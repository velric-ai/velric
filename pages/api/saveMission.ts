import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const missions = req.body;

    // Use absolute path
    const filePath = path.join(process.cwd(), "data", "missions.json");

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write missions to JSON file
    fs.writeFileSync(filePath, JSON.stringify(missions, null, 2), "utf-8");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving missions:", err);
    return res.status(500).json({ error: "Failed to save missions" });
  }
}
