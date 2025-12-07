// lib/ai.ts
// lib/ai.ts
import { MissionTemplate } from "@/types";
import { StaticMission } from "@/data/staticMissions";
import { storeAIGeneratedMission, supabase } from "@/lib/supabaseClient";
import OpenAI from "openai";

// Initialize OpenAI client
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn(
    "OpenAI API key not configured. Mission generation will use fallback method."
  );
}

if (typeof window === "undefined" && process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Enhanced prompt template for comprehensive mission generation
export const COMPREHENSIVE_MISSION_PROMPT = `
You are an HR expert and mentor who creates realistic, engaging missions based on actual industry scenarios and individual professional profiles. Generate a comprehensive mission that feels like a real project from a top-tier company, specifically tailored to the user's actual experience and skills.

CONTEXT FROM SURVEY:
- Resume Data: {resume_json}
- Education Level: {education_level}
- Industry Focus: {industry}
- Mission Focus Areas: {mission_focus}
- Strength Areas: {strength_areas}
- Experience Summary: {experience_summary}
- Difficulty Level: {level}
-time estimate - less than 2 hours

RESUME DATA INTEGRATION:
The Resume Data above contains structured professional information including:
- Technical skills, programming languages, and tools from the user's actual resume
- Real work experience with companies and roles
- Completed projects and their technologies
- Educational background and certifications
- Career trajectory and expertise areas

USE THIS DATA TO:
1. Create missions that leverage the user's ACTUAL existing skills and experience
2. Build on their demonstrated expertise rather than generic interests
3. Suggest next-level challenges that extend their proven capabilities
4. Recommend technologies they've already worked with for familiarity
5. Frame missions in the context of their career progression

CLASSIFY USER:
1. Determine if the user profile is TECHNICAL or NON-TECHNICAL using resume data and background above.
2. TECHNICAL indicators: programming, software, engineering, devops, data engineering, machine learning skills in resume.
3. NON-TECHNICAL indicators: product management, UX research/design, marketing, operations, strategy, sales in resume/background.
4. Tailor the mission accordingly:
   - Technical: implementation-focused mission with code, architecture, testing, deployment using technologies from their resume.
   - Non-technical: non-coding mission such as product strategy, research, analytics, go-to-market, process optimization.

REQUIREMENTS:
Generate a single, detailed mission with the following structure.Make Sure that the missions are Easy and Quick so that it can be completed in given time. The user will write the approach for non technical and will write approach and Code in technical,So make sure the Missions generated can be concluded under 250 character for approach and small code for technical. Make it as comprehensive and detailed as the example missions you might find at companies like Google, Meta, or top startups. CRUCIALLY: Use the user's resume data to make the mission highly personalized to their skill level and experience.

MISSION OUTPUT (JSON):
{
  "title": "Engaging, specific mission title directly related to user's resume skills and experience",
  "description": "Detailed 3-4 sentence description explaining scenario, impact, constraints, and outcome. Reference user's relevant experience/skills from resume.",
  "type": "technical" or "non-technical" - MUST be determined based on classification above,
  "language": "primary programming language for technical missions (e.g., 'python', 'javascript', 'java', 'cpp', 'sql', 'typescript', 'go', 'rust') - null for non-technical missions. Detect from user's resume skills and mission requirements",
  "field": "Match classification: Technical (use technologies from user's resume like 'Backend Engineering with Node.js', 'Frontend Development with React', etc.) or Non-technical",
  "difficulty": "Beginner|Intermediate|Advanced - Must match user's experience level from resume",
  "timeEstimate": "Realistic time estimate",
  "category": "Aligned with classification and user's demonstrated experience",
  "company": "Realistic company name in user's industry focus",
  "context": "4-5 sentences of urgent business context with metrics/timelines. Reference industry-specific challenges relevant to user's background.",
  "skills": ["6-8 skills directly from or building on user's resume (prioritize technologies they've already used, add complementary skills)"],
  "industries": ["2-3 relevant industries - PRIMARY: {industry}, SECONDARY: industries from user's resume experience"],
  "tasks": [
    "5-7 actionable tasks tailored to classification and user's actual experience level.",
    "Technical: implementation steps using technologies from their resume, with measurable criteria (performance, security, tests, deployment)",
    "Non-technical: discovery, research, analysis, stakeholder alignment, experiment design, KPI definition, roadmap, reporting"
  ],
  "objectives": [
    "3-4 learning objectives aligned with career growth and building on their existing expertise. Add a context why this mission is generated based on their education level, industry focus, strength areas, or mission focus areas."
  ],
  "resources": [
    "4-6 resources aligned with classification and user's tech stack from resume (Technical: docs for their tech stack, cloud platforms they know, similar codebases; Non-technical: interview pools, analytics dashboards, market research)"
  ],
  "evaluationMetrics": [
    "4-6 measurable criteria aligned with classification and user's professional standards",
    "Technical: performance, reliability, coverage, scalability, security (using their tech stack)",
    "Non-technical: customer impact (NPS, conversion), research validity, roadmap clarity, stakeholder alignment, KPI movement"
  ]
}

CRITICAL GUIDELINES:
1. LEVERAGE SURVEY DATA: Use user's actual education level, industry focus, mission focus areas, and strength areas to create highly personalized missions.
2. SKILL CONTINUITY: Build missions that extend existing skills rather than random unrelated technologies.
3. COMPANY CONTEXT MUST BE URGENT, SPECIFIC, and relevant to user's industry experience.
4. TASKS MUST BE COMPREHENSIVE, include acceptance criteria, and use user's proven tech stack.
5. TECHNICAL DEPTH must match user's actual difficulty level based on education level.
6. BUSINESS IMPACT must be explicit, measurable, and relatable to user's industry.
7. REAL-WORLD CONSTRAINTS must be included.
8. STRICT INDUSTRY ALIGNMENT: Use provided {resume_json} as PRIMARY focus, but honor user's demonstrated expertise from resume.
9. TECHNOLOGY STACK: Prioritize technologies from user's resume; add complementary tools for skill progression.
10. Make sure the missions are of {level} difficulty and can be realistically completed within the given time estimate.
DO NOT CREATE GENERIC MISSIONS - Make every mission specific to this user's actual professional profile based on survey responses.

Generate a mission that reads like it came from a real company's high-priority project backlog, specifically designed for this user's skill level and experience. Use their survey data as the foundation for relevance and personalization.
`;

/**
 * Survey Response Type - Data structure from survey_responses table in Supabase
 * This ensures type safety and clarity that data comes from the survey_responses table
 */
export interface SurveyResponseData {
  education_level: string;
  industry: string;
  level: string;
  mission_focus: string[] | string;
  strength_areas: string[] | string;
  resume_json: any;
  experience_summary: string;
  full_name?: string;
  user_id?: string;
}

/**
 * Fetch survey data from survey_responses table for a specific user
 * This is the single source of truth for survey data
 */
export async function fetchSurveyDataFromTable(userId: string): Promise<SurveyResponseData | null> {
  try {
    const { data: surveyData, error: surveyError } = await supabase
      .from('survey_responses')
      .select(
        'education_level, industry, level, mission_focus, strength_areas, resume_json, experience_summary, full_name, user_id, created_at'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (surveyError || !surveyData) {
      console.error('[Survey Data Fetch] Error fetching survey data:', surveyError);
      return null;
    }

    // Validate that all required fields are present from survey_responses table
    if (!surveyData.education_level || !surveyData.industry || !surveyData.level) {
      console.error('[Survey Data Fetch] Survey data is incomplete. Missing required fields.');
      return null;
    }

    return surveyData as SurveyResponseData;
  } catch (error) {
    console.error('[Survey Data Fetch] Exception while fetching survey data:', error);
    return null;
  }
}

/**
 * Generate a single comprehensive mission from survey data using OpenAI
 * Data MUST come exclusively from survey_responses table
 */
export async function generateMissionFromSurvey(surveyData: SurveyResponseData): Promise<StaticMission> {
  if (!openai) {
    console.warn("OpenAI not configured. Using fallback generation.");
    return generateFallbackMissionFromSurvey(surveyData);
  }

  try {
    // Format resume data for the prompt
    let resumeDataStr = "";
    if (surveyData.resume_json) {
      try {
        const parsed =
          typeof surveyData.resume_json === "string"
            ? JSON.parse(surveyData.resume_json)
            : surveyData.resume_json;

        const parts = [];
        if (parsed.summary) parts.push(`Summary: ${parsed.summary}`);
        if (parsed.skills && Array.isArray(parsed.skills)) {
          parts.push(`Skills: ${parsed.skills.join(", ")}`);
        }
        if (parsed.experiences && Array.isArray(parsed.experiences)) {
          const expList = parsed.experiences
            .map(
              (e: any) =>
                `${e.title || "Role"} at ${e.company || "Company"}${
                  e.startDate ? ` (${e.startDate}-${e.endDate || "Present"})` : ""
                }`
            )
            .join("; ");
          parts.push(`Experiences: ${expList}`);
        }
        if (parsed.projects && Array.isArray(parsed.projects)) {
          parts.push(
            `Projects: ${parsed.projects.map((p: any) => p.name).join(", ")}`
          );
        }
        if (parsed.education && Array.isArray(parsed.education)) {
          const eduList = parsed.education
            .map(
              (ed: any) =>
                `${ed.degree || "Degree"} in ${ed.field || "Field"} from ${
                  ed.institution || "Institution"
                }`
            )
            .join("; ");
          parts.push(`Education: ${eduList}`);
        }

        resumeDataStr = parts.join(" | ");
      } catch (e) {
        console.warn("Failed to parse resume_json:", e);
        resumeDataStr = String(surveyData.resume_json).substring(0, 500);
      }
    }

    // Format mission focus areas
    const missionFocusStr = Array.isArray(surveyData.mission_focus)
      ? surveyData.mission_focus.join(", ")
      : surveyData.mission_focus || "";

    // Format strength areas
    const strengthAreasStr = Array.isArray(surveyData.strength_areas)
      ? surveyData.strength_areas.join(", ")
      : surveyData.strength_areas || "";

    const prompt = COMPREHENSIVE_MISSION_PROMPT.replace("{resume_json}", resumeDataStr)
      .replace("{education_level}", surveyData.education_level)
      .replace("{industry}", surveyData.industry)
      .replace("{level}", surveyData.level)
      .replace("{mission_focus}", missionFocusStr)
      .replace("{strength_areas}", strengthAreasStr)
      .replace("{experience_summary}", surveyData.experience_summary || "");

    console.log("[Survey Mission Generation] Calling OpenAI with prompt...", {
      fullName: surveyData.full_name,
      industry: surveyData.industry,
      level: surveyData.level,
      missionFocus: missionFocusStr.substring(0, 50),
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical career coach and mission designer. Generate comprehensive, realistic missions based on actual industry scenarios and user's professional background from survey data. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const cleaned = response
      .replace(/^```(?:json)?/im, "")
      .replace(/```$/m, "")
      .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/m);
    const jsonText = jsonMatch ? jsonMatch[0] : cleaned;

    let parsedMission: any;
    try {
      parsedMission = JSON.parse(jsonText);
    } catch (e) {
      const fallbackMatch = response.match(/\{[\s\S]*\}/m);
      if (!fallbackMatch) throw e;
      parsedMission = JSON.parse(fallbackMatch[0]);
    }

    // Parse tasks - handle both string array and object array formats
    let tasks: string[] = [];
    if (Array.isArray(parsedMission.tasks)) {
      tasks = parsedMission.tasks.map((task: any) => {
        if (typeof task === "object" && task.task) {
          return task.task;
        }
        return String(task);
      });
    }

    console.log("[Survey Mission Generation] Parsed mission from OpenAI:", {
      title: parsedMission.title,
      difficulty: parsedMission.difficulty,
      type: parsedMission.type,
      taskCount: tasks.length,
    });

    // Determine type and language
    const missionType =
      parsedMission.type ||
      (parsedMission.field?.toLowerCase().includes("non-technical")
        ? "non-technical"
        : "technical");

    // Normalize language
    let language = parsedMission.language;
    if (language) {
      language = language.toLowerCase();
      const languageMap: Record<string, string> = {
        js: "javascript",
        ts: "typescript",
        "c++": "cpp",
        "c#": "csharp",
        py: "python",
        go: "golang",
      };
      language = languageMap[language] || language;
    }

    const mission: StaticMission = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: parsedMission.title,
      description: parsedMission.description,
      type: missionType as "technical" | "non-technical",
      language:
        missionType === "technical" ? (language || undefined) : undefined,
      field: parsedMission.field,
      difficulty: parsedMission.difficulty,
      timeEstimate: parsedMission.timeEstimate,
      category: parsedMission.category,
      company: parsedMission.company,
      context: parsedMission.context,
      status: "suggested",
      skills: parsedMission.skills || [],
      industries: parsedMission.industries || [],
      tasks: tasks,
      objectives: parsedMission.objectives || [],
      resources: parsedMission.resources || [],
      evaluationMetrics: parsedMission.evaluationMetrics || [],
    };

    return mission;
  } catch (error) {
    console.error("Error generating mission from survey with OpenAI:", error);
    return generateFallbackMissionFromSurvey(surveyData);
  }
}

/**
 * Generate multiple missions in parallel from survey data
 * This is the main entry point for mission generation
 * All data MUST come exclusively from survey_responses table
 */
export async function generateMissionsFromSurvey(
  surveyData: SurveyResponseData,
  count: number = 3
): Promise<StaticMission[]> {
  const generatedMissions: StaticMission[] = [];

  console.log(
    `[Survey Mission Generation] Starting parallel generation of ${count} missions for user:`,
    surveyData.full_name || surveyData.user_id || "Anonymous"
  );

  // Create promise array for parallel generation
  const missionPromises = Array.from({ length: count }).map(() =>
    generateMissionFromSurvey(surveyData)
  );

  try {
    const missions = await Promise.all(missionPromises);
    generatedMissions.push(...missions.filter((m) => m !== null));

    console.log(
      `[Survey Mission Generation] ✅ Successfully generated ${generatedMissions.length} missions in parallel`
    );
  } catch (error) {
    console.error(
      "[Survey Mission Generation] Error generating missions in parallel:",
      error
    );
  }

  return generatedMissions;
}

/**
 * Fallback mission generation when OpenAI is not available or fails
 * Uses only data from survey_responses table
 */
function generateFallbackMissionFromSurvey(surveyData: SurveyResponseData): StaticMission {
  const industry = surveyData.industry || "Technology";
  const missionFocus = Array.isArray(surveyData.mission_focus)
    ? surveyData.mission_focus[0]
    : surveyData.mission_focus || "General";

  // Industry-specific mission templates
  const missionTemplates: Record<string, any[]> = {
    "Technology/Software": [
      {
        title: "Build Scalable API Architecture for SaaS Platform",
        description:
          "Design and implement a robust, scalable API that serves millions of requests daily with sub-100ms response times. Build with proper caching, database optimization, and monitoring.",
        skills: ["API Design", "Database Optimization", "Caching", "Monitoring"],
        context:
          "Current API bottlenecks are causing user experience degradation during peak hours. Build a system that scales horizontally and maintains performance.",
      },
      {
        title: "Create Real-Time Data Processing Pipeline",
        description:
          "Architect and implement a data pipeline that processes streaming data with low latency and high reliability. Include error handling, recovery mechanisms, and monitoring.",
        skills: [
          "Streaming Data",
          "Pipeline Design",
          "Error Handling",
          "Monitoring",
        ],
        context:
          "The business needs to process event streams to generate real-time insights and alerts.",
      },
    ],
    Healthcare: [
      {
        title: "Implement HIPAA-Compliant Patient Data System",
        description:
          "Build a secure, compliant system for managing patient records with encryption, audit trails, and access controls. Ensure regulatory compliance and data privacy.",
        skills: ["Security", "Compliance", "Encryption", "Access Control"],
        context:
          "Patient data security is critical for regulatory compliance and patient trust.",
      },
      {
        title: "Develop Healthcare Analytics Dashboard",
        description:
          "Create an analytics dashboard for healthcare providers to track patient outcomes, resource utilization, and operational efficiency metrics.",
        skills: [
          "Analytics",
          "Data Visualization",
          "Healthcare Systems",
          "Reporting",
        ],
        context:
          "Providers need visibility into key metrics to improve operational efficiency and patient outcomes.",
      },
    ],
    Finance: [
      {
        title: "Build High-Performance Trading System",
        description:
          "Create a trading system that processes market data in real-time, executes trades with minimal latency, and provides risk management capabilities.",
        skills: [
          "Real-time Systems",
          "Market Data",
          "Trading Algorithms",
          "Risk Management",
        ],
        context:
          "Trading speed is critical for competitive advantage in financial markets.",
      },
      {
        title: "Implement Advanced Fraud Detection System",
        description:
          "Develop a machine learning system to detect fraudulent transactions in real-time with high precision and minimal false positives.",
        skills: [
          "Machine Learning",
          "Real-time Processing",
          "Anomaly Detection",
          "Data Analysis",
        ],
        context:
          "Fraud prevention is essential for protecting customers and company revenue.",
      },
    ],
    "E-commerce/Retail": [
      {
        title: "Build Personalization Engine for Product Recommendations",
        description:
          "Create a machine learning system that provides personalized product recommendations based on user behavior, preferences, and purchase history.",
        skills: [
          "Machine Learning",
          "Recommendation Systems",
          "User Behavior Analysis",
          "Personalization",
        ],
        context:
          "Personalized recommendations increase conversion rates and average order value.",
      },
      {
        title: "Design Inventory Management System",
        description:
          "Build an inventory management system that optimizes stock levels, predicts demand, and coordinates with supply chain partners.",
        skills: [
          "Inventory Management",
          "Demand Forecasting",
          "Supply Chain",
          "Optimization",
        ],
        context:
          "Efficient inventory management reduces costs and improves customer satisfaction.",
      },
    ],
    "DevOps/Infrastructure": [
      {
        title: "Architect Kubernetes-Based Deployment Platform",
        description:
          "Design and implement a Kubernetes platform for deploying, scaling, and managing containerized applications with high reliability.",
        skills: ["Kubernetes", "Docker", "Infrastructure", "Automation"],
        context:
          "Container orchestration is essential for modern cloud-native applications.",
      },
      {
        title: "Implement Comprehensive Monitoring and Observability",
        description:
          "Build a monitoring stack that provides visibility into application and infrastructure health with automated alerting and remediation.",
        skills: ["Monitoring", "Observability", "Alerting", "Automation"],
        context:
          "Visibility into system health is critical for maintaining high availability.",
      },
    ],
  };

  // Select template based on industry or mission focus
  const candidateTemplates =
    missionTemplates[industry] ||
    missionTemplates[missionFocus] ||
    missionTemplates["Technology/Software"];
  const selected =
    candidateTemplates[Math.floor(Math.random() * candidateTemplates.length)];

  // Parse resume if available
  let skills = selected.skills;
  try {
    if (surveyData.resume_json) {
      const parsed =
        typeof surveyData.resume_json === "string"
          ? JSON.parse(surveyData.resume_json)
          : surveyData.resume_json;
      if (parsed.skills && Array.isArray(parsed.skills)) {
        // Merge resume skills with template skills
        skills = Array.from(
          new Set([...selected.skills, ...parsed.skills.slice(0, 3)])
        ).slice(0, 8);
      }
    }
  } catch (e) {
    // Use default skills
  }

  return {
    id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: selected.title,
    description: selected.description,
    type: "technical",
    field: industry,
    difficulty: surveyData.level as "Beginner" | "Intermediate" | "Advanced",
    timeEstimate: surveyData.level === "Advanced" ? "8-12 hours" : "5-8 hours",
    category: industry,
    company: "Your Company",
    context: selected.context,
    status: "suggested",
    skills: skills,
    industries: [industry],
    tasks: [
      "Design the system architecture and components",
      "Implement core functionality with proper error handling",
      "Add comprehensive testing and validation",
      "Optimize for performance and scalability",
      "Deploy and monitor in production",
    ],
    objectives: [
      `Master ${missionFocus} using industry best practices`,
      `Build production-ready systems aligned with your industry`,
      `Apply real-world engineering principles`,
    ],
    resources: [
      "Official documentation for relevant technologies",
      "Code examples and case studies",
      "Testing frameworks and tools",
      "Deployment and monitoring guides",
    ],
    evaluationMetrics: [
      "System functionality and feature completeness",
      "Code quality and maintainability",
      "Performance benchmarks met",
      "Test coverage and reliability",
    ],
  };
}
