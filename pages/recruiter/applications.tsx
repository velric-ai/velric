import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  FileText,
  X,
  Save,
  Loader2,
  Building2,
  Code,
} from "lucide-react";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";
import { useSnackbar } from "@/hooks/useSnackbar";
import { getIndustryOptions } from "@/utils/surveyValidation";
import {
  REGIONS,
  INDUSTRIES,
  EDUCATION_LEVELS,
  VALID_STRENGTHS,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  APPLICATION_STATUSES,
} from "@/data/surveyConstants";
import CustomSelect from "@/components/ui/CustomSelect";

interface Application {
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
}

function ApplicationsContent() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    location: "",
    industry: "",
    domain: "",
    sponsorshipRequired: false,
    remoteWork: false,
    employmentType: "",
    salaryRange: "",
    experienceLevel: "",
    requiredSkills: "",
    preferredSkills: "",
    educationRequirements: "",
    additionalQuestions: "",
    status: "draft",
  });

  useEffect(() => {
    const userDataString = localStorage.getItem("velric_user");
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setUser(parsedUser);
      } catch (error) {
        // Don't throw, handle gracefully
        console.error("Error parsing user data:", error);
        // Note: showSnackbar might not be available during initial mount, so we just log
      }
    }
    // No user data found case is handled by ProtectedRoute component
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/recruiter/applications?recruiterId=${user.id}`);
      
      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Network error occurred" }));
        showSnackbar(errorData.error || "Failed to fetch applications. Please try again.", "error");
        return;
      }

      const data = await response.json().catch((parseError) => {
        console.error("Error parsing response:", parseError);
        showSnackbar("Error processing server response. Please try again.", "error");
        return null;
      });

      if (!data) return;

      if (data.success) {
        setApplications(data.applications || []);
      } else {
        showSnackbar(data.error || "Failed to fetch applications. Please try again.", "error");
      }
    } catch (error: any) {
      // Don't throw, handle gracefully
      console.error("Error fetching applications:", error);
      const errorMessage = error?.message || "An unexpected error occurred. Please try again later.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (application?: Application) => {
    if (application) {
      setEditingApplication(application);
      setFormData({
        jobTitle: application.job_title,
        jobDescription: application.job_description,
        location: application.location || "",
        industry: "",
        domain: "",
        sponsorshipRequired: application.sponsorship_required,
        remoteWork: application.remote_work,
        employmentType: application.employment_type || "",
        salaryRange: application.salary_range || "",
        experienceLevel: application.experience_level || "",
        requiredSkills: (application.required_skills || []).join(", "),
        preferredSkills: (application.preferred_skills || []).join(", "),
        educationRequirements: application.education_requirements || "",
        additionalQuestions: application.additional_questions
          ? JSON.stringify(application.additional_questions, null, 2)
          : "",
        status: application.status,
      });
    } else {
      setEditingApplication(null);
      setFormData({
        jobTitle: "",
        jobDescription: "",
        location: "",
        industry: "",
        domain: "",
        sponsorshipRequired: false,
        remoteWork: false,
        employmentType: "",
        salaryRange: "",
        experienceLevel: "",
        requiredSkills: "",
        preferredSkills: "",
        educationRequirements: "",
        additionalQuestions: "",
        status: "draft",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate and parse additional questions
      let additionalQuestions = null;
      if (formData.additionalQuestions && formData.additionalQuestions.trim()) {
        try {
          additionalQuestions = JSON.parse(formData.additionalQuestions);
        } catch (parseError) {
          // Don't throw, show error and return
          showSnackbar("Invalid JSON format in Additional Questions field. Please check your syntax.", "error");
          setIsSaving(false);
          return;
        }
      }

      const payload = {
        recruiterId: user.id,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        location: formData.location,
        sponsorshipRequired: formData.sponsorshipRequired,
        remoteWork: formData.remoteWork,
        employmentType: formData.employmentType || null,
        salaryRange: formData.salaryRange || null,
        experienceLevel: formData.experienceLevel || null,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        preferredSkills: formData.preferredSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        educationRequirements: formData.educationRequirements || null,
        additionalQuestions: additionalQuestions || (formData.industry || formData.domain
          ? {
              industry: formData.industry,
              domain: formData.domain,
            }
          : null),
        status: formData.status,
      };

      let response;
      try {
        if (editingApplication) {
          // Update existing application
          response = await fetch(`/api/recruiter/applications/${editingApplication.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          // Create new application
          response = await fetch("/api/recruiter/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } catch (networkError: any) {
        // Don't throw, handle network errors
        console.error("Network error:", networkError);
        showSnackbar("Network error. Please check your connection and try again.", "error");
        setIsSaving(false);
        return;
      }

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Server error occurred" }));
        showSnackbar(errorData.error || "Failed to save application. Please try again.", "error");
        setIsSaving(false);
        return;
      }

      const data = await response.json().catch((parseError) => {
        // Don't throw, handle parsing errors
        console.error("Error parsing response:", parseError);
        showSnackbar("Error processing server response. Please try again.", "error");
        return null;
      });

      if (!data) {
        setIsSaving(false);
        return;
      }

      if (data.success) {
        showSnackbar(
          editingApplication
            ? "Application updated successfully"
            : "Application created successfully",
          "success"
        );
        handleCloseModal();
        fetchApplications();
      } else {
        showSnackbar(data.error || "Failed to save application. Please try again.", "error");
      }
    } catch (error: any) {
      // Don't throw, handle all other errors gracefully
      console.error("Error saving application:", error);
      const errorMessage = error?.message || "An unexpected error occurred. Please try again later.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "closed":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="text-white text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Applications | Velric</title>
        <meta name="description" content="Manage your job applications" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div
        className="min-h-screen text-white"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <RecruiterNavbar />

        <div className="relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-extrabold text-white">
                Job Applications
              </h1>
              <motion.button
                onClick={() => handleOpenModal()}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>New Application</span>
              </motion.button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg mb-4">
                  No applications yet. Create your first job application!
                </p>
                <motion.button
                  onClick={() => handleOpenModal()}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Application
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((application) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl relative overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(15px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          {application.job_title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenModal(application)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-white/70" />
                      </button>
                    </div>

                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                      {application.job_description}
                    </p>

                    <div className="space-y-2 text-sm">
                      {application.location && (
                        <div className="flex items-center space-x-2 text-white/60">
                          <MapPin className="w-4 h-4" />
                          <span>{application.location}</span>
                        </div>
                      )}
                      {application.employment_type && (
                        <div className="flex items-center space-x-2 text-white/60">
                          <Briefcase className="w-4 h-4" />
                          <span>{application.employment_type}</span>
                        </div>
                      )}
                      {application.salary_range && (
                        <div className="flex items-center space-x-2 text-white/60">
                          <DollarSign className="w-4 h-4" />
                          <span>{application.salary_range}</span>
                        </div>
                      )}
                      {application.sponsorship_required && (
                        <div className="text-yellow-400 text-xs font-semibold">
                          Sponsorship Required
                        </div>
                      )}
                      {application.remote_work && (
                        <div className="text-green-400 text-xs font-semibold">
                          Remote Work Available
                        </div>
                      )}
                    </div>

                    {application.required_skills &&
                      application.required_skills.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-white/50 mb-2">
                            Required Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {application.required_skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.required_skills.length > 3 && (
                              <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs">
                                +{application.required_skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0, 0, 0, 0.8)" }}
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-8"
                style={{
                  background: "rgba(26, 11, 46, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingApplication ? "Edit Application" : "New Application"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Job Description *
                      </label>
                      <textarea
                        value={formData.jobDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jobDescription: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        placeholder="Describe the job position..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <CustomSelect
                        value={formData.location}
                        onChange={(value) =>
                          setFormData({ ...formData, location: value })
                        }
                        options={REGIONS}
                        placeholder="Select location"
                        icon={<MapPin className="w-4 h-4" />}
                        label="Location (same options as survey form)"
                      />
                    </div>

                    <div>
                      <CustomSelect
                        value={formData.employmentType}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            employmentType: value,
                          })
                        }
                        options={EMPLOYMENT_TYPES}
                        placeholder="Select type"
                        icon={<Briefcase className="w-4 h-4" />}
                        label="Employment Type"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={formData.salaryRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salaryRange: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., $100k - $150k"
                      />
                    </div>

                    <div>
                      <CustomSelect
                        value={formData.industry}
                        onChange={(value) => {
                          setFormData({
                            ...formData,
                            industry: value,
                            domain: "", // Reset domain when industry changes
                          });
                        }}
                        options={INDUSTRIES}
                        placeholder="Select industry"
                        icon={<Building2 className="w-4 h-4" />}
                        label="Industry (for matching)"
                      />
                    </div>

                    <div>
                      <CustomSelect
                        value={formData.domain}
                        onChange={(value) =>
                          setFormData({ ...formData, domain: value })
                        }
                        options={
                          formData.industry
                            ? getIndustryOptions(formData.industry)
                            : []
                        }
                        placeholder={
                          formData.industry
                            ? "Select domain"
                            : "Select industry first"
                        }
                        disabled={!formData.industry}
                        icon={<Code className="w-4 h-4" />}
                        label="Domain/Specialization (for matching)"
                      />
                    </div>

                    <div>
                      <CustomSelect
                        value={formData.experienceLevel}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            experienceLevel: value,
                          })
                        }
                        options={EXPERIENCE_LEVELS}
                        placeholder="Select level"
                        label="Experience Level"
                      />
                    </div>

                    <div>
                      <CustomSelect
                        value={formData.status}
                        onChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                        options={APPLICATION_STATUSES}
                        placeholder="Select status"
                        label="Status"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Required Skills (comma-separated)
                        <span className="text-xs text-white/50 ml-2">
                          (same options as survey form)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.requiredSkills}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            requiredSkills: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., React, Node.js, TypeScript"
                        list="required-skills-suggestions"
                      />
                      <datalist id="required-skills-suggestions">
                        {VALID_STRENGTHS.map((skill) => (
                          <option key={skill} value={skill} />
                        ))}
                      </datalist>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Preferred Skills (comma-separated)
                        <span className="text-xs text-white/50 ml-2">
                          (same options as survey form)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.preferredSkills}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredSkills: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., AWS, Docker, Kubernetes"
                        list="preferred-skills-suggestions"
                      />
                      <datalist id="preferred-skills-suggestions">
                        {VALID_STRENGTHS.map((skill) => (
                          <option key={skill} value={skill} />
                        ))}
                      </datalist>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-white/80 mb-2 flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Education Requirements</span>
                        <span className="text-xs text-white/50 ml-2">
                          (same options as survey form)
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <CustomSelect
                            value={
                              EDUCATION_LEVELS.includes(
                                formData.educationRequirements
                              )
                                ? formData.educationRequirements
                                : ""
                            }
                            onChange={(value) =>
                              setFormData({
                                ...formData,
                                educationRequirements: value,
                              })
                            }
                            options={EDUCATION_LEVELS}
                            placeholder="Select education level"
                            icon={<GraduationCap className="w-4 h-4" />}
                          />
                        </div>
                        <input
                          type="text"
                          value={
                            EDUCATION_LEVELS.includes(
                              formData.educationRequirements
                            )
                              ? ""
                              : formData.educationRequirements
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              educationRequirements: e.target.value,
                            })
                          }
                          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          placeholder="Or enter custom requirements"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.sponsorshipRequired}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sponsorshipRequired: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-sm font-semibold text-white/80">
                          Sponsorship Required
                        </span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.remoteWork}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              remoteWork: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded bg-white/5 border border-white/10 text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-sm font-semibold text-white/80">
                          Remote Work Available
                        </span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Additional Questions (JSON format)
                      </label>
                      <textarea
                        value={formData.additionalQuestions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalQuestions: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 font-mono text-sm"
                        placeholder='{"question1": "Why do you want to work here?", "question2": "What is your availability?"}'
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>{editingApplication ? "Update" : "Create"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function Applications() {
  return (
    <ProtectedDashboardRoute>
      <ApplicationsContent />
    </ProtectedDashboardRoute>
  );
}

