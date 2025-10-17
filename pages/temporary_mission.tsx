import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function TemporaryMission() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] pt-20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] pt-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Missions Coming Soon!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Your personalized missions will appear here soon.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Missions Feature Under Development
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're working hard to create personalized missions based on your survey responses and resume. 
            Check back soon to start your journey!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Personalized</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Tailored to your skills</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Career-focused</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Real-world experience</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Growth-oriented</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">Skill development</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => router.push("/profile")}
            className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}