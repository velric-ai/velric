// lib/missionHelpers.ts
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  skills: string[];
  tags: string[];
}

export const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'AI System Design',
    description: 'Tackle real-world architecture problems using LLMs and scalable backends.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    estimatedTime: '4-6 hours',
    skills: ['Python', 'System Design', 'LLMs', 'Architecture'],
    tags: ['AI', 'Backend', 'Scalability']
  },
  {
    id: '2',
    title: 'Security & Auth in Modern Web',
    description: 'Secure apps with best practices around JWTs, OAuth2, and more.',
    category: 'Security',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 hours',
    skills: ['JWT', 'OAuth2', 'Security', 'Authentication'],
    tags: ['Security', 'Web', 'Authentication']
  },
  {
    id: '3',
    title: 'Frontend Debugging Challenge',
    description: 'Identify and fix common bugs in React and TypeScript codebases.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    estimatedTime: '2-3 hours',
    skills: ['React', 'TypeScript', 'Debugging', 'Testing'],
    tags: ['Frontend', 'React', 'Debugging']
  },
  {
    id: '4',
    title: 'Data Science Exploration',
    description: 'Analyze and visualize datasets to uncover hidden insights.',
    category: 'Data Science',
    difficulty: 'Beginner',
    estimatedTime: '3-5 hours',
    skills: ['Python', 'Pandas', 'Visualization', 'Statistics'],
    tags: ['Data Science', 'Analytics', 'Python']
  },
  {
    id: '5',
    title: 'Cloud Infrastructure Automation',
    description: 'Learn how to automate cloud infrastructure using Terraform and Kubernetes.',
    category: 'DevOps',
    difficulty: 'Advanced',
    estimatedTime: '5-7 hours',
    skills: ['Terraform', 'Kubernetes', 'AWS', 'Docker'],
    tags: ['DevOps', 'Cloud', 'Infrastructure']
  },
  {
    id: '6',
    title: 'Natural Language Processing',
    description: 'Build models to process and understand human language effectively.',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    estimatedTime: '4-5 hours',
    skills: ['NLP', 'Python', 'Machine Learning', 'Text Processing'],
    tags: ['AI', 'NLP', 'Machine Learning']
  },
  {
    id: '7',
    title: 'Mobile App Performance Optimization',
    description: 'Improve app responsiveness and reduce battery consumption on mobile devices.',
    category: 'Mobile',
    difficulty: 'Advanced',
    estimatedTime: '4-6 hours',
    skills: ['React Native', 'Performance', 'Mobile', 'Optimization'],
    tags: ['Mobile', 'Performance', 'Optimization']
  },
  {
    id: '8',
    title: 'Machine Learning Model Deployment',
    description: 'Deploy scalable ML models with monitoring and version control.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    estimatedTime: '5-8 hours',
    skills: ['MLOps', 'Docker', 'Monitoring', 'Deployment'],
    tags: ['ML', 'Deployment', 'MLOps']
  }
];

export const interestOptions = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'AI/ML',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design',
  'Product Management',
  'System Design',
  'Database Design',
  'API Development'
];

export function filterMissionsByInterests(interests: string[]): Mission[] {
  if (interests.length === 0) return mockMissions;
  
  return mockMissions.filter(mission => 
    interests.some(interest => 
      mission.category.toLowerCase().includes(interest.toLowerCase()) ||
      mission.skills.some(skill => 
        skill.toLowerCase().includes(interest.toLowerCase())
      ) ||
      mission.tags.some(tag => 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    )
  );
}

export function getDifficultyColor(difficulty: Mission['difficulty']): string {
  switch (difficulty) {
    case 'Beginner':
      return 'text-green-400';
    case 'Intermediate':
      return 'text-yellow-400';
    case 'Advanced':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Analyzes mission tasks to determine if they require an IDE (coding environment).
 * This function specifically checks if tasks involve writing, implementing, or debugging code.
 * 
 * @param tasks - Array of task descriptions
 * @returns true if tasks require an IDE, false otherwise
 */
export function tasksNeedIDE(tasks: string[]): boolean {
  if (!tasks || tasks.length === 0) {
    return false; // No tasks means no IDE needed
  }

  const allTasksText = tasks.join(" ").toLowerCase();
  
  // Strong IDE indicators - tasks that explicitly require coding
  const ideRequiredKeywords = [
    "write code", "write a function", "write a class", "write a script",
    "implement", "implement a", "implement the", "code", "coding",
    "program", "programming", "develop", "develop a", "develop the",
    "build", "build a", "build the", "create api", "create endpoint",
    "create function", "create class", "create module", "create service",
    "debug", "debugging", "fix bug", "fix the bug", "fix bugs",
    "refactor", "refactoring", "optimize code", "optimize the code",
    "test code", "test the code", "unit test", "integration test",
    "deploy", "deployment", "compile", "run code", "execute code",
    "algorithm", "data structure", "design pattern", "architecture",
    "database query", "sql query", "api endpoint", "rest api",
    "graphql", "microservice", "container", "docker", "kubernetes",
    "repository", "git", "version control", "pull request", "merge",
    "ci/cd", "pipeline", "automation script", "shell script",
    "javascript", "python", "java", "typescript", "react", "node",
    "express", "django", "flask", "spring", "angular", "vue"
  ];

  // Non-IDE indicators - tasks that don't require coding
  const noIDEKeywords = [
    "write a", "draft", "create a plan", "strategy", "framework",
    "presentation", "report", "analysis", "research", "interview",
    "survey", "campaign", "launch", "marketing", "content",
    "social media", "blog", "article", "proposal", "roadmap",
    "kpi", "metrics", "dashboard", "analytics", "business case",
    "executive summary", "brief", "documentation", "process",
    "workflow", "alignment", "communication", "meeting", "workshop"
  ];

  // Count IDE-required keyword matches
  let ideScore = 0;
  let noIDEScore = 0;

  ideRequiredKeywords.forEach(keyword => {
    if (allTasksText.includes(keyword)) {
      ideScore++;
    }
  });

  noIDEKeywords.forEach(keyword => {
    if (allTasksText.includes(keyword)) {
      noIDEScore++;
    }
  });

  // If we have strong IDE indicators and they outweigh non-IDE indicators, IDE is needed
  if (ideScore > 0 && ideScore >= noIDEScore) {
    return true;
  }

  // If non-IDE indicators dominate, no IDE needed
  if (noIDEScore > ideScore) {
    return false;
  }

  // Default: no IDE needed if ambiguous
  return false;
}

/**
 * Detects if a mission is technical or non-technical based on its tasks.
 * This is useful when the mission type is not explicitly set.
 * 
 * Technical indicators in tasks:
 * - Programming languages (code, implement, write code, develop, build, create API, etc.)
 * - Technical terms (algorithm, architecture, system design, database, API, deployment, etc.)
 * - Coding-related actions (write, implement, code, debug, test code, etc.)
 * 
 * Non-technical indicators in tasks:
 * - Business/strategy terms (strategy, plan, analyze, research, report, presentation, etc.)
 * - Marketing/sales terms (campaign, launch, content, social media, etc.)
 * - Management terms (framework, process, stakeholder, alignment, etc.)
 */
export function detectMissionTypeFromTasks(tasks: string[]): "technical" | "non-technical" {
  if (!tasks || tasks.length === 0) {
    return "technical"; // Default to technical if no tasks
  }

  const allTasksText = tasks.join(" ").toLowerCase();
  
  // Technical indicators (strong signals)
  const technicalKeywords = [
    "code", "programming", "implement", "develop", "build", "create api",
    "write code", "algorithm", "architecture", "system design", "database",
    "deployment", "debug", "test code", "function", "class", "module",
    "repository", "git", "docker", "kubernetes", "aws", "cloud",
    "backend", "frontend", "full stack", "api endpoint", "rest api",
    "graphql", "sql", "query", "optimize code", "refactor", "framework",
    "library", "package", "npm", "pip", "compile", "runtime", "server",
    "client", "protocol", "http", "https", "authentication", "authorization",
    "encryption", "security", "testing", "unit test", "integration test",
    "ci/cd", "pipeline", "script", "automation", "infrastructure",
    "microservice", "container", "kubernetes", "terraform", "ansible",
    "javascript", "python", "java", "typescript", "react", "node",
    "express", "django", "flask", "spring", "angular", "vue", "next.js"
  ];

  // Non-technical indicators (strong signals)
  const nonTechnicalKeywords = [
    "write a", "draft", "create a plan", "strategy", "framework",
    "stakeholder", "presentation", "report", "analysis", "research",
    "interview", "survey", "campaign", "launch", "marketing",
    "content", "social media", "blog", "article", "proposal",
    "roadmap", "kpi", "metrics", "dashboard", "analytics",
    "business case", "executive summary", "brief", "documentation",
    "process", "workflow", "alignment", "communication", "meeting",
    "workshop", "training", "onboarding", "recruitment", "hiring",
    "budget", "financial", "cost", "revenue", "profit", "roi",
    "customer", "user research", "persona", "journey map",
    "go-to-market", "gtm", "product strategy", "market research"
  ];

  // Count matches
  let technicalScore = 0;
  let nonTechnicalScore = 0;

  technicalKeywords.forEach(keyword => {
    if (allTasksText.includes(keyword)) {
      technicalScore++;
    }
  });

  nonTechnicalKeywords.forEach(keyword => {
    if (allTasksText.includes(keyword)) {
      nonTechnicalScore++;
    }
  });

  // If we have strong technical signals, it's technical
  if (technicalScore > 0 && technicalScore >= nonTechnicalScore) {
    return "technical";
  }

  // If we have strong non-technical signals, it's non-technical
  if (nonTechnicalScore > technicalScore) {
    return "non-technical";
  }

  // Default to technical if ambiguous (most missions are technical)
  return "technical";
}

/**
 * Gets the mission type, either from the explicit type field or by detecting from tasks.
 * Also checks if IDE is needed based on tasks.
 */
export function getMissionType(
  explicitType?: "technical" | "non-technical",
  tasks?: string[]
): "technical" | "non-technical" {
  if (explicitType) {
    return explicitType;
  }
  
  if (tasks && tasks.length > 0) {
    return detectMissionTypeFromTasks(tasks);
  }
  
  return "technical"; // Default fallback
}

/**
 * Determines if a mission needs an IDE based on its type and tasks.
 * This is the main function to use for showing/hiding the IDE component.
 * 
 * @param explicitType - Explicit mission type if set
 * @param tasks - Array of task descriptions
 * @returns true if IDE is needed, false otherwise
 */
export function missionNeedsIDE(
  explicitType?: "technical" | "non-technical",
  tasks?: string[]
): boolean {
  // If explicitly non-technical, no IDE needed
  if (explicitType === "non-technical") {
    return false;
  }

  // If explicitly technical, IDE is needed
  if (explicitType === "technical") {
    return true;
  }

  // If no explicit type, analyze tasks to determine if IDE is needed
  if (tasks && tasks.length > 0) {
    return tasksNeedIDE(tasks);
  }

  // Default: no IDE needed if we can't determine
  return false;
}