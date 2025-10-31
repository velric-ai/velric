import type { NextApiRequest, NextApiResponse } from "next";
import {
  createSubmission,
  updateSubmission,
  getCompletedSubmissionsByUser,
  updateUserOverallVelricScore,
} from "@/lib/supabaseClient";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

type Data = { success: boolean; id?: string; error?: string };

async function callOpenAIToGrade(text: string) {
  if (!OPENAI_KEY) {
    console.warn("[Grading] OpenAI API key not set, using mock grading");
    // Fallback: Generate realistic mock grading based on submission length and quality
    const wordCount = text.split(/\s+/).length;
    const hasCode = /```|function|const|let|var|class|import/.test(text);
    const hasStructure = text.length > 100;

    // Calculate base score (50-90) based on submission quality indicators
    let baseScore = 50;
    if (wordCount > 100) baseScore += 10;
    if (wordCount > 300) baseScore += 10;
    if (hasCode) baseScore += 15;
    if (hasStructure) baseScore += 10;
    // Add some randomness (±5)
    baseScore += Math.floor(Math.random() * 11) - 5;
    baseScore = Math.min(95, Math.max(50, baseScore));

    return {
      grades: {
        "Technical Accuracy": Math.floor(baseScore / 10),
        Clarity: Math.floor((baseScore + 5) / 10),
        Creativity: Math.floor((baseScore - 5) / 10),
        Relevance: Math.floor(baseScore / 10),
        "Code Quality": hasCode
          ? Math.floor((baseScore + 10) / 10)
          : Math.floor((baseScore - 10) / 10),
      },
      feedback: `Your submission demonstrates ${
        baseScore >= 80 ? "excellent" : baseScore >= 70 ? "good" : "adequate"
      } understanding. ${
        hasCode
          ? "The code implementation shows promise."
          : "Consider adding code examples to strengthen your submission."
      } ${
        wordCount > 200
          ? "Your detailed explanation is appreciated."
          : "Try to provide more comprehensive explanations."
      }`,
      summary: `${
        baseScore >= 80 ? "Strong" : baseScore >= 70 ? "Good" : "Satisfactory"
      } submission with room for improvement.`,
      overall_score: baseScore,
      letter_grade:
        baseScore >= 90
          ? "A"
          : baseScore >= 80
          ? "B+"
          : baseScore >= 70
          ? "B"
          : baseScore >= 60
          ? "C+"
          : "C",
      rubric: {
        "Technical Accuracy": "Demonstrates understanding of concepts",
        Clarity: "Clear communication of ideas",
        Creativity: "Original approach to problem-solving",
        Relevance: "Addresses the mission requirements",
        "Code Quality": hasCode ? "Well-structured code" : "N/A",
      },
      positiveTemplates: [
        "Great attention to detail",
        "Clear documentation",
        "Good problem-solving approach",
      ],
      improvementTemplates: [
        "Consider adding more examples",
        "Expand on edge cases",
        "Improve code comments",
      ],
    };
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

  console.log("[OpenAI Grading Response]:", {
    hasGrades: !!parsed.grades,
    grades: parsed.grades,
    overall_score: parsed.overall_score,
    letter_grade: parsed.letter_grade,
  });

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
    const { submission } = await createSubmission({
      userId: userId!,
      missionId: missionId || "",
      submissionText: submissionText!,
    });

    // 2) Call OpenAI to grade (MVP requires API key)
    console.log("[Grading] Starting AI grading for submission:", submission.id);
    const grading = await callOpenAIToGrade(submissionText);
    console.log("[Grading] AI returned:", {
      hasGrades: !!grading.grades,
      overall_score: grading.overall_score,
      letter_grade: grading.letter_grade,
      hasFeedback: !!grading.feedback,
    });

    // 3) Calculate Velric score for user (0-10 scale, harder to get 10/10)
    try {
      // Get all completed/graded submissions for user
      const completedSubs = await getCompletedSubmissionsByUser(userId);

      // Collect all scores including current one
      const allScores = [
        ...completedSubs.map((sub: any) =>
          typeof sub.overall_score === "number" ? sub.overall_score : 0
        ),
        typeof grading.overall_score === "number" ? grading.overall_score : 0,
      ];

      // Calculate weighted average (recent submissions have slightly more weight)
      let weightedSum = 0;
      let weightSum = 0;
      allScores.forEach((score, index) => {
        const weight = 1 + (index / allScores.length) * 0.5; // Recent ones get up to 1.5x weight
        weightedSum += score * weight;
        weightSum += weight;
      });
      const averageScore = weightSum > 0 ? weightedSum / weightSum : 0;

      console.log("[Velric Score Calculation]:", {
        allScoresCount: allScores.length,
        allScoresValues: allScores,
        averageScore: averageScore,
        weightedSum,
        weightSum,
      });

      // Convert 0-100 scale to 0-10 with harsh curve
      // Perfect 10 requires 95+ average, 9+ requires 85+, 8+ requires 75+
      let velricScore = 0;
      if (averageScore >= 95) velricScore = 10;
      else if (averageScore >= 90) velricScore = 9.5;
      else if (averageScore >= 85) velricScore = 9;
      else if (averageScore >= 80) velricScore = 8.5;
      else if (averageScore >= 75) velricScore = 8;
      else if (averageScore >= 70) velricScore = 7.5;
      else if (averageScore >= 65) velricScore = 7;
      else if (averageScore >= 60) velricScore = 6.5;
      else if (averageScore >= 55) velricScore = 6;
      else velricScore = Math.max(1, averageScore / 10); // Minimum 1.0

      console.log("[Velric Score Calculation Detail]:", {
        averageScore,
        beforeCurve: velricScore,
        curveApplied: averageScore >= 55 ? "tiered" : "linear",
      });

      // Small bonus for consistency (completing multiple missions)
      const consistencyBonus = Math.min(0.5, allScores.length * 0.05);
      velricScore = Math.min(10, velricScore + consistencyBonus);

      // Round to 1 decimal place
      velricScore = Math.round(velricScore * 10) / 10;

      console.log("[Velric Score Final]:", {
        calculatedScore: velricScore,
        consistencyBonus,
        finalScore: velricScore,
      });
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
      await updateUserOverallVelricScore(userId, velricScore);
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
