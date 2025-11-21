import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { OpenAI } from "openai";
import * as pdfjsLib from "pdfjs-dist";

// ⚠️ Required: Worker file for pdfjs-dist
//pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.js");

// ---------------------------------------------------------------------
// Extract text from PDF using pdfjs-dist
// ---------------------------------------------------------------------
async function extractTextFromPDF(uint8Array: Uint8Array): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");

    fullText += text + "\n";
  }

  return fullText;
}

// ---------------------------------------------------------------------
// Download PDF from URL → return text
// ---------------------------------------------------------------------
async function fetchPdfText(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  return await extractTextFromPDF(uint8Array);
}

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
// ---------------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { surveyResponseId } = req.body;

    if (!surveyResponseId) {
      return res.status(400).json({ error: "Missing surveyResponseId" });
    }

    // 1️⃣ Load portfolio from Supabase
    const { data, error } = await supabase
      .from("survey_responses")
      .select("portfolio")
      .eq("id", surveyResponseId)
      .single();

    if (error || !data?.portfolio?.url) {
      console.error("Portfolio fetch error:", error);
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const pdfUrl = data.portfolio.url;

    // 2️⃣ Extract text from PDF
    let pdfText: string;
    try {
      pdfText = await fetchPdfText(pdfUrl);
    } catch (err) {
      console.error("PDF reading error:", err);
      return res.status(500).json({ error: "Failed to read PDF", details: String(err) });
    }

    // 3️⃣ Parse resume into structured JSON
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

    // 4️⃣ Update Supabase with structured JSON
    try {
      await supabase
        .from("survey_responses")
        .update({ resume_json: resumeJson })
        .eq("id", surveyResponseId);
    } catch (err) {
      console.error("Supabase update error:", err);
      return res.status(500).json({
        error: "Failed to update resume_json in Supabase",
        details: String(err),
      });
    }

    // 5️⃣ Return result
    return res.status(200).json({ resume_json: resumeJson });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Unexpected server error", details: String(err) });
  }
}
