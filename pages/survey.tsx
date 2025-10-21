// pages/survey.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface SurveyData {
  full_name: string;
  field_of_interest: string;
  skill_level: string;
  resume_text: string;
}

export default function Survey() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [surveyData, setSurveyData] = useState<SurveyData>({
    full_name: '',
    field_of_interest: '',
    skill_level: '',
    resume_text: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fieldsOfInterest = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'UX/UI Design',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education',
    'Other'
  ];

  const skillLevels = [
    'College student pursuing bachelor\'s',
    'Graduate student',
    'New grad (0-1 years)',
    '1-2 years of experience',
    '3-4 years of experience',
    '5+ years of experience',
    'Senior level (8+ years)',
    'Executive level'
  ];

  useEffect(() => {
    if (!loading && user) {
      // Pre-fill with existing data if available
      if (user.user_metadata?.survey_data) {
        setSurveyData(user.user_metadata.survey_data);
      }
      // Pre-fill name from user metadata if available
      if (user.user_metadata?.full_name && !surveyData.full_name) {
        setSurveyData(prev => ({
          ...prev,
          full_name: user.user_metadata.full_name
        }));
      }
    }
  }, [user, loading]);

  const handleInputChange = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Save survey data to user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user?.user_metadata,
          full_name: surveyData.full_name,
          survey_completed: true,
          survey_data: surveyData
        }
      });

      if (error) throw error;

      setMessage('Survey completed successfully! Redirecting...');
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error: any) {
      console.error('Survey submission error:', error);
      setMessage('Error saving survey: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
          >
            <svg 
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to Velric!
          </h1>
          <p className="text-gray-400 text-lg">
            Help us personalize your experience by completing this quick survey
          </p>
        </div>

        {/* Survey Form */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('Error') 
                  ? 'bg-red-500/10 border border-red-500/50 text-red-400'
                  : 'bg-green-500/10 border border-green-500/50 text-green-400'
              }`}>
                {message}
              </div>
            )}

            {/* Question 1: Full Name */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Question #1: What's your full name?
              </label>
              <input
                type="text"
                value={surveyData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Question 2: Field of Interest */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Question #2: What field are you interested in?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {fieldsOfInterest.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleInputChange('field_of_interest', field)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                      surveyData.field_of_interest === field
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Skill Level */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Question #3: What's your current skill level?
              </label>
              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange('skill_level', level)}
                    className={`w-full p-4 rounded-lg border transition-all duration-300 text-left ${
                      surveyData.skill_level === level
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Resume Upload */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Question #4: Paste your resume below
              </label>
              <textarea
                value={surveyData.resume_text}
                onChange={(e) => handleInputChange('resume_text', e.target.value)}
                className="w-full h-48 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Copy and paste your resume text here..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Don't worry, your resume is stored securely and only used to personalize your experience.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={saving || !surveyData.full_name || !surveyData.field_of_interest || !surveyData.skill_level || !surveyData.resume_text}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    {user.user_metadata?.survey_completed ? 'Updating Survey...' : 'Completing Survey...'}
                  </div>
                ) : (
                  user.user_metadata?.survey_completed ? 'Update Survey Responses' : 'Complete Survey & Get Started'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}