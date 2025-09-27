import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

// Mock mission data - in a real app this would come from an API
const mockMissions = {
  'ai-system-design': {
    title: 'AI System Design',
    description: 'Tackle real-world architecture problems using LLMs and scalable solutions. Design and implement AI systems that can handle complex data processing and decision-making tasks.',
    tags: ['System Design', 'AI', 'Backend'],
    difficulty: 'Intermediate',
    timeLimit: '7 days',
    submissions: 243,
    details: {
      overview: 'This mission challenges you to design and architect an AI system capable of processing large volumes of data and making intelligent decisions. You\'ll work with modern AI frameworks and learn how to build scalable, production-ready systems.',
      requirements: [
        'Design a scalable AI system architecture',
        'Implement data processing pipelines',
        'Create decision-making algorithms',
        'Document your system design choices',
        'Include performance considerations'
      ],
      technologies: ['Python', 'TensorFlow/PyTorch', 'Docker', 'Kubernetes', 'Cloud Services'],
      learningOutcomes: [
        'System architecture best practices',
        'AI model deployment strategies',
        'Scalability considerations',
        'Performance optimization techniques'
      ]
    }
  },
  'nlp-processing': {
    title: 'Natural Language Processing',
    description: 'Build models to process and understand human language effectively. Implement NLP solutions for text analysis, sentiment detection, and language understanding.',
    tags: ['NLP', 'Machine Learning', 'Python', 'AI'],
    difficulty: 'Advanced',
    timeLimit: '10 days',
    submissions: 187,
    details: {
      overview: 'Dive deep into natural language processing by building comprehensive models that can understand, analyze, and generate human language. This mission covers everything from basic text processing to advanced language models.',
      requirements: [
        'Implement text preprocessing pipelines',
        'Build sentiment analysis models',
        'Create named entity recognition systems',
        'Develop language understanding capabilities',
        'Deploy models for real-time processing'
      ],
      technologies: ['Python', 'NLTK', 'spaCy', 'Transformers', 'TensorFlow/PyTorch'],
      learningOutcomes: [
        'Advanced NLP techniques',
        'Model training and evaluation',
        'Text preprocessing strategies',
        'Language model fine-tuning'
      ]
    }
  }
};

export default function MissionDescription() {
  const router = useRouter();
  const { templateId } = router.query;
  
  // Get mission data or default to first mission
  const missionKey = (templateId as string) || 'ai-system-design';
  const mission = mockMissions[missionKey as keyof typeof mockMissions] || mockMissions['ai-system-design'];

  const handleStartMission = () => {
    // Navigate to submission page (would be implemented later)
    router.push(`/submission/${missionKey}`);
  };

  const handleGetHint = () => {
    // Show hint modal or navigate to hints page (would be implemented later)
    alert('Hint feature coming soon!');
  };

  const getDifficultyDots = (difficulty: string) => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    const level = levels[difficulty as keyof typeof levels] || 1;
    return [...Array(3)].map((_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i < level ? 'bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] animate-pulse' : 'bg-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] antialiased pb-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-r from-[#6A0DAD]/10 to-[#00D9FF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-[#00D9FF]/10 to-[#6A0DAD]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#6A0DAD]/5 to-[#00D9FF]/5 rounded-full blur-3xl animate-spin" style={{animationDuration: '60s'}}></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00D9FF]/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <Navbar />
      
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-20 px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - spans 2 columns */}
            <div className="lg:col-span-2">
              {/* Mission Details Card */}
              <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl p-8 mt-20 hover:shadow-2xl hover:shadow-[#6A0DAD]/20 transition-all duration-500 border border-[#6A0DAD]/20 hover:border-[#6A0DAD]/40 group relative overflow-hidden">
                {/* Card Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/5 to-[#00D9FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00D9FF]/20 to-transparent rounded-bl-3xl"></div>
                
                <div className="relative z-10">
                  {/* Mission Overview with Icon */}
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mr-4 rotate-3 hover:rotate-0 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-[#F5F5F5] font-['Space_Grotesk'] bg-gradient-to-r from-[#F5F5F5] to-[#00D9FF] bg-clip-text text-transparent">
                      Mission Overview
                    </h2>
                  </div>

                  <p className="text-[#F5F5F5] text-lg mb-8 leading-relaxed font-['Inter'] hover:text-[#00D9FF]/80 transition-colors duration-300">
                    {mission.details.overview}
                  </p>

                  {/* Requirements with Enhanced Styling */}
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#00D9FF]/20 to-[#6A0DAD]/20 rounded-lg flex items-center justify-center mr-3 border border-[#00D9FF]/30">
                        <svg className="w-4 h-4 text-[#00D9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">Requirements</h3>
                    </div>
                    <ul className="space-y-4">
                      {mission.details.requirements.map((req, index) => (
                        <li key={index} className="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                          <div className="w-3 h-3 bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="text-[#F5F5F5] text-lg font-['Inter'] group-hover/item:text-[#00D9FF]/80 transition-colors duration-200">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies with Interactive Tags */}
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-lg flex items-center justify-center mr-3 border border-[#6A0DAD]/30">
                        <svg className="w-4 h-4 text-[#6A0DAD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">Technologies</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {mission.details.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-[#0D0D0D] text-[#F5F5F5] px-4 py-2 rounded-2xl text-sm font-['Inter'] border border-gray-600 hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-lg flex items-center justify-center mr-3 border border-[#6A0DAD]/30">
                        <svg className="w-4 h-4 text-[#6A0DAD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">What You'll Learn</h3>
                    </div>
                    <ul className="space-y-4">
                      {mission.details.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                          <div className="w-3 h-3 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="text-[#F5F5F5] text-lg font-['Inter'] group-hover/item:text-[#6A0DAD]/80 transition-colors duration-200">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl p-6 mt-20 sticky top-32 hover:shadow-2xl hover:shadow-[#6A0DAD]/20 transition-all duration-500 border border-[#6A0DAD]/20 hover:border-[#6A0DAD]/40 group relative overflow-hidden">
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #00D9FF 1px, transparent 0)`,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>

                {/* Floating Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-l from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  {/* Mission Metrics Header with Icon */}
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mr-3 animate-pulse">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F5F5F5] font-['Space_Grotesk'] bg-gradient-to-r from-[#F5F5F5] to-[#00D9FF] bg-clip-text text-transparent">Mission Metrics</h2>
                  </div>
                  
                  {/* Enhanced Metrics */}
                  <div className="space-y-8">
                    <div className="group/metric hover:scale-105 transition-transform duration-200">
                      <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">Difficulty:</label>
                      <div className="flex items-center mt-3 p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#00D9FF]/30 transition-all duration-200">
                        <span className="text-[#F5F5F5] font-semibold text-lg font-['Inter'] mr-4">{mission.difficulty}</span>
                        <div className="flex space-x-2">
                          {getDifficultyDots(mission.difficulty)}
                        </div>
                      </div>
                    </div>

                    <div className="group/metric hover:scale-105 transition-transform duration-200">
                      <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">Submissions:</label>
                      <div className="p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#6A0DAD]/30 transition-all duration-200">
                        <p className="text-[#F5F5F5] font-semibold text-lg font-['Inter']">
                          <span className="text-2xl bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] bg-clip-text text-transparent">{mission.submissions}</span> developers
                        </p>
                      </div>
                    </div>

                    <div className="group/metric hover:scale-105 transition-transform duration-200">
                      <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">Time Limit:</label>
                      <div className="p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#00D9FF]/30 transition-all duration-200">
                        <p className="text-[#F5F5F5] font-semibold text-lg font-['Inter']">
                          <span className="text-2xl bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] bg-clip-text text-transparent">{mission.timeLimit}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold text-[#F5F5F5] mb-4 font-['Space_Grotesk'] flex items-center">
                      <div className="w-2 h-2 bg-[#00D9FF] rounded-full mr-2 animate-pulse"></div>
                      Your Progress
                    </h3>
                    <div className="bg-[#0D0D0D]/70 rounded-full h-4 mb-3 overflow-hidden border border-gray-700/50 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/20 to-[#00D9FF]/20 animate-pulse"></div>
                      <div className="bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] h-4 rounded-full w-0 transition-all duration-1000 relative z-10"></div>
                    </div>
                    <p className="text-gray-400 text-sm font-['Inter'] flex items-center">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      0% Complete
                    </p>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="space-y-4 mt-8">
                    <button
                      onClick={handleStartMission}
                      className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] hover:from-[#6A0DAD]/80 hover:to-[#00D9FF]/80 text-white py-4 rounded-2xl font-semibold font-['Inter'] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-[#6A0DAD]/50 relative overflow-hidden group/button"
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Mission
                      </span>
                    </button>

                    <button
                      onClick={handleGetHint}
                      className="w-full bg-[#0D0D0D]/70 hover:bg-gray-700/50 text-[#F5F5F5] py-4 rounded-2xl font-semibold font-['Inter'] border border-gray-600 hover:border-[#00D9FF]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group/button"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/10 to-[#00D9FF]/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Get Hint
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}