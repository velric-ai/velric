import Head from "next/head";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Bookmark, BookmarkCheck, MapPin, Mail, Linkedin, Github, X, SlidersHorizontal } from "lucide-react";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/router";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";
import { getClusterById } from "@/lib/skillClusters";
import { Candidate, mockCandidates } from "@/lib/mockCandidates";
import { getIndustryOptions } from "@/utils/surveyValidation";

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
const candidateDomainToIndustry: Record<string, string> = {
  "Frontend": "Technology & Software",
  "Backend": "Technology & Software",
  "Data": "Data Science & Analytics",
  "Marketing": "Marketing & Advertising",
  "Finance": "Finance & Banking",
  "General": "Other",
};

// Check if a candidate matches an industry option
function candidateMatchesIndustryOption(candidate: Candidate, industryOption: string): boolean {
  const optionLower = industryOption.toLowerCase();
  
  // Check if candidate's skills match
  const skillsMatch = candidate.skills.some(skill => {
    const skillLower = skill.toLowerCase();
    return optionLower.includes(skillLower) || skillLower.includes(optionLower);
  });
  
  // Check if candidate's clusters match
  const clustersMatch = candidate.clusters.core_stack.some(clusterId => {
    const cluster = getClusterById(clusterId);
    if (!cluster) return false;
    const clusterNameLower = cluster.name.toLowerCase();
    // Check if cluster name appears in option or vice versa
    if (optionLower.includes(clusterNameLower) || clusterNameLower.includes(optionLower)) {
      return true;
    }
    // Check if any cluster keyword matches
    return cluster.keywords.some(keyword => 
      optionLower.includes(keyword.toLowerCase()) || 
      keyword.toLowerCase().includes(optionLower)
    );
  });
  
  // Check domain tags and strength tags
  const tagsMatch = [
    ...candidate.clusters.domain_tags,
    ...candidate.clusters.strength_tags
  ].some(tagId => {
    const cluster = getClusterById(tagId);
    if (!cluster) return false;
    const clusterNameLower = cluster.name.toLowerCase();
    return optionLower.includes(clusterNameLower) || clusterNameLower.includes(optionLower);
  });
  
  // Direct keyword matching for specific options
  const keywordMatches = [
    // Technology options
    (optionLower.includes('frontend') || optionLower.includes('react') || optionLower.includes('vue') || optionLower.includes('angular')) && 
      (candidate.domain === 'Frontend' || candidate.skills.some(s => ['react', 'vue', 'angular', 'typescript', 'javascript'].some(tech => s.toLowerCase().includes(tech)))),
    (optionLower.includes('backend') || optionLower.includes('node') || optionLower.includes('python') || optionLower.includes('java')) && 
      (candidate.domain === 'Backend' || candidate.skills.some(s => ['node', 'python', 'java', 'postgresql', 'api'].some(tech => s.toLowerCase().includes(tech)))),
    optionLower.includes('full stack') && (candidate.skills.length > 5 || (candidate.domain === 'Frontend' || candidate.domain === 'Backend')),
    (optionLower.includes('ai') || optionLower.includes('machine learning')) && 
      candidate.skills.some(s => ['ai', 'ml', 'tensorflow', 'pytorch', 'neural', 'deep learning'].some(tech => s.toLowerCase().includes(tech))),
    optionLower.includes('devops') && candidate.skills.some(s => ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform'].some(tech => s.toLowerCase().includes(tech))),
    optionLower.includes('mobile') && candidate.skills.some(s => ['react native', 'swift', 'kotlin', 'flutter', 'ios', 'android'].some(tech => s.toLowerCase().includes(tech))),
    // Data options
    optionLower.includes('data engineering') && (candidate.domain === 'Data' || candidate.skills.some(s => ['airflow', 'dbt', 'etl', 'pipeline'].some(tech => s.toLowerCase().includes(tech)))),
    (optionLower.includes('data analytics') || optionLower.includes('business analytics')) && 
      (candidate.domain === 'Data' || candidate.skills.some(s => ['sql', 'tableau', 'analytics', 'pandas'].some(tech => s.toLowerCase().includes(tech)))),
    // Finance options
    optionLower.includes('investment banking') && (candidate.domain === 'Finance' || candidate.skills.some(s => ['investment', 'banking', 'm&a', 'capital'].some(tech => s.toLowerCase().includes(tech)))),
    optionLower.includes('quantitative') && (candidate.domain === 'Finance' || candidate.skills.some(s => ['quant', 'quantitative', 'trading', 'risk'].some(tech => s.toLowerCase().includes(tech)))),
    // Marketing options
    (optionLower.includes('growth marketing') || optionLower.includes('growth')) && 
      (candidate.domain === 'Marketing' || candidate.skills.some(s => ['growth', 'marketing', 'acquisition'].some(tech => s.toLowerCase().includes(tech)))),
    (optionLower.includes('content marketing') || optionLower.includes('content strategy')) && 
      (candidate.domain === 'Marketing' || candidate.skills.some(s => ['content', 'strategy', 'marketing'].some(tech => s.toLowerCase().includes(tech)))),
    optionLower.includes('social media') && 
      (candidate.domain === 'Marketing' || candidate.skills.some(s => ['social', 'media', 'ugc'].some(tech => s.toLowerCase().includes(tech)))),
  ].some(Boolean);
  
  return skillsMatch || clustersMatch || tagsMatch || keywordMatches;
}

function CandidatesPageContent() {
  const router = useRouter();
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [scoreRange, setScoreRange] = useState<[number, number]>([70, 100]);
  const [clusterFilters, setClusterFilters] = useState<string[]>([]); // Now stores industry option strings
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        candidate.clusters.core_stack.some(clusterId => {
          const cluster = getClusterById(clusterId);
          return cluster?.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

      // Match domain: if industry is selected, check if candidate's domain maps to that industry
      const matchesDomain =
        domainFilter === "All" || 
        candidateDomainToIndustry[candidate.domain] === domainFilter ||
        candidate.domain === domainFilter;

      const matchesScore =
        candidate.velricScore >= scoreRange[0] &&
        candidate.velricScore <= scoreRange[1];

      // Filter by industry options (clusters): candidate must match at least one selected option
      const matchesClusters =
        clusterFilters.length === 0 ||
        clusterFilters.some(option => candidateMatchesIndustryOption(candidate, option));

      return matchesSearch && matchesDomain && matchesScore && matchesClusters;
    });
  }, [domainFilter, scoreRange, searchQuery, clusterFilters]);

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
    setScoreRange([70, 100]);
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
    (scoreRange[0] !== 70 || scoreRange[1] !== 100 ? 1 : 0) +
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
                      Velric Score Range: {scoreRange[0]} - {scoreRange[1]}
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={0}
                          max={scoreRange[1]}
                          value={scoreRange[0]}
                          onChange={(e) =>
                            setScoreRange([Number(e.target.value), scoreRange[1]])
                          }
                          className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <span className="text-white/40">to</span>
                        <input
                          type="number"
                          min={scoreRange[0]}
                          max={100}
                          value={scoreRange[1]}
                          onChange={(e) =>
                            setScoreRange([scoreRange[0], Number(e.target.value)])
                          }
                          className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={scoreRange[0]}
                          onChange={(e) =>
                            setScoreRange([Number(e.target.value), scoreRange[1]])
                          }
                          className="flex-1 accent-cyan-400"
                        />
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={scoreRange[1]}
                          onChange={(e) =>
                            setScoreRange([scoreRange[0], Number(e.target.value)])
                          }
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
                            <p className="text-xs text-white/60 mb-1">Velric Score</p>
                            <p className="text-3xl font-bold text-cyan-300">
                              {candidate.velricScore}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/60">Subscores</p>
                            <p className="text-sm text-white/80">
                              Tech: {candidate.subscores.technical}%
                            </p>
                            <p className="text-sm text-white/80">
                              Collab: {candidate.subscores.collaboration}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Core Clusters */}
                      <div className="mb-4">
                        <p className="text-xs text-white/60 mb-2">Core Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.clusters.core_stack.slice(0, 4).map((clusterId) => {
                            const cluster = getClusterById(clusterId);
                            if (!cluster) return null;
                            return (
                              <span
                                key={clusterId}
                                className="px-2 py-1 rounded-lg text-xs border"
                                style={{
                                  background: `${cluster.color}20`,
                                  borderColor: `${cluster.color}60`,
                                }}
                              >
                                {cluster.name}
                              </span>
                            );
                          })}
                          {candidate.clusters.core_stack.length > 4 && (
                            <span className="px-2 py-1 rounded-lg text-xs text-white/60 border border-white/10">
                              +{candidate.clusters.core_stack.length - 4}
                            </span>
                          )}
                        </div>
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
