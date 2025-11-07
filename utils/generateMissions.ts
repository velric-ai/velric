import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid"; // for unique mission IDs

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const usersPath = path.join(process.cwd(), "data", "users.json");
const missionsPath = path.join(process.cwd(), "public", "data", "generatedMissions.json");

export async function generateMissions() {
  // Load users
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const allMissions: any[] = [];

  for (const user of users) {
    const prompt = `
You are an AI that generates project-based missions for users based on their professional field.

User:
- Name: ${user.name}
- Field: ${user.field}

Using the StaticMission format below, generate 2 new, unique, creative missions specifically designed for this user's field.

StaticMission format:
{
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
}

Return only valid JSON.
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a JSON-generating assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
      });

      let content = response.choices[0].message?.content ?? "";
      content = content.replace(/```json|```/g, "").trim();

      const missions = JSON.parse(content);

      // Ensure each mission has a unique ID and default status
      missions.forEach((m: any) => {
        m.id = uuidv4();
        m.status = "suggested";
      });

      allMissions.push(...missions);
    } catch (err) {
      console.error("❌ Error generating missions for user", user.name, err);
    }
  }

  // Ensure the directory exists
  const dir = path.dirname(missionsPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Save missions to public/data/generatedMissions.json
  fs.writeFileSync(missionsPath, JSON.stringify(allMissions, null, 2), "utf-8");
  console.log(`✅ Generated ${allMissions.length} missions and saved to ${missionsPath}`);

  return allMissions;
}
