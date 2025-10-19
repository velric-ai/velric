// data/mockMissions.ts
import {
  MissionTemplate,
  UserMission,
  User,
  Project,
  ProjectDoc,
  IndustryTag,
  TargetRole,
  Submission,
} from "@/types";

export const mockMissionTemplates: MissionTemplate[] = [
  {
    id: "ai-system-design",
    title: "AI System Design",
    description:
      "Tackle real-world architecture problems using LLMs and scalable solutions. Design and implement AI systems that can handle complex data processing and decision-making tasks.",
    skills: [
      "Python",
      "System Design",
      "LLMs",
      "Architecture",
      "Redis",
      "Docker",
    ],
    industries: ["Technology", "E-commerce", "Media"],
    difficulty: "Advanced",
    time_estimate: "4-6 hours",
    category: "AI/ML",
    tags: ["System Design", "AI", "Backend"],
    timeLimit: "7 days",
    submissions: 243,
    details: {
      overview:
        "This mission challenges you to design and architect an AI system capable of processing large volumes of data and making intelligent decisions. You'll work with modern AI frameworks and learn how to build scalable, production-ready systems.",
      requirements: [
        "Design a scalable AI system architecture",
        "Implement data processing pipelines",
        "Create decision-making algorithms",
        "Document your system design choices",
        "Include performance considerations",
      ],
      technologies: [
        "Python",
        "TensorFlow/PyTorch",
        "Docker",
        "Kubernetes",
        "Cloud Services",
      ],
      learningOutcomes: [
        "System architecture best practices",
        "AI model deployment strategies",
        "Scalability considerations",
        "Performance optimization techniques",
      ],
    },
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "nlp-processing",
    title: "Natural Language Processing",
    description:
      "Build models to process and understand human language effectively. Implement NLP solutions for text analysis, sentiment detection, and language understanding.",
    skills: [
      "NLP",
      "Python",
      "Machine Learning",
      "Transformers",
      "spaCy",
      "PyTorch",
    ],
    industries: ["Technology", "Media", "Customer Service"],
    difficulty: "Advanced",
    time_estimate: "4-5 hours",
    category: "AI/ML",
    tags: ["NLP", "Machine Learning", "Python", "AI"],
    timeLimit: "10 days",
    submissions: 187,
    details: {
      overview:
        "Dive deep into natural language processing by building comprehensive models that can understand, analyze, and generate human language. This mission covers everything from basic text processing to advanced language models.",
      requirements: [
        "Implement text preprocessing pipelines",
        "Build sentiment analysis models",
        "Create named entity recognition systems",
        "Develop language understanding capabilities",
        "Deploy models for real-time processing",
      ],
      technologies: [
        "Python",
        "NLTK",
        "spaCy",
        "Transformers",
        "TensorFlow/PyTorch",
      ],
      learningOutcomes: [
        "Advanced NLP techniques",
        "Model training and evaluation",
        "Text preprocessing strategies",
        "Language model fine-tuning",
      ],
    },
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "security-auth",
    title: "Security & Authentication Implementation",
    description:
      "Build a comprehensive authentication system with JWT tokens, OAuth2 integration, and role-based access control. Implement security best practices including rate limiting, input validation, and secure session management.",
    skills: [
      "JWT",
      "OAuth2",
      "Security",
      "Authentication",
      "Node.js",
      "Express",
    ],
    industries: ["Technology", "Finance", "Healthcare"],
    difficulty: "Intermediate",
    time_estimate: "3-4 hours",
    category: "Security",
    tags: ["Security", "Authentication", "Backend"],
    timeLimit: "5 days",
    submissions: 156,
    details: {
      overview:
        "Master the fundamentals of web security by implementing a robust authentication and authorization system. Learn industry best practices for securing web applications and protecting user data.",
      requirements: [
        "Implement JWT-based authentication",
        "Set up OAuth2 integration",
        "Create role-based access control",
        "Add rate limiting and input validation",
        "Implement secure session management",
      ],
      technologies: ["Node.js", "Express", "JWT", "OAuth2", "bcrypt"],
      learningOutcomes: [
        "Web security fundamentals",
        "Authentication vs authorization",
        "Token-based security",
        "Security best practices",
      ],
    },
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z",
  },
  {
    id: "frontend-performance",
    title: "Frontend Performance Optimization",
    description:
      "Identify and fix performance bottlenecks in a React application. Implement code splitting, lazy loading, memoization, and optimize bundle size. Use profiling tools to measure improvements.",
    skills: ["React", "TypeScript", "Performance", "Webpack", "Testing"],
    industries: ["Technology", "E-commerce", "Media"],
    difficulty: "Intermediate",
    time_estimate: "2-3 hours",
    category: "Frontend",
    tags: ["React", "Performance", "Frontend"],
    timeLimit: "4 days",
    submissions: 298,
    details: {
      overview:
        "Learn to identify and resolve performance issues in React applications. Master techniques for optimizing bundle size, reducing load times, and improving user experience.",
      requirements: [
        "Analyze application performance bottlenecks",
        "Implement code splitting and lazy loading",
        "Optimize React component rendering",
        "Reduce bundle size and improve load times",
        "Set up performance monitoring",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Webpack",
        "React DevTools",
        "Lighthouse",
      ],
      learningOutcomes: [
        "Performance profiling techniques",
        "React optimization strategies",
        "Bundle analysis and optimization",
        "User experience improvements",
      ],
    },
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-17T10:00:00Z",
  },
  {
    id: "data-pipeline",
    title: "Data Pipeline & Analytics",
    description:
      "Build an end-to-end data pipeline that ingests, processes, and visualizes large datasets. Implement ETL processes, data validation, and create interactive dashboards for business insights.",
    skills: [
      "Python",
      "Pandas",
      "SQL",
      "Visualization",
      "ETL",
      "Apache Airflow",
    ],
    industries: ["Technology", "Finance", "Retail"],
    difficulty: "Beginner",
    time_estimate: "3-5 hours",
    category: "Data Science",
    tags: ["Data Science", "Analytics", "Python"],
    timeLimit: "6 days",
    submissions: 134,
    details: {
      overview:
        "Build a complete data pipeline from ingestion to visualization. Learn how to process large datasets, ensure data quality, and create meaningful insights for business decisions.",
      requirements: [
        "Design and implement data ingestion pipeline",
        "Create data transformation and cleaning processes",
        "Build data validation and quality checks",
        "Develop interactive dashboards",
        "Implement automated reporting",
      ],
      technologies: [
        "Python",
        "Pandas",
        "Apache Airflow",
        "PostgreSQL",
        "Plotly",
      ],
      learningOutcomes: [
        "ETL pipeline design",
        "Data quality management",
        "Dashboard development",
        "Business intelligence concepts",
      ],
    },
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-18T10:00:00Z",
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud Infrastructure Automation",
    description:
      "Design and implement Infrastructure as Code using Terraform and Kubernetes. Set up CI/CD pipelines, monitoring, and auto-scaling for a production application deployment.",
    skills: ["Terraform", "Kubernetes", "AWS", "Docker", "CI/CD", "Monitoring"],
    industries: ["Technology", "Finance", "Healthcare"],
    difficulty: "Advanced",
    time_estimate: "5-7 hours",
    category: "DevOps",
    tags: ["DevOps", "Cloud", "Infrastructure"],
    timeLimit: "8 days",
    submissions: 89,
    details: {
      overview:
        "Master modern DevOps practices by building automated infrastructure deployment and management systems. Learn to scale applications efficiently and maintain high availability.",
      requirements: [
        "Create Infrastructure as Code with Terraform",
        "Set up Kubernetes cluster and deployments",
        "Implement CI/CD pipelines",
        "Configure monitoring and alerting",
        "Set up auto-scaling and load balancing",
      ],
      technologies: [
        "Terraform",
        "Kubernetes",
        "AWS",
        "Docker",
        "Jenkins",
        "Prometheus",
      ],
      learningOutcomes: [
        "Infrastructure as Code principles",
        "Container orchestration",
        "CI/CD best practices",
        "Monitoring and observability",
      ],
    },
    created_at: "2024-01-19T10:00:00Z",
    updated_at: "2024-01-19T10:00:00Z",
  },
];

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "john.doe@example.com",
    name: "John Doe",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "user-2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-02T10:00:00Z",
  },
];

export const mockUserMissions: UserMission[] = [
  {
    id: "um-1",
    user_id: "user-1",
    mission_id: "ai-system-design",
    status: "starred",
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z",
  },
  {
    id: "um-2",
    user_id: "user-1",
    mission_id: "security-auth",
    status: "in_progress",
    started_at: "2024-01-16T09:00:00Z",
    created_at: "2024-01-16T09:00:00Z",
    updated_at: "2024-01-16T09:00:00Z",
  },
  {
    id: "um-3",
    user_id: "user-1",
    mission_id: "frontend-performance",
    status: "completed",
    started_at: "2024-01-17T09:00:00Z",
    completed_at: "2024-01-17T14:00:00Z",
    created_at: "2024-01-17T09:00:00Z",
    updated_at: "2024-01-17T14:00:00Z",
  },
  {
    id: "um-4",
    user_id: "user-1",
    mission_id: "data-pipeline",
    status: "suggested",
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-18T10:00:00Z",
  },
];

export const mockIndustryTags: IndustryTag[] = [
  { id: "it-1", name: "Technology", created_at: "2024-01-01T10:00:00Z" },
  { id: "it-2", name: "Finance", created_at: "2024-01-01T10:00:00Z" },
  { id: "it-3", name: "Healthcare", created_at: "2024-01-01T10:00:00Z" },
  { id: "it-4", name: "E-commerce", created_at: "2024-01-01T10:00:00Z" },
  { id: "it-5", name: "Media", created_at: "2024-01-01T10:00:00Z" },
  { id: "it-6", name: "Retail", created_at: "2024-01-01T10:00:00Z" },
];

export const mockTargetRoles: TargetRole[] = [
  { id: "tr-1", name: "Software Engineer", created_at: "2024-01-01T10:00:00Z" },
  {
    id: "tr-2",
    name: "Senior Software Engineer",
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "tr-3",
    name: "Full Stack Developer",
    created_at: "2024-01-01T10:00:00Z",
  },
  { id: "tr-4", name: "DevOps Engineer", created_at: "2024-01-01T10:00:00Z" },
  { id: "tr-5", name: "Data Scientist", created_at: "2024-01-01T10:00:00Z" },
  { id: "tr-6", name: "ML Engineer", created_at: "2024-01-01T10:00:00Z" },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "E-commerce Recommendation System",
    description:
      "A machine learning-powered recommendation engine for an e-commerce platform",
    user_id: "user-1",
    mission_id: "ai-system-design",
    status: "in_progress",
    created_at: "2024-01-15T12:00:00Z",
    updated_at: "2024-01-15T12:00:00Z",
  },
];

export const mockProjectDocs: ProjectDoc[] = [
  {
    id: "pd-1",
    project_id: "proj-1",
    title: "Project Overview",
    content:
      "# E-commerce Recommendation System\n\nThis project implements a scalable recommendation engine...",
    doc_type: "readme",
    order_index: 1,
    created_at: "2024-01-15T12:30:00Z",
    updated_at: "2024-01-15T12:30:00Z",
  },
  {
    id: "pd-2",
    project_id: "proj-1",
    title: "Technical Specification",
    content:
      "# Technical Specification\n\n## Architecture\n\nThe system consists of...",
    doc_type: "spec",
    order_index: 2,
    created_at: "2024-01-15T13:00:00Z",
    updated_at: "2024-01-15T13:00:00Z",
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "sub-1",
    user_id: "user-1",
    mission_id: "ai-system-design",
    text: "This is an example submission explaining the architecture decisions. It uses caching and a message queue.",
    feedback:
      "Strong architecture choices. Consider elaborating on scaling strategies, adding benchmarks for your caching strategy, and clarifying failure modes.",
    summary:
      "Solid architecture with a clear focus on scalability; needs more detail on operational metrics and failure handling.",
    grades: {
      "Technical Accuracy": 5,
      Clarity: 4,
      Creativity: 4,
      Relevance: 5,
      "Code Quality": 4,
    },
    overall_score: 88,
    letter_grade: "A-",
    rubric: {
      "Technical Accuracy": "Correct design and sound engineering tradeoffs",
      Clarity: "Mostly clear but some sections could be expanded",
      Creativity: "Good novel ideas",
      Relevance: "Directly addresses the mission",
      "Code Quality": "Readable with minor issues",
    },
    positiveTemplates: [
      "Excellent architecture and tradeoff reasoning.",
      "Clear focus on scalability and maintainability.",
      "Good use of established patterns for reliability.",
    ],
    improvementTemplates: [
      "Provide performance numbers or benchmarking for the caching layer.",
      "Clarify fallback behavior on failure scenarios.",
      "Add more concrete examples for deployment steps.",
    ],
    status: "graded",
    created_at: "2024-02-01T12:00:00Z",
    updated_at: "2024-02-01T12:00:00Z",
  },
];

// In-memory store for dummy mode
export class MockDataStore {
  private static instance: MockDataStore;

  public missionTemplates: MissionTemplate[] = [...mockMissionTemplates];
  public userMissions: UserMission[] = [...mockUserMissions];
  public users: User[] = [...mockUsers];
  public projects: Project[] = [...mockProjects];
  public projectDocs: ProjectDoc[] = [...mockProjectDocs];
  public industryTags: IndustryTag[] = [...mockIndustryTags];
  public targetRoles: TargetRole[] = [...mockTargetRoles];
  public submissions: Submission[] = [...mockSubmissions];

  private constructor() {}

  public static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  public reset(): void {
    this.missionTemplates = [...mockMissionTemplates];
    this.userMissions = [...mockUserMissions];
    this.users = [...mockUsers];
    this.projects = [...mockProjects];
    this.projectDocs = [...mockProjectDocs];
    this.industryTags = [...mockIndustryTags];
    this.targetRoles = [...mockTargetRoles];
    this.submissions = [...mockSubmissions];
  }
}
