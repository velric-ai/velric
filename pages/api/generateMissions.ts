import type { NextApiRequest, NextApiResponse } from "next";
import { generateMissions } from "@/utils/generateMissions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const missions = await generateMissions();
    res.status(200).json({ success: true, missions });
  } catch (error) {
    console.error("❌ Error generating missions:", error);
    res.status(500).json({ success: false, error: "Failed to generate missions" });
  }
}
