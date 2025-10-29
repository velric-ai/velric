import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { SurveyLayout } from "../../components/survey/SurveyLayout";
import { ProgressBar } from "../../components/survey/ProgressBar";
import { StepBasicInfo } from "../../components/survey/StepBasicInfo";
import { StepMissionQuestions } from "../../components/survey/StepMissionQuestions";
import { StepStrengthAreas } from "../../components/survey/StepStrengthAreas";
import { StepLearningPreference } from "../../components/survey/StepLearningPreference";
import { StepPortfolioUpload } from "../../components/survey/StepPortfolioUpload";
import { StepPlatformConnections } from "../../components/survey/StepPlatformConnections";
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
    isCompleted
  } = useSurveyForm();

  // Load any existing survey draft on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        const draftData = localStorage.getItem("velric_survey_draft");
        if (draftData) {
          const draft = JSON.parse(draftData);
          updateFormData(draft);
        }
      } catch (error) {
        console.warn("Failed to load survey draft:", error);
        localStorage.removeItem("velric_survey_draft");
      }
    };

    loadDraft();
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
    const stepProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrev: handlePrev,
      onSkip: handleSkip,
      canProceed,
      isSubmitting
    };

    switch (currentStep) {
      case 1:
        return <StepBasicInfo {...stepProps} />;
      case 2:
        return <StepMissionQuestions {...stepProps} />;
      case 3:
        return <StepStrengthAreas {...stepProps} />;
      case 4:
        return <StepLearningPreference {...stepProps} />;
      case 5:
        return <StepPortfolioUpload {...stepProps} />;
      case 6:
        return <StepPlatformConnections {...stepProps} />;
      case 7:
        return <StepCompletion {...stepProps} />;
      default:
        return <StepBasicInfo {...stepProps} />;
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

// ✅ LOCATION 2: Survey Route Guard - Only allow access if logged in but NOT onboarded
export default function SurveyPage() {
  return (
    <ProtectedSurveyRoute>
      <SurveyPageContent />
    </ProtectedSurveyRoute>
  );
}