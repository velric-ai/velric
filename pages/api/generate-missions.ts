// pages/api/generate-missions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // safe server-side
});

export type Mission = {
  id: number;
  title: string;
  description: string;
  steps: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, field } = req.body;

  if (!name || !field) {
    return res.status(400).json({ error: "Missing name or field" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 3 missions for a user named "${name}" in the field of "${field}". Return a JSON array with id, title, description, steps (array).`,
        },
      ],
    });

    let text = completion.choices[0]?.message?.content || "[]";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let missions: Mission[] = [];
    try {
      missions = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse GPT output:", text);
      missions = [];
    }

    res.status(200).json(missions);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
