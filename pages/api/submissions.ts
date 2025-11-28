import type { NextApiRequest, NextApiResponse } from "next";
import {
  createSubmission,
  updateSubmission,
  getCompletedSubmissionsByUser,
  updateUserOverallVelricScore,
  supabase,
  USE_DUMMY,
} from "@/lib/supabaseClient";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

type Data = { success: boolean; id?: string; error?: string };

async function callOpenAIToGrade(text: string, isTechnical: boolean = true) {
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
    if (hasCode && isTechnical) baseScore += 15;
    if (hasStructure) baseScore += 10;
    // Add some randomness (±5)
    baseScore += Math.floor(Math.random() * 11) - 5;
    baseScore = Math.min(95, Math.max(50, baseScore));

    // Build grades object - exclude Code Quality for non-technical missions
    const grades: Record<string, number> = {
      "Technical Accuracy": Math.floor(baseScore / 10),
      Clarity: Math.floor((baseScore + 5) / 10),
      Creativity: Math.floor((baseScore - 5) / 10),
      Relevance: Math.floor(baseScore / 10),
    };

    // Only include Code Quality for technical missions
    if (isTechnical) {
      grades["Code Quality"] = hasCode
        ? Math.floor((baseScore + 10) / 10)
        : Math.floor((baseScore - 10) / 10);
    }

    const rubric: Record<string, string> = {
      "Technical Accuracy": "Demonstrates understanding of concepts",
      Clarity: "Clear communication of ideas",
      Creativity: "Original approach to problem-solving",
      Relevance: "Addresses the mission requirements",
    };

    if (isTechnical) {
      rubric["Code Quality"] = hasCode ? "Well-structured code" : "N/A";
    }

    return {
      grades,
      feedback: `Your submission demonstrates ${
        baseScore >= 80 ? "excellent" : baseScore >= 70 ? "good" : "adequate"
      } understanding. ${
        isTechnical && hasCode
          ? "The code implementation shows promise."
          : !isTechnical
          ? "Your strategic approach and analysis are well-presented."
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
      rubric,
      positiveTemplates: [
        "Great attention to detail",
        "Clear documentation",
        "Good problem-solving approach",
      ],
      improvementTemplates: isTechnical
        ? [
            "Consider adding more examples",
            "Expand on edge cases",
            "Improve code comments",
          ]
        : [
            "Consider adding more examples",
            "Expand on analysis depth",
            "Strengthen strategic recommendations",
          ],
    };
  }

  // Build grading categories based on mission type
  const gradingCategories = isTechnical
    ? "Technical Accuracy, Clarity, Creativity, Relevance, Code Quality"
    : "Technical Accuracy, Clarity, Creativity, Relevance";

  const system = `You are an expert grader. You will receive a submission text for an assignment or project. Your job is to infer the assignment/task from the submission itself and provide feedback, grades, rubric, and feedback templates accordingly. Return ONLY a single JSON object (no surrounding text) with the following keys:\n- grades: an object mapping exactly these ${isTechnical ? "five" : "four"} categories to integer scores 1-10 (${gradingCategories})\n- feedback: a detailed textual feedback string (2-6 short paragraphs)\n- summary: a 1-2 sentence overall summary\n- overall_score: integer 0-100 representing combined score\n- letter_grade: short letter grade string (e.g. A, A-, B+)\n- rubric: an object mapping each criterion to a short descriptor sentence\n- positiveTemplates: an array of 2-4 short positive feedback templates (strings)\n- improvementTemplates: an array of 2-4 short improvement suggestion templates (strings)\n${isTechnical ? "" : "IMPORTANT: This is a NON-TECHNICAL mission. Do NOT include 'Code Quality' in the grades. Focus on strategic thinking, analysis, and business impact instead."}\nInfer the assignment/task from the submission text and grade accordingly. Make sure the JSON is valid and contains all keys.`;

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
    // 0) Determine if mission is technical or non-technical
    let isTechnical = true; // Default to technical
    if (missionId) {
      try {
        if (USE_DUMMY) {
          // For dummy mode, check if field contains "Non-technical" or similar
          isTechnical = true; // Default assumption for dummy mode
        } else {
          const { data: mission, error: missionError } = await supabase
            .from("missions")
            .select("field")
            .eq("id", missionId)
            .single();

          if (!missionError && mission) {
            const field = (mission.field || "").toLowerCase();
            // Check if field explicitly indicates non-technical
            // Based on the mission generation prompt, field can be "Technical" or "Non-technical"
            isTechnical = !field.includes("non-technical") && 
                         field !== "non-technical" &&
                         !field.startsWith("non-technical");
          }
        }
      } catch (err) {
        console.warn("[Grading] Could not determine mission type, defaulting to technical:", err);
        isTechnical = true;
      }
    }

    // 1) Save submission
    const { submission } = await createSubmission({
      userId: userId!,
      missionId: missionId || "",
      submissionText: submissionText!,
    });

    // 2) Call OpenAI to grade (MVP requires API key)
    console.log("[Grading] Starting AI grading for submission:", submission.id, "isTechnical:", isTechnical);
    const grading = await callOpenAIToGrade(submissionText, isTechnical);
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
