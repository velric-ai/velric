import { generateCandidateClusters } from "./skillClusters";

export type Candidate = {
  id: string;
  name: string;
  velricScore: number;
  domain: string;
  location?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  about?: string;
  subscores: {
    technical: number;
    collaboration: number;
    reliability: number;
  };
  skills: string[];
  clusters: ReturnType<typeof generateCandidateClusters>;
  missions: Array<{ name: string; status: "completed" | "in-progress"; description?: string }>;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  strengths: string[];
  weaknesses: string[];
};

// Base candidate data without clusters
const baseCandidates = [
  {
    id: "cand-1",
    name: "Ava Thompson",
    velricScore: 92,
    domain: "Frontend",
    location: "San Francisco, CA",
    email: "ava.thompson@example.com",
    linkedin: "linkedin.com/in/avathompson",
    github: "github.com/avathompson",
    about: "Passionate frontend developer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and modern UI/UX design. Love creating pixel-perfect interfaces and optimizing user experiences.",
    subscores: { technical: 94, collaboration: 88, reliability: 90 },
    skills: ["React", "TypeScript", "TailwindCSS", "Next.js", "GraphQL", "Figma"],
    missions: [
      { name: "Revamp Dashboard UI", status: "completed", description: "Redesigned entire dashboard with modern UI components and improved accessibility" },
      { name: "Design System Audit", status: "completed", description: "Created comprehensive design system documentation and component library" },
    ],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        duration: "2021 - Present",
        description: "Lead frontend development for multiple product lines. Built reusable component libraries, improved performance by 40%, and mentored junior developers."
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        description: "Developed customer-facing web applications using React and Redux. Collaborated with design team to implement responsive UIs."
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "Stanford University",
        year: "2019"
      }
    ],
    strengths: ["Pixel-perfect execution", "Great communication", "Team leadership"],
    weaknesses: ["Needs backend exposure"],
  },
  {
    id: "cand-2",
    name: "Leo Martinez",
    velricScore: 88,
    domain: "Backend",
    location: "New York, NY",
    email: "leo.martinez@example.com",
    linkedin: "linkedin.com/in/leomartinez",
    github: "github.com/leomartinez",
    about: "Backend engineer specializing in distributed systems and microservices architecture. Expert in Node.js, PostgreSQL, and cloud infrastructure. Passionate about writing clean, maintainable code and building scalable solutions.",
    subscores: { technical: 90, collaboration: 82, reliability: 91 },
    skills: ["Node.js", "PostgreSQL", "Supabase", "AWS", "Docker", "Kubernetes"],
    missions: [
      { name: "Real-time Notifications API", status: "completed", description: "Built high-performance notification system handling 1M+ requests/day" },
      { name: "Billing Service Refactor", status: "in-progress", description: "Migrating legacy billing system to microservices architecture" },
    ],
    experience: [
      {
        title: "Backend Engineer",
        company: "CloudScale Systems",
        duration: "2020 - Present",
        description: "Design and implement microservices architecture. Optimized database queries reducing latency by 60%. Led migration to Kubernetes."
      },
      {
        title: "Software Engineer",
        company: "DataFlow Inc.",
        duration: "2018 - 2020",
        description: "Developed RESTful APIs and database schemas. Implemented caching strategies improving response times by 50%."
      }
    ],
    education: [
      {
        degree: "M.S. Software Engineering",
        school: "MIT",
        year: "2018"
      }
    ],
    strengths: ["Scalable architecture", "Test coverage", "Performance optimization"],
    weaknesses: ["Frontend handoff delays"],
  },
  {
    id: "cand-3",
    name: "Maya Patel",
    velricScore: 81,
    domain: "Data",
    location: "Seattle, WA",
    email: "maya.patel@example.com",
    linkedin: "linkedin.com/in/mayapatel",
    github: "github.com/mayapatel",
    about: "Data engineer and analyst with expertise in building data pipelines and generating actionable insights. Proficient in Python, SQL, and modern data stack tools. Strong background in statistical analysis and machine learning.",
    subscores: { technical: 85, collaboration: 78, reliability: 80 },
    skills: ["Python", "Airflow", "dbt", "SQL", "Pandas", "Tableau"],
    missions: [
      { name: "Customer Churn Insights", status: "completed", description: "Developed predictive model identifying at-risk customers with 85% accuracy" },
      { name: "Usage Forecast Model", status: "completed", description: "Built time-series forecasting model for resource planning" },
    ],
    experience: [
      {
        title: "Data Engineer",
        company: "Analytics Pro",
        duration: "2021 - Present",
        description: "Build and maintain ETL pipelines processing 100GB+ daily. Create dashboards and reports for business stakeholders. Optimize data warehouse queries."
      },
      {
        title: "Data Analyst",
        company: "Insight Labs",
        duration: "2019 - 2021",
        description: "Performed statistical analysis and created visualizations. Wrote SQL queries and Python scripts for data processing."
      }
    ],
    education: [
      {
        degree: "B.S. Data Science",
        school: "University of Washington",
        year: "2019"
      }
    ],
    strengths: ["Sharp analytical reports", "Clear stakeholder updates", "Data modeling"],
    weaknesses: ["Prefers async communication"],
  },
  {
    id: "cand-4",
    name: "Sarah Chen",
    velricScore: 87,
    domain: "Marketing",
    location: "Los Angeles, CA",
    email: "sarah.chen@example.com",
    linkedin: "linkedin.com/in/sarahchen",
    about: "Marketing professional specializing in digital marketing and growth strategies. Expert in social media marketing, content creation, and user acquisition. Passionate about building brand awareness and driving engagement.",
    subscores: { technical: 75, collaboration: 92, reliability: 88 },
    skills: ["Digital Marketing", "Social Media", "Content Strategy", "SEO", "Growth Marketing", "UGC"],
    missions: [
      { name: "Viral Campaign Launch", status: "completed", description: "Launched social media campaign that reached 2M+ impressions" },
      { name: "Content Strategy Overhaul", status: "completed", description: "Redesigned content calendar increasing engagement by 150%" },
    ],
    experience: [
      {
        title: "Growth Marketing Manager",
        company: "GrowthCo",
        duration: "2020 - Present",
        description: "Led growth initiatives across multiple channels. Increased user acquisition by 200% through data-driven campaigns."
      }
    ],
    education: [
      {
        degree: "B.A. Marketing",
        school: "UCLA",
        year: "2020"
      }
    ],
    strengths: ["Creative campaigns", "Data-driven decisions", "Cross-functional collaboration"],
    weaknesses: ["Technical implementation"],
  },
  {
    id: "cand-5",
    name: "James Wilson",
    velricScore: 89,
    domain: "Finance",
    location: "New York, NY",
    email: "james.wilson@example.com",
    linkedin: "linkedin.com/in/jameswilson",
    about: "Investment banking professional with expertise in M&A and capital markets. Strong analytical skills and experience in financial modeling. Passionate about strategic transactions and deal execution.",
    subscores: { technical: 88, collaboration: 85, reliability: 92 },
    skills: ["Investment Banking", "M&A", "Financial Modeling", "Capital Markets", "Strategy"],
    missions: [
      { name: "Major Acquisition Deal", status: "completed", description: "Led due diligence for $500M acquisition" },
      { name: "IPO Preparation", status: "in-progress", description: "Preparing company for public offering" },
    ],
    experience: [
      {
        title: "Investment Banking Associate",
        company: "Goldman Sachs",
        duration: "2019 - Present",
        description: "Execute M&A transactions and capital raising. Built financial models and conducted market analysis."
      }
    ],
    education: [
      {
        degree: "M.B.A. Finance",
        school: "Wharton",
        year: "2019"
      }
    ],
    strengths: ["Financial analysis", "Deal execution", "Client relationships"],
    weaknesses: ["Technical skills"],
  },
];

// Generate clusters for each candidate
export const mockCandidates: Candidate[] = baseCandidates.map(candidate => ({
  ...candidate,
  clusters: generateCandidateClusters(candidate.skills)
}));

