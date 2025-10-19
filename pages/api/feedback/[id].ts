import type { NextApiRequest, NextApiResponse } from "next";
import { getSubmissionById } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || Array.isArray(id))
    return res.status(400).json({ success: false, error: "Invalid id" });

  try {
    const submission = await getSubmissionById(id);
    if (!submission)
      return res.status(404).json({ success: false, error: "Not found" });
    return res.status(200).json({ success: true, submission });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}
