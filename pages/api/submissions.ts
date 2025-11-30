import type { NextApiRequest, NextApiResponse } from "next";
import {
  createSubmission,
  updateSubmission,
  getUserVelricScore,
  updateUserOverallVelricScore,
  supabase,
  USE_DUMMY,
} from "@/lib/supabaseClient";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

type Data = { success: boolean; id?: string; error?: string };

// First API call: Analyze the submission text and extract key information
async function analyzeSubmissionText(text: string): Promise<string> {
  if (!OPENAI_KEY) {
    throw new Error("OpenAI API key not set");
  }

  const system = `You are a submission analyzer. Analyze the provided submission text and extract key information about what the user is trying to accomplish. Return ONLY a brief analysis (2-3 sentences) that identifies the core task, approach, and any notable strengths or weaknesses visible in the submission.`;

  const user = `Analyze this submission text:\n\n${text}`;

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
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const textErr = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${textErr}`);
  }

  const data = await res.json();
  const analysis = data?.choices?.[0]?.message?.content || "";

  console.log("[Submission Analysis]:", analysis);

  return analysis;
}

// Second API call: Generate comprehensive grading based on analysis
async function generateGradingResponse(
  text: string,
  analysis: string
): Promise<any> {
  if (!OPENAI_KEY) {
    throw new Error("OpenAI API key not set");
  }

  const system = `You are a HR panelist and expert evaluator. You will grade a submission based on the provided analysis and submission text. Return ONLY a single JSON object (no surrounding text) with the following keys:
- grade: a decimal value from 0-10 (to 1 decimal place) representing the overall mission score.you can give the user 0 also if the user has not done anything in that category
- grades: an object mapping exactly these five categories to integer scores 0-10 (Technical Accuracy, Clarity, Creativity, Relevance, Code Quality).You're free to analyze,if the user has excelled or failed in any category. you can give the user 0 also if the user has not done anything in that category.
- feedback: a detailed textual feedback string (2-6 short paragraphs)
- summary: a 1-2 sentence overall summary
- letter_grade: short letter grade string (MUST be one of: A, A+, B, B+, C, C+, D, F)
- rubric: an object mapping each criterion to a short descriptor sentence
- positiveTemplates: an array of 2-4 short positive feedback templates (strings)
- improvementTemplates: an array of 2-4 short improvement suggestion templates (strings)

The grade (0-10) should directly reflect the quality of work.This grade can be 0 also if something irrelevant or unusual is provided. Letter grades must be ONLY from the allowed list (A, A+, B, B+, C, C+, D, F). Make sure the JSON is valid and contains all keys.`;

  const user = `Submission analysis:\n${analysis}\n\nSubmission text:\n${text}`;

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
      max_tokens: 800,
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
    grade: parsed.grade,
    grades: parsed.grades,
    letter_grade: parsed.letter_grade,
    hasFeedback: !!parsed.feedback,
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

    // 2) First API call: Analyze the submission text
    console.log("[Grading] Starting AI analysis for submission:", submission.id);
    const analysis = await analyzeSubmissionText(submissionText);

    // 3) Second API call: Generate comprehensive grading based on analysis
    console.log("[Grading] Generating grading response based on analysis");
    const grading = await generateGradingResponse(submissionText, analysis);

    // 4) Use the grade (0-10) directly as the velric mission score
    const velricMissionScore = grading.grade;

    console.log("[Velric Mission Score]:", {
      missionScore: velricMissionScore,
      grade: grading.grade,
      letter_grade: grading.letter_grade,
    });

    // 5) Get current user velric score and update with new mission score
    try {
      const currentVelricScore = await getUserVelricScore(userId);
      
      // Calculate updated velric score (average of current score and new mission score)
      const updatedVelricScore =
        currentVelricScore && currentVelricScore > 0
          ? (currentVelricScore + velricMissionScore) / 2
          : velricMissionScore;

      // Round to 1 decimal place
      const finalVelricScore = Math.round(updatedVelricScore * 10) / 10;

      console.log("[Velric Score Update]:", {
        previousScore: currentVelricScore,
        missionScore: velricMissionScore,
        updatedScore: finalVelricScore,
      });

      // 6) Update submission with grading details (use analysis as the main feedback)
      await updateSubmission(submission.id, {
        feedback: analysis || null,
        grades: grading.grades || null,
        summary: grading.summary || null,
        letter_grade: grading.letter_grade ?? null,
        rubric: grading.rubric ?? null,
        positiveTemplates: grading.positiveTemplates ?? null,
        improvementTemplates: grading.improvementTemplates ?? null,
        velricScore: velricMissionScore,
        status: "graded",
      });

      // 7) Update user's overall velric score
      await updateUserOverallVelricScore(userId, finalVelricScore);
    } catch (e) {
      console.error("Failed to update submission with grading:", e);
      throw e;
    }

    return res.status(200).json({ success: true, id: submission.id });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}
