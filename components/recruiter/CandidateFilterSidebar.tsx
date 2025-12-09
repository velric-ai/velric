import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, MapPin, GraduationCap, Briefcase, Clock, Globe, UserCheck } from "lucide-react";
import { useState } from "react";
import { REGIONS, EDUCATION_LEVELS, REMOTE_WORK_OPTIONS, SPONSORSHIP_OPTIONS } from "@/data/surveyConstants";
import { skillClusters, getHighLevelClusters, getSubtopics } from "@/lib/skillClusters";

interface FilterState {
  // Candidate attributes
  location: string[];
  remoteWork: string[];
  sponsorship: string[];
  citizenship: string[];
  yearsOfExperience: { min: number; max: number };
  educationLevel: string[];
  graduationYear: { min: number; max: number };
  
  // Role attributes
  domain: string[];
  skillClusters: string[]; // Cluster IDs
  seniority: string[];
  availability: string[];
  
  // Existing filters
  velricScore: { min: number; max: number };
}

interface CandidateFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

const SENIORITY_LEVELS = ["Beginner", "Intermediate", "Professional"];
const AVAILABILITY_OPTIONS = ["Immediate", "2 weeks", "1 month", "2+ months"];

export default function CandidateFilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
}: CandidateFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["candidate", "role"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = <K extends keyof FilterState>(
    key: K,
    value: string
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as FilterState[K]);
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

  const highLevelClusters = getHighLevelClusters();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Filters</h2>
                  {getActiveFiltersCount() > 0 && (
                    <p className="text-sm text-cyan-400 mt-1">
                      {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={onReset}
                      className="px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Candidate Attributes Section */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("candidate")}
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-white">Candidate Attributes</span>
                  </div>
                  {expandedSections.has("candidate") ? (
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has("candidate") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-6">
                        {/* Location */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {REGIONS.map((region) => (
                              <button
                                key={region}
                                onClick={() => toggleArrayFilter("location", region)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.location.includes(region)
                                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {region}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Remote / Hybrid / On-site */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Remote Work Preference
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {REMOTE_WORK_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => toggleArrayFilter("remoteWork", option.value)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.remoteWork.includes(option.value)
                                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sponsorship */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Sponsorship Required
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {SPONSORSHIP_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => toggleArrayFilter("sponsorship", option.value)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.sponsorship.includes(option.value)
                                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Citizenship / Work Authorization */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Citizenship / Work Authorization
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {REGIONS.map((region) => (
                              <button
                                key={region}
                                onClick={() => toggleArrayFilter("citizenship", region)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.citizenship.includes(region)
                                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {region}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Years of Experience */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Years of Experience: {filters.yearsOfExperience.min} - {filters.yearsOfExperience.max}
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min={0}
                                max={filters.yearsOfExperience.max}
                                value={filters.yearsOfExperience.min}
                                onChange={(e) =>
                                  updateFilter("yearsOfExperience", {
                                    ...filters.yearsOfExperience,
                                    min: Math.max(0, parseInt(e.target.value) || 0),
                                  })
                                }
                                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                              <span className="text-white/40">to</span>
                              <input
                                type="number"
                                min={filters.yearsOfExperience.min}
                                max={50}
                                value={filters.yearsOfExperience.max}
                                onChange={(e) =>
                                  updateFilter("yearsOfExperience", {
                                    ...filters.yearsOfExperience,
                                    max: Math.min(50, parseInt(e.target.value) || 50),
                                  })
                                }
                                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="range"
                                min={0}
                                max={50}
                                value={filters.yearsOfExperience.min}
                                onChange={(e) =>
                                  updateFilter("yearsOfExperience", {
                                    ...filters.yearsOfExperience,
                                    min: Math.min(parseInt(e.target.value), filters.yearsOfExperience.max),
                                  })
                                }
                                className="flex-1 accent-cyan-400"
                              />
                              <input
                                type="range"
                                min={0}
                                max={50}
                                value={filters.yearsOfExperience.max}
                                onChange={(e) =>
                                  updateFilter("yearsOfExperience", {
                                    ...filters.yearsOfExperience,
                                    max: Math.max(parseInt(e.target.value), filters.yearsOfExperience.min),
                                  })
                                }
                                className="flex-1 accent-cyan-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Education Level */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Education Level
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {EDUCATION_LEVELS.map((level) => (
                              <button
                                key={level}
                                onClick={() => toggleArrayFilter("educationLevel", level)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.educationLevel.includes(level)
                                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Graduation Year */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Graduation Year: {filters.graduationYear.min} - {filters.graduationYear.max}
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min={2000}
                                max={filters.graduationYear.max}
                                value={filters.graduationYear.min}
                                onChange={(e) =>
                                  updateFilter("graduationYear", {
                                    ...filters.graduationYear,
                                    min: Math.max(2000, parseInt(e.target.value) || 2000),
                                  })
                                }
                                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                              <span className="text-white/40">to</span>
                              <input
                                type="number"
                                min={filters.graduationYear.min}
                                max={new Date().getFullYear() + 5}
                                value={filters.graduationYear.max}
                                onChange={(e) =>
                                  updateFilter("graduationYear", {
                                    ...filters.graduationYear,
                                    max: Math.min(new Date().getFullYear() + 5, parseInt(e.target.value) || new Date().getFullYear()),
                                  })
                                }
                                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Role Attributes Section */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("role")}
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-white">Role Attributes</span>
                  </div>
                  {expandedSections.has("role") ? (
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has("role") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-6">
                        {/* Domain */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Domain
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["All", "Technology & Software", "Finance & Banking", "Product Management", "Healthcare & Medical", "Marketing & Advertising", "Education & Learning", "Design & Creative", "E-commerce & Retail", "Data Science & Analytics", "Startup Founder", "Other"].map((domain) => (
                              <button
                                key={domain}
                                onClick={() => {
                                  if (domain === "All") {
                                    updateFilter("domain", []);
                                  } else {
                                    toggleArrayFilter("domain", domain);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.domain.includes(domain) || (domain === "All" && filters.domain.length === 0)
                                    ? "bg-purple-500/20 border-purple-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {domain}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Skill Clusters */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Skills (by Cluster)
                          </label>
                          <div className="space-y-4 max-h-96 overflow-y-auto custom-scroll">
                            {highLevelClusters.map((cluster) => {
                              const subtopics = getSubtopics(cluster.id);
                              const isExpanded = expandedSections.has(`cluster-${cluster.id}`);
                              const hasSelectedSubtopics = subtopics.some((sub) =>
                                filters.skillClusters.includes(sub.id)
                              );
                              const isClusterSelected = filters.skillClusters.includes(cluster.id);

                              return (
                                <div key={cluster.id} className="border border-white/10 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => {
                                      if (subtopics.length > 0) {
                                        toggleSection(`cluster-${cluster.id}`);
                                      } else {
                                        toggleArrayFilter("skillClusters", cluster.id);
                                      }
                                    }}
                                    className={`w-full px-3 py-2 flex items-center justify-between transition-colors ${
                                      isClusterSelected || hasSelectedSubtopics
                                        ? "bg-cyan-500/10"
                                        : "bg-white/5 hover:bg-white/10"
                                    }`}
                                  >
                                    <span className={`text-sm font-medium ${
                                      isClusterSelected || hasSelectedSubtopics
                                        ? "text-cyan-400"
                                        : "text-white/80"
                                    }`}>
                                      {cluster.name}
                                    </span>
                                    {subtopics.length > 0 && (
                                      isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-white/60" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-white/60" />
                                      )
                                    )}
                                  </button>
                                  {subtopics.length > 0 && isExpanded && (
                                    <div className="p-2 space-y-1 bg-white/5">
                                      {subtopics.map((subtopic) => (
                                        <button
                                          key={subtopic.id}
                                          onClick={() => toggleArrayFilter("skillClusters", subtopic.id)}
                                          className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                                            filters.skillClusters.includes(subtopic.id)
                                              ? "bg-cyan-500/20 text-cyan-400"
                                              : "text-white/60 hover:text-white hover:bg-white/5"
                                          }`}
                                        >
                                          {subtopic.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Seniority */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Seniority
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {SENIORITY_LEVELS.map((level) => (
                              <button
                                key={level}
                                onClick={() => toggleArrayFilter("seniority", level)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.seniority.includes(level)
                                    ? "bg-purple-500/20 border-purple-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Availability */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Availability
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {AVAILABILITY_OPTIONS.map((option) => (
                              <button
                                key={option}
                                onClick={() => toggleArrayFilter("availability", option)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                  filters.availability.includes(option)
                                    ? "bg-purple-500/20 border-purple-400 text-white"
                                    : "border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Velric Score */}
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-3">
                            Velric Score: {filters.velricScore.min.toFixed(1)} - {filters.velricScore.max.toFixed(1)}
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min={0}
                                max={filters.velricScore.max}
                                step={0.1}
                                value={filters.velricScore.min}
                                onChange={(e) =>
                                  updateFilter("velricScore", {
                                    ...filters.velricScore,
                                    min: Math.max(0, Math.min(parseFloat(e.target.value) || 0, filters.velricScore.max)),
                                  })
                                }
                                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="text-white/40">to</span>
                              <input
                                type="number"
                                min={filters.velricScore.min}
                                max={10}
                                step={0.1}
                                value={filters.velricScore.max}
                                onChange={(e) =>
                                  updateFilter("velricScore", {
                                    ...filters.velricScore,
                                    max: Math.min(10, Math.max(parseFloat(e.target.value) || 10, filters.velricScore.min)),
                                  })
                                }
                                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="range"
                                min={0}
                                max={10}
                                step={0.1}
                                value={filters.velricScore.min}
                                onChange={(e) =>
                                  updateFilter("velricScore", {
                                    ...filters.velricScore,
                                    min: Math.min(parseFloat(e.target.value), filters.velricScore.max),
                                  })
                                }
                                className="flex-1 accent-purple-400"
                              />
                              <input
                                type="range"
                                min={0}
                                max={10}
                                step={0.1}
                                value={filters.velricScore.max}
                                onChange={(e) =>
                                  updateFilter("velricScore", {
                                    ...filters.velricScore,
                                    max: Math.max(parseFloat(e.target.value), filters.velricScore.min),
                                  })
                                }
                                className="flex-1 accent-purple-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

