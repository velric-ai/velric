import type { NextApiRequest, NextApiResponse } from "next";
import { createSubmission } from "@/lib/supabaseClient";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

type Data = { success: boolean; id?: string; error?: string };

async function callOpenAIToGrade(text: string) {
  if (!OPENAI_KEY) {
    throw new Error("OPENAI_API_KEY is required for grading in MVP");
  }

  const system = `You are an expert grader. You will receive a submission text for an assignment or project. Your job is to infer the assignment/task from the submission itself and provide feedback, grades, rubric, and feedback templates accordingly. Return ONLY a single JSON object (no surrounding text) with the following keys:\n- grades: an object mapping exactly these five categories to integer scores 1-10 (Technical Accuracy, Clarity, Creativity, Relevance, Code Quality)\n- feedback: a detailed textual feedback string (2-6 short paragraphs)\n- summary: a 1-2 sentence overall summary\n- overall_score: integer 0-100 representing combined score\n- letter_grade: short letter grade string (e.g. A, A-, B+)\n- rubric: an object mapping each criterion to a short descriptor sentence\n- positiveTemplates: an array of 2-4 short positive feedback templates (strings)\n- improvementTemplates: an array of 2-4 short improvement suggestion templates (strings)\nInfer the assignment/task from the submission text and grade accordingly. Make sure the JSON is valid and contains all keys.`;

  const user = `Here is a submission text. Please infer the assignment/task and grade it as described above.\n\n${text}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.15,
      max_tokens: 700,
    }),
  });

  if (!res.ok) {
    const textErr = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${textErr}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "";

  // Defensive JSON extraction: try to find first JSON object in the response
  const jsonMatch = content.match(/\{[\s\S]*\}/m);
  const jsonText = jsonMatch ? jsonMatch[0] : content;
  const parsed = JSON.parse(jsonText);
  return parsed;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });

  const { submissionText, missionId, userId } = req.body as {
    submissionText?: string;
    missionId?: string;
    userId?: string;
  };
  if (!submissionText || !userId)
    return res
      .status(400)
      .json({ success: false, error: "Missing submissionText or userId" });

  try {
    // 1) Save submission
    const submission = await createSubmission(
      userId,
      missionId || null,
      submissionText
    );

    // 2) Call OpenAI to grade (MVP requires API key)
    const grading = await callOpenAIToGrade(submissionText);

    // 3) Calculate Velric score for user
    try {
      const { updateSubmission, getCompletedSubmissionsByUser } = await import(
        "@/lib/supabaseClient"
      );
      // Get all completed/graded submissions for user
      const completedSubs = await getCompletedSubmissionsByUser(userId);
      // Use overall_score from each completed submission (default 0 if missing)
      const gradesSum = completedSubs.reduce(
        (sum: number, sub: any) =>
          sum + (typeof sub.overall_score === "number" ? sub.overall_score : 0),
        0
      );
      const bonus = completedSubs.length * 10;
      const velricScore = gradesSum + bonus;
      await updateSubmission(submission.id, {
        feedback: grading.feedback || grading.summary || null,
        grades: grading.grades || null,
        summary: grading.summary || null,
        overall_score: grading.overall_score ?? null,
        letter_grade: grading.letter_grade ?? null,
        rubric: grading.rubric ?? null,
        positiveTemplates: grading.positiveTemplates ?? null,
        improvementTemplates: grading.improvementTemplates ?? null,
        velricScore,
        status: "graded",
      });
    } catch (e) {
      console.error("Failed to update submission with grading:", e);
    }

    return res.status(200).json({ success: true, id: submission.id });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}
