import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Send, Briefcase } from "lucide-react";
import { useSnackbar } from "@/hooks/useSnackbar";
import CustomSelect from "@/components/ui/CustomSelect";
import WarningModal from "@/components/ui/WarningModal";

interface ScheduleInterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  missionTitle?: string; // Optional mission title for auto-fill
}

const INTERVIEW_TYPES = [
  "Screening",
  "Technical",
  "Behavioral",
  "Founder Discussion",
  "Culture Fit",
  "Final Round",
  "Other",
];


export default function ScheduleInterviewFormModal({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  candidateEmail,
  missionTitle,
}: ScheduleInterviewFormModalProps) {
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    interviewType: "Screening",
    context: missionTitle || "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");
  const [applications, setApplications] = useState<Array<{ id: string; job_title: string }>>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [validationReasons, setValidationReasons] = useState<string[]>([]);
  const [startHour, setStartHour] = useState<string>("9");
  const [startMinute, setStartMinute] = useState<string>("00");
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("AM");
  const [endHour, setEndHour] = useState<string>("10");
  const [endMinute, setEndMinute] = useState<string>("00");
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("AM");

  // Get recruiter ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("velric_user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.id) {
          setRecruiterId(parsedUser.id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch applications when modal opens
  useEffect(() => {
    if (isOpen && recruiterId) {
      fetchApplications();
    }
  }, [isOpen, recruiterId]);

  const fetchApplications = async () => {
    if (!recruiterId) return;
    
    setIsLoadingApplications(true);
    try {
      const response = await fetch(`/api/recruiter/applications?recruiterId=${encodeURIComponent(recruiterId)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch applications" }));
        console.error("Failed to fetch applications:", errorData.error);
        return;
      }

      const result = await response.json().catch(() => ({ success: false }));
      
      if (result.success && Array.isArray(result.applications)) {
        // Filter to only show active applications (optional - you can remove this filter if you want all)
        const activeApplications = result.applications.filter(
          (app: any) => app.status === "active" || app.status === "draft"
        );
        setApplications(activeApplications);
        console.log("Fetched applications:", activeApplications.length);
      } else {
        console.error("Invalid response format:", result);
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setIsLoadingApplications(false);
    }
  };


  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const convertTo24Hour = (hour: string, minute: string, ampm: "AM" | "PM"): string => {
    let hour24 = parseInt(hour, 10);
    if (ampm === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };

  const handleTimeRangeChange = () => {
    const startTime24 = convertTo24Hour(startHour, startMinute, startAmPm);
    
    // Use start time as preferred time
    setFormData((prev) => ({
      ...prev,
      preferredTime: startTime24,
    }));
    
    // Clear errors
    if (errors.preferredTime) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.preferredTime;
        return newErrors;
      });
    }
  };

  // Update preferredTime when time range changes (for backward compatibility)
  useEffect(() => {
    if (startHour && startMinute && startAmPm) {
      const startTime24 = convertTo24Hour(startHour, startMinute, startAmPm);
      setFormData((prev) => ({
        ...prev,
        preferredTime: startTime24,
      }));
      
      // Clear errors
      if (errors.preferredTime) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.preferredTime;
          return newErrors;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startHour, startMinute, startAmPm]);



  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.interviewType) {
      newErrors.interviewType = "Interview type is required";
    }

    if (!formData.context.trim()) {
      newErrors.context = "Context/Message is required";
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred date is required";
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateApplicationMatch = async (): Promise<{ isValid: boolean; reasons: string[] }> => {
    // Only validate if an application is selected
    if (!selectedApplicationId || selectedApplicationId.trim() === "") {
      return { isValid: true, reasons: [] }; // No application selected, skip validation
    }

    try {
      const response = await fetch(`/api/recruiter/validate-application-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApplicationId,
          candidateId,
        }),
      });

      if (!response.ok) {
        return { isValid: true, reasons: [] }; // If validation fails, allow submission
      }

      const result = await response.json().catch(() => ({ success: false }));
      
      if (result.success && result.isValid) {
        return { isValid: true, reasons: [] };
      }

      return {
        isValid: false,
        reasons: result.reasons || ["Application requirements do not match candidate preferences"],
      };
    } catch (err) {
      console.error("Error validating application match:", err);
      return { isValid: true, reasons: [] }; // On error, allow submission
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    // Check if recruiter ID is available
    if (!recruiterId) {
      showSnackbar("Recruiter authentication required. Please log in again.", "error");
      return;
    }

    // Validate application match if application is selected
    if (selectedApplicationId) {
      const validation = await validateApplicationMatch();
      if (!validation.isValid) {
        setValidationReasons(validation.reasons);
        setShowWarningModal(true);
        return;
      }
    }

    setIsLoading(true);

    try {
      const startTime24 = convertTo24Hour(startHour, startMinute, startAmPm);
      const endTime24 = convertTo24Hour(endHour, endMinute, endAmPm);
      
      const response = await fetch("/api/recruiter/schedule-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId,
          candidateName,
          candidateEmail,
          recruiterId,
          interviewType: formData.interviewType,
          context: formData.context,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime, // Keep for backward compatibility
          startTime: startTime24,
          endTime: endTime24,
          message: formData.message,
          applicationId: selectedApplicationId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to schedule interview" }));
        showSnackbar(errorData.error || "Failed to schedule interview", "error");
        setIsLoading(false);
        return;
      }

      const result = await response.json().catch(() => ({ success: false, error: "Invalid response from server" }));

      if (!result.success) {
        showSnackbar(result.error || "Failed to schedule interview", "error");
        setIsLoading(false);
        return;
      }

      showSnackbar(`Interview request sent to ${candidateName}`, "success");
      handleClose();
    } catch (err: any) {
      console.error("Error scheduling interview:", err);
      const errorMessage = err instanceof TypeError && err.message.includes("fetch")
        ? "Network error. Please check your connection and try again."
        : err.message || "Failed to schedule interview. Please try again.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      interviewType: "Screening",
      context: missionTitle || "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
    setSelectedApplicationId("");
    setErrors({});
    setShowWarningModal(false);
    setValidationReasons([]);
    onClose();
  };

  const handleForceSubmit = async () => {
    setShowWarningModal(false);
    setIsLoading(true);

    try {
      const startTime24 = convertTo24Hour(startHour, startMinute, startAmPm);
      const endTime24 = convertTo24Hour(endHour, endMinute, endAmPm);
      
      const response = await fetch("/api/recruiter/schedule-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId,
          candidateName,
          candidateEmail,
          recruiterId,
          interviewType: formData.interviewType,
          context: formData.context,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime, // Keep for backward compatibility
          startTime: startTime24,
          endTime: endTime24,
          message: formData.message,
          applicationId: selectedApplicationId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to schedule interview" }));
        showSnackbar(errorData.error || "Failed to schedule interview", "error");
        setIsLoading(false);
        return;
      }

      const result = await response.json().catch(() => ({ success: false, error: "Invalid response from server" }));

      if (!result.success) {
        showSnackbar(result.error || "Failed to schedule interview", "error");
        setIsLoading(false);
        return;
      }

      showSnackbar(`Interview request sent to ${candidateName}`, "success");
      handleClose();
    } catch (err: any) {
      console.error("Error scheduling interview:", err);
      const errorMessage = err instanceof TypeError && err.message.includes("fetch")
        ? "Network error. Please check your connection and try again."
        : err.message || "Failed to schedule interview. Please try again.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Schedule Interview</h2>
                <p className="text-sm text-white/60">with {candidateName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scroll">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Application Selection */}
              <div>
                {isLoadingApplications ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-white/60">Loading applications...</p>
                  </div>
                ) : applications.length > 0 ? (
                  <CustomSelect
                    value={selectedApplicationId}
                    onChange={(value) => setSelectedApplicationId(value)}
                    options={applications.map((app) => app.id)}
                    placeholder="Select a job application (optional)"
                    icon={<Briefcase className="w-4 h-4" />}
                    label="Job Application (Optional)"
                    getOptionLabel={(id) => applications.find((app) => app.id === id)?.job_title || id}
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Job Application (Optional)
                    </label>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-sm text-white/60">No applications available. Create one in the Applications page.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Interview Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.interviewType}
                  onChange={handleInputChange("interviewType")}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                    errors.interviewType ? "border-red-500" : "border-white/10"
                  } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                >
                  {INTERVIEW_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-[#1a0b2e]">
                      {type}
                    </option>
                  ))}
                </select>
                {errors.interviewType && (
                  <p className="mt-1 text-sm text-red-400">{errors.interviewType}</p>
                )}
              </div>

              {/* Context / Message */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Context / Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.context}
                  onChange={handleInputChange("context")}
                  placeholder="Enter interview context or mission title..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                    errors.context ? "border-red-500" : "border-white/10"
                  } text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none`}
                />
                {errors.context && (
                  <p className="mt-1 text-sm text-red-400">{errors.context}</p>
                )}
              </div>

              {/* Date and Time Range Selection */}
              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Interview Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange("preferredDate")}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border ${
                        errors.preferredDate ? "border-red-500" : "border-white/10"
                      } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all`}
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="mt-1 text-sm text-red-400">{errors.preferredDate}</p>
                  )}
                </div>

                {/* Time Range Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Time Range <span className="text-red-400">*</span>
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                    {/* Start Time */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-16">
                        <span className="text-xs text-white/60 font-medium">From</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={startHour}
                          onChange={(e) => setStartHour(e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                            <option key={h} value={h} className="bg-[#1a0b2e]">
                              {h}
                            </option>
                          ))}
                        </select>
                        <span className="text-white/60 font-semibold">:</span>
                        <select
                          value={startMinute}
                          onChange={(e) => setStartMinute(e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                        >
                          {["00", "15", "30", "45"].map((m) => (
                            <option key={m} value={m} className="bg-[#1a0b2e]">
                              {m}
                            </option>
                          ))}
                        </select>
                        <select
                          value={startAmPm}
                          onChange={(e) => setStartAmPm(e.target.value as "AM" | "PM")}
                          className="flex-1 px-3 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                        >
                          <option value="AM" className="bg-[#1a0b2e]">AM</option>
                          <option value="PM" className="bg-[#1a0b2e]">PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-16"></div>
                      <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    {/* End Time */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-16">
                        <span className="text-xs text-white/60 font-medium">To</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={endHour}
                          onChange={(e) => setEndHour(e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                            <option key={h} value={h} className="bg-[#1a0b2e]">
                              {h}
                            </option>
                          ))}
                        </select>
                        <span className="text-white/60 font-semibold">:</span>
                        <select
                          value={endMinute}
                          onChange={(e) => setEndMinute(e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                        >
                          {["00", "15", "30", "45"].map((m) => (
                            <option key={m} value={m} className="bg-[#1a0b2e]">
                              {m}
                            </option>
                          ))}
                        </select>
                        <select
                          value={endAmPm}
                          onChange={(e) => setEndAmPm(e.target.value as "AM" | "PM")}
                          className="flex-1 px-3 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                        >
                          <option value="AM" className="bg-[#1a0b2e]">AM</option>
                          <option value="PM" className="bg-[#1a0b2e]">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {errors.preferredTime && (
                    <p className="mt-1 text-sm text-red-400">{errors.preferredTime}</p>
                  )}
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={handleInputChange("message")}
                  placeholder="Add any additional notes or instructions..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Interview Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Application Requirements Mismatch"
        reasons={validationReasons}
        onConfirm={handleForceSubmit}
        confirmText="Submit Anyway"
      />
    </AnimatePresence>
  );
}

