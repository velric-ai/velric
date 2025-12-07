import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { SurveyLayout } from "../../components/survey/SurveyLayout";
import { ProgressBar } from "../../components/survey/ProgressBar";
import { StepBasicInfo } from "../../components/survey/StepBasicInfo";
import { StepMissionQuestions } from "../../components/survey/StepMissionQuestions";
import { StepCandidateLevel } from "../../components/survey/StepCandidateLevel";
import { StepStrengthAreas } from "../../components/survey/StepStrengthAreas";
import { StepLearningPreference } from "../../components/survey/StepLearningPreference";
import { StepPortfolioUpload } from "../../components/survey/StepPortfolioUpload";
import { StepPlatformConnections } from "../../components/survey/StepPlatformConnections";
import { StepExperience } from "../../components/survey/StepExperience";
import { StepLogisticsPreferences } from "../../components/survey/StepLogisticsPreferences";
import { StepCompletion } from "../../components/survey/StepCompletion";
import { useSurveyForm } from "../../hooks/useSurveyForm";
import { AppError, AuthError } from "../../utils/surveyValidation";
import { ProtectedSurveyRoute } from "../../components/auth/ProtectedRoute";

function SurveyPageContent() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    totalSteps,
    isSubmitting,
    submitError,
    updateFormData,
    nextStep,
    prevStep,
    submitSurvey,
    canProceed,
    isCompleted,
    resetSubsequentSteps
  } = useSurveyForm();

  // Load any existing survey draft on mount
  useEffect(() => {
    const initializeSurvey = () => {
      try {
        // Check for survey state first
        const surveyStateStr = localStorage.getItem("velric_survey_state");
        const surveyState = surveyStateStr ? JSON.parse(surveyStateStr) : null;
        
        // CRITICAL FIX: If no state or step is wrong, initialize properly
        if (!surveyState) {
          console.log('📋 No survey state found. Initializing...');
          const newState = {
            currentStep: 1,
            currentStepIndex: 0,
            totalSteps: 9,
            completedSteps: [],
            surveyData: {},
            startedAt: new Date().toISOString()
          };
          localStorage.setItem('velric_survey_state', JSON.stringify(newState));
          updateFormData({ currentStep: 1 });
          return;
        }
        
        // CRITICAL FIX: If survey was just started but showing wrong step, reset it
        if (surveyState.completedSteps.length === 0 && surveyState.currentStep !== 1) {
          console.warn('⚠️ RESETTING: Survey showed step', surveyState.currentStep, 'but no steps completed. Resetting to Step 1.');
          const resetState = {
            ...surveyState,
            currentStep: 1,
            currentStepIndex: 0,
            completedSteps: []
          };
          localStorage.setItem('velric_survey_state', JSON.stringify(resetState));
          // 🔴 CRITICAL: Clear any corrupted draft data
          localStorage.removeItem("velric_survey_draft");
          updateFormData({ currentStep: 1 });
          return;
        }
        
        // Normal path: Load existing survey state
        updateFormData({ currentStep: surveyState.currentStep });
        
        // 🔴 CRITICAL FIX: Only load draft data if we're NOT on step 1
        // This prevents draft data from overriding the reset to step 1
        if (surveyState.currentStep > 1) {
          const draftData = localStorage.getItem("velric_survey_draft");
          if (draftData) {
            const draft = JSON.parse(draftData);
            // Only apply draft data if it doesn't conflict with current step
            if (draft.currentStep === surveyState.currentStep) {
              updateFormData(draft);
            }
          }
        }
      } catch (error) {
        console.warn("Failed to initialize survey:", error);
        localStorage.removeItem("velric_survey_draft");
        localStorage.removeItem("velric_survey_state");
        updateFormData({ currentStep: 1 });
      }
    };

    initializeSurvey();
  }, [updateFormData]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (formData.currentStep > 1 && !isCompleted) {
      try {
        localStorage.setItem("velric_survey_draft", JSON.stringify({
          ...formData,
          savedAt: Date.now(),
          isDraft: true
        }));
      } catch (error) {
        console.warn("Failed to save survey draft:", error);
      }
    }
  }, [formData, isCompleted]);

  const handleNext = async () => {
    try {
      if (currentStep === totalSteps - 1) {
        // Final step - submit survey
        await submitSurvey();
        // Clear draft on successful submission
        localStorage.removeItem("velric_survey_draft");
      } else {
        nextStep();
      }
    } catch (error) {
      console.error("Navigation error:", error);
      if (error instanceof AuthError) {
        router.push("/login?redirect=/onboard/survey");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleSkip = () => {
    // Only allow skipping optional steps (5 & 6)
    if (currentStep === 5 || currentStep === 6) {
      nextStep();
    }
  };

  const renderStep = () => {
    const baseStepProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrev: handlePrev,
      onSkip: handleSkip,
      isSubmitting,
      resetSubsequentSteps
    };

    switch (currentStep) {
      case 1:
        return <StepBasicInfo {...baseStepProps} canProceed={canProceed()} />;
      case 2:
        return <StepMissionQuestions {...baseStepProps} canProceed={canProceed()} />;
      case 3:
        return <StepCandidateLevel {...baseStepProps} canProceed={canProceed()} />;
      case 4:
        return <StepStrengthAreas {...baseStepProps} canProceed={canProceed()} />;
      case 5:
        return <StepLearningPreference {...baseStepProps} canProceed={canProceed()} />;
      case 6:
        return <StepPortfolioUpload {...baseStepProps} canProceed={canProceed()} />;
      case 7:
        return <StepPlatformConnections {...baseStepProps} canProceed={canProceed()} />;
      case 8:
        return <StepExperience {...baseStepProps} canProceed={canProceed} />;
      case 9:
        return <StepCompletion {...baseStepProps} canProceed={canProceed()} />;
      default:
        return <StepBasicInfo {...baseStepProps} canProceed={canProceed()} />;
    }
  };

  return (
    <>
      <Head>
        <title>Complete Your Profile | Velric</title>
        <meta name="description" content="Complete your Velric profile to get personalized missions and track your progress" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <SurveyLayout>
        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          completedSteps={currentStep - 1}
        />

        {/* Error Display */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-medium">
                      {submitError}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SurveyLayout>
    </>
  );
}

export default function SurveyPage() {
  return (
    <ProtectedSurveyRoute>
      <SurveyPageContent />
    </ProtectedSurveyRoute>
  );
}
