import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { StaticMission } from "@/data/staticMissions";
import { ArrowLeft, Clock, TrendingUp, Users, Star } from "lucide-react";

export default function MissionsPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<StaticMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [source, setSource] = useState<'database' | 'static' | undefined>(undefined);
  const [generating, setGenerating] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [previewGenerating, setPreviewGenerating] = useState(false);

  useEffect(() => {
    fetchAndGenerateMissions();
  }, []);

  const fetchAndGenerateMissions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First, generate fresh AI missions
      const generateResponse = await fetch('/api/missions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userBackground: 'Motivated developer interested in web and AI, familiar with React/Next.js and Node.js.',
          interests: ['AI', 'SaaS', 'Productivity', 'Web Development'],
          industry: 'SaaS',
          difficulty: 'Intermediate',
          count: 5
        })
      });
      
      if (generateResponse.ok) {
        const generateData = await generateResponse.json();
        if (generateData.success && generateData.missions) {
          setMissions(generateData.missions);
          setSource('database');
          return;
        }
      }
      
      // Fallback to regular missions if generation fails
      const response = await fetch('/api/missions');
      const data = await response.json();
      
      if (data.success) {
        setMissions(data.missions);
        setSource(data.source);
      } else {
        setError('Failed to load missions');
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      setError('Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async (forceDb?: boolean) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/missions${forceDb ? '?source=database' : ''}`);
      const data = await response.json();
      
      if (data.success) {
        setMissions(data.missions);
        setSource(data.source);
      } else {
        setError('Failed to load missions');
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      setError('Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  const generateAIMissions = async () => {
    try {
      setGenerating(true);
      setError('');
      const payload = {
        userBackground: 'Ambitious developer focused on web and AI. Comfortable with React/Next.js and Node.js.',
        interests: ['AI','SaaS','Productivity'],
        industry: 'SaaS',
        difficulty: 'Intermediate',
        count: 3,
      };
      const resp = await fetch('/api/admin/generate-missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate missions');
      }
      await fetchMissions(true);
    } catch (e: any) {
      setError(e.message || 'Failed to generate missions');
    } finally {
      setGenerating(false);
    }
  };

  // Generate missions and show immediately (also stores to DB when available)
  const generateAndShowNow = async () => {
    try {
      setPreviewGenerating(true);
      setError('');
      const payload = {
        userBackground: 'Ambitious developer focused on web and AI. Comfortable with React/Next.js and Node.js.',
        interests: ['AI','SaaS','Productivity'],
        industry: 'SaaS',
        difficulty: 'Intermediate',
        count: 3,
      };
      const resp = await fetch('/api/missions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate missions');
      }
      // Prepend generated missions to the list for immediate UX
      setMissions((prev: StaticMission[]) => [...data.missions, ...prev]);
      // If DB was used, also refetch from DB to align IDs
      if (data.usedDatabase) {
        await fetchMissions(true);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to generate missions');
    } finally {
      setPreviewGenerating(false);
    }
  };

  const seedStaticIntoDB = async () => {
    try {
      setSeeding(true);
      setError('');
      const resp = await fetch('/api/admin/seed-static-missions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 5 }) });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Failed to seed missions');
      }
      await fetchMissions(true);
    } catch (e: any) {
      setError(e.message || 'Failed to seed missions');
    } finally {
      setSeeding(false);
    }
  };

  const handleStartMission = (missionId: string) => {
    router.push(`/missions/${missionId}`);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6A0DAD] mx-auto mb-4"></div>
          <p className="text-[#F5F5F5] text-lg">Loading your personalized missions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Personalized Missions | Velric</title>
        <meta name="description" content="Discover personalized missions tailored to your skills and interests" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="min-h-screen bg-[#0D0D0D]">
        <Navbar />
        
        <div className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/10 via-transparent to-[#00D9FF]/10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#6A0DAD]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00D9FF]/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
            
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.button
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-2 text-[#00D9FF] hover:text-[#6A0DAD] transition-colors duration-200 mb-8"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#1C1C1E] border border-[#6A0DAD]/30 rounded-full mb-8"
              >
                <div className="w-3 h-3 bg-[#00D9FF] rounded-full mr-3 animate-pulse"></div>
                <span className="text-[#00D9FF] text-[14px] font-inter font-semibold uppercase tracking-wide">
                  Fresh AI Missions Generated
                </span>
                {/* Refresh hint */}
                <span className="ml-3 px-3 py-1.5 text-xs rounded-lg bg-[#00D9FF]/20 text-[#00D9FF]/70 border border-[#00D9FF]/30">
                  Refresh page for new missions
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[64px] md:text-[80px] font-bold font-sora mb-6 antialiased leading-tight 
                         bg-gradient-to-r from-[#6A0DAD] via-[#00D9FF] to-[#6A0DAD] 
                         text-transparent bg-clip-text"
              >
                Your Missions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[22px] text-[#F5F5F5]/90 font-inter max-w-3xl mx-auto leading-relaxed"
              >
                Carefully curated challenges from top companies, tailored to accelerate your career growth.
              </motion.p>
            </div>

            {/* Source notice */}
            {source === 'static' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center mb-8 text-yellow-300"
              >
                Showing static example missions. To enable AI-generated missions stored in Supabase, set OPENAI_API_KEY and Supabase keys in .env.local, run the SQL in migrations/create_missions_schema.sql, set USE_DUMMY_DATA=false.
                <div className="mt-3 flex gap-3 justify-center">
                  <button
                    onClick={seedStaticIntoDB}
                    disabled={seeding}
                    className="px-4 py-2 rounded-lg bg-[#1C1C1E] border border-yellow-500/30 text-yellow-200 hover:border-yellow-500/60 disabled:opacity-50"
                  >
                    {seeding ? 'Seeding…' : 'Seed static into DB'}
                  </button>
                  <button
                    onClick={generateAIMissions}
                    disabled={generating}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white disabled:opacity-50"
                  >
                    {generating ? 'Generating…' : 'Generate AI missions'}
                  </button>
                  <button
                    onClick={generateAndShowNow}
                    disabled={previewGenerating}
                    className="px-4 py-2 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 hover:bg-[#00D9FF]/30 disabled:opacity-50"
                  >
                    {previewGenerating ? 'Generating…' : 'Generate & show now'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center mb-8"
              >
                <p className="text-red-400 text-lg">{error}</p>
                <button
                  onClick={() => fetchMissions()}
                  className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Missions Grid */}
            {!error && missions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {missions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#6A0DAD]/20 hover:border-[#6A0DAD]/40 transition-all duration-500 cursor-pointer relative overflow-hidden"
                    onClick={() => handleStartMission(mission.id)}
                  >
                    {/* Card Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/5 via-transparent to-[#00D9FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-l from-[#6A0DAD]/10 to-[#00D9FF]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                      {/* Company Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-3 py-1 bg-[#6A0DAD]/20 text-[#6A0DAD] text-sm font-semibold rounded-full">
                          {mission.company}
                        </div>
                        <div className="flex items-center gap-2 text-[#00D9FF] text-sm">
                          <Clock className="w-4 h-4" />
                          {mission.timeEstimate}
                        </div>
                      </div>

                      {/* Mission Title */}
                      <h3 className="text-xl font-bold text-[#F5F5F5] mb-3 group-hover:text-[#00D9FF] transition-colors duration-300">
                        {mission.title}
                      </h3>

                      {/* Mission Description */}
                      <p className="text-[#F5F5F5]/70 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {mission.description}
                      </p>

                      {/* Field & Difficulty */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-[#00D9FF] text-sm">
                          <TrendingUp className="w-4 h-4" />
                          {mission.field}
                        </div>
                        <div className="px-2 py-1 bg-[#00D9FF]/20 text-[#00D9FF] text-xs rounded">
                          {mission.difficulty}
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {mission.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-[#1C1C1E] text-[#F5F5F5] text-xs rounded border border-gray-700 group-hover:border-[#6A0DAD]/30 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {mission.skills.length > 3 && (
                          <span className="px-2 py-1 bg-[#6A0DAD]/20 text-[#6A0DAD] text-xs rounded">
                            +{mission.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Start Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#6A0DAD]/25 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartMission(mission.id);
                        }}
                      >
                        Start Mission
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Stats Section */}
            {!error && missions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 text-center"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="bg-[#1C1C1E]/60 p-6 rounded-2xl border border-[#6A0DAD]/20">
                    <div className="text-3xl font-bold text-[#6A0DAD] mb-2">{missions.length}</div>
                    <div className="text-[#F5F5F5]/70">Available Missions</div>
                  </div>
                  <div className="bg-[#1C1C1E]/60 p-6 rounded-2xl border border-[#00D9FF]/20">
                    <div className="text-3xl font-bold text-[#00D9FF] mb-2">5</div>
                    <div className="text-[#F5F5F5]/70">Industry Leaders</div>
                  </div>
                  <div className="bg-[#1C1C1E]/60 p-6 rounded-2xl border border-[#6A0DAD]/20">
                    <div className="text-3xl font-bold text-[#6A0DAD] mb-2">100%</div>
                    <div className="text-[#F5F5F5]/70">Personalized</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}