import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Bookmark, BookmarkCheck, MapPin, Mail, Linkedin, Github, X, SlidersHorizontal, Loader2, User, CheckCircle, XCircle, Calendar, Briefcase } from "lucide-react";
import CandidateProfileModal from "@/components/recruiter/CandidateProfileModal";
import HiringConstraintsModal from "@/components/recruiter/HiringConstraintsModal";
import ScheduleInterviewFormModal from "@/components/recruiter/ScheduleInterviewFormModal";
import CandidateFilterSidebar from "@/components/recruiter/CandidateFilterSidebar";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/router";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";
import { getIndustryOptions } from "@/utils/surveyValidation";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useDebounce } from "@/hooks/useDebounce";
import ThreeDotsLoader from "@/components/ThreeDotsLoader";

// All industries from survey form (Step 1)
const allIndustries = [
  "Technology & Software",
  "Finance & Banking",
  "Product Management",
  "Healthcare & Medical",
  "Marketing & Advertising",
  "Education & Learning",
  "Design & Creative",
  "E-commerce & Retail",
  "Data Science & Analytics",
  "Startup Founder",
  "Other"
];

// Domain filters use industries from survey
const domainFilters = ["All", ...allIndustries];

// Map candidate domain to survey industry for filtering
const candidateDomainAliases: Record<string, string> = {
  "frontend": "Technology & Software",
  "frontend development": "Technology & Software",
  "backend": "Technology & Software",
  "backend development": "Technology & Software",
  "full stack": "Technology & Software",
  "data": "Data Science & Analytics",
 "data analytics": "Data Science & Analytics",
  "data science": "Data Science & Analytics",
  "marketing": "Marketing & Advertising",
  "growth marketing": "Marketing & Advertising",
  "finance": "Finance & Banking",
  "product management": "Product Management",
  "healthcare": "Healthcare & Medical",
  "education": "Education & Learning",
  "design": "Design & Creative",
  "e-commerce": "E-commerce & Retail",
  "startup": "Startup Founder",
};

interface CandidateClustersDisplay {
  core_stack: string[];
  domain_tags: string[];
  strength_tags: string[];
}

interface DisplayCandidate {
  id: string;
  name: string;
  email?: string;
  domain: string;
  industry?: string;
  velricScore: number;
  missionsCompleted?: number;
  location?: string;
  skills: string[];
  clusters: CandidateClustersDisplay;
  about?: string;
  linkedin?: string;
  github?: string;
  profile_image?: string | null;
}

// Check if a candidate matches an industry option
function candidateMatchesIndustryOption(candidate: DisplayCandidate, industryOption: string): boolean {
  const optionLower = industryOption.toLowerCase();

  const skillsMatch = (candidate.skills || []).some((skill) =>
    skill.toLowerCase().includes(optionLower)
  );

  const specializationSources = [
    ...(candidate.clusters?.core_stack || []),
    ...(candidate.clusters?.domain_tags || []),
    ...(candidate.clusters?.strength_tags || []),
    candidate.domain,
    candidate.industry,
  ].filter(Boolean) as string[];

  const specializationMatch = specializationSources.some((spec) =>
    spec.toLowerCase().includes(optionLower) || optionLower.includes(spec.toLowerCase())
  );

  const keywordMatches = [
    (optionLower.includes("frontend") || optionLower.includes("react")) &&
      (candidate.domain.toLowerCase().includes("frontend") ||
        candidate.skills.some((s) => ["react", "typescript", "javascript"].some((tech) => s.toLowerCase().includes(tech)))),
    (optionLower.includes("backend") || optionLower.includes("node")) &&
      (candidate.domain.toLowerCase().includes("backend") ||
        candidate.skills.some((s) => ["node", "python", "java", "api"].some((tech) => s.toLowerCase().includes(tech)))),
    optionLower.includes("full stack") && candidate.skills.length > 5,
    optionLower.includes("ai") &&
      candidate.skills.some((s) => ["ai", "ml", "tensorflow", "pytorch"].some((tech) => s.toLowerCase().includes(tech))),
    optionLower.includes("data") &&
      (candidate.domain.toLowerCase().includes("data") ||
        candidate.skills.some((s) => ["sql", "tableau", "pandas"].some((tech) => s.toLowerCase().includes(tech)))),
    optionLower.includes("marketing") &&
      (candidate.domain.toLowerCase().includes("marketing") ||
        candidate.skills.some((s) => ["marketing", "growth", "content"].some((tech) => s.toLowerCase().includes(tech)))),
  ].some(Boolean);

  return skillsMatch || specializationMatch || keywordMatches;
}

interface ApiCandidate {
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

interface HiringConstraints {
  location?: string[];
  visaSponsorshipAllowed: boolean;
  relocationRequired: boolean;
  preferredTimezone?: string;
}

interface CompatibilityResult {
  location: boolean | null;
  visaSponsorship: boolean | null;
  relocation: boolean | null;
  timezone: boolean | null;
}

interface FilterState {
  location: string[];
  remoteWork: string[];
  sponsorship: string[];
  citizenship: string[];
  yearsOfExperience: { min: number; max: number };
  educationLevel: string[];
  graduationYear: { min: number; max: number };
  domain: string[];
  skillClusters: string[];
  seniority: string[];
  availability: string[];
  velricScore: { min: number; max: number };
}

function CandidatesPageContent() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    remoteWork: [],
    sponsorship: [],
    citizenship: [],
    yearsOfExperience: { min: 0, max: 50 },
    educationLevel: [],
    graduationYear: { min: 2000, max: new Date().getFullYear() },
    domain: [],
    skillClusters: [],
    seniority: [],
    availability: [],
    velricScore: { min: 0, max: 10 },
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileCandidate, setSelectedProfileCandidate] = useState<{
    id: string;
    name: string;
    email?: string;
    velricScore?: number;
  } | null>(null);
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [showConstraintsModal, setShowConstraintsModal] = useState(false);
  const [hiringConstraints, setHiringConstraints] = useState<HiringConstraints | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    email?: string;
  } | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Debounce search query and filters to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedFilters = useDebounce(filters, 300);

  // Check if constraints modal should be shown on first load
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("recruiter_constraints_seen");
    const savedConstraints = sessionStorage.getItem("recruiter_hiring_constraints");
    
    if (!hasSeenModal && !savedConstraints) {
      setShowConstraintsModal(true);
    } else if (savedConstraints) {
      try {
        const parsed = JSON.parse(savedConstraints);
        setHiringConstraints(parsed);
      } catch (e) {
        console.warn("Failed to parse saved constraints:", e);
      }
    }
  }, []);

  // Function to check compatibility
  const checkCompatibility = (candidate: ApiCandidate): CompatibilityResult => {
    if (!hiringConstraints) {
      return {
        location: null,
        visaSponsorship: null,
        relocation: null,
        timezone: null,
      };
    }

    const result: CompatibilityResult = {
      location: null,
      visaSponsorship: null,
      relocation: null,
      timezone: null,
    };

    // Check location compatibility
    if (hiringConstraints.location && hiringConstraints.location.length > 0) {
      const candidateRegion = candidate.location || 
        candidate.logistics_preferences?.current_region;
      if (candidateRegion) {
        // Simple region matching - can be enhanced
        const regionLower = candidateRegion.toLowerCase();
        result.location = hiringConstraints.location.some(loc => 
          regionLower.includes(loc.toLowerCase()) || 
          loc.toLowerCase().includes(regionLower)
        );
      } else {
        result.location = false; // No location info = incompatible
      }
    }

    // Check visa sponsorship
    const logistics = candidate.logistics_preferences;
    if (logistics) {
      const needsSponsorship = logistics.sponsorship_consideration === "yes" || 
                              (logistics.sponsorship_consideration === "depends" && 
                               logistics.sponsorship_regions && 
                               logistics.sponsorship_regions.length > 0);
      
      if (needsSponsorship) {
        result.visaSponsorship = hiringConstraints.visaSponsorshipAllowed;
      } else {
        result.visaSponsorship = true; // Doesn't need sponsorship = compatible
      }
    }

    // Check relocation
    if (hiringConstraints.relocationRequired) {
      const relocationOpenness = logistics?.relocation_openness;
      if (relocationOpenness) {
        result.relocation = relocationOpenness === "anywhere" || 
                           relocationOpenness === "only_some" ||
                           relocationOpenness === "depends";
      } else {
        result.relocation = false; // No info = assume not open
      }
    } else {
      result.relocation = true; // Relocation not required = compatible
    }

    // Check timezone
    if (hiringConstraints.preferredTimezone) {
      const candidateTimezone = candidate.interview_availability?.timezone;
      if (candidateTimezone) {
        // Simple timezone matching - can be enhanced
        result.timezone = candidateTimezone.toLowerCase().includes(
          hiringConstraints.preferredTimezone.toLowerCase().split(" ")[0]
        ) || hiringConstraints.preferredTimezone.toLowerCase().includes(
          candidateTimezone.toLowerCase()
        );
      } else {
        result.timezone = false; // No timezone info = incompatible
      }
    }

    return result;
  };

  const handleConstraintsSave = (constraints: HiringConstraints) => {
    setHiringConstraints(constraints);
    setShowConstraintsModal(false);
    sessionStorage.setItem("recruiter_constraints_seen", "true");
  };

  const handleConstraintsSkip = () => {
    setShowConstraintsModal(false);
    sessionStorage.setItem("recruiter_constraints_seen", "true");
  };

  // Fetch candidates from API with debounced values
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
        
        // Domain filters
        if (debouncedFilters.domain.length > 0) {
          params.append("domain", debouncedFilters.domain.join(","));
        }
        
        // Velric Score
        params.append("minScore", debouncedFilters.velricScore.min.toString());
        params.append("maxScore", debouncedFilters.velricScore.max.toString());
        
        // Skill Clusters
        if (debouncedFilters.skillClusters.length > 0) {
          params.append("skillClusters", debouncedFilters.skillClusters.join(","));
        }
        
        // Location
        if (debouncedFilters.location.length > 0) {
          params.append("location", debouncedFilters.location.join(","));
        }
        
        // Remote Work
        if (debouncedFilters.remoteWork.length > 0) {
          params.append("remoteWork", debouncedFilters.remoteWork.join(","));
        }
        
        // Sponsorship
        if (debouncedFilters.sponsorship.length > 0) {
          params.append("sponsorship", debouncedFilters.sponsorship.join(","));
        }
        
        // Citizenship
        if (debouncedFilters.citizenship.length > 0) {
          params.append("citizenship", debouncedFilters.citizenship.join(","));
        }
        
        // Years of Experience
        if (debouncedFilters.yearsOfExperience.min > 0 || debouncedFilters.yearsOfExperience.max < 50) {
          params.append("minExperience", debouncedFilters.yearsOfExperience.min.toString());
          params.append("maxExperience", debouncedFilters.yearsOfExperience.max.toString());
        }
        
        // Education Level
        if (debouncedFilters.educationLevel.length > 0) {
          params.append("educationLevel", debouncedFilters.educationLevel.join(","));
        }
        
        // Graduation Year
        if (debouncedFilters.graduationYear.min > 2000 || debouncedFilters.graduationYear.max < new Date().getFullYear()) {
          params.append("minGraduationYear", debouncedFilters.graduationYear.min.toString());
          params.append("maxGraduationYear", debouncedFilters.graduationYear.max.toString());
        }
        
        // Seniority
        if (debouncedFilters.seniority.length > 0) {
          params.append("seniority", debouncedFilters.seniority.join(","));
        }
        
        // Availability
        if (debouncedFilters.availability.length > 0) {
          params.append("availability", debouncedFilters.availability.join(","));
        }

        const response = await fetch(`/api/recruiter/candidates?${params.toString()}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch candidates");
        }

        setCandidates(result.candidates || []);
        setTotalCandidates(result.total || 0);
      } catch (err: any) {
        console.error("Error fetching candidates:", err);
        showSnackbar(err.message || "Failed to load candidates", "error");
        setCandidates([]);
        setTotalCandidates(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, debouncedFilters]);

  const resetFilters = () => {
    setFilters({
      location: [],
      remoteWork: [],
      sponsorship: [],
      citizenship: [],
      yearsOfExperience: { min: 0, max: 50 },
      educationLevel: [],
      graduationYear: { min: 2000, max: new Date().getFullYear() },
      domain: [],
      skillClusters: [],
      seniority: [],
      availability: [],
      velricScore: { min: 0, max: 10 },
    });
  };

  // Convert API candidate to display format
  const convertToDisplayCandidate = (apiCandidate: ApiCandidate): DisplayCandidate => {
    // Generate mock clusters structure
    const generateMockClusters = () => {
      return {
        core_stack: apiCandidate.mission_focus || [],
        domain_tags: apiCandidate.industry ? [apiCandidate.industry] : [],
        strength_tags: apiCandidate.strength_areas || [],
      };
    };

    const displayDomain =
      apiCandidate.domain ||
      (apiCandidate.mission_focus && apiCandidate.mission_focus.length > 0
        ? apiCandidate.mission_focus[0]
        : apiCandidate.industry) ||
      "General";

    return {
      id: apiCandidate.id,
      name: apiCandidate.name,
      email: apiCandidate.email,
      domain: displayDomain,
      industry: apiCandidate.industry,
      velricScore: typeof apiCandidate.velricScore === "number" ? Number(apiCandidate.velricScore.toFixed(1)) : 0,
      missionsCompleted: apiCandidate.missionsCompleted || 0,
      location: apiCandidate.location || undefined,
      skills: apiCandidate.skills || [],
      clusters: generateMockClusters(),
      about: apiCandidate.experience_summary || "",
      linkedin: undefined,
      github: undefined,
      profile_image: apiCandidate.profile_image || null,
    };
  };

  const filteredCandidates = useMemo<DisplayCandidate[]>(() => {
    return candidates.map(convertToDisplayCandidate);
  }, [candidates]);

  const toggleSaveCandidate = (candidateId: string) => {
    setSavedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location.length > 0) count++;
    if (filters.remoteWork.length > 0) count++;
    if (filters.sponsorship.length > 0) count++;
    if (filters.citizenship.length > 0) count++;
    if (filters.yearsOfExperience.min > 0 || filters.yearsOfExperience.max < 50) count++;
    if (filters.educationLevel.length > 0) count++;
    if (filters.graduationYear.min > 2000 || filters.graduationYear.max < new Date().getFullYear()) count++;
    if (filters.domain.length > 0) count++;
    if (filters.skillClusters.length > 0) count++;
    if (filters.seniority.length > 0) count++;
    if (filters.availability.length > 0) count++;
    if (filters.velricScore.min > 0 || filters.velricScore.max < 10) count++;
    return count;
  };

  return (
    <>
      <Head>
        <title>Search Candidates | Velric Recruiter</title>
        <meta
          name="description"
          content="Search and filter Velric candidates with powerful filters."
        />
      </Head>

      <div
        className="min-h-screen text-white"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #120c2d 50%, #020617 100%)",
        }}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-32 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <RecruiterNavbar />
        
        <header className="relative z-10 pt-16 border-b border-white/10 bg-black/30 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <p className="text-sm text-white/60 mb-2">Recruiter • Talent Search</p>
            <h1 className="text-3xl font-bold mb-6">Search Candidates</h1>
            
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Search by name, skill, or cluster..."
                />
              </div>
              
              <motion.button
                onClick={() => setShowConstraintsModal(true)}
                className={`relative px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                  hiringConstraints
                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={hiringConstraints ? "Update hiring constraints" : "Set hiring constraints"}
              >
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Constraints</span>
                {hiringConstraints && (
                  <span className="absolute -top-2 -right-2 w-2 h-2 bg-cyan-400 rounded-full"></span>
                )}
              </motion.button>
              
              <motion.button
                onClick={() => setShowFilters(true)}
                className={`relative px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-purple-500/20 border-purple-400 text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-400 text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Filter Sidebar */}
        <CandidateFilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {/* Main Content - Candidate Grid */}
        <main className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
              <ThreeDotsLoader size="lg" text="Loading candidates..." />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-white/60">
                  Showing <span className="text-white font-semibold">{filteredCandidates.length}</span> candidate{filteredCandidates.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 mb-2">No candidates found</p>
                  <p className="text-sm text-white/40">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredCandidates.map((candidate, index) => {
                  const isSaved = savedCandidates.has(candidate.id);
                  // Find the original API candidate for compatibility check
                  const apiCandidate = candidates.find(c => c.id === candidate.id);
                  const compatibility = apiCandidate ? checkCompatibility(apiCandidate) : null;
                  
                  return (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-400/30 transition-all hover:scale-[1.02] cursor-pointer"
                      onClick={() => {
                        setSelectedProfileCandidate({
                          id: candidate.id,
                          name: candidate.name,
                          email: candidate.email,
                          velricScore: candidate.velricScore,
                        });
                        setIsProfileModalOpen(true);
                      }}
                    >
                      {/* Compatibility Badges */}
                      {hiringConstraints && compatibility && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {compatibility.location !== null && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              compatibility.location
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                              {compatibility.location ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>Location</span>
                            </div>
                          )}
                          {compatibility.visaSponsorship !== null && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              compatibility.visaSponsorship
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                              {compatibility.visaSponsorship ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>Visa</span>
                            </div>
                          )}
                          {compatibility.relocation !== null && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              compatibility.relocation
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                              {compatibility.relocation ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>Relocation</span>
                            </div>
                          )}
                          {compatibility.timezone !== null && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              compatibility.timezone
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                              {compatibility.timezone ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>Timezone</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          {/* Profile Image */}
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30 overflow-hidden flex-shrink-0">
                            {candidate.profile_image ? (
                              <img
                                src={candidate.profile_image}
                                alt={candidate.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-cyan-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {candidate.name}
                            </h3>
                            <p className="text-sm text-white/60 mb-2">
                              {candidate.domain}
                            </p>
                            {candidate.location && (
                              <div className="flex items-center text-xs text-white/50">
                                <MapPin className="w-3 h-3 mr-1" />
                                {candidate.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveCandidate(candidate.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isSaved
                              ? "text-yellow-400 bg-yellow-400/10"
                              : "text-white/40 hover:text-yellow-400 hover:bg-white/5"
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Velric Score */}
                      <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-white/60 mb-1">Velric Score (Avg mission score)</p>
                            <p className="text-3xl font-bold text-cyan-300 flex items-baseline gap-1">
                              {candidate.velricScore.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        {/* Missions Completed */}
                        <div className="pt-3 border-t border-cyan-500/20">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-white/60">Missions Completed</p>
                            <p className="text-lg font-bold text-white">
                              {candidate.missionsCompleted || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Interview Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidate({
                            id: candidate.id,
                            name: candidate.name,
                            email: candidate.email,
                          });
                          setIsScheduleModalOpen(true);
                        }}
                        className="w-full mb-4 px-4 py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #0891b2, #7c3aed)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #06b6d4, #8b5cf6)";
                        }}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Interview</span>
                      </button>

                      {/* Core Clusters */}
                      <div className="mb-4">
                        <p className="text-xs text-white/60 mb-2">Core Expertise</p>
                        {candidate.clusters.core_stack.length === 0 ? (
                          <p className="text-xs text-white/50">No specializations listed</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {candidate.clusters.core_stack.slice(0, 4).map((label, idx) => (
                              <span
                                key={`${candidate.id}-core-${idx}`}
                                className="px-2 py-1 rounded-lg text-xs border border-white/15 bg-white/5 text-white/80"
                              >
                                {label}
                              </span>
                            ))}
                            {candidate.clusters.core_stack.length > 4 && (
                              <span className="px-2 py-1 rounded-lg text-xs text-white/60 border border-white/10">
                                +{candidate.clusters.core_stack.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* About Preview */}
                      {candidate.about && (
                        <p className="text-sm text-white/70 line-clamp-2 mb-4">
                          {candidate.about}
                        </p>
                      )}

                      {/* Contact Links */}
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        {candidate.email && (
                          <a
                            href={`mailto:${candidate.email}`}
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-cyan-400 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </a>
                        )}
                        {candidate.linkedin && (
                          <a
                            href={`https://${candidate.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-cyan-400 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                        {candidate.github && (
                          <a
                            href={`https://${candidate.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-purple-400 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Candidate Profile Modal */}
        {selectedProfileCandidate && (
          <CandidateProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => {
              setIsProfileModalOpen(false);
              setSelectedProfileCandidate(null);
            }}
            candidateId={selectedProfileCandidate.id}
            candidateName={selectedProfileCandidate.name}
            candidateEmail={selectedProfileCandidate.email}
            candidateVelricScore={selectedProfileCandidate.velricScore}
          />
        )}

        {/* Hiring Constraints Modal */}
        <HiringConstraintsModal
          isOpen={showConstraintsModal}
          onSave={handleConstraintsSave}
          onSkip={handleConstraintsSkip}
        />

        {/* Schedule Interview Modal */}
        {selectedCandidate && (
          <ScheduleInterviewFormModal
            isOpen={isScheduleModalOpen}
            onClose={() => {
              setIsScheduleModalOpen(false);
              setSelectedCandidate(null);
            }}
            candidateId={selectedCandidate.id}
            candidateName={selectedCandidate.name}
            candidateEmail={selectedCandidate.email}
          />
        )}
      </div>
    </>
  );
}

export default function RecruiterCandidatesPage() {
  return (
    <ProtectedDashboardRoute>
      <CandidatesPageContent />
    </ProtectedDashboardRoute>
  );
}
