import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import OpenAI from "openai";

// Initialize OpenAI client
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface SearchCriteria {
  name?: string;
  email?: string;
  industries?: string[];
  mission_focus?: string[];
  strength_areas?: string[];
  skills?: string[];
  keywords?: string[];
  experience_level?: string;
  education_level?: string;
  learning_preference?: string;
  min_velric_score?: number;
  search_text?: string;
}

type SearchCandidatesResponse =
  | {
      success: true;
      candidates: Array<{
        id: string;
        name: string;
        email: string;
        velricScore?: number;
        domain?: string;
        location?: string;
        matchReason?: string;
        industry?: string;
        mission_focus?: string[];
        strength_areas?: string[];
        experience_summary?: string;
      }>;
      searchCriteria?: SearchCriteria;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchCandidatesResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { prompt } = req.body;

    console.log("📝 Received search prompt:", prompt);

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Search prompt is required",
      });
    }

    // Step 1: Extract search criteria from prompt using ChatGPT
    let searchCriteria: SearchCriteria = {};
    
    if (!USE_DUMMY && openai) {
      try {
        console.log("🤖 Sending to ChatGPT for analysis...");
        
        const systemPrompt = `You are a candidate search assistant. Extract structured search criteria from the user's prompt.

Database schema:
- users: id, name, email, onboarded, profile_complete, is_recruiter
- survey_responses: user_id, industry, mission_focus (array), strength_areas (array), experience_summary, education_level, learning_preference

Return ONLY valid JSON (no markdown, no code blocks):
{
  "name": "exact name if mentioned (e.g., 'arvind khandal', 'john doe') or null",
  "email": "email if mentioned or null",
  "industries": ["Technology", "Healthcare", etc.] or null,
  "mission_focus": ["Frontend Development", "Backend Development", "Data Science", etc.] or null,
  "strength_areas": ["Problem Solving", "Technical Implementation", "Communication", etc.] or null,
  "skills": ["React", "TypeScript", "Python", "Node.js", etc.] or null,
  "keywords": ["important keywords from prompt"] or null,
  "experience_level": "beginner|intermediate|advanced" or null,
  "education_level": "Bachelor|Master|PhD|etc." or null,
  "learning_preference": "specific preference" or null,
  "search_text": "fallback general search text" or null
}

Examples:
- "show all candidates with arvind khandal name" → {"name": "arvind khandal"}
- "find React developers" → {"skills": ["React"], "mission_focus": ["Frontend Development"]}
- "senior python engineer with ML experience" → {"skills": ["Python", "Machine Learning"], "experience_level": "advanced"}
- "candidates in healthcare industry" → {"industries": ["Healthcare"]}

Extract all relevant criteria. Use null for unmentioned fields.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content;
        console.log("🤖 ChatGPT raw response:", response);

        if (response) {
          const cleaned = response
            .replace(/^```(?:json)?/gim, "")
            .replace(/```$/gm, "")
            .trim();
          
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
          const jsonText = jsonMatch ? jsonMatch[0] : cleaned;
          
          try {
            searchCriteria = JSON.parse(jsonText);
            console.log("✅ Extracted search criteria:", JSON.stringify(searchCriteria, null, 2));
          } catch (parseError) {
            console.error("❌ JSON parse error:", parseError);
            const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
            searchCriteria = { keywords, search_text: prompt };
          }
        }
      } catch (aiError: any) {
        console.error("❌ ChatGPT API error:", aiError.message);
        const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        searchCriteria = { keywords, search_text: prompt };
      }
    } else {
      console.log("⚠️ Using fallback keyword extraction");
      const keywords = prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      searchCriteria = { keywords, search_text: prompt };
    }

     // Step 2: Build optimized database query
     console.log("🔍 Building database query...");
     
     // Start with base query - fetch users first
     let query = supabase
       .from("users")
       .select("id, name, email, onboarded, profile_complete")
    //    .eq("is_recruiter", false)
    //    .eq("onboarded", true);

    // Apply name filter (exact or partial match)
    if (searchCriteria.name && searchCriteria.name.trim()) {
      const searchName = searchCriteria.name.trim();
      // Use ilike for case-insensitive partial matching
      // This will match if the name contains the search term anywhere
      query = query.ilike("name", `%${searchName}%`);
      console.log("🔍 Filtering by name:", searchName);
      console.log("🔍 Name filter pattern:", `%${searchName}%`);
    }

    // Apply email filter
    if (searchCriteria.email && searchCriteria.email.trim()) {
      query = query.ilike("email", `%${searchCriteria.email.trim()}%`);
      console.log("🔍 Filtering by email:", searchCriteria.email);
    }

    const { data: users, error: dbError } = await query;

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return res.status(500).json({
        success: false,
        error: dbError.message || "Failed to search candidates",
      });
    }

    console.log(`📊 Found ${users?.length || 0} users from database`);
    if (users && users.length > 0 && searchCriteria.name) {
      console.log("📋 Sample user names found:", users.slice(0, 5).map(u => u.name));
    }

     if (!users || users.length === 0) {
       return res.status(200).json({
         success: true,
         candidates: [],
         searchCriteria,
       });
     }

     // Step 3: Fetch survey data for all users separately
     const userIds = users.map((u) => u.id);
     const { data: surveyData } = await supabase
       .from("survey_responses")
       .select("user_id, industry, mission_focus, strength_areas, experience_summary, education_level, learning_preference")
       .in("user_id", userIds);

     // Create a map of user_id to survey data
     const surveyMap = new Map(
       (surveyData || []).map((s) => [s.user_id, s])
     );

     // Step 4: Score and rank candidates
     console.log("🎯 Scoring candidates...");
     
     const scoredCandidates = users
       .map((user: any) => {
         const survey = surveyMap.get(user.id);
        
        let matchScore = 0;
        let matchReasons: string[] = [];

        // Name matching (highest priority - 100 points)
        if (searchCriteria.name && searchCriteria.name.trim()) {
          const searchName = searchCriteria.name.trim().toLowerCase();
          const userName = (user.name || "").toLowerCase();
          
          if (userName === searchName) {
            matchScore += 100;
            matchReasons.push(`Exact name: ${user.name}`);
          } else if (userName.includes(searchName)) {
            matchScore += 80;
            matchReasons.push(`Name match: ${user.name}`);
          } else {
            const nameParts = searchName.split(/\s+/);
            if (nameParts.every(part => userName.includes(part))) {
              matchScore += 70;
              matchReasons.push(`Partial name: ${user.name}`);
            }
          }
        }

        // Email matching (90 points)
        if (searchCriteria.email && searchCriteria.email.trim()) {
          const searchEmail = searchCriteria.email.trim().toLowerCase();
          const userEmail = (user.email || "").toLowerCase();
          
          if (userEmail.includes(searchEmail)) {
            matchScore += 90;
            matchReasons.push(`Email: ${user.email}`);
          }
        }

        // If no survey data but name/email matched, return early
        if (!survey && matchScore > 0) {
          return {
            user,
            survey,
            matchScore,
            matchReasons,
          };
        }

        // Skip if no survey data and no name/email match
        if (!survey) {
          return null;
        }

        // Industry matching (20 points)
        if (searchCriteria.industries && searchCriteria.industries.length > 0 && survey.industry) {
          const industryMatch = searchCriteria.industries.some((ind) =>
            survey.industry.toLowerCase().includes(ind.toLowerCase())
          );
          if (industryMatch) {
            matchScore += 20;
            matchReasons.push(`Industry: ${survey.industry}`);
          }
        }

        // Mission focus matching (15 points each)
        if (searchCriteria.mission_focus && searchCriteria.mission_focus.length > 0) {
          const missionFocusArray = Array.isArray(survey.mission_focus) 
            ? survey.mission_focus 
            : [];
          
          const matches = searchCriteria.mission_focus.filter((mf) =>
            missionFocusArray.some((sf: string) =>
              sf.toLowerCase().includes(mf.toLowerCase())
            )
          );
          
          if (matches.length > 0) {
            matchScore += matches.length * 15;
            matchReasons.push(`Focus: ${matches.join(", ")}`);
          }
        }

        // Strength areas matching (10 points each)
        if (searchCriteria.strength_areas && searchCriteria.strength_areas.length > 0) {
          const strengthAreasArray = Array.isArray(survey.strength_areas)
            ? survey.strength_areas
            : [];
          
          const matches = searchCriteria.strength_areas.filter((sa) =>
            strengthAreasArray.some((ss: string) =>
              ss.toLowerCase().includes(sa.toLowerCase())
            )
          );
          
          if (matches.length > 0) {
            matchScore += matches.length * 10;
            matchReasons.push(`Strengths: ${matches.join(", ")}`);
          }
        }

        // Skills and keywords matching in experience_summary (5 points each)
        const searchTerms = [
          ...(searchCriteria.skills || []),
          ...(searchCriteria.keywords || []),
        ];
        
        if (searchTerms.length > 0 && survey.experience_summary) {
          const experienceText = survey.experience_summary.toLowerCase();
          const matches = searchTerms.filter((term) =>
            experienceText.includes(term.toLowerCase())
          );
          
          if (matches.length > 0) {
            matchScore += matches.length * 5;
            matchReasons.push(`Skills: ${matches.slice(0, 5).join(", ")}`);
          }
        }

        // General text search (3 points)
        if (searchCriteria.search_text && survey.experience_summary) {
          const searchText = searchCriteria.search_text.toLowerCase();
          const experienceText = survey.experience_summary.toLowerCase();
          
          if (experienceText.includes(searchText)) {
            matchScore += 3;
            matchReasons.push(`Text match`);
          }
        }

        // Education level matching (10 points)
        if (searchCriteria.education_level && survey.education_level) {
          if (survey.education_level.toLowerCase().includes(
            searchCriteria.education_level.toLowerCase()
          )) {
            matchScore += 10;
            matchReasons.push(`Education: ${survey.education_level}`);
          }
        }

        // Learning preference matching (5 points)
        if (searchCriteria.learning_preference && survey.learning_preference) {
          if (survey.learning_preference.toLowerCase().includes(
            searchCriteria.learning_preference.toLowerCase()
          )) {
            matchScore += 5;
            matchReasons.push(`Learning: ${survey.learning_preference}`);
          }
        }

        // Return only if there's a match
        if (matchScore > 0) {
          return {
            user,
            survey,
            matchScore,
            matchReasons,
          };
        }

        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    console.log(`✅ Found ${scoredCandidates.length} matching candidates`);

    // Step 4: Format response
    const candidates = scoredCandidates.map((item) => ({
      id: item.user.id,
      name: item.user.name || "Unknown",
      email: item.user.email,
      matchReason: item.matchReasons.join(" • ") || "Match found",
      industry: item.survey?.industry,
      mission_focus: Array.isArray(item.survey?.mission_focus) 
        ? item.survey.mission_focus 
        : [],
      strength_areas: Array.isArray(item.survey?.strength_areas)
        ? item.survey.strength_areas
        : [],
      experience_summary: item.survey?.experience_summary,
    }));

    // Handle dummy mode
    if (USE_DUMMY) {
      const mockCandidates = [
        {
          id: "user_1",
          name: "Arvind Khandal",
          email: "arvind@example.com",
          velricScore: 85,
          matchReason: "Exact name match",
          industry: "Technology & Software",
          mission_focus: ["Frontend Development"],
          strength_areas: ["Problem Solving"],
        },
        {
          id: "user_2",
          name: "Jane Smith",
          email: "jane@example.com",
          velricScore: 92,
          matchReason: "Skills: React, TypeScript",
          industry: "Technology & Software",
          mission_focus: ["Full Stack Development"],
          strength_areas: ["Technical Implementation"],
        },
      ];

      return res.status(200).json({
        success: true,
        candidates: mockCandidates,
        searchCriteria,
      });
    }

    return res.status(200).json({
      success: true,
      candidates,
      searchCriteria,
    });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}