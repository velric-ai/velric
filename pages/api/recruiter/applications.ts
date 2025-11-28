import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type Application = {
  id: string;
  recruiter_id: string;
  job_title: string;
  job_description: string;
  location: string | null;
  sponsorship_required: boolean;
  remote_work: boolean;
  employment_type: string | null;
  salary_range: string | null;
  experience_level: string | null;
  required_skills: string[];
  preferred_skills: string[];
  education_requirements: string | null;
  additional_questions: any;
  status: string;
  created_at: string;
  updated_at: string;
};

type ApplicationResponse =
  | {
      success: true;
      application?: Application;
      applications?: Application[];
      message: string;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApplicationResponse>
) {
  if (req.method === "POST") {
    // Create new application
    try {
      const {
        recruiterId,
        jobTitle,
        jobDescription,
        location,
        sponsorshipRequired,
        remoteWork,
        employmentType,
        salaryRange,
        experienceLevel,
        requiredSkills,
        preferredSkills,
        educationRequirements,
        additionalQuestions,
        status,
      } = req.body;

      // Validation
      if (!recruiterId) {
        return res.status(400).json({
          success: false,
          error: "Recruiter ID is required",
        });
      }

      if (!jobTitle || !jobDescription) {
        return res.status(400).json({
          success: false,
          error: "Job title and description are required",
        });
      }

      // Handle dummy mode
      if (USE_DUMMY) {
        const mockApplication = {
          id: `app_${Date.now()}`,
          recruiter_id: recruiterId,
          job_title: jobTitle,
          job_description: jobDescription,
          location: location || null,
          sponsorship_required: sponsorshipRequired || false,
          remote_work: remoteWork || false,
          employment_type: employmentType || null,
          salary_range: salaryRange || null,
          experience_level: experienceLevel || null,
          required_skills: requiredSkills || [],
          preferred_skills: preferredSkills || [],
          education_requirements: educationRequirements || null,
          additional_questions: additionalQuestions || null,
          status: status || "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return res.status(201).json({
          success: true,
          application: mockApplication,
          message: "Application created successfully",
        });
      }

      // Create application record
      const applicationData = {
        recruiter_id: recruiterId,
        job_title: jobTitle.trim(),
        job_description: jobDescription.trim(),
        location: location?.trim() || null,
        sponsorship_required: sponsorshipRequired || false,
        remote_work: remoteWork || false,
        employment_type: employmentType || null,
        salary_range: salaryRange?.trim() || null,
        experience_level: experienceLevel || null,
        required_skills: requiredSkills || [],
        preferred_skills: preferredSkills || [],
        education_requirements: educationRequirements?.trim() || null,
        additional_questions: additionalQuestions || null,
        status: status || "draft",
      };

      const { data: application, error: dbError } = await supabase
        .from("applications")
        .insert([applicationData])
        .select()
        .single();

      if (dbError) {
        console.error("Supabase applications insert error:", dbError);
        // Don't throw, return error response
        return res.status(500).json({
          success: false,
          error: dbError.message || "Failed to create application. Please try again.",
        });
      }

      if (!application) {
        // Don't throw, return error response
        return res.status(500).json({
          success: false,
          error: "Application was not created. Please try again.",
        });
      }

      return res.status(201).json({
        success: true,
        application: {
          id: application.id,
          recruiter_id: application.recruiter_id,
          job_title: application.job_title,
          job_description: application.job_description,
          location: application.location,
          sponsorship_required: application.sponsorship_required,
          remote_work: application.remote_work,
          employment_type: application.employment_type,
          salary_range: application.salary_range,
          experience_level: application.experience_level,
          required_skills: application.required_skills || [],
          preferred_skills: application.preferred_skills || [],
          education_requirements: application.education_requirements,
          additional_questions: application.additional_questions,
          status: application.status,
          created_at: application.created_at,
          updated_at: application.updated_at,
        },
        message: "Application created successfully",
      });
    } catch (err: any) {
      console.error("/api/recruiter/applications POST error:", err);
      // Don't throw, return error response
      return res.status(500).json({
        success: false,
        error: err?.message || "An unexpected error occurred. Please try again later.",
      });
    }
  } else if (req.method === "GET") {
    // Get all applications for a recruiter
    try {
      const recruiterId = req.query.recruiterId as string;

      if (!recruiterId) {
        return res.status(400).json({
          success: false,
          error: "Recruiter ID is required",
        });
      }

      // Handle dummy mode
      if (USE_DUMMY) {
        return res.status(200).json({
          success: true,
          applications: [],
          message: "Applications retrieved successfully",
        });
      }

      const { data: applications, error: dbError } = await supabase
        .from("applications")
        .select("*")
        .eq("recruiter_id", recruiterId)
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Supabase applications select error:", dbError);
        // Don't throw, return error response
        return res.status(500).json({
          success: false,
          error: dbError.message || "Failed to retrieve applications. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        applications: applications || [],
        message: "Applications retrieved successfully",
      });
    } catch (err: any) {
      console.error("/api/recruiter/applications GET error:", err);
      // Don't throw, return error response
      return res.status(500).json({
        success: false,
        error: err?.message || "An unexpected error occurred. Please try again later.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}

