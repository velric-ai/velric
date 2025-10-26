import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const missionsPath = path.join(process.cwd(), "public", "data", "generatedMissions.json");

  try {
    const data = fs.readFileSync(missionsPath, "utf-8");
    const missions = JSON.parse(data);
    res.status(200).json(missions);
  } catch (error) {
    console.warn("⚠️ No missions file found, returning empty array.");
    res.status(200).json([]);
  }
}
