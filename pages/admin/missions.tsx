// pages/admin/missions.tsx
import React, { useState, useEffect } from 'react';
import { StaticMission } from '@/data/staticMissions';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface GenerationRequest {
  userBackground: string;
  interests: string[];
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  count: number;
}

interface MissionResponse {
  missions?: StaticMission[];
  success: boolean;
  error?: string;
  source?: 'database' | 'static';
}

interface GenerationResponse {
  success: boolean;
  message?: string;
  missionIds?: string[];
  count?: number;
  error?: string;
  details?: string;
}

const AdminMissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<StaticMission[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [source, setSource] = useState<'database' | 'static'>('static');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [generationForm, setGenerationForm] = useState<GenerationRequest>({
    userBackground: '',
    interests: [],
    industry: '',
    difficulty: 'Intermediate',
    count: 3
  });

  const [newInterest, setNewInterest] = useState('');

  // Fetch existing missions
  const fetchMissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/missions');
      const data: MissionResponse = await response.json();
      
      if (data.success && data.missions) {
        setMissions(data.missions);
        setSource(data.source || 'static');
      } else {
        setError(data.error || 'Failed to fetch missions');
      }
    } catch (err) {
      setError('Network error while fetching missions');
    } finally {
      setLoading(false);
    }
  };

  // Generate new missions
  const generateMissions = async () => {
    if (!generationForm.userBackground || !generationForm.industry || generationForm.interests.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/generate-missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationForm)
      });

      const data: GenerationResponse = await response.json();

      if (data.success) {
        setSuccess(`Successfully generated ${data.count} missions!`);
        // Refresh the missions list
        await fetchMissions();
        // Reset form
        setGenerationForm({
          userBackground: '',
          interests: [],
          industry: '',
          difficulty: 'Intermediate',
          count: 3
        });
      } else {
        setError(data.error || 'Failed to generate missions');
      }
    } catch (err) {
      setError('Network error while generating missions');
    } finally {
      setGenerating(false);
    }
  };

  // Add interest to the list
  const addInterest = () => {
    if (newInterest.trim() && !generationForm.interests.includes(newInterest.trim())) {
      setGenerationForm(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  // Remove interest from the list
  const removeInterest = (interest: string) => {
    setGenerationForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <>
      <Head>
        <title>Admin • Missions Generator</title>
      </Head>
      <div className="min-h-screen bg-[#0D0D0D]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-6">Missions Admin</h1>
          <p className="text-gray-400 mb-8">Generate AI-powered missions and store them in Supabase for team-wide use.</p>

          <div className="grid gap-6 bg-[#141414] border border-[#222] rounded-xl p-6">
            <div>
              <label className="block text-gray-300 mb-2">User Background</label>
              <textarea
                className="w-full rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] p-3 text-gray-200"
                rows={4}
                value={generationForm.userBackground}
                onChange={(e) => setGenerationForm(prev => ({ ...prev, userBackground: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Interests (comma-separated)</label>
                <input
                  className="w-full rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] p-3 text-gray-200"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Industry</label>
                <input
                  className="w-full rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] p-3 text-gray-200"
                  value={generationForm.industry}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, industry: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Difficulty</label>
                <select
                  className="w-full rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] p-3 text-gray-200"
                  value={generationForm.difficulty}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">How many</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="w-full rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] p-3 text-gray-200"
                  value={generationForm.count}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateMissions}
                disabled={generating}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white disabled:opacity-60"
              >
                {generating ? 'Generating…' : 'Generate Missions'}
              </button>
            </div>

            {success && (
              <div className="p-4 rounded-lg border border-emerald-700 bg-emerald-900/30 text-emerald-300">
                {success}
              </div>
            )}
            {error && (
              <div className="p-4 rounded-lg border border-red-700 bg-red-900/30 text-red-300">
                {error}
              </div>
            )}
          </div>

          <div className="mt-10 text-gray-400 text-sm">
            <p className="mb-2 font-semibold text-gray-300">Heads up</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>If OPENAI_API_KEY is not set, we use a fallback generator (still stored if Supabase is configured).</li>
              <li>If Supabase keys aren’t set, we run in dummy mode (no DB writes) and return mock IDs.</li>
              <li>To create the database tables, run the SQL in <code>migrations/create_missions_schema.sql</code> in Supabase SQL editor.</li>
            </ul>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminMissionsPage;