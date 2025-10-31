import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  Circle,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward
} from "lucide-react";

interface MessagesCenterProps {
  user: any;
}

export default function MessagesCenter({ user }: MessagesCenterProps) {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");

  // Mock messages data
  const messages = [
    {
      id: 1,
      from: "TechCorp HR",
      fromEmail: "hr@techcorp.com",
      subject: "Interview Invitation - Senior Frontend Developer",
      preview: "We're excited to invite you for an interview for the Senior Frontend Developer position...",
      content: "Dear [name],\n\nWe're excited to invite you for an interview for the Senior Frontend Developer position at TechCorp. Based on your application and impressive portfolio, we believe you would be a great fit for our team.\n\nInterview Details:\n- Date: January 25, 2024\n- Time: 2:00 PM PST\n- Format: Video call (Zoom link will be provided)\n- Duration: 1 hour\n\nPlease confirm your availability by replying to this message.\n\nBest regards,\nTechCorp HR Team",
      timestamp: "2024-01-20T10:30:00Z",
      read: false,
      starred: true,
      type: "interview",
      priority: "high"
    },
    {
      id: 2,
      from: "Velric Support",
      fromEmail: "support@velric.com",
      subject: "Your Velric Score has been updated",
      preview: "Congratulations! Your Velric Score has increased to 847 based on your recent mission completion...",
      content: "Hello [name],\n\nCongratulations! Your Velric Score has been updated to 847 based on your recent mission completion.\n\nRecent Activity:\n- React Dashboard Component: 92/100\n- API Integration Project: 89/100\n- UI/UX Design Challenge: 85/100\n\nYour improved score makes you eligible for premium job opportunities. Check out the latest openings in your dashboard.\n\nKeep up the excellent work!\n\nBest,\nVelric Team",
      timestamp: "2024-01-19T15:45:00Z",
      read: true,
      starred: false,
      type: "system",
      priority: "medium"
    },
    {
      id: 3,
      from: "StartupXYZ",
      fromEmail: "jobs@startupxyz.com",
      subject: "Application Status Update",
      preview: "Thank you for your interest in the Full Stack Engineer position. We're currently reviewing...",
      content: "Dear [name],\n\nThank you for your interest in the Full Stack Engineer position at StartupXYZ.\n\nWe're currently reviewing all applications and will be in touch within the next week with next steps. Your application is progressing well through our initial screening process.\n\nIn the meantime, feel free to check out our company blog to learn more about our culture and recent projects.\n\nBest regards,\nStartupXYZ Hiring Team",
      timestamp: "2024-01-18T09:15:00Z",
      read: true,
      starred: false,
      type: "application",
      priority: "medium"
    },
    {
      id: 4,
      from: "BigTech Solutions",
      fromEmail: "careers@bigtech.com",
      subject: "Offer Letter - React Developer Position",
      preview: "We're pleased to extend an offer for the React Developer position at BigTech Solutions...",
      content: "Dear [name],\n\nWe're pleased to extend an offer for the React Developer position at BigTech Solutions.\n\nOffer Details:\n- Position: React Developer\n- Salary: $125,000 annually\n- Start Date: February 15, 2024\n- Benefits: Health, dental, vision insurance, 401k matching, unlimited PTO\n- Location: New York, NY (Hybrid - 3 days in office)\n\nPlease review the attached offer letter and let us know your decision by January 30, 2024.\n\nWe're excited about the possibility of you joining our team!\n\nBest regards,\nBigTech HR Team",
      timestamp: "2024-01-17T14:20:00Z",
      read: false,
      starred: true,
      type: "offer",
      priority: "high"
    },
    {
      id: 5,
      from: "DevStudio",
      fromEmail: "hello@devstudio.com",
      subject: "Mission Collaboration Opportunity",
      preview: "We noticed your excellent work on recent Velric missions and would like to discuss...",
      content: "Hi [name],\n\nWe noticed your excellent work on recent Velric missions, particularly your React Dashboard Component project.\n\nWe're working on a similar project and would love to discuss a potential collaboration opportunity. This could be a great way to showcase your skills while working on real-world projects.\n\nWould you be interested in a brief call to discuss this further?\n\nBest,\nDevStudio Team",
      timestamp: "2024-01-16T11:30:00Z",
      read: true,
      starred: false,
      type: "opportunity",
      priority: "medium"
    }
  ];

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "interview":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "offer":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "system":
        return <Star className="w-4 h-4 text-purple-400" />;
      case "application":
        return <MessageSquare className="w-4 h-4 text-yellow-400" />;
      case "opportunity":
        return <Star className="w-4 h-4 text-orange-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !message.read) ||
                         (filter === "starred" && message.starred) ||
                         message.type === filter;
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    // In real app, this would send the reply
    console.log("Sending reply:", replyText);
    setReplyText("");
  };

  const toggleStar = (messageId: number) => {
    // In real app, this would update the message on server
    console.log("Toggling star for message:", messageId);
  };

  const markAsRead = (messageId: number) => {
    // In real app, this would update the message on server
    console.log("Marking as read:", messageId);
  };

  const stats = {
    total: messages.length,
    unread: messages.filter(msg => !msg.read).length,
    starred: messages.filter(msg => msg.starred).length,
    high_priority: messages.filter(msg => msg.priority === "high").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Messages & Notifications</h2>
        <p className="text-white/70">Stay updated with your applications and opportunities</p>
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
          <div className="text-sm text-white/60">Total Messages</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-blue-500/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.unread}</div>
          <div className="text-sm text-white/60">Unread</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-yellow-500/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.starred}</div>
          <div className="text-sm text-white/60">Starred</div>
        </div>
        <div className="bg-[#1C1C1E] p-4 rounded-xl border border-red-500/20 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.high_priority}</div>
          <div className="text-sm text-white/60">High Priority</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-[#1C1C1E] rounded-2xl border border-white/10 overflow-hidden">
          {/* Search and Filter */}
          <div className="p-4 border-b border-white/10">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm"
                placeholder="Search messages..."
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm"
              title="Filter messages"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
              <option value="interview">Interviews</option>
              <option value="offer">Offers</option>
              <option value="application">Applications</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Messages List */}
          <div className="overflow-y-auto h-full">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) markAsRead(message.id);
                }}
                className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors border-l-4 ${getPriorityColor(message.priority)} ${
                  selectedMessage?.id === message.id ? 'bg-purple-500/10' : ''
                } ${!message.read ? 'bg-blue-500/5' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getMessageIcon(message.type)}
                    <span className={`text-sm font-medium ${!message.read ? 'text-white' : 'text-white/80'}`}>
                      {message.from}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                      className="text-white/40 hover:text-yellow-400 transition-colors"
                      title={message.starred ? "Remove from starred" : "Add to starred"}
                    >
                      <Star className={`w-4 h-4 ${message.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                    <span className="text-xs text-white/50">{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
                <h3 className={`text-sm mb-1 ${!message.read ? 'font-semibold text-white' : 'text-white/80'}`}>
                  {message.subject}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2">{message.preview}</p>
                {!message.read && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 bg-[#1C1C1E] rounded-2xl border border-white/10 overflow-hidden">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">{selectedMessage.subject}</h2>
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span>From: {selectedMessage.from}</span>
                      <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Reply">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Forward">
                      <Forward className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Archive">
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-white/80 font-sans text-sm leading-relaxed">
                    {selectedMessage.content.replace(/\[name\]/g, user?.name || 'User')}
                  </pre>
                </div>
              </div>

              {/* Reply Section */}
              <div className="p-6 border-t border-white/10">
                <div className="flex space-x-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a Message</h3>
                <p className="text-white/60">Choose a message from the list to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}