import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  MessageCircle, 
  Send, 
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface SupportHelpProps {
  user: any;
}

export default function SupportHelp({ user }: SupportHelpProps) {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: "How is my Velric Score calculated?",
      answer: "Your Velric Score is calculated based on multiple factors including mission completion rates, code quality, problem-solving approach, time efficiency, and peer feedback. Our AI analyzes your submissions against industry standards and best practices.",
      category: "scoring"
    },
    {
      id: 2,
      question: "Can I retake a mission to improve my score?",
      answer: "Yes! You can retake most missions to improve your score. However, there's a 48-hour cooldown period between attempts, and your highest score will be recorded.",
      category: "missions"
    },
    {
      id: 3,
      question: "How do companies view my Velric profile?",
      answer: "Companies can see your Velric Score, completed missions, skill assessments, and portfolio projects. They cannot see your personal information unless you choose to share it during the application process.",
      category: "privacy"
    },
    {
      id: 4,
      question: "What happens if I don't complete a mission on time?",
      answer: "Missions have flexible deadlines. If you don't complete within the suggested timeframe, you can still submit, but it may affect your time efficiency score component.",
      category: "missions"
    },
    {
      id: 5,
      question: "How do I update my skills and preferences?",
      answer: "Go to your Profile section in the dashboard. You can add/remove skills, update your experience level, and set job preferences. This helps us recommend relevant missions and opportunities.",
      category: "profile"
    },
    {
      id: 6,
      question: "Is my code and data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and security measures. Your code submissions are analyzed by our AI and then securely stored. We never share your code with third parties without explicit consent.",
      category: "privacy"
    },
    {
      id: 7,
      question: "How do I get notified about new opportunities?",
      answer: "You'll receive notifications through the dashboard, email, and optionally SMS. You can customize notification preferences in your account settings.",
      category: "notifications"
    },
    {
      id: 8,
      question: "Can I work on missions as a team?",
      answer: "Currently, missions are individual assessments. However, we're developing collaborative missions for team-based evaluations. Stay tuned for updates!",
      category: "missions"
    }
  ];

  // Help Resources
  const helpResources = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new users",
      type: "guide",
      icon: Book,
      link: "#"
    },
    {
      title: "Mission Tutorial Videos",
      description: "Video guides for different mission types",
      type: "video",
      icon: Video,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      type: "docs",
      icon: FileText,
      link: "#"
    },
    {
      title: "Best Practices",
      description: "Tips to improve your Velric Score",
      type: "guide",
      icon: Book,
      link: "#"
    }
  ];

  // Support Categories
  const supportCategories = [
    { value: "technical", label: "Technical Issue" },
    { value: "account", label: "Account & Billing" },
    { value: "missions", label: "Mission Help" },
    { value: "scoring", label: "Scoring Questions" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other" }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.subject || !supportForm.message || !supportForm.category) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setSupportForm({
        subject: "",
        category: "",
        message: "",
        priority: "medium"
      });
      
      alert("Support ticket submitted successfully! We'll get back to you within 24 hours.");
    } catch (error) {
      console.error("Error submitting support ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Support & Help</h2>
        <p className="text-white/70">Get help, find answers, and contact our support team</p>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-green-500/20 text-center">
          <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-lg font-semibold text-white">&lt; 2 hours</div>
          <div className="text-sm text-white/60">Average Response Time</div>
        </div>
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-blue-500/20 text-center">
          <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-lg font-semibold text-white">98%</div>
          <div className="text-sm text-white/60">Issue Resolution Rate</div>
        </div>
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-purple-500/20 text-center">
          <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-lg font-semibold text-white">24/7</div>
          <div className="text-sm text-white/60">Support Availability</div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[#1C1C1E] p-1 rounded-lg">
        {[
          { id: "faq", label: "FAQ", icon: HelpCircle },
          { id: "resources", label: "Resources", icon: Book },
          { id: "contact", label: "Contact Support", icon: MessageCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1C1C1E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Search frequently asked questions..."
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-[#1C1C1E] rounded-2xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <motion.a
                    key={index}
                    href={resource.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-3">{resource.description}</p>
                        <div className="flex items-center text-purple-400 text-sm">
                          <span>Learn more</span>
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Contact Options */}
            <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Need More Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Email Support</div>
                    <div className="text-sm text-white/60">support@velric.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">Live Chat</div>
                    <div className="text-sm text-white/60">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Support Tab */}
        {activeTab === "contact" && (
          <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Contact Support</h3>
            <form onSubmit={handleSupportSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={supportForm.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <select
                    name="category"
                    value={supportForm.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {supportCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Priority</label>
                <select
                  name="priority"
                  value={supportForm.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="low">Low - General question</option>
                  <option value="medium">Medium - Issue affecting usage</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <textarea
                  name="message"
                  value={supportForm.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-3 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}