import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { OpenAI } from "openai";

// ---------------------------------------------------------------------
// Parse PDF text with OpenAI → structured JSON
// ---------------------------------------------------------------------
async function parseResumeTextWithAI(text: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },   // Auto-return proper JSON
    messages: [
      {
        role: "system",
        content:
          "You are a resume parser. Return clean JSON with: name, email, phone, education, experience, skills, summary.",
      },
      { role: "user", content: text },
    ],
    temperature: 0.1,
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}");
}

// ---------------------------------------------------------------------
// API Route Handler
// Accepts raw text from client-side PDF parsing
// Sends to OpenAI for structured JSON parsing
// Stores result in survey_responses resume_json column
// ---------------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { surveyResponseId, pdfText } = req.body;

    // 1️⃣ Validate inputs
    if (!surveyResponseId) {
      return res.status(400).json({ error: "Missing surveyResponseId" });
    }

    if (!pdfText || typeof pdfText !== "string") {
      return res.status(400).json({ error: "Missing or invalid pdfText. PDF should be parsed on client-side." });
    }

    // 2️⃣ Parse resume text into structured JSON using OpenAI
    let resumeJson: any;
    try {
      resumeJson = await parseResumeTextWithAI(pdfText);
    } catch (err) {
      console.error("OpenAI parsing error:", err);
      return res.status(500).json({
        error: "OpenAI resume parsing failed",
        details: String(err),
      });
    }

    // 3️⃣ Update Supabase with structured JSON
    try {
      const { error: updateError } = await supabase
        .from("survey_responses")
        .update({ resume_json: resumeJson })
        .eq("id", surveyResponseId);

      if (updateError) {
        throw updateError;
      }
    } catch (err) {
      console.error("Supabase update error:", err);
      return res.status(500).json({
        error: "Failed to update resume_json in Supabase",
        details: String(err),
      });
    }

    // 4️⃣ Return result
    return res.status(200).json({ 
      success: true,
      message: "Resume parsed and stored successfully",
      resume_json: resumeJson 
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Unexpected server error", details: String(err) });
  }
}
