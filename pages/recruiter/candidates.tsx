import Head from "next/head";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Bookmark, BookmarkCheck, MapPin, Briefcase, GraduationCap, Mail, Linkedin, Github } from "lucide-react";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/router";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";
import { getAllFilterClusters, getClusterById } from "@/lib/skillClusters";
import { Candidate, mockCandidates } from "@/lib/mockCandidates";

// Get all available clusters for filtering
const availableClusters = getAllFilterClusters();

function CandidatesPageContent() {
  const router = useRouter();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    mockCandidates[0].id
  );
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [scoreRange, setScoreRange] = useState<[number, number]>([70, 100]);
  const [clusterFilters, setClusterFilters] = useState<string[]>([]); // Changed from skillFilters

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

      const matchesDomain =
        domainFilter === "All" || candidate.domain === domainFilter;

      const matchesScore =
        candidate.velricScore >= scoreRange[0] &&
        candidate.velricScore <= scoreRange[1];

      // Filter by clusters: candidate must have at least one of the selected clusters
      const matchesClusters =
        clusterFilters.length === 0 ||
        clusterFilters.some(clusterId => 
          candidate.clusters.core_stack.includes(clusterId) ||
          candidate.clusters.domain_tags.includes(clusterId) ||
          candidate.clusters.strength_tags.includes(clusterId)
        );

      return matchesSearch && matchesDomain && matchesScore && matchesClusters;
    });
  }, [domainFilter, scoreRange, searchQuery, clusterFilters]);

  const selectedCandidate = filteredCandidates.find(
    (candidate) => candidate.id === selectedCandidateId
  );

  const toggleClusterFilter = (clusterId: string) => {
    setClusterFilters((prev) =>
      prev.includes(clusterId)
        ? prev.filter((item) => item !== clusterId)
        : [...prev, clusterId]
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
            <p className="text-sm text-white/60">Recruiter • Talent Search</p>
            <h1 className="text-3xl font-bold">Search Candidates</h1>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left: Candidate List */}
          <section className="xl:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <span>Candidate List</span>
              </h2>
              <span className="text-xs text-white/50">
                {filteredCandidates.length} results
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Search by name or skill"
                />
              </div>
              <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70">
                {scoreRange[0]} - {scoreRange[1]}
              </div>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 custom-scroll">
              <AnimatePresence>
                {filteredCandidates.map((candidate) => {
                  const isSelected = candidate.id === selectedCandidateId;
                  const isSaved = savedCandidates.has(candidate.id);
                  return (
                    <motion.button
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-white/30"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{candidate.name}</p>
                          <p className="text-xs text-white/60">
                            {candidate.domain}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/60">Velric Score</p>
                          <p className="text-xl font-bold text-cyan-300">
                            {candidate.velricScore}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>
                          Tech {candidate.subscores.technical}% • Collab{" "}
                          {candidate.subscores.collaboration}%
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveCandidate(candidate.id);
                          }}
                          className={`flex items-center text-xs space-x-1 ${
                            isSaved ? "text-yellow-300" : "text-white/50"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3 h-3" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3 h-3" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Right: Filters + Profile */}
          <section className="xl:col-span-2 space-y-6">
            <motion.div
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-purple-400" />
                  <span>Filters</span>
                </h2>
                <button
                  className="text-xs text-white/50 hover:text-white/80"
                  onClick={() => {
                    setDomainFilter("All");
                    setScoreRange([70, 100]);
                    setClusterFilters([]);
                    setSearchQuery("");
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">
                    Domain
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {domainFilters.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => setDomainFilter(domain)}
                        className={`px-3 py-1 rounded-full text-xs border ${
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

                <div>
                  <label className="text-xs text-white/60 mb-1 block">
                    Velric Score Range
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min={0}
                      max={scoreRange[1]}
                      value={scoreRange[0]}
                      onChange={(e) =>
                        setScoreRange([Number(e.target.value), scoreRange[1]])
                      }
                      className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                    />
                    <input
                      type="range"
                      min={60}
                      max={100}
                      value={scoreRange[0]}
                      onChange={(e) =>
                        setScoreRange([Number(e.target.value), scoreRange[1]])
                      }
                      className="w-full accent-cyan-400"
                    />
                    <input
                      type="range"
                      min={60}
                      max={100}
                      value={scoreRange[1]}
                      onChange={(e) =>
                        setScoreRange([scoreRange[0], Number(e.target.value)])
                      }
                      className="w-full accent-cyan-400"
                    />
                    <input
                      type="number"
                      min={scoreRange[0]}
                      max={100}
                      value={scoreRange[1]}
                      onChange={(e) =>
                        setScoreRange([scoreRange[0], Number(e.target.value)])
                      }
                      className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  Skill Clusters
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scroll">
                  {availableClusters.map((cluster) => {
                    const isSelected = clusterFilters.includes(cluster.id);
                    return (
                      <button
                        key={cluster.id}
                        onClick={() => toggleClusterFilter(cluster.id)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-400 text-white"
                            : "border-white/10 text-white/60 hover:border-white/30"
                        }`}
                        style={isSelected ? { borderColor: cluster.color } : {}}
                        title={cluster.parent ? `Subtopic of ${getClusterById(cluster.parent)?.name}` : 'High-level cluster'}
                      >
                        {cluster.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {selectedCandidate ? (
              <motion.div
                key={selectedCandidate.id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* LinkedIn-style Header Banner */}
                <div className="relative h-48 bg-gradient-to-r from-purple-600/30 to-cyan-600/30">
                  <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 border-4 border-black/50 flex items-center justify-center text-4xl font-bold text-white">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Profile Header Content */}
                <div className="pt-20 px-8 pb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-1">
                        {selectedCandidate.name}
                      </h2>
                      <p className="text-lg text-white/80 mb-2">
                        {selectedCandidate.domain} Developer
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                        {selectedCandidate.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedCandidate.location}</span>
                          </div>
                        )}
                        {selectedCandidate.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{selectedCandidate.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-3">
                        {selectedCandidate.linkedin && (
                          <a
                            href={`https://${selectedCandidate.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                        {selectedCandidate.github && (
                          <a
                            href={`https://${selectedCandidate.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span className="text-sm">GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveCandidate(selectedCandidate.id)}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${
                        savedCandidates.has(selectedCandidate.id)
                          ? "border-yellow-400 text-yellow-300 bg-yellow-400/10"
                          : "border-white/20 text-white/80 hover:border-white/40"
                      }`}
                    >
                      {savedCandidates.has(selectedCandidate.id) ? (
                        <span className="flex items-center space-x-2">
                          <BookmarkCheck className="w-4 h-4" />
                          <span>Saved</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <Bookmark className="w-4 h-4" />
                          <span>Save Candidate</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Content Sections */}
                <div className="px-8 pb-8 space-y-6">
                  {/* Velric Score Section */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Velric Score</p>
                        <p className="text-5xl font-bold text-cyan-300">
                          {selectedCandidate.velricScore}
                        </p>
                        <p className="text-sm text-white/60 mt-1">Top {100 - selectedCandidate.velricScore}% of candidates</p>
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      {Object.entries(selectedCandidate.subscores).map(
                        ([label, value]) => (
                          <div key={label}>
                            <div className="flex items-center justify-between text-sm text-white/80 mb-1 capitalize">
                              <span className="font-medium">{label}</span>
                              <span className="text-cyan-300 font-semibold">{value}%</span>
                            </div>
                            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  {selectedCandidate.about && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-xl font-semibold mb-3">About</h3>
                      <p className="text-white/80 leading-relaxed">
                        {selectedCandidate.about}
                      </p>
                    </div>
                  )}

                  {/* Experience Section */}
                  {selectedCandidate.experience && selectedCandidate.experience.length > 0 && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-purple-400" />
                        <span>Experience</span>
                      </h3>
                      <div className="space-y-6">
                        {selectedCandidate.experience.map((exp, idx) => (
                          <div key={idx} className="border-l-2 border-purple-500/30 pl-4">
                            <h4 className="text-lg font-semibold text-white mb-1">
                              {exp.title}
                            </h4>
                            <p className="text-purple-300 font-medium mb-1">
                              {exp.company}
                            </p>
                            <p className="text-sm text-white/60 mb-2">{exp.duration}</p>
                            <p className="text-white/70 text-sm leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {selectedCandidate.education && selectedCandidate.education.length > 0 && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5 text-cyan-400" />
                        <span>Education</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedCandidate.education.map((edu, idx) => (
                          <div key={idx}>
                            <h4 className="text-lg font-semibold text-white mb-1">
                              {edu.degree}
                            </h4>
                            <p className="text-cyan-300 font-medium mb-1">
                              {edu.school}
                            </p>
                            <p className="text-sm text-white/60">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skill Clusters Section */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4">Core Expertise</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {selectedCandidate.clusters.core_stack.slice(0, 6).map((clusterId) => {
                        const cluster = getClusterById(clusterId);
                        if (!cluster) return null;
                        return (
                          <span
                            key={clusterId}
                            className="px-4 py-2 rounded-full text-sm border text-white font-medium"
                            style={{
                              background: `${cluster.color}20`,
                              borderColor: `${cluster.color}60`,
                            }}
                          >
                            {cluster.name}
                          </span>
                        );
                      })}
                    </div>
                    {selectedCandidate.clusters.domain_tags.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-white/80 mb-2">Domain Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.clusters.domain_tags.map((domainId) => {
                            const cluster = getClusterById(domainId);
                            if (!cluster) return null;
                            return (
                              <span
                                key={domainId}
                                className="px-3 py-1 rounded-full text-xs border text-white/70"
                                style={{
                                  background: `${cluster.color}15`,
                                  borderColor: `${cluster.color}40`,
                                }}
                              >
                                {cluster.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {selectedCandidate.clusters.strength_tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-white/80 mb-2">Key Strengths</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.clusters.strength_tags.slice(0, 4).map((strengthId) => {
                            const cluster = getClusterById(strengthId);
                            if (!cluster) return null;
                            return (
                              <span
                                key={strengthId}
                                className="px-3 py-1 rounded-full text-xs border text-white/70"
                                style={{
                                  background: `${cluster.color}15`,
                                  borderColor: `${cluster.color}40`,
                                }}
                              >
                                {cluster.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Missions/Projects Section */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4">Recent Missions</h3>
                    <div className="space-y-4">
                      {selectedCandidate.missions.map((mission, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/5 border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white">{mission.name}</h4>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                mission.status === "completed"
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                              }`}
                            >
                              {mission.status.replace("-", " ")}
                            </span>
                          </div>
                          {mission.description && (
                            <p className="text-sm text-white/70 mt-2">
                              {mission.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Focus Areas */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold mb-3 text-green-300">Strengths</h3>
                      <ul className="space-y-2">
                        {selectedCandidate.strengths.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-white/80">
                            <span className="text-green-400 mt-1">✓</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-semibold mb-3 text-yellow-300">Focus Areas</h3>
                      <ul className="space-y-2">
                        {selectedCandidate.weaknesses.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-white/80">
                            <span className="text-yellow-400 mt-1">→</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-10 text-center text-white/60 border border-dashed border-white/10 rounded-3xl">
                Select a candidate to view details.
              </div>
            )}
          </section>
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