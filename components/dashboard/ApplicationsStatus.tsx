import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  ExternalLink
} from "lucide-react";

interface ApplicationsStatusProps {
  user: any;
}

export default function ApplicationsStatus({ user }: ApplicationsStatusProps) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock applications data
  const applications = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Senior Frontend Developer",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      appliedDate: "2024-01-15",
      status: "interview",
      statusText: "Interview Scheduled",
      nextStep: "Technical Interview on Jan 25",
      logo: "https://via.placeholder.com/40x40/6366f1/ffffff?text=TC"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Engineer",
      location: "Remote",
      salary: "$100k - $130k",
      appliedDate: "2024-01-12",
      status: "pending",
      statusText: "Application Under Review",
      nextStep: "Waiting for initial screening",
      logo: "https://via.placeholder.com/40x40/8b5cf6/ffffff?text=SX"
    },
    {
      id: 3,
      company: "BigTech Solutions",
      position: "React Developer",
      location: "New York, NY",
      salary: "$110k - $140k",
      appliedDate: "2024-01-10",
      status: "accepted",
      statusText: "Offer Received",
      nextStep: "Review offer details",
      logo: "https://via.placeholder.com/40x40/10b981/ffffff?text=BT"
    },
    {
      id: 4,
      company: "InnovateLab",
      position: "Frontend Specialist",
      location: "Austin, TX",
      salary: "$95k - $120k",
      appliedDate: "2024-01-08",
      status: "rejected",
      statusText: "Not Selected",
      nextStep: "Application closed",
      logo: "https://via.placeholder.com/40x40/ef4444/ffffff?text=IL"
    },
    {
      id: 5,
      company: "DevStudio",
      position: "UI/UX Developer",
      location: "Seattle, WA",
      salary: "$105k - $135k",
      appliedDate: "2024-01-05",
      status: "pending",
      statusText: "Application Submitted",
      nextStep: "Waiting for response",
      logo: "https://via.placeholder.com/40x40/f59e0b/ffffff?text=DS"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "interview":
        return <Eye className="w-5 h-5 text-blue-400" />;
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "interview":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    interview: applications.filter(app => app.status === "interview").length,
    accepted: applications.filter(app => app.status === "accepted").length,
    rejected: applications.filter(app => app.status === "rejected").length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Application Status</h2>
        <p className="text-white/70">Track your job applications and their progress</p>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-white/60">Total</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-yellow-500/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-white/60">Pending</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-blue-500/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.interview}</div>
          <div className="text-sm text-white/60">Interview</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-green-500/20 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.accepted}</div>
          <div className="text-sm text-white/60">Accepted</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-red-500/20 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
          <div className="text-sm text-white/60">Rejected</div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1C1C1E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="Search applications..."
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-12 pr-8 py-3 bg-[#1C1C1E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors appearance-none cursor-pointer"
            title="Filter applications"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredApplications.length === 0 ? (
          <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-white/10 text-center">
            <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Applications Found</h3>
            <p className="text-white/60">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "You haven't submitted any applications yet"
              }
            </p>
          </div>
        ) : (
          filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Company Logo */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {application.company.charAt(0)}
                  </div>

                  {/* Application Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{application.position}</h3>
                        <p className="text-purple-400 font-medium">{application.company}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.statusText}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{application.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        {getStatusIcon(application.status)}
                        <span className="text-white/80">{application.nextStep}</span>
                      </div>
                      <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm">
                        <span>View Details</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}