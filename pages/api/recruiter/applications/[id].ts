import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type ApplicationResponse =
  | {
      success: true;
      application: {
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
      message: string;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApplicationResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "Application ID is required",
    });
  }

  if (req.method === "PUT") {
    // Update application
    try {
      const {
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

      // Handle dummy mode
      if (USE_DUMMY) {
        const mockApplication = {
          id: id,
          recruiter_id: "recruiter_1",
          job_title: jobTitle || "Updated Job Title",
          job_description: jobDescription || "Updated Job Description",
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

        return res.status(200).json({
          success: true,
          application: mockApplication,
          message: "Application updated successfully",
        });
      }

      // Build update object with only provided fields
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (jobTitle !== undefined) updateData.job_title = jobTitle.trim();
      if (jobDescription !== undefined) updateData.job_description = jobDescription.trim();
      if (location !== undefined) updateData.location = location?.trim() || null;
      if (sponsorshipRequired !== undefined) updateData.sponsorship_required = sponsorshipRequired;
      if (remoteWork !== undefined) updateData.remote_work = remoteWork;
      if (employmentType !== undefined) updateData.employment_type = employmentType || null;
      if (salaryRange !== undefined) updateData.salary_range = salaryRange?.trim() || null;
      if (experienceLevel !== undefined) updateData.experience_level = experienceLevel || null;
      if (requiredSkills !== undefined) updateData.required_skills = requiredSkills || [];
      if (preferredSkills !== undefined) updateData.preferred_skills = preferredSkills || [];
      if (educationRequirements !== undefined) updateData.education_requirements = educationRequirements?.trim() || null;
      if (additionalQuestions !== undefined) updateData.additional_questions = additionalQuestions || null;
      if (status !== undefined) updateData.status = status;

      const { data: application, error: dbError } = await supabase
        .from("applications")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (dbError) {
        console.error("Supabase applications update error:", dbError);
        // Don't throw, return error response
        return res.status(500).json({
          success: false,
          error: dbError.message || "Failed to update application. Please try again.",
        });
      }

      if (!application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      return res.status(200).json({
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
        message: "Application updated successfully",
      });
    } catch (err: any) {
      console.error("/api/recruiter/applications/[id] PUT error:", err);
      // Don't throw, return error response
      return res.status(500).json({
        success: false,
        error: err?.message || "An unexpected error occurred. Please try again later.",
      });
    }
  } else if (req.method === "GET") {
    // Get single application
    try {
      // Handle dummy mode
      if (USE_DUMMY) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      const { data: application, error: dbError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (dbError) {
        console.error("Supabase applications select error:", dbError);
        // Don't throw, return error response
        return res.status(500).json({
          success: false,
          error: dbError.message || "Failed to retrieve application. Please try again.",
        });
      }

      if (!application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      return res.status(200).json({
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
        message: "Application retrieved successfully",
      });
    } catch (err: any) {
      console.error("/api/recruiter/applications/[id] GET error:", err);
      // Don't throw, return error response
      return res.status(500).json({
        success: false,
        error: err?.message || "An unexpected error occurred. Please try again later.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}

