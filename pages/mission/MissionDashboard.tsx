import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface StaticMission {
  id: string;
  title: string;
  description: string;
  field: string;
  difficulty: string;
  timeEstimate: string;
  category: string;
  skills: string[];
  industries: string[];
  tasks: string[];
  evaluationMetrics: string[];
  company?: string;
  context?: string;
  objectives?: string[];
  resources?: string[];
  status: "suggested" | "starred" | "in_progress" | "submitted" | "completed";
  grade?: number;
  feedback?: string;
  started_at?: string;
  submitted_at?: string;
  completed_at?: string;
}

export default function MissionDashboard() {
  const [missions, setMissions] = useState<StaticMission[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch missions from API
  const fetchMissions = async () => {
    try {
      const res = await fetch("/api/getMissions", { cache: "no-store" });
      if (!res.ok) {
        setMissions([]);
        return;
      }
      const data: StaticMission[] = await res.json(); // Directly use the array returned
      setMissions(data);
    } catch (err) {
      console.error("❌ Failed to fetch missions:", err);
      setMissions([]);
    }
  };

  // Generate missions API call
  const handleGenerateMissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generateMissions", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate missions");
      await fetchMissions();
    } catch (err) {
      console.error("❌ Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to mission page
  const handleMissionClick = (id: string) => {
    router.push(`/mission/${id}`);
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">🎯 Mission Dashboard</h1>

      <button
        onClick={handleGenerateMissions}
        disabled={loading}
        className={`mb-8 px-6 py-3 rounded-lg font-medium transition-all ${
          loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg"
        }`}
      >
        {loading ? "Generating..." : "Generate Missions"}
      </button>

      {missions.length === 0 && !loading && (
        <p className="text-gray-400">No missions yet. Click “Generate Missions” to start.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => handleMissionClick(mission.id)}
            className="p-6 border border-gray-700 rounded-xl bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-2 text-purple-400">{mission.title}</h2>
            <p className="text-gray-400 mb-1">
              <strong>Field:</strong> {mission.field}
            </p>
            <p className="text-gray-400 mb-1">
              <strong>Difficulty:</strong> {mission.difficulty}
            </p>
            <p className="text-gray-300 mb-2">{mission.description}</p>
            <p className="text-gray-400">
              <strong>Skills:</strong> {mission.skills.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
