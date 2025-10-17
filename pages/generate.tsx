// pages/generate.tsx
import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubmissionForm from '@/components/SubmissionForm';
import MissionCard from '@/components/MissionCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';

import { MissionTemplate, GenerateMissionsRequest, GenerateMissionsResponse } from '@/types';
import { RefreshCw, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function GeneratePage() {
  const [missions, setMissions] = useState<MissionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [currentInterests, setCurrentInterests] = useState<string[]>([]);
  const [currentResumeText, setCurrentResumeText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleGenerateMissions = async (formData: { interests?: string[]; resumeText?: string }) => {
    setIsLoading(true);
    setError('');
    setCurrentInterests(formData.interests || []);
    setCurrentResumeText(formData.resumeText || '');

    try {
      const requestData: GenerateMissionsRequest = {
        interests: formData.interests,
        resumeText: formData.resumeText
      };

      const response = await fetch('/api/generate_missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: GenerateMissionsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate missions');
      }

      setMissions(data.missions);
      setHasGenerated(true);
      showToast(`Generated ${data.missions.length} personalized missions!`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate missions';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMissions = async () => {
    setIsLoading(true);
    setError('');

    try {
      const requestData: GenerateMissionsRequest = {
        interests: currentInterests,
        resumeText: currentResumeText
      };

      const response = await fetch('/api/generate_missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: GenerateMissionsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to regenerate missions');
      }

      setMissions(data.missions);
      showToast(`Regenerated ${data.missions.length} new missions!`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate missions';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setMissions([]);
    setHasGenerated(false);
    setCurrentInterests([]);
    setCurrentResumeText('');
    setError('');
    setSuccessMessage('');
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Generate Missions | Velric</title>
        <meta
          name="description"
          content="Generate personalized AI-powered missions based on your interests and skills."
        />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="bg-[#0D0D0D] text-white min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-velricViolet" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-velricViolet to-plasmaBlue bg-clip-text text-transparent">
                  Missions Generated For You
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                AI-powered challenges built from actual work done by top professionals,
                tailored to your interests and skill level.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Toast Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <section className="px-4 md:px-8 lg:px-16 pb-20">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {!hasGenerated ? (
                /* Interest Form */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-2xl mx-auto"
                >
                  <SubmissionForm
                    onSubmit={handleGenerateMissions}
                    isLoading={isLoading}
                  />
                </motion.div>
              ) : (
                /* Generated Missions */
                <motion.div
                  key="missions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header with Actions */}
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Your Personalized Missions
                      </h2>
                      <p className="text-gray-400">
                        {currentInterests.length > 0 && `Interests: ${currentInterests.join(', ')}`}
                        {currentInterests.length > 0 && currentResumeText && ' • '}
                        {currentResumeText && 'Resume analyzed'}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRegenerateMissions}
                        disabled={isLoading}
                        className="whitespace-nowrap"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Regenerate
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleStartOver}
                        disabled={isLoading}
                        className="whitespace-nowrap"
                      >
                        Start Over
                      </Button>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoading ? (
                    <div className="flex justify-center py-20">
                      <LoadingSpinner
                        size="lg"
                        text="Generating your personalized missions..."
                      />
                    </div>
                  ) : (
                    /* Missions Grid */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {missions.map((mission) => (
                        <MissionCard
                          key={mission.id}
                          mission={mission}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* No Missions Found */}
                  {!isLoading && missions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-20"
                    >
                      <div className="text-gray-400 mb-4">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No missions found</h3>
                        <p>Try selecting different interests or regenerating missions.</p>
                      </div>
                      <Button onClick={handleStartOver} className="mt-4">
                        Try Different Interests
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}