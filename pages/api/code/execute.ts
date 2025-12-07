import type { NextApiRequest, NextApiResponse } from "next";

type ExecuteCodeResponse =
  | {
      success: true;
      stdout?: string;
      stderr?: string;
      output?: string;
      executionTime?: number;
    }
  | { success: false; error: string; stderr?: string };

// Language mapping for code execution service
const LANGUAGE_MAP: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rust",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  swift: "swift",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExecuteCodeResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { code, language } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }

    if (!language || typeof language !== "string") {
      return res.status(400).json({
        success: false,
        error: "Language is required",
      });
    }

    const execLanguage = LANGUAGE_MAP[language.toLowerCase()];
    if (!execLanguage) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    // Use Piston API (free code execution service)
    const PISTON_API_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";
    const startTime = Date.now();

    try {
      const response = await fetch(PISTON_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: execLanguage,
          version: "*",
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Piston API error:", errorText);
        return res.status(500).json({
          success: false,
          error: "Code execution service unavailable",
          stderr: errorText,
        });
      }

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      if (result.run) {
        const { stdout, stderr } = result.run;
        return res.status(200).json({
          success: true,
          stdout: stdout || "",
          stderr: stderr || "",
          output: stdout || stderr || "",
          executionTime,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Invalid response from code execution service",
        });
      }
    } catch (fetchError: any) {
      console.error("Error calling execution service:", fetchError);
      return res.status(500).json({
        success: false,
        error: "Failed to execute code. Please try again.",
        stderr: fetchError.message,
      });
    }
  } catch (err: any) {
    console.error("/api/code/execute error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}
