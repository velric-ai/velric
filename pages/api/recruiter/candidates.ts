import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { demoCandidates } from "@/data/demoCandidates";

interface Candidate {
  id: string;
  name: string;
  email: string;
  onboarded: boolean;
  profile_complete: boolean;
  velricScore?: number;
  missionsCompleted?: number;
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
  profile_image?: string | null;
  logistics_preferences?: {
    current_region?: string;
    legal_work_regions?: string[];
    sponsorship_consideration?: string;
    sponsorship_regions?: string[];
    relocation_openness?: string;
    relocation_regions?: string;
    remote_work_international?: string;
  };
  interview_availability?: {
    timeSlots?: Array<{ day: string; startTime: string; endTime: string }>;
    timezone?: string;
  };
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
      skillClusters,
      location,
      remoteWork,
      sponsorship,
      citizenship,
      minExperience,
      maxExperience,
      educationLevel,
      minGraduationYear,
      maxGraduationYear,
      seniority,
      availability,
      limit = "50",
      offset = "0",
    } = req.query;

    // Handle dummy mode - use demo candidates
    if (USE_DUMMY) {
      // Convert demo candidates to API format
      const mockCandidates: Candidate[] = demoCandidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        onboarded: candidate.onboarded,
        profile_complete: candidate.profile_complete,
        velricScore: candidate.velricScore,
        missionsCompleted: candidate.missionsCompleted,
        domain: candidate.domain,
        location: candidate.location,
        industry: candidate.industry,
        mission_focus: candidate.mission_focus,
        strength_areas: candidate.strength_areas,
        experience_summary: candidate.experience_summary,
        education_level: candidate.education_level,
        learning_preference: candidate.learning_preference,
        skills: candidate.skills,
        clusters: candidate.clusters,
        profile_image: candidate.profile_image || null,
      }));

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
      .select("id, name, email, onboarded, profile_complete, profile_image")
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
        "user_id, industry, mission_focus, strength_areas, experience_summary, education_level, learning_preference, logistics_preferences, interview_availability"
      )
      .in("user_id", userIds)
      .order("created_at", { ascending: false });

    if (surveyError) {
      console.error("Error fetching survey data:", surveyError);
      // Continue without survey data rather than failing
    }

    const { data: missionScores, error: missionError } = await supabase
      .from("user_mission")
      .select("user_id, velric_score, status")
      .in("user_id", userIds)
      .not("velric_score", "is", null);

    if (missionError) {
      console.error("Error fetching mission grades:", missionError);
    }

    // Fetch completed missions count
    const { data: completedMissions, error: completedError } = await supabase
      .from("user_mission")
      .select("user_id")
      .in("user_id", userIds)
      .in("status", ["completed", "graded"]);

    if (completedError) {
      console.error("Error fetching completed missions:", completedError);
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

    // Count completed missions per user
    const completedMissionsMap = new Map<string, number>();
    (completedMissions || []).forEach((mission) => {
      const existing = completedMissionsMap.get(mission.user_id) || 0;
      completedMissionsMap.set(mission.user_id, existing + 1);
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
      const missionsCompleted = completedMissionsMap.get(user.id) || 0;

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
        missionsCompleted,
        domain,
        industry: survey?.industry || undefined,
        mission_focus: survey?.mission_focus || undefined,
        strength_areas: survey?.strength_areas || undefined,
        experience_summary: survey?.experience_summary || undefined,
        education_level: survey?.education_level || undefined,
        learning_preference: survey?.learning_preference || undefined,
        skills: extractSkillsFromExperience(survey?.experience_summary),
        clusters: clusters.size ? Array.from(clusters) : undefined,
        profile_image: user.profile_image || null,
        logistics_preferences: survey?.logistics_preferences || undefined,
        interview_availability: survey?.interview_availability || undefined,
      };
    });

    // Step 4: Apply filters
    // Domain filter (industry-based) - support multiple domains
    if (domain && typeof domain === "string") {
      const domainList = domain.split(",").map((d) => d.trim());
      if (!domainList.includes("All")) {
        candidates = candidates.filter((c) => {
          const candidateIndustry = c.industry?.toLowerCase();
          const candidateDomain = c.domain?.toLowerCase();
          return domainList.some((d) => {
            const domainLower = d.toLowerCase();
            if (candidateIndustry && candidateIndustry === domainLower) return true;
            if (candidateDomain && candidateDomain === domainLower) return true;
            const alias = candidateDomainAlias(c.domain);
            if (alias && alias.toLowerCase() === domainLower) return true;
            return false;
          });
        });
      }
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

    // Skill Clusters filter
    if (skillClusters && typeof skillClusters === "string") {
      const clusterList = skillClusters.split(",").map((s) => s.trim());
      candidates = candidates.filter((c) => {
        if (!c.skills || c.skills.length === 0) return false;
        // Check if any skill matches the cluster keywords
        // This is a simplified check - in production, use the skillClusters mapping
        const skillsLower = c.skills.map((s) => s.toLowerCase());
        return clusterList.some((clusterId) => {
          // For now, check if any skill contains the cluster name
          // In production, use the skillClusters library to map skills to clusters
          return skillsLower.some((skill) => skill.includes(clusterId.toLowerCase()));
        });
      });
    }

    // Specialization filter (mission_focus) - kept for backward compatibility
    if (specializations && typeof specializations === "string") {
      const specializationList = specializations.split(",").map((s) => s.trim().toLowerCase());
      candidates = candidates.filter((c) => {
        if (!c.mission_focus || !Array.isArray(c.mission_focus)) return false;
        return specializationList.some((spec) =>
          c.mission_focus!.some((mf) => mf.toLowerCase().includes(spec))
        );
      });
    }

    // Location filter
    if (location && typeof location === "string") {
      const locationList = location.split(",").map((l) => l.trim());
      candidates = candidates.filter((c) => {
        const candidateLocation = c.location || c.logistics_preferences?.current_region;
        if (!candidateLocation) return false;
        const locationLower = candidateLocation.toLowerCase();
        return locationList.some((loc) => locationLower.includes(loc.toLowerCase()) || loc.toLowerCase().includes(locationLower));
      });
    }

    // Remote Work filter
    if (remoteWork && typeof remoteWork === "string") {
      const remoteWorkList = remoteWork.split(",").map((r) => r.trim());
      candidates = candidates.filter((c) => {
        const remotePref = c.logistics_preferences?.remote_work_international;
        if (!remotePref) return false;
        return remoteWorkList.includes(remotePref);
      });
    }

    // Sponsorship filter
    if (sponsorship && typeof sponsorship === "string") {
      const sponsorshipList = sponsorship.split(",").map((s) => s.trim());
      candidates = candidates.filter((c) => {
        const sponsorPref = c.logistics_preferences?.sponsorship_consideration;
        if (!sponsorPref) return false;
        return sponsorshipList.includes(sponsorPref);
      });
    }

    // Citizenship filter
    if (citizenship && typeof citizenship === "string") {
      const citizenshipList = citizenship.split(",").map((c) => c.trim());
      candidates = candidates.filter((c) => {
        const legalRegions = c.logistics_preferences?.legal_work_regions || [];
        if (legalRegions.length === 0) return false;
        return citizenshipList.some((cit) =>
          legalRegions.some((region: string) => region.toLowerCase().includes(cit.toLowerCase()) || cit.toLowerCase().includes(region.toLowerCase()))
        );
      });
    }

    // Years of Experience filter (extract from experience_summary - simplified)
    if (minExperience || maxExperience) {
      const minExp = minExperience ? parseInt(minExperience as string, 10) : 0;
      const maxExp = maxExperience ? parseInt(maxExperience as string, 10) : 50;
      candidates = candidates.filter((c) => {
        // This is a simplified check - in production, extract years from experience_summary
        // For now, we'll use a basic heuristic
        const expSummary = c.experience_summary?.toLowerCase() || "";
        // Look for patterns like "X years", "X+ years", etc.
        const yearsMatch = expSummary.match(/(\d+)\+?\s*(?:year|yr)/);
        if (yearsMatch) {
          const years = parseInt(yearsMatch[1], 10);
          return years >= minExp && years <= maxExp;
        }
        // If no explicit years found, return true (don't filter out)
        return true;
      });
    }

    // Education Level filter
    if (educationLevel && typeof educationLevel === "string") {
      const educationList = educationLevel.split(",").map((e) => e.trim());
      candidates = candidates.filter((c) => {
        if (!c.education_level) return false;
        return educationList.includes(c.education_level);
      });
    }

    // Graduation Year filter (extract from experience_summary - simplified)
    if (minGraduationYear || maxGraduationYear) {
      const minYear = minGraduationYear ? parseInt(minGraduationYear as string, 10) : 2000;
      const maxYear = maxGraduationYear ? parseInt(maxGraduationYear as string, 10) : new Date().getFullYear();
      candidates = candidates.filter((c) => {
        // This is a simplified check - in production, extract graduation year from profile
        // For now, we'll check experience_summary for year patterns
        const expSummary = c.experience_summary || "";
        const yearMatches = expSummary.match(/\b(19|20)\d{2}\b/g);
        if (yearMatches) {
          const years = yearMatches.map((y) => parseInt(y, 10)).filter((y) => y >= 2000 && y <= new Date().getFullYear());
          if (years.length > 0) {
            const latestYear = Math.max(...years);
            return latestYear >= minYear && latestYear <= maxYear;
          }
        }
        // If no year found, return true (don't filter out)
        return true;
      });
    }

    // Seniority filter (level)
    if (seniority && typeof seniority === "string") {
      const seniorityList = seniority.split(",").map((s) => s.trim());
      // Map seniority levels - this would need to be stored in the database
      // For now, we'll use a simplified approach based on experience_summary
      candidates = candidates.filter((c) => {
        // This is a placeholder - in production, store level in the database
        // For now, return true for all (don't filter)
        return true;
      });
    }

    // Availability filter (based on interview_availability)
    if (availability && typeof availability === "string") {
      const availabilityList = availability.split(",").map((a) => a.trim());
      candidates = candidates.filter((c) => {
        const interviewAvail = c.interview_availability;
        if (!interviewAvail || !interviewAvail.timeSlots || interviewAvail.timeSlots.length === 0) {
          return availabilityList.includes("2+ months"); // No availability = not immediate
        }
        // Simplified check - in production, calculate actual availability
        const hasAvailability = interviewAvail.timeSlots.length > 0;
        if (hasAvailability) {
          return availabilityList.some((avail) => {
            if (avail === "Immediate") return true;
            if (avail === "2 weeks") return true;
            if (avail === "1 month") return true;
            return avail === "2+ months";
          });
        }
        return false;
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

