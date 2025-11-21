import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  submitSurveyData,
  SurveyFormData,
  uploadPortfolioFile,
} from "../services/surveyApi";
import { validateStep } from "../utils/surveyValidation";
import {
  AppError,
  AuthError,
  ValidationError,
} from "../utils/surveyValidation";

// Added missing types
interface PlatformConnection {
  connected: boolean;
  username: string;
  userId: string;
  avatar: string;
  profile: any;
  error: string | null;
  loading: boolean;
  score?: number | null;
  rank?: number | null;
}

interface SurveySubmissionResponse {
  success: boolean;
  userId: string | null;
  message: string;
  profile: {
    onboarded: boolean;
    completedAt: string;
    surveyData: any;
  };
  redirectUrl: string;
  completedAt: number;
}

const initialFormData: SurveyFormData = {
  // Step 1: Basic Information
  fullName: {
    value: "",
    error: null,
    touched: false,
  },
  educationLevel: {
    value: "Bachelors Degree",
    error: null,
    touched: false,
  },
  industry: {
    value: "",
    error: null,
    touched: false,
  },

  // Step 2: Mission Questions (dynamic)
  missionFocus: {
    value: [],
    error: null,
    touched: false,
    questionText: "",
    options: [],
  },

  // Step 3: Strength Areas
  strengthAreas: {
    value: [],
    error: null,
    touched: false,
  },

  // Step 4: Learning Preference
  learningPreference: {
    value: "",
    error: null,
    touched: false,
  },

  // Step 5: Portfolio (Optional)
  portfolio: {
    file: null,
    filePreview: null,
    fileError: null,
    fileProgress: 0,
    url: "",
    urlError: null,
    uploadStatus: null,
    uploadedUrl: null,
    uploadedFilename: null,
  },

  // Step 6: Platform Connections (Optional)
  platformConnections: {
    github: {
      connected: false,
      username: "",
      userId: "",
      avatar: "",
      profile: {},
      error: null,
      loading: false,
    },
    codesignal: {
      connected: false,
      username: "",
      userId: "",
      avatar: "",
      score: null,
      profile: {},
      error: null,
      loading: false,
    },
    hackerrank: {
      connected: false,
      username: "",
      userId: "",
      avatar: "",
      rank: null,
      profile: {},
      error: null,
      loading: false,
    },
  },

  // Step 7: Experience Summary
  experienceSummary: {
    value: "",
    error: null,
    touched: false,
  },

  // Meta/Navigation
  currentStep: 1,
  totalSteps: 8,
  isSubmitting: false,
  submitError: null,
  completedAt: null,

  // Draft persistence
  savedAt: null,
  isDraft: true,

  // Analytics/Tracking
  startedAt: Date.now(),
  timeSpentPerStep: {},
  interactions: [],
};

export function useSurveyForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

  // 🔴 CRITICAL FIX: Force reset to step 1 on hook initialization if user just signed up
useEffect(() => {
  const checkForNewSignup = () => {
    try {
      const userDataStr = localStorage.getItem("velric_user");
      const surveyStateStr = localStorage.getItem("velric_survey_state");

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);

        if (!userData.onboarded && surveyStateStr) {
          const surveyState = JSON.parse(surveyStateStr);

          if (
            surveyState.currentStep !== 1 &&
            (!surveyState.completedSteps || surveyState.completedSteps.length === 0)
          ) {
            console.warn("🔴 HOOK RESET: Forcing survey back to Step 1 for new signup");

            const resetState = {
              ...surveyState,
              currentStep: 1,
              currentStepIndex: 0,
              completedSteps: [],
            };
            localStorage.setItem("velric_survey_state", JSON.stringify(resetState));
            localStorage.removeItem("velric_survey_draft");

            setFormData((prev) => ({
              ...prev,
              currentStep: 1,
            }));
          }
        }
      }
    } catch (error) {
      console.warn("Error checking signup state:", error);
    }
  };

  checkForNewSignup();
}, []);

  const updateFormData = useCallback(
    (
      updates:
        | Partial<SurveyFormData>
        | ((prevState: SurveyFormData) => Partial<SurveyFormData>)
    ) => {
      setFormData((prevState) => {
        const resolvedUpdates =
          typeof updates === "function" ? updates(prevState) : updates;

        if (
          !resolvedUpdates ||
          typeof resolvedUpdates !== "object" ||
          Object.keys(resolvedUpdates).length === 0
        ) {
          return prevState;
        }

        const newState = {
          ...prevState,
          ...resolvedUpdates,
          updatedAt: Date.now(),
        };

        newState.interactions = [
          ...prevState.interactions,
          {
            timestamp: Date.now(),
            step: prevState.currentStep,
            action: "field_update",
            data: resolvedUpdates,
          },
        ];

        return newState;
      });
    },
    []
  );

  const updateFieldData = useCallback((fieldName: string, fieldData: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: {
        ...(prevState[fieldName as keyof SurveyFormData] as object),
        ...fieldData,
        touched: true,
      },
      updatedAt: Date.now(),
    }));
  }, []);

  // Reset subsequent steps when education level or industry changes on step 1
  const resetSubsequentSteps = useCallback(() => {
    setFormData((prevState) => {
      // Only reset if we're on step 1
      if (prevState.currentStep !== 1) {
        return prevState;
      }

      // Reset all fields from step 2 onwards
      const resetState = {
        ...prevState,
        // Step 2: Mission Questions
        missionFocus: {
          value: [],
          error: null,
          touched: false,
          questionText: "",
          options: [],
        },
        // Step 3: Strength Areas
        strengthAreas: {
          value: [],
          error: null,
          touched: false,
        },
        // Step 4: Learning Preference
        learningPreference: {
          value: "",
          error: null,
          touched: false,
        },
        // Step 5: Portfolio (Optional)
        portfolio: {
          file: null,
          filePreview: null,
          fileError: null,
          fileProgress: 0,
          url: "",
          urlError: null,
          uploadStatus: null,
          uploadedUrl: null,
          uploadedFilename: null,
        },
        // Step 6: Platform Connections (Optional)
        platformConnections: {
          github: {
            connected: false,
            username: "",
            userId: "",
            avatar: "",
            profile: {},
            error: null,
            loading: false,
          },
          codesignal: {
            connected: false,
            username: "",
            userId: "",
            avatar: "",
            score: null,
            profile: {},
            error: null,
            loading: false,
          },
          hackerrank: {
            connected: false,
            username: "",
            userId: "",
            avatar: "",
            rank: null,
            profile: {},
            error: null,
            loading: false,
          },
        },
        // Step 7: Experience Summary
        experienceSummary: {
          value: "",
          error: null,
          touched: false,
        },
        updatedAt: Date.now(),
      };

      // Update survey state to remove completed steps after step 1
      const surveyStateStr = localStorage.getItem("velric_survey_state");
      const surveyState = surveyStateStr ? JSON.parse(surveyStateStr) : {};
      const updatedSurveyState = {
        ...surveyState,
        completedSteps: [1], // Only keep step 1 as completed
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        "velric_survey_state",
        JSON.stringify(updatedSurveyState)
      );

      // Clear draft data for subsequent steps
      const draftData = localStorage.getItem("velric_survey_draft");
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          // Only keep step 1 data in draft
          const cleanedDraft = {
            ...draft,
            missionFocus: resetState.missionFocus,
            strengthAreas: resetState.strengthAreas,
            learningPreference: resetState.learningPreference,
            portfolio: resetState.portfolio,
            platformConnections: resetState.platformConnections,
            experienceSummary: resetState.experienceSummary,
            currentStep: 1,
          };
          localStorage.setItem("velric_survey_draft", JSON.stringify(cleanedDraft));
        } catch (error) {
          console.warn("Failed to clean draft data:", error);
        }
      }

      return resetState;
    });
  }, []);

  const nextStep = useCallback(() => {
    const currentStepTime = Date.now() - stepStartTime;

    setFormData((prevState) => {
      const validation = validateStep(prevState.currentStep, prevState);
      if (!validation.isValid) {
        const updatedState = { ...prevState };
        Object.entries(validation.errors).forEach(([field, error]) => {
          if (updatedState[field as keyof SurveyFormData]) {
            (updatedState[field as keyof SurveyFormData] as any).error = error;
          }
        });
        return updatedState;
      }

      const newStep = Math.min(prevState.currentStep + 1, prevState.totalSteps);

      const surveyStateStr = localStorage.getItem("velric_survey_state");
      const surveyState = surveyStateStr ? JSON.parse(surveyStateStr) : {};
      const updatedSurveyState = {
        ...surveyState,
        currentStep: newStep,
        currentStepIndex: newStep - 1,
        completedSteps: [
          ...(surveyState.completedSteps || []),
          prevState.currentStep,
        ],
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        "velric_survey_state",
        JSON.stringify(updatedSurveyState)
      );

      return {
        ...prevState,
        currentStep: newStep,
        timeSpentPerStep: {
          ...prevState.timeSpentPerStep,
          [prevState.currentStep]: currentStepTime,
        },
        interactions: [
          ...prevState.interactions,
          {
            timestamp: Date.now(),
            step: prevState.currentStep,
            action: "next_step",
            timeSpent: currentStepTime,
          },
        ],
      };
    });
  }, [stepStartTime]);

  const prevStep = useCallback(() => {
    setFormData((prevState) => {
      const newStep = Math.max(prevState.currentStep - 1, 1);

      const surveyStateStr = localStorage.getItem("velric_survey_state");
      const surveyState = surveyStateStr ? JSON.parse(surveyStateStr) : {};
      const updatedSurveyState = {
        ...surveyState,
        currentStep: newStep,
        currentStepIndex: newStep - 1,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        "velric_survey_state",
        JSON.stringify(updatedSurveyState)
      );

      return {
        ...prevState,
        currentStep: newStep,
        interactions: [
          ...prevState.interactions,
          {
            timestamp: Date.now(),
            step: prevState.currentStep,
            action: "prev_step",
          },
        ],
      };
    });
  }, []);

  const canProceed = useCallback(
    (step?: number) => {
      const currentStepToCheck = step || formData.currentStep;
      const validation = validateStep(currentStepToCheck, formData);
      return validation.isValid;
    },
    [formData]
  );

  // Import the parseResumeAndStore function
  // (You may need to add this import at the top of the file)
  // import { parseResumeAndStore } from "../services/surveyApi";
  const parseResumeAndStore = async (surveyResponseId: string) => {
    try {
      const response = await fetch("/api/survey/parseResume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyResponseId }),
      });
      return await response.json();
    } catch (err) {
      console.error("Resume parsing failed:", err);
      return null;
    }
  };

  const submitSurvey = useCallback(async () => {
    if (formData.isSubmitting) {
      console.warn("Survey submission already in progress");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: null,
    }));

    try {
      for (let step = 1; step <= 7; step++) {
        const validation = validateStep(step, formData);
        if (!validation.isValid && (step <= 4 || step === 7)) {
          throw new ValidationError(
            `Please complete step ${step} before submitting`
          );
        }
      }

      // 🔴 FIX: Attach user_id to submission
      const userDataStr = localStorage.getItem("velric_user");
      let userId = "";
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.id || userData.user_id || "";
        userData.onboarded = true;
        localStorage.setItem("velric_user", JSON.stringify(userData));
      }

      const submissionData = {
        ...formData,
        user_id: userId,
        completedAt: Date.now(),
        isDraft: false,
        totalTimeSpent: Object.values(formData.timeSpentPerStep).reduce(
          (sum, time) => sum + time,
          0
        ),
      };

      // Call API
      const result: SurveySubmissionResponse = await submitSurveyData(submissionData);

      // If survey response has an id, trigger resume parsing
      let surveyResponseId = result?.profile?.surveyData?.id;
      if (result.success && surveyResponseId) {
        await parseResumeAndStore(surveyResponseId);
      }

      const surveyStateStr = localStorage.getItem("velric_survey_state");
      const surveyState = surveyStateStr ? JSON.parse(surveyStateStr) : {};
      const finalSurveyState = {
        ...surveyState,
        currentStep: 8,
        currentStepIndex: 7,
        completedSteps: [1, 2, 3, 4, 5, 6, 7],
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "velric_survey_state",
        JSON.stringify(finalSurveyState)
      );

      setFormData((prev) => ({
        ...prev,
        currentStep: 8,
        completedAt: result.completedAt,
        isSubmitting: false,
        isDraft: false,
      }));

      // Mark survey as completed in local storage for route guards
      try {
        const userDataStr = localStorage.getItem("velric_user");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userData.surveyCompleted = true;
          userData.onboarded = true;
          userData.surveyCompletedAt = new Date().toISOString();
          localStorage.setItem("velric_user", JSON.stringify(userData));
        }
      } catch {}

      // Route to dashboard after parsing is complete
      router.push("/user-dashboard");
    } catch (error) {
      console.error("❌ Survey submission error:", error);

      let errorMessage = "Failed to save survey. Please try again.";

      if (error instanceof AuthError) {
        errorMessage = "Session expired. Please sign in again.";
        setTimeout(() => {
          router.push("/login?redirect=/onboard/survey");
        }, 2000);
      } else if (error instanceof ValidationError) {
        errorMessage = error.message;
      } else if (error instanceof AppError) {
        errorMessage = error.message;
      }

      setFormData((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: errorMessage,
      }));
    }
  }, [formData, router]);

  return {
    formData,
    currentStep: formData.currentStep,
    totalSteps: formData.totalSteps,
    isSubmitting: formData.isSubmitting,
    submitError: formData.submitError,
    isCompleted: formData.completedAt !== null,
    updateFormData,
    updateFieldData,
    nextStep,
    prevStep,
    resetSubsequentSteps,
    canProceed,
    submitSurvey,
  };
}
