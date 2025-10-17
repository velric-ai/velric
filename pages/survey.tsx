// pages/survey.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";

const fieldOptions = ["AI", "Web Development", "Data Science", "Mobile Apps"];
const skillLevels = [
  "College Student",
  "Graduate Student",
  "New Grad",
  "3-4 YOE",
  "5+ YOE",
];

export default function Survey() {
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [field, setField] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in");

    if (!fullName || !field || !skillLevel || !resume) {
      return setError("Please fill in all fields");
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: supaError } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          full_name: fullName,
          field_of_interest: field,
          skill_level: skillLevel,
          resume_text: resume,
        });

      if (supaError) throw supaError;

      // Redirect to missions page
      router.push("/missions");
    } catch (err: any) {
      setError(err.message || "Failed to save survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Tell us about yourself</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg flex flex-col gap-6"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-2 font-medium">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Field of Interest */}
        <div>
          <label className="block mb-2 font-medium">Field of Interest</label>
          <div className="flex flex-wrap gap-2">
            {fieldOptions.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setField(f)}
                className={`px-4 py-2 rounded-full border ${
                  field === f
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-600 hover:bg-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label className="block mb-2 font-medium">Skill Level</label>
          <div className="flex flex-wrap gap-2">
            {skillLevels.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSkillLevel(s)}
                className={`px-4 py-2 rounded-full border ${
                  skillLevel === s
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-600 hover:bg-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div>
          <label className="block mb-2 font-medium">Paste Your Resume</label>
          <textarea
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={6}
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          ></textarea>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
