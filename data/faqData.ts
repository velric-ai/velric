export type FAQCategory =
  | "About Velric"
  | "Velric Score"
  | "For Candidates"
  | "For Companies";

export interface FAQItem {
  id: number;
  category: FAQCategory;
  slug: string;
  categoryColor: string;
  categoryIcon: string;
  question: string;
  answer: string;
  tags: string[];
  relatedQuestions?: number[];
  isPopular?: boolean;
  isRecent?: boolean;
}

export const faqData: FAQItem[] = [
  // About Velric Category
  {
    id: 1,
    category: "About Velric",
    slug: "what-is-velric",
    categoryColor: "purple",
    categoryIcon: "sparkles",
    question: "What is Velric?",
    answer:
      "Velric is a revolutionary hiring platform that replaces traditional resumes with proof of work. We believe skills matter more than credentials, so we've built a system where candidates showcase their actual abilities through real projects and assessments.\n\nInstead of relying on outdated CVs, Velric connects talented individuals with forward-thinking companies through skills-based matching. Our platform evaluates what you can do, not just what you claim to know.",
    tags: ["basics", "platform", "skills-based"],
    relatedQuestions: [2, 5],
    isPopular: true,
  },
  {
    id: 2,
    category: "About Velric",
    slug: "how-velric-works",
    categoryColor: "purple",
    categoryIcon: "sparkles",
    question: "How does Velric work?",
    answer:
      "Velric works in three simple steps:\n\n1. Showcase Your Skills: Complete real-world projects and assessments that demonstrate your abilities in your field.\n\n2. Get Scored: Our AI-powered system evaluates your work and assigns you a Velric Score based on your performance.\n\n3. Connect with Companies: Companies discover you based on your skills and scores, not your resume. They can see exactly what you're capable of.\n\nFor companies, the process is equally streamlined - they post requirements, and we match them with candidates who have proven they can deliver.",
    tags: ["process", "how-it-works", "steps"],
    relatedQuestions: [1, 3],
  },
  {
    id: 3,
    category: "About Velric",
    slug: "who-is-velric-for",
    categoryColor: "purple",
    categoryIcon: "sparkles",
    question: "Who is Velric for?",
    answer:
      "Velric is designed for two main groups:\n\nFor Talented Professionals: Whether you're a developer, designer, marketer, or any other skilled professional who wants to be recognized for their abilities rather than their background. Perfect for career changers, self-taught experts, and anyone whose skills don't fit traditional hiring boxes.\n\nFor Forward-Thinking Companies: Organizations that want to hire the best talent based on actual capabilities. Companies tired of resume screening and looking for a more effective way to identify top performers.\n\nIf you believe skills matter more than credentials, Velric is for you.",
    tags: ["target-audience", "professionals", "companies"],
    relatedQuestions: [1, 7],
  },

  // Velric Score Category
  {
    id: 4,
    category: "Velric Score",
    slug: "what-is-velric-score",
    categoryColor: "blue",
    categoryIcon: "trending-up",
    question: "What is the Velric Score?",
    answer:
      "The Velric Score is your skills-based rating that ranges from 0-1000 points. It's calculated based on your performance across various assessments, projects, and real-world challenges in your field.\n\nUnlike traditional metrics, your Velric Score reflects your actual capabilities:\n• Technical Skills: How well you execute tasks in your domain\n• Problem-Solving: Your ability to tackle complex challenges\n• Quality: The standard of work you consistently deliver\n• Efficiency: How effectively you complete projects\n\nYour score is dynamic and improves as you complete more assessments and demonstrate growth.",
    tags: ["scoring", "assessment", "rating"],
    relatedQuestions: [5, 6],
    isPopular: true,
  },
  {
    id: 5,
    category: "Velric Score",
    slug: "how-is-score-calculated",
    categoryColor: "blue",
    categoryIcon: "trending-up",
    question: "How is my Velric Score calculated?",
    answer:
      "Your Velric Score is calculated using our proprietary AI algorithm that evaluates multiple factors:\n\nPerformance Metrics (40%):\n• Accuracy and quality of your work\n• Time to completion vs. benchmarks\n• Code quality, design aesthetics, or domain-specific excellence\n\nConsistency (30%):\n• Performance across multiple assessments\n• Reliability in delivering quality work\n• Improvement trajectory over time\n\nComplexity Handling (20%):\n• Ability to solve challenging problems\n• Handling of edge cases and difficult scenarios\n• Innovation in your solutions\n\nPeer Comparison (10%):\n• How your work compares to others in your field\n• Industry benchmarks and standards\n\nThe algorithm is continuously refined to ensure fair and accurate scoring.",
    tags: ["calculation", "algorithm", "metrics"],
    relatedQuestions: [4, 6],
  },
  {
    id: 6,
    category: "Velric Score",
    slug: "improve-velric-score",
    categoryColor: "blue",
    categoryIcon: "trending-up",
    question: "How can I improve my Velric Score?",
    answer:
      "Improving your Velric Score is straightforward - focus on demonstrating your skills consistently:\n\nComplete More Assessments:\n• Take on diverse challenges in your field\n• Show versatility across different project types\n• Maintain high quality across all submissions\n\nFocus on Quality Over Speed:\n• Deliver polished, professional work\n• Pay attention to details and best practices\n• Test and refine your solutions\n\nShow Growth:\n• Learn from feedback on previous assessments\n• Tackle increasingly complex challenges\n• Stay updated with industry trends and tools\n\nBe Consistent:\n• Regular participation shows reliability\n• Maintain your performance standards\n• Build a strong portfolio of proven work\n\nRemember: Your score reflects your actual capabilities, so genuine skill development is the best way to improve.",
    tags: ["improvement", "tips", "growth"],
    relatedQuestions: [4, 5],
  },

  // For Candidates Category
  {
    id: 7,
    category: "For Candidates",
    slug: "getting-started-candidate",
    categoryColor: "cyan",
    categoryIcon: "user",
    question: "How do I get started as a candidate?",
    answer:
      "Getting started on Velric is simple and designed to showcase your skills immediately:\n\nStep 1: Create Your Profile\n• Sign up with basic information\n• Select your primary skill areas\n• Set your career preferences\n\nStep 2: Complete Your First Assessment\n• Choose from available challenges in your field\n• Work on real-world projects that matter\n• Submit your best work for evaluation\n\nStep 3: Build Your Portfolio\n• Complete additional assessments to improve your score\n• Showcase diverse skills and capabilities\n• Demonstrate consistent quality\n\nStep 4: Get Discovered\n• Companies will find you based on your skills and scores\n• Receive opportunities that match your abilities\n• Connect with employers who value what you can do\n\nNo resume required - just your skills and dedication to quality work.",
    tags: ["getting-started", "onboarding", "candidates"],
    relatedQuestions: [8, 9],
  },
  {
    id: 8,
    category: "For Candidates",
    slug: "types-of-assessments",
    categoryColor: "cyan",
    categoryIcon: "user",
    question: "What types of assessments are available?",
    answer:
      "Velric offers diverse, real-world assessments tailored to different fields and skill levels:\n\nFor Developers:\n• Coding challenges and algorithm problems\n• Full-stack application development\n• Code review and optimization tasks\n• API design and database modeling\n\nFor Designers:\n• UI/UX design challenges\n• Brand identity projects\n• User research and wireframing\n• Design system creation\n\nFor Marketers:\n• Campaign strategy development\n• Content creation and copywriting\n• Analytics and performance optimization\n• Market research and analysis\n\nFor Other Professionals:\n• Role-specific challenges in your domain\n• Cross-functional collaboration projects\n• Problem-solving scenarios\n• Industry-relevant case studies\n\nAll assessments are designed to mirror real work situations you'd encounter in your career.",
    tags: ["assessments", "types", "challenges"],
    relatedQuestions: [7, 9],
  },
  {
    id: 9,
    category: "For Candidates",
    slug: "candidate-benefits",
    categoryColor: "cyan",
    categoryIcon: "user",
    question: "What are the benefits for candidates?",
    answer:
      "Velric offers numerous advantages over traditional job searching:\n\nSkills-First Approach:\n• Be recognized for what you can do, not your background\n• Perfect for career changers and self-taught professionals\n• No bias based on education, previous companies, or gaps in employment\n\nQuality Opportunities:\n• Connect with companies that value skills over credentials\n• Access to roles that match your actual capabilities\n• Higher likelihood of job satisfaction and success\n\nProfessional Growth:\n• Continuous skill assessment and improvement\n• Clear feedback on your performance\n• Portfolio of proven work to showcase\n\nEfficient Process:\n• No more endless resume submissions\n• Companies come to you based on your demonstrated abilities\n• Faster, more meaningful connections with employers\n\nFair Evaluation:\n• Objective scoring based on actual performance\n• Equal opportunity regardless of background\n• Transparent assessment criteria",
    tags: ["benefits", "advantages", "value-proposition"],
    relatedQuestions: [7, 10],
  },

  // For Companies Category
  {
    id: 10,
    category: "For Companies",
    slug: "why-companies-use-velric",
    categoryColor: "indigo",
    categoryIcon: "briefcase",
    question: "Why should companies use Velric?",
    answer:
      "Velric transforms how companies identify and hire top talent:\n\nBetter Hiring Decisions:\n• See actual work quality before making offers\n• Reduce hiring mistakes and improve retention\n• Identify hidden gems that traditional methods miss\n\nEfficiency Gains:\n• Skip resume screening and lengthy interview processes\n• Focus on candidates who have proven their abilities\n• Faster time-to-hire with higher success rates\n\nAccess to Diverse Talent:\n• Discover skilled professionals regardless of background\n• Find candidates who might not have traditional credentials\n• Build more diverse and capable teams\n\nCost Effective:\n• Reduce recruitment costs and time investment\n• Lower turnover rates due to better skill matching\n• Eliminate expensive hiring mistakes\n\nCompetitive Advantage:\n• Access talent that competitors using traditional methods miss\n• Build teams based on actual capabilities\n• Stay ahead with skills-first hiring approach",
    tags: ["companies", "benefits", "hiring"],
    relatedQuestions: [11, 12],
    isPopular: true,
  },
  {
    id: 11,
    category: "For Companies",
    slug: "how-companies-find-candidates",
    categoryColor: "indigo",
    categoryIcon: "briefcase",
    question: "How do companies find candidates on Velric?",
    answer:
      "Companies use Velric's advanced matching system to discover the right talent:\n\nSkills-Based Search:\n• Filter candidates by specific technical skills\n• Set minimum Velric Score requirements\n• Search by project types and experience levels\n\nSmart Matching Algorithm:\n• Our AI matches candidates to your specific needs\n• Considers both hard and soft skills\n• Factors in cultural fit and work style preferences\n\nPortfolio Review:\n• View actual work samples and project outcomes\n• See performance metrics and quality scores\n• Review consistency across multiple assessments\n\nDirect Engagement:\n• Contact candidates who meet your criteria\n• Schedule interviews with pre-qualified talent\n• Make offers based on demonstrated capabilities\n\nContinuous Discovery:\n• Get notified when new candidates match your needs\n• Access to growing pool of skilled professionals\n• Regular updates on candidate performance improvements",
    tags: ["search", "matching", "discovery"],
    relatedQuestions: [10, 12],
  },
  {
    id: 12,
    category: "For Companies",
    slug: "company-onboarding",
    categoryColor: "indigo",
    categoryIcon: "briefcase",
    question: "How do companies get started with Velric?",
    answer:
      "Getting your company set up on Velric is straightforward:\n\nStep 1: Company Registration\n• Create your company profile\n• Verify your organization\n• Set up team access and permissions\n\nStep 2: Define Your Needs\n• Specify the skills and roles you're hiring for\n• Set your quality standards and score requirements\n• Configure your hiring preferences and criteria\n\nStep 3: Explore the Talent Pool\n• Browse available candidates in your field\n• Review portfolios and performance metrics\n• Use filters to find the perfect matches\n\nStep 4: Start Hiring\n• Contact candidates who meet your requirements\n• Schedule interviews and assessments\n• Make data-driven hiring decisions\n\nOngoing Support:\n• Dedicated customer success manager\n• Training on platform features and best practices\n• Regular insights and hiring analytics\n\nOur team will guide you through the entire process to ensure success.",
    tags: ["onboarding", "setup", "getting-started"],
    relatedQuestions: [10, 11],
  },
];
