import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

interface Candidate {
  id: string;
  name: string;
  email: string;
  onboarded: boolean;
  profile_complete: boolean;
  velricScore?: number;
  domain?: string;
  location?: string;
  industry?: string;
  mission_focus?: string[];
  strength_areas?: string[];
  experience_summary?: string;
  education_level?: string;
  learning_preference?: string;
  skills?: string[];
  clusters?: string[];
}

type CandidatesResponse =
  | {
      success: true;
      candidates: Candidate[];
      total: number;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CandidatesResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const {
      search,
      domain,
      minScore,
      maxScore,
      specializations,
      limit = "50",
      offset = "0",
    } = req.query;

    // Handle dummy mode
    if (USE_DUMMY) {
      const mockCandidates: Candidate[] = [
        {
          id: "user_1",
          name: "John Doe",
          email: "john@example.com",
          onboarded: true,
          profile_complete: true,
          velricScore: 8.5,
          domain: "Frontend Development",
          industry: "Technology",
          mission_focus: ["Frontend Development"],
          strength_areas: ["Problem Solving", "Technical Implementation"],
          experience_summary: "5+ years of experience in React and TypeScript",
          education_level: "Bachelor's Degree",
          learning_preference: "Hands-on",
          skills: ["React", "TypeScript", "Next.js"],
          clusters: ["Technology"],
        },
        {
          id: "user_2",
          name: "Jane Smith",
          email: "jane@example.com",
          onboarded: true,
          profile_complete: true,
          velricScore: 9.2,
          domain: "Full Stack Development",
          industry: "Technology",
          mission_focus: ["Full Stack Development"],
          strength_areas: ["Technical Implementation"],
          experience_summary: "Proficient in React, Node.js, and UI/UX",
          education_level: "Master's Degree",
          learning_preference: "Project-based",
          skills: ["React", "Node.js", "UI/UX"],
          clusters: ["Technology"],
        },
      ];

      let filtered = mockCandidates;

      // Apply search filter
      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.domain?.toLowerCase().includes(searchLower) ||
            c.skills?.some((s) => s.toLowerCase().includes(searchLower))
        );
      }

      // Apply domain filter
      if (domain && typeof domain === "string" && domain !== "All") {
        filtered = filtered.filter((c) => c.domain === domain);
      }

      // Apply score filter
      if (minScore) {
        const min = parseFloat(minScore as string);
        filtered = filtered.filter((c) => (c.velricScore || 0) >= min);
      }
      if (maxScore) {
        const max = parseFloat(maxScore as string);
        filtered = filtered.filter((c) => (c.velricScore || 10) <= max);
      }

      return res.status(200).json({
        success: true,
        candidates: filtered,
        total: filtered.length,
      });
    }

    // Step 1: Fetch all non-recruiter users
    let usersQuery = supabase
      .from("users")
      .select("id, name, email, onboarded, profile_complete")
      .eq("is_recruiter", false)

    // Apply search filter on users
    if (search && typeof search === "string" && search.trim()) {
      const searchTerm = search.trim();
      usersQuery = usersQuery.or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
      );
    }

    const { data: users, error: usersError } = await usersQuery;

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return res.status(500).json({
        success: false,
        error: usersError.message || "Failed to fetch candidates",
      });
    }

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        candidates: [],
        total: 0,
      });
    }

    // Step 2: Fetch survey data for all users
    const userIds = users.map((u) => u.id);
    const { data: surveyData, error: surveyError } = await supabase
      .from("survey_responses")
      .select(
        "user_id, industry, mission_focus, strength_areas, experience_summary, education_level, learning_preference"
      )
      .in("user_id", userIds)
      .order("created_at", { ascending: false });

    if (surveyError) {
      console.error("Error fetching survey data:", surveyError);
      // Continue without survey data rather than failing
    }

    const { data: missionScores, error: missionError } = await supabase
      .from("user_mission")
      .select("user_id, velric_score")
      .in("user_id", userIds)
      .not("velric_score", "is", null);

    if (missionError) {
      console.error("Error fetching mission grades:", missionError);
    }

    const surveyMap = new Map((surveyData || []).map((s) => [s.user_id, s]));

    const missionScoreMap = new Map<
      string,
      { total: number; count: number }
    >();

    (missionScores || []).forEach((mission) => {
      if (mission.velric_score === null || mission.velric_score === undefined) return;
      const numericGrade =
        typeof mission.velric_score === "number"
          ? mission.velric_score
          : parseFloat(mission.velric_score);
      if (isNaN(numericGrade)) return;
      const existing = missionScoreMap.get(mission.user_id) || { total: 0, count: 0 };
      missionScoreMap.set(mission.user_id, {
        total: existing.total + numericGrade,
        count: existing.count + 1,
      });
    });

    let candidates: Candidate[] = users.map((user) => {
      const survey = surveyMap.get(user.id);
      const missionScore = missionScoreMap.get(user.id);
      const averageVelric =
        missionScore && missionScore.count > 0
          ? missionScore.total / missionScore.count
          : null;
      const velricScore =
        averageVelric !== null ? parseFloat(averageVelric.toFixed(1)) : 0;

      const domain =
        survey?.mission_focus && Array.isArray(survey.mission_focus) && survey.mission_focus.length > 0
          ? survey.mission_focus[0]
          : undefined;

      const clusters = new Set<string>();
      if (survey?.industry) clusters.add(survey.industry);
      (survey?.mission_focus || []).forEach((item: string) => clusters.add(item));
      (survey?.strength_areas || []).forEach((item: string) => clusters.add(item));

      return {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email || "",
        onboarded: user.onboarded || false,
        profile_complete: user.profile_complete || false,
        velricScore,
        domain,
        industry: survey?.industry || undefined,
        mission_focus: survey?.mission_focus || undefined,
        strength_areas: survey?.strength_areas || undefined,
        experience_summary: survey?.experience_summary || undefined,
        education_level: survey?.education_level || undefined,
        learning_preference: survey?.learning_preference || undefined,
        skills: extractSkillsFromExperience(survey?.experience_summary),
        clusters: clusters.size ? Array.from(clusters) : undefined,
      };
    });

    // Step 4: Apply filters
    // Domain filter (industry-based)
    if (domain && typeof domain === "string" && domain !== "All") {
      const domainLower = domain.toLowerCase();
      candidates = candidates.filter((c) => {
        const candidateIndustry = c.industry?.toLowerCase();
        if (candidateIndustry && candidateIndustry === domainLower) return true;
        const alias =
          c.domain && typeof c.domain === "string"
            ? candidateDomainAlias(c.domain)
            : undefined;
        if (alias && alias.toLowerCase() === domainLower) return true;
        return false;
      });
    }

    // Score filter
    if (minScore) {
      const min = parseFloat(minScore as string);
      candidates = candidates.filter((c) => (c.velricScore ?? 0) >= min);
    }
    if (maxScore) {
      const max = parseFloat(maxScore as string);
      candidates = candidates.filter((c) => (c.velricScore ?? 0) <= max);
    }

    // Specialization filter (mission_focus) - already filtered at DB level, but double-check
    if (specializations && typeof specializations === "string") {
      const specializationList = specializations.split(",").map((s) => s.trim().toLowerCase());
      candidates = candidates.filter((c) => {
        if (!c.mission_focus || !Array.isArray(c.mission_focus)) return false;
        return specializationList.some((spec) =>
          c.mission_focus!.some((mf) => mf.toLowerCase().includes(spec))
        );
      });
    }

    // Search filter
    if (search && typeof search === "string" && search.trim()) {
      const searchLower = search.trim().toLowerCase();
      candidates = candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.domain?.toLowerCase().includes(searchLower) ||
          c.industry?.toLowerCase().includes(searchLower) ||
          c.skills?.some((s) => s.toLowerCase().includes(searchLower)) ||
          c.experience_summary?.toLowerCase().includes(searchLower) ||
          c.mission_focus?.some((mf) => mf.toLowerCase().includes(searchLower))
      );
    }

    // Step 5: Sort by Velric Score (descending)
    candidates.sort((a, b) => (b.velricScore || 0) - (a.velricScore || 0));

    // Step 6: Apply pagination
    const limitNum = parseInt(limit as string, 10) || 50;
    const offsetNum = parseInt(offset as string, 10) || 0;
    const total = candidates.length;
    const paginatedCandidates = candidates.slice(offsetNum, offsetNum + limitNum);

    return res.status(200).json({
      success: true,
      candidates: paginatedCandidates,
      total,
    });
  } catch (err: any) {
    console.error("/api/recruiter/candidates error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

// Helper function to extract skills from experience summary
function extractSkillsFromExperience(experience?: string): string[] {
  if (!experience) return [];

  // Common tech skills to look for
  const commonSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Vue",
    "Angular",
    "Next.js",
    "Express",
    "Django",
    "Flask",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "HTML",
    "CSS",
    "Tailwind",
    "Bootstrap",
  ];

  const experienceLower = experience.toLowerCase();
  const foundSkills = commonSkills.filter((skill) =>
    experienceLower.includes(skill.toLowerCase())
  );

  return foundSkills;
}

function candidateDomainAlias(domain?: string): string | undefined {
  if (!domain) return undefined;
  const key = domain.toLowerCase();
  const map: Record<string, string> = {
    frontend: "Technology & Software",
    "frontend development": "Technology & Software",
    "full stack": "Technology & Software",
    backend: "Technology & Software",
    "backend development": "Technology & Software",
    "data science": "Data Science & Analytics",
    "data analytics": "Data Science & Analytics",
    "data engineering": "Data Science & Analytics",
    marketing: "Marketing & Advertising",
    "growth marketing": "Marketing & Advertising",
    "product management": "Product Management",
    finance: "Finance & Banking",
    "investment banking": "Finance & Banking",
    healthcare: "Healthcare & Medical",
    education: "Education & Learning",
    design: "Design & Creative",
    ecommerce: "E-commerce & Retail",
    "e-commerce": "E-commerce & Retail",
    startup: "Startup Founder",
  };
  return map[key];
}

