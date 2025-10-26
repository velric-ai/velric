// utils/openai.ts
export type Mission = {
  id: number;
  title: string;
  description: string;
  steps: string[];
};

// Fetch missions from server API
export const generateMissions = async (name: string, field: string): Promise<Mission[]> => {
  try {
    const res = await fetch("/api/generate-missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, field }),
    });
    if (!res.ok) throw new Error("Failed to generate missions");
    const data: Mission[] = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
