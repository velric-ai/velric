import { useState } from "react";

export default function SurveyPage() {
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [goals, setGoals] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // 暂时不用后端，直接模拟成功
    setTimeout(() => setMsg("Saved!"), 400);
  }

  const inputCls =
    "w-full border rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20";
  const btnCls =
    "bg-black text-white rounded-xl px-4 py-2 hover:opacity-90 transition";

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-full max-w-xl bg-white rounded-2xl shadow p-6"
      >
        <h1 className="text-2xl font-semibold mb-1">Career Survey</h1>
        <p className="text-sm text-gray-500 mb-4">
          Help us personalize your experience
        </p>

        <label className="text-sm text-gray-600">Target industry</label>
        <input
          className={inputCls}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g., Banking, Consulting"
        />

        <label className="text-sm text-gray-600">Years of experience</label>
        <input
          className={inputCls}
          value={experience}
          onChange={(e) => setExperience(Number(e.target.value) || 0)}
          type="number"
          min={0}
        />

        <label className="text-sm text-gray-600">Your goals</label>
        <textarea
          className={inputCls + " min-h-[96px]"}
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="Briefly describe your goals"
        />

        <button className={btnCls + " mt-2"} type="submit">
          Submit
        </button>

        {msg && <p className="mt-3 text-sm text-gray-500">{msg}</p>}
      </form>
    </main>
  );
}
