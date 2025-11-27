import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Send, Briefcase } from "lucide-react";
import { useSnackbar } from "@/contexts/SnackbarContext";
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

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "2 hours" },
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
    duration: 60,
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [suggestedTimeSlots, setSuggestedTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");
  const [applications, setApplications] = useState<Array<{ id: string; job_title: string }>>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [validationReasons, setValidationReasons] = useState<string[]>([]);

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

  // Fetch candidate availability and applications when modal opens
  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateAvailability();
      if (recruiterId) {
        fetchApplications();
      }
    }
  }, [isOpen, candidateId, recruiterId]);

  const fetchCandidateAvailability = async () => {
    setIsLoadingSlots(true);
    try {
      const response = await fetch(`/api/recruiter/candidate-availability?userId=${candidateId}`);

      if (!response.ok) {
        setSuggestedTimeSlots(generateDefaultTimeSlots());
        return;
      }

      const result = await response.json().catch(() => ({ success: false }));

      if (result.success && Array.isArray(result.timeSlots)) {
        setSuggestedTimeSlots(result.timeSlots);
      } else {
        setSuggestedTimeSlots(generateDefaultTimeSlots());
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      setSuggestedTimeSlots(generateDefaultTimeSlots());
    } finally {
      setIsLoadingSlots(false);
    }
  };

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

  const generateDefaultTimeSlots = (): string[] => {
    const slots: string[] = [];
    const today = new Date();
    
    // Generate slots for next 7 days
    for (let day = 1; day <= 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate time slots: 9 AM, 11 AM, 2 PM, 4 PM
      const times = ["09:00", "11:00", "14:00", "16:00"];
      times.forEach((time) => {
        const dateStr = date.toISOString().split("T")[0];
        slots.push(`${dateStr} ${time}`);
      });
    }
    
    return slots.slice(0, 10); // Return top 10 slots
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

  const handleTimeSlotSelect = (slot: string) => {
    const [date, time] = slot.split(" ");
    setFormData((prev) => ({
      ...prev,
      preferredDate: date,
      preferredTime: time,
    }));
    
    // Clear errors
    if (errors.preferredDate || errors.preferredTime) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.preferredDate;
        delete newErrors.preferredTime;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.interviewType) {
      newErrors.interviewType = "Interview type is required";
    }

    if (!formData.context.trim()) {
      newErrors.context = "Context/Message is required";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Duration is required";
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
          duration: formData.duration,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
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
      duration: 60,
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
          duration: formData.duration,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
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

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Duration <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={handleInputChange("duration")}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                    errors.duration ? "border-red-500" : "border-white/10"
                  } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#1a0b2e]">
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-400">{errors.duration}</p>
                )}
              </div>

              {/* Suggested Time Slots */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Suggested Time Slots <span className="text-red-400">*</span>
                </label>
                {isLoadingSlots ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-white/60">Loading availability...</p>
                  </div>
                ) : suggestedTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {suggestedTimeSlots.map((slot) => {
                      const [date, time] = slot.split(" ");
                      const dateObj = new Date(date);
                      const isSelected =
                        formData.preferredDate === date && formData.preferredTime === time;
                      
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            isSelected
                              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                              : "border-white/10 bg-white/5 text-white/80 hover:border-cyan-400/50 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-xs text-white/60 mb-1">
                            {dateObj.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="font-semibold">{time}</div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-white/60">No availability data found</p>
                  </div>
                )}
                {(errors.preferredDate || errors.preferredTime) && (
                  <p className="mt-1 text-sm text-red-400">
                    Please select a time slot
                  </p>
                )}
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

