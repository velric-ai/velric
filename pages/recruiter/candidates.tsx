import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Bookmark, BookmarkCheck, MapPin, Mail, Linkedin, Github, X, SlidersHorizontal, Calendar, Loader2 } from "lucide-react";
import ScheduleInterviewFormModal from "@/components/recruiter/ScheduleInterviewFormModal";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/router";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";
import { getIndustryOptions } from "@/utils/surveyValidation";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useDebounce } from "@/hooks/useDebounce";

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
  location?: string;
  skills: string[];
  clusters: CandidateClustersDisplay;
  about?: string;
  linkedin?: string;
  github?: string;
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

function CandidatesPageContent() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10]);
  const [clusterFilters, setClusterFilters] = useState<string[]>([]); // Now stores industry option strings
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    email?: string;
  } | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(0);

  // Debounce search query and filters to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedDomainFilter = useDebounce(domainFilter, 300);
  const debouncedScoreRange = useDebounce(scoreRange, 300);
  const debouncedClusterFilters = useDebounce(clusterFilters, 300);

  // Fetch candidates from API with debounced values
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
        if (debouncedDomainFilter && debouncedDomainFilter !== "All") params.append("domain", debouncedDomainFilter);
        params.append("minScore", debouncedScoreRange[0].toString());
        params.append("maxScore", debouncedScoreRange[1].toString());
        if (debouncedClusterFilters.length > 0) {
          params.append("specializations", debouncedClusterFilters.join(","));
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
  }, [debouncedSearchQuery, debouncedDomainFilter, debouncedScoreRange, debouncedClusterFilters, showSnackbar]);

  // Get industry options (clusters) based on selected domain/industry
  const availableIndustryOptions = useMemo(() => {
    if (domainFilter === "All") {
      // If "All" is selected, show options from all industries
      const allOptions: string[] = [];
      allIndustries.forEach(industry => {
        allOptions.push(...getIndustryOptions(industry));
      });
      return [...new Set(allOptions)];
    }
    return getIndustryOptions(domainFilter);
  }, [domainFilter]);

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
      location: apiCandidate.location || undefined,
      skills: apiCandidate.skills || [],
      clusters: generateMockClusters(),
      about: apiCandidate.experience_summary || "",
      linkedin: undefined,
      github: undefined,
    };
  };

  const filteredCandidates = useMemo<DisplayCandidate[]>(() => {
    return candidates.map(convertToDisplayCandidate);
  }, [candidates]);

  const toggleClusterFilter = (option: string) => {
    setClusterFilters((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

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

  const resetFilters = () => {
    setDomainFilter("All");
    setScoreRange([0, 10]);
    setClusterFilters([]);
    setSearchQuery("");
  };

  // Clear cluster filters when domain changes
  const handleDomainChange = (domain: string) => {
    setDomainFilter(domain);
    setClusterFilters([]); // Clear cluster filters when domain changes
  };

  const activeFiltersCount = 
    (domainFilter !== "All" ? 1 : 0) +
    (scoreRange[0] !== 0 || scoreRange[1] !== 10 ? 1 : 0) +
    clusterFilters.length;

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
            
            {/* Search and Filtier Bar */}
            <div className="flex tems-center gap-3">
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
                onClick={() => setShowFilters(!showFilters)}
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
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-400 text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-lg overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <span>Filter Options</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-white/50 hover:text-white/80 transition-colors"
                      >
                        Reset All
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Domain Filter */}
                  <div>
                    <label className="text-xs text-white/60 mb-3 block font-medium">
                      Domain
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {domainFilters.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => handleDomainChange(domain)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            domainFilter === domain
                              ? "bg-purple-500/20 border-purple-400 text-white"
                              : "border-white/10 text-white/60 hover:border-white/30"
                          }`}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Velric Score Range */}
                  <div>
                    <label className="text-xs text-white/60 mb-3 block font-medium">
                      Velric Score Range: {scoreRange[0].toFixed(1)} - {scoreRange[1].toFixed(1)}
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={0}
                          max={scoreRange[1]}
                          step={0.1}
                          value={scoreRange[0]}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(parseFloat(e.target.value) || 0, scoreRange[1]));
                            setScoreRange([parseFloat(value.toFixed(1)), scoreRange[1]]);
                          }}
                          className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <span className="text-white/40">to</span>
                        <input
                          type="number"
                          min={scoreRange[0]}
                          max={10}
                          step={0.1}
                          value={scoreRange[1]}
                          onChange={(e) => {
                            const value = Math.min(10, Math.max(parseFloat(e.target.value) || 0, scoreRange[0]));
                            setScoreRange([scoreRange[0], parseFloat(value.toFixed(1))]);
                          }}
                          className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={0.1}
                          value={scoreRange[0]}
                          onChange={(e) => {
                            const value = Math.min(parseFloat(e.target.value), scoreRange[1]);
                            setScoreRange([parseFloat(value.toFixed(1)), scoreRange[1]]);
                          }}
                          className="flex-1 accent-cyan-400"
                        />
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={0.1}
                          value={scoreRange[1]}
                          onChange={(e) => {
                            const value = Math.max(parseFloat(e.target.value), scoreRange[0]);
                            setScoreRange([scoreRange[0], parseFloat(value.toFixed(1))]);
                          }}
                          className="flex-1 accent-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Industry Options (Clusters) - Filtered by Domain */}
                  <div>
                    <label className="text-xs text-white/60 mb-3 block font-medium">
                      Specializations {domainFilter !== "All" && `(${domainFilter})`}
                    </label>
                    {availableIndustryOptions.length === 0 ? (
                      <p className="text-xs text-white/40">Select an industry to see specializations</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scroll p-1">
                        {availableIndustryOptions.map((option) => {
                          const isSelected = clusterFilters.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => toggleClusterFilter(option)}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap ${
                                isSelected
                                  ? "bg-cyan-500/20 border-cyan-400 text-white"
                                  : "border-white/10 text-white/60 hover:border-white/30"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - Candidate Grid */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
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
                  return (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-400/30 transition-all hover:scale-[1.02]"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
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
                        <button
                          onClick={() => toggleSaveCandidate(candidate.id)}
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
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-white/60 mb-1">Velric Score (Avg mission score)</p>
                            <p className="text-3xl font-bold text-cyan-300 flex items-baseline gap-1">
                              {candidate.velricScore.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        {/* Schedule Interview Button */}
                        <button
                          onClick={() => {
                            setSelectedCandidate({
                              id: candidate.id,
                              name: candidate.name,
                              email: candidate.email,
                            });
                            setIsScheduleModalOpen(true);
                          }}
                          className="mt-3 w-full px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center justify-center space-x-2"
                          style={{
                            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                          }}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Schedule Interview</span>
                        </button>
                      </div>

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
        </main>

        {/* Schedule Interview Form Modal */}
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
