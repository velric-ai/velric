import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, TrendingUp, User, Briefcase, ChevronRight, Star, Clock } from 'lucide-react';
import { faqData, FAQItem, FAQCategory } from '../data/faqData';
import Navbar from '@/components/Navbar';

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('About Velric');
  const [selectedQuestion, setSelectedQuestion] = useState<FAQItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  const [viewedQuestions, setViewedQuestions] = useState<number[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Category configuration
  const categories = [
    {
      name: 'About Velric' as FAQCategory,
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'Learn what Velric is and who it\'s for',
      count: faqData.filter(item => item.category === 'About Velric').length
    },
    {
      name: 'Velric Score' as FAQCategory,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'Understand how scoring works',
      count: faqData.filter(item => item.category === 'Velric Score').length
    },
    {
      name: 'For Candidates' as FAQCategory,
      icon: User,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      description: 'Tips for showcasing your skills',
      count: faqData.filter(item => item.category === 'For Candidates').length
    },
    {
      name: 'For Companies' as FAQCategory,
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      description: 'How to hire top talent',
      count: faqData.filter(item => item.category === 'For Companies').length
    }
  ];

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = faqData.filter(item =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Get current category's questions
  const currentQuestions = useMemo(() => 
    faqData.filter(item => item.category === selectedCategory),
    [selectedCategory]
  );

  // Auto-select first question when category changes
  useEffect(() => {
    if (currentQuestions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(currentQuestions[0]);
    }
  }, [currentQuestions, selectedQuestion]);

  // Handle question selection
  const handleQuestionSelect = (question: FAQItem) => {
    setSelectedQuestion(question);
    if (!viewedQuestions.includes(question.id)) {
      setViewedQuestions(prev => [...prev, question.id]);
    }
    // Update URL
    window.history.pushState(null, '', `#${question.slug}`);
  };

  // Handle category selection
  const handleCategorySelect = (category: FAQCategory) => {
    setSelectedCategory(category);
    const categoryQuestions = faqData.filter(item => item.category === category);
    if (categoryQuestions.length > 0) {
      setSelectedQuestion(categoryQuestions[0]);
    }
  };

  // Get related questions
  const getRelatedQuestions = (currentQuestion: FAQItem) => {
    if (!currentQuestion.relatedQuestions) return [];
    return faqData.filter(item => 
      currentQuestion.relatedQuestions?.includes(item.id) && item.id !== currentQuestion.id
    ).slice(0, 3);
  };

  // Animated placeholder texts
  const placeholderTexts = [
    "What is Velric?",
    "How does scoring work?",
    "Can I improve my score?",
    "How do companies use Velric?"
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholderTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>FAQ - Velric | Questions About Skills-Based Hiring</title>
        <meta name="description" content="Everything you need to know about Velric's skills-based hiring platform. Get answers to common questions about scoring, candidates, and companies." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-jetBlack via-slateGray to-jetBlack">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-velricViolet/20 to-plasmaBlue/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-plasmaBlue/20 to-velricViolet/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-black text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Questions About{' '}
              <span className="bg-gradient-to-r from-velricViolet to-plasmaBlue bg-clip-text text-transparent">
                Velric?
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We've Got Answers. Everything you need to know about skills-based hiring, in one place.
            </motion.p>

            {/* Interactive Search Bar */}
            <motion.div 
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={placeholderTexts[currentPlaceholder]}
                  className="w-full pl-16 pr-6 py-6 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-velricViolet/50 focus:border-velricViolet/50 transition-all duration-300"
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-slateGray/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                  >
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          handleQuestionSelect(result);
                          setSelectedCategory(result.category);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm mb-1">{result.question}</h4>
                            <p className="text-gray-400 text-xs line-clamp-2">{result.answer.substring(0, 100)}...</p>
                          </div>
                          <span className="ml-3 px-2 py-1 bg-velricViolet/20 text-velricViolet text-xs rounded-full">
                            {result.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.name;
                
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => handleCategorySelect(category.name)}
                    className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                      isSelected 
                        ? `${category.bgColor} ${category.borderColor} shadow-2xl scale-105` 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-12 h-12 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`} />
                      <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                        {category.count} questions
                      </span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'} transition-colors`}>
                      {category.name}
                    </h3>
                    
                    <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'} transition-colors`}>
                      {category.description}
                    </p>

                    {isSelected && (
                      <motion.div
                        layoutId="selectedCategory"
                        className="absolute inset-0 bg-gradient-to-r from-velricViolet/20 to-plasmaBlue/20 rounded-2xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Split-Screen FAQ Display */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
              <div className="grid lg:grid-cols-5 min-h-[600px]">
                {/* Questions List - Left Side */}
                <div className="lg:col-span-2 border-r border-white/10 p-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    {categories.find(cat => cat.name === selectedCategory)?.name}
                    <span className="ml-3 px-3 py-1 bg-velricViolet/20 text-velricViolet text-sm rounded-full">
                      {currentQuestions.length}
                    </span>
                  </h2>
                  
                  <div className="space-y-3">
                    {currentQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleQuestionSelect(question)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                          selectedQuestion?.id === question.id
                            ? 'bg-velricViolet/20 border-l-4 border-velricViolet text-white'
                            : 'hover:bg-white/10 text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm pr-4 group-hover:text-white transition-colors">
                            {question.question}
                          </h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {question.isPopular && (
                              <Star className="w-4 h-4 text-yellow-400" />
                            )}
                            {viewedQuestions.includes(question.id) && (
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Answer Display - Right Side */}
                <div className="lg:col-span-3 p-8">
                  <AnimatePresence mode="wait">
                    {selectedQuestion && (
                      <motion.div
                        key={selectedQuestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                      >
                        <div className="flex items-center mb-6">
                          <h2 className="text-2xl font-bold text-white flex-1">
                            {selectedQuestion.question}
                          </h2>
                          {selectedQuestion.isPopular && (
                            <span className="ml-4 px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              Most Asked
                            </span>
                          )}
                        </div>

                        <div className="flex-1 mb-8">
                          <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                              {selectedQuestion.answer}
                            </p>
                          </div>
                        </div>

                        {/* Related Questions */}
                        {getRelatedQuestions(selectedQuestion).length > 0 && (
                          <div className="border-t border-white/10 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Related Questions</h3>
                            <div className="grid gap-3">
                              {getRelatedQuestions(selectedQuestion).map((relatedQ) => (
                                <motion.div
                                  key={relatedQ.id}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => handleQuestionSelect(relatedQ)}
                                  className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/10"
                                >
                                  <p className="text-sm text-gray-300 hover:text-white transition-colors">
                                    {relatedQ.question}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;