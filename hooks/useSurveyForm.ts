import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { submitSurveyData, SurveyFormData } from "../services/surveyApi";
import { validateStep } from "../utils/surveyValidation";
import {
  AppError,
  AuthError,
  ValidationError,
} from "../utils/surveyValidation";

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
      score: null,
      profile: {},
      error: null,
      loading: false,
    },
    hackerrank: {
      connected: false,
      username: "",
      rank: null,
      profile: {},
      error: null,
      loading: false,
    },
  },

  // Meta/Navigation
  currentStep: 1,
  totalSteps: 7,
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

  // Track time spent on each step
  useEffect(() => {
    setStepStartTime(Date.now());
  }, [formData.currentStep]);

  const updateFormData = useCallback((updates: Partial<SurveyFormData>) => {
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        ...updates,
        updatedAt: Date.now(),
      };

      // Track interactions
      if (updates !== prevState) {
        newState.interactions = [
          ...prevState.interactions,
          {
            timestamp: Date.now(),
            step: prevState.currentStep,
            action: "field_update",
            data: updates,
          },
        ];
      }

      return newState;
    });
  }, []);

  const updateFieldData = useCallback((fieldName: string, fieldData: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName as keyof SurveyFormData],
        ...fieldData,
        touched: true,
      },
      updatedAt: Date.now(),
    }));
  }, []);

  const nextStep = useCallback(() => {
    const currentStepTime = Date.now() - stepStartTime;

    setFormData((prevState) => {
      // Validate current step before proceeding
      const validation = validateStep(prevState.currentStep, prevState);
      if (!validation.isValid) {
        // Update field errors
        const updatedState = { ...prevState };
        Object.entries(validation.errors).forEach(([field, error]) => {
          if (updatedState[field as keyof SurveyFormData]) {
            (updatedState[field as keyof SurveyFormData] as any).error = error;
          }
        });
        return updatedState;
      }

      const newStep = Math.min(prevState.currentStep + 1, prevState.totalSteps);

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
    setFormData((prevState) => ({
      ...prevState,
      currentStep: Math.max(prevState.currentStep - 1, 1),
      interactions: [
        ...prevState.interactions,
        {
          timestamp: Date.now(),
          step: prevState.currentStep,
          action: "prev_step",
        },
      ],
    }));
  }, []);

  const canProceed = useCallback(
    (step?: number) => {
      const currentStepToCheck = step || formData.currentStep;
      const validation = validateStep(currentStepToCheck, formData);
      return validation.isValid;
    },
    [formData]
  );

  const submitSurvey = useCallback(async () => {
    // Prevent double submission
    if (formData.isSubmitting) {
      console.warn("Survey submission already in progress");
      return;
    }

    console.log("=== STARTING SURVEY SUBMISSION ===");
    
    setFormData((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: null,
    }));

    try {
      // Final validation of all steps
      console.log("Validating all steps...");
      for (let step = 1; step <= 6; step++) {
        const validation = validateStep(step, formData);
        if (!validation.isValid && step <= 4) {
          // Steps 1-4 are required
          throw new ValidationError(
            `Please complete step ${step} before submitting`
          );
        }
      }
      console.log("✅ All steps validated");

      // Take snapshot of current state
      const submissionData = {
        ...formData,
        completedAt: Date.now(),
        isDraft: false,
        totalTimeSpent: Object.values(formData.timeSpentPerStep).reduce(
          (sum, time) => sum + time,
          0
        ),
      };

      // Submit to backend
      console.log("Submitting to backend...");
      const result = await submitSurveyData(submissionData);
      console.log("✅ Backend submission successful");

      // ✅ CRITICAL FIX: Update localStorage FIRST, BEFORE state update
      console.log("=== UPDATING LOCALSTORAGE ===");
      
      const updateLocalStorage = () => {
        try {
          const userData = localStorage.getItem("velric_user");
          
          if (!userData) {
            console.error("❌ CRITICAL: No velric_user found in localStorage!");
            // Create a basic user object if it doesn't exist
            const newUser = {
              onboarded: true,
              surveyCompletedAt: result.completedAt,
              completedAt: result.completedAt
            };
            localStorage.setItem("velric_user", JSON.stringify(newUser));
            console.log("✅ Created new user data with onboarded: true");
            return true;
          }

          const user = JSON.parse(userData);
          console.log("Current user data:", user);
          
          // Update onboarded status
          user.onboarded = true;
          user.surveyCompletedAt = result.completedAt;
          
          // Save back to localStorage
          localStorage.setItem("velric_user", JSON.stringify(user));
          console.log("✅ USER DATA UPDATED IN LOCALSTORAGE");
          console.log("Updated user:", user);
          
          // VERIFY the update was successful
          const verifyData = localStorage.getItem("velric_user");
          if (verifyData) {
            const verified = JSON.parse(verifyData);
            console.log("=== VERIFICATION CHECK ===");
            console.log("Onboarded status:", verified.onboarded);
            console.log("Survey completed at:", verified.surveyCompletedAt);
            
            if (verified.onboarded === true) {
              console.log("✅ VERIFICATION PASSED - onboarded is TRUE");
              return true;
            } else {
              console.error("❌ VERIFICATION FAILED - onboarded is", verified.onboarded);
              return false;
            }
          }
          
          return false;
        } catch (error) {
          console.error("❌ Error updating localStorage:", error);
          return false;
        }
      };

      // Update localStorage
      const localStorageUpdated = updateLocalStorage();
      
      if (!localStorageUpdated) {
        console.warn("⚠️ localStorage update verification failed, retrying...");
        // Retry once
        await new Promise(resolve => setTimeout(resolve, 100));
        updateLocalStorage();
      }

      // ✅ Wait 200ms to ensure localStorage write is complete
      console.log("Waiting for localStorage to settle...");
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Final verification
      const finalCheck = localStorage.getItem("velric_user");
      if (finalCheck) {
        const finalUser = JSON.parse(finalCheck);
        console.log("=== FINAL PRE-REDIRECT CHECK ===");
        console.log("Onboarded:", finalUser.onboarded);
        
        if (finalUser.onboarded !== true) {
          console.error("❌ CRITICAL: onboarded is still not true!");
          // Force set it one more time
          finalUser.onboarded = true;
          localStorage.setItem("velric_user", JSON.stringify(finalUser));
          console.log("🔧 Force-set onboarded to true");
        }
      }

      // ✅ NOW update component state to move to completion step
      console.log("Moving to completion step...");
      setFormData((prev) => ({
        ...prev,
        currentStep: 7, // Completion step
        completedAt: result.completedAt,
        isSubmitting: false,
        isDraft: false,
      }));

      console.log("=== SURVEY SUBMISSION COMPLETE ===");
      console.log("✅ localStorage is ready");
      console.log("✅ Completion page will now handle redirect");
      
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
    canProceed,
    submitSurvey,
  };
}