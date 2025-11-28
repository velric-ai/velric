import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type ValidationResponse =
  | {
      success: true;
      isValid: boolean;
      reasons: string[];
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { applicationId, candidateId } = req.body;

    if (!applicationId || !candidateId) {
      return res.status(400).json({
        success: false,
        error: "Application ID and Candidate ID are required",
      });
    }

    // Handle dummy mode
    if (USE_DUMMY) {
      return res.status(200).json({
        success: true,
        isValid: true,
        reasons: [],
      });
    }

    // Fetch application details
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    // Fetch candidate survey data
    const { data: candidateSurvey, error: surveyError } = await supabase
      .from("survey_responses")
      .select("logistics_preferences")
      .eq("user_id", candidateId)
      .single();

    if (surveyError || !candidateSurvey) {
      // If no survey data, allow submission
      return res.status(200).json({
        success: true,
        isValid: true,
        reasons: [],
      });
    }

    const reasons: string[] = [];
    const logistics = candidateSurvey.logistics_preferences;

    // Validate location
    if (application.location) {
      let locationMatch = false;

      // Check current region
      if (logistics?.current_region === application.location) {
        locationMatch = true;
      }

      // Check legal work regions
      if (
        !locationMatch &&
        Array.isArray(logistics?.legal_work_regions) &&
        logistics.legal_work_regions.includes(application.location)
      ) {
        locationMatch = true;
      }

      // Check relocation regions
      if (
        !locationMatch &&
        logistics?.relocation_regions === application.location
      ) {
        locationMatch = true;
      }

      // Check sponsorship regions
      if (
        !locationMatch &&
        Array.isArray(logistics?.sponsorship_regions) &&
        logistics.sponsorship_regions.includes(application.location)
      ) {
        locationMatch = true;
      }

      // Check remote work
      if (
        !locationMatch &&
        application.location === "Remote only" &&
        logistics?.remote_work_international === "yes"
      ) {
        locationMatch = true;
      }

      if (!locationMatch) {
        reasons.push(
          `Location mismatch: Application requires "${application.location}" but candidate's preferences don't include this location`
        );
      }
    }

    // Validate sponsorship
    if (application.sponsorship_required) {
      const sponsorshipConsideration = logistics?.sponsorship_consideration;

      if (sponsorshipConsideration === "no") {
        reasons.push(
          "Sponsorship mismatch: Application requires sponsorship but candidate is not open to sponsorship"
        );
      } else if (sponsorshipConsideration === "only_remote") {
        if (application.location !== "Remote only") {
          reasons.push(
            "Sponsorship mismatch: Application requires sponsorship for on-site work but candidate only accepts remote positions with sponsorship"
          );
        }
      } else if (sponsorshipConsideration === "depends") {
        // Check if location is in sponsorship regions
        if (
          application.location &&
          Array.isArray(logistics?.sponsorship_regions) &&
          !logistics.sponsorship_regions.includes(application.location)
        ) {
          reasons.push(
            `Sponsorship mismatch: Application requires sponsorship for "${application.location}" but candidate's sponsorship regions don't include this location`
          );
        }
      }
    }

    // Validate remote work
    if (application.remote_work) {
      if (logistics?.remote_work_international === "no") {
        reasons.push(
          "Remote work mismatch: Application offers remote work but candidate prefers on-site positions"
        );
      }
    } else {
      // Application requires on-site
      if (logistics?.remote_work_international === "yes") {
        reasons.push(
          "Remote work mismatch: Application requires on-site work but candidate only accepts remote positions"
        );
      }
    }

    return res.status(200).json({
      success: true,
      isValid: reasons.length === 0,
      reasons,
    });
  } catch (err: any) {
    console.error("/api/recruiter/validate-application-match error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred",
    });
  }
}

