import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";

interface DocumentsManagerProps {
  user: any;
}

export default function DocumentsManager({ user }: DocumentsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: "Resume_2024.pdf",
      type: "resume",
      size: "245 KB",
      uploadDate: "2024-01-15",
      status: "approved",
      statusText: "Approved",
      description: "Updated resume with latest experience"
    },
    {
      id: 2,
      name: "Cover_Letter_TechCorp.pdf",
      type: "cover_letter",
      size: "128 KB",
      uploadDate: "2024-01-14",
      status: "pending",
      statusText: "Under Review",
      description: "Cover letter for TechCorp application"
    },
    {
      id: 3,
      name: "Portfolio_Screenshots.zip",
      type: "portfolio",
      size: "2.1 MB",
      uploadDate: "2024-01-12",
      status: "approved",
      statusText: "Approved",
      description: "Screenshots of recent projects"
    },
    {
      id: 4,
      name: "Certification_React.pdf",
      type: "certificate",
      size: "512 KB",
      uploadDate: "2024-01-10",
      status: "approved",
      statusText: "Approved",
      description: "React Developer Certification"
    },
    {
      id: 5,
      name: "Transcript_University.pdf",
      type: "transcript",
      size: "890 KB",
      uploadDate: "2024-01-08",
      status: "rejected",
      statusText: "Needs Update",
      description: "University transcript - requires official seal"
    }
  ];

  const documentTypes = [
    { id: "resume", label: "Resume", required: true },
    { id: "cover_letter", label: "Cover Letter", required: false },
    { id: "portfolio", label: "Portfolio", required: false },
    { id: "certificate", label: "Certificates", required: false },
    { id: "transcript", label: "Transcripts", required: false },
    { id: "other", label: "Other", required: false }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    return <FileText className="w-8 h-8 text-purple-400" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === "all" || doc.type === filter || doc.status === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would upload to server
      console.log("Files uploaded:", files);
      
      // Reset input
      event.target.value = '';
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (document: any) => {
    // In real app, this would download the actual file
    console.log("Downloading:", document.name);
  };

  const handleDelete = (documentId: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      // In real app, this would delete from server
      console.log("Deleting document:", documentId);
    }
  };

  const stats = {
    total: documents.length,
    approved: documents.filter(doc => doc.status === "approved").length,
    pending: documents.filter(doc => doc.status === "pending").length,
    rejected: documents.filter(doc => doc.status === "rejected").length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Documents</h2>
          <p className="text-white/70">Manage your application documents and certificates</p>
        </div>
        <div className="relative">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
            title="Upload documents"
            aria-label="Upload documents"
          />
          <button
            disabled={isUploading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Documents'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-white/60">Total Documents</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-green-500/20 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
          <div className="text-sm text-white/60">Approved</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-yellow-500/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-white/60">Under Review</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-red-500/20 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
          <div className="text-sm text-white/60">Needs Update</div>
        </div>
      </motion.div>

      {/* Document Types Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4">Document Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {documentTypes.map((type) => {
            const typeCount = documents.filter(doc => doc.type === type.id).length;
            return (
              <div
                key={type.id}
                className="bg-[#1C1C1E] p-4 rounded-xl border border-white/10 text-center hover:border-purple-500/30 transition-colors cursor-pointer"
                onClick={() => setFilter(type.id)}
              >
                <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">{type.label}</div>
                <div className="text-xs text-white/60">{typeCount} files</div>
                {type.required && (
                  <div className="text-xs text-red-400 mt-1">Required</div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1C1C1E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="Search documents..."
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-12 pr-8 py-3 bg-[#1C1C1E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors appearance-none cursor-pointer"
            title="Filter documents"
          >
            <option value="all">All Documents</option>
            <option value="approved">Approved</option>
            <option value="pending">Under Review</option>
            <option value="rejected">Needs Update</option>
            <optgroup label="Document Types">
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </motion.div>

      {/* Documents List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {filteredDocuments.length === 0 ? (
          <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-white/10 text-center">
            <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Documents Found</h3>
            <p className="text-white/60 mb-4">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Upload your first document to get started"
              }
            </p>
            <div className="relative inline-block">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                title="Upload first document"
                aria-label="Upload first document"
              />
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>
        ) : (
          filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    {getTypeIcon(document.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-white">{document.name}</h3>
                      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(document.status)}`}>
                        {document.statusText}
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/60 mb-2">{document.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-white/50">
                      <span>Size: {document.size}</span>
                      <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                      <span className="capitalize">Type: {document.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(document)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}