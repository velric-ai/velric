export interface StaticMission {
  id: string;
  title: string;
  description: string;
  field: string;
  difficulty: string;
  timeEstimate: string;
  category: string;
  skills: string[];
  industries: string[];
  tasks: string[];
  evaluationMetrics: string[];
  company?: string;
  context?: string;
  objectives?: string[];
  resources?: string[];
  status: "suggested" | "starred" | "in_progress" | "submitted" | "completed";
  grade?: number;
  feedback?: string;
  started_at?: string;
  submitted_at?: string;
  completed_at?: string;
}

export const staticMissions: StaticMission[] = [
  {
    id: "1",
    title: "Launch a Viral Product in 48 Hours",
    field: "Growth & Marketing",
    description: "You've just joined Nuvion, an early-stage AI startup building Nuvion OS — a productivity layer that automates your daily tasks across Google Workspace, Slack, and Notion. The product is currently in closed beta with 20 users, and your goal is to position it as the next big tool for high-performing teams.",
    difficulty: "Intermediate",
    timeEstimate: "48 hours",
    category: "Marketing & Growth",
    skills: ["Digital Marketing", "Social Media Strategy", "Content Creation", "Growth Hacking"],
    industries: ["AI/ML", "Productivity", "SaaS"],
    company: "Nuvion",
    status: "suggested",
    context: "You have 48 hours before launch and no paid advertising budget. You only have access to: the product demo video (30 seconds, muted B-roll only), the founder's personal social media accounts, and a small list of 200 startup founders and students who signed up for early access.",
    objectives: [
      "Create and execute a viral mini-launch that sparks organic attention and sign-ups before the public beta goes live"
    ],
    resources: [
      "Product demo video (30 seconds, muted B-roll only)",
      "Founder's personal social media accounts",
      "List of 200 startup founders and students (early access)",
      "No paid advertising budget"
    ],
    tasks: [
      "Write a three-step launch plan that explains your campaign's concept, audience, and main message",
      "Draft a short-form video idea (script or storyboard) that would perform well on Instagram, TikTok, or X",
      "Write one written post for LinkedIn or X announcing Nuvion OS — focus on curiosity, urgency, and emotional hook",
      "Reflect on your approach: if you had one more week and $500 in ad spend, how would you scale the campaign and measure results?"
    ],
    evaluationMetrics: [
      "Strategic clarity and storytelling strength",
      "Audience insight and creativity",
      "Practicality and virality potential of ideas",
      "Quality and tone of communication",
      "Reflection depth and ability to scale ideas"
    ]
  },
  {
    id: "2",
    title: "Build a Financial Stability Report for a Scaling SaaS Company",
    field: "Finance & Data Analysis",
    description: "You've joined Quantara, a mid-stage SaaS company that provides AI-driven compliance automation for fintech startups. Quantara recently crossed $10 million ARR with 220 enterprise clients, but its customer acquisition cost (CAC) and operational overhead have sharply increased over the last two quarters.",
    difficulty: "Advanced",
    timeEstimate: "5-7 days",
    category: "Finance & Analytics",
    skills: ["Financial Analysis", "SaaS Metrics", "Data Analysis", "Excel/Google Sheets", "Strategic Planning"],
    industries: ["SaaS", "Fintech", "Compliance"],
    company: "Quantara",
    status: "suggested",
    context: "The CFO wants you to evaluate whether Quantara's current growth model is financially sustainable and how to optimize its unit economics before a potential Series B round.",
    objectives: [
      "Deliver a data-backed analysis and executive summary that quantifies Quantara's financial health",
      "Identify weak points and propose strategic next steps to improve cash flow and margins"
    ],
    resources: [
      "Quarterly financial summaries for the past 8 quarters (revenue, COGS, operating expenses, CAC, LTV, and churn rate)",
      "Departmental expense breakdowns (R&D, Sales, Marketing, and G&A)",
      "Benchmark data from three competitors in the same space",
      "Notes indicating customer churn has risen by 1.5% quarter-over-quarter"
    ],
    tasks: [
      "Financial Analysis: Calculate Quantara's CAC:LTV ratio, EBITDA margin, and cash runway based on the provided data. Identify two leading financial risks that could impact the company's next 12 months",
      "Comparative Insight: Compare Quantara's metrics against industry benchmarks and its three listed competitors. Highlight where Quantara is underperforming or overperforming and explain why",
      "Strategic Recommendation: Propose two actionable financial strategies to improve sustainability before the Series B. Quantify the potential impact of your strategies on EBITDA or cash runway",
      "Executive Summary: Write a concise 200–300-word summary as if presenting to the CFO, outlining your findings and recommendations"
    ],
    evaluationMetrics: [
      "Depth and precision of financial analysis",
      "Accuracy of calculations and metric interpretations",
      "Strength and practicality of recommendations",
      "Strategic thinking and ability to quantify outcomes",
      "Clarity, professionalism, and structure of the final summary"
    ]
  },
  {
    id: "3",
    title: "Design a Scalable Hiring Strategy for Global Expansion",
    field: "Human Resources & Talent Management",
    description: "You've joined HelixWorks, a fast-growing health tech company that builds AI-powered diagnostic tools for hospitals and clinics. After securing $15 million in Series A funding, HelixWorks plans to expand from 120 employees across two countries to 400 employees across five regions within the next year.",
    difficulty: "Intermediate",
    timeEstimate: "4-6 days",
    category: "HR & Talent",
    skills: ["Talent Acquisition", "HR Strategy", "Global Expansion", "Data Analysis", "Process Design"],
    industries: ["HealthTech", "AI/ML", "Diagnostics"],
    company: "HelixWorks",
    status: "suggested",
    context: "The company has struggled with inconsistent hiring standards, high turnover in technical roles, and limited visibility into long-term workforce costs. You need to build a scalable, data-informed hiring framework that addresses these challenges.",
    objectives: [
      "Design a hiring and retention strategy that balances speed, quality, and culture fit",
      "Build a scalable, data-informed hiring framework for global expansion"
    ],
    resources: [
      "Current workforce structure (departments, locations, attrition rates, average time-to-hire)",
      "$15 million Series A funding secured",
      "Expansion plan: 120 to 400 employees across five regions"
    ],
    tasks: [
      "Talent Landscape Analysis: Review the current workforce structure and identify two key bottlenecks slowing down the hiring process and their impact on business growth",
      "Strategic Framework: Propose a 3-step hiring framework that can scale across multiple countries while maintaining cultural alignment. Specify KPIs to track success",
      "Retention and Culture Plan: Design one initiative to improve retention in high-turnover roles. Include estimated cost, expected ROI, and measurement approach",
      "Executive Summary: Write a 250-word brief for the Chief People Officer explaining your strategy's business value and how it supports expansion goals"
    ],
    evaluationMetrics: [
      "Depth of understanding of global hiring dynamics",
      "Strategic reasoning and scalability of framework",
      "Data literacy and ability to quantify HR impact",
      "Creativity and practicality of retention initiative",
      "Communication and presentation of ideas"
    ]
  },
  {
    id: "4",
    title: "Develop an ESG Impact Framework for a Global Supply Chain Company",
    field: "Sustainability & ESG Strategy",
    description: "You've joined Solvanta Logistics, a multinational supply chain and freight optimization company operating in 18 countries. Solvanta recently committed to reaching net-zero emissions by 2035 and publishing its first annual ESG report next quarter.",
    difficulty: "Advanced",
    timeEstimate: "6-8 days",
    category: "Sustainability & ESG",
    skills: ["ESG Strategy", "Sustainability", "Data Analysis", "Supply Chain", "Environmental Impact"],
    industries: ["Logistics", "Supply Chain", "Transportation"],
    company: "Solvanta Logistics",
    status: "suggested",
    context: "The company has strong financial performance but little structured data on its environmental or social impact. You need to create a foundational framework for measuring, reporting, and improving sustainability performance.",
    objectives: [
      "Create a foundational ESG framework that defines how Solvanta should measure, report, and improve its sustainability performance",
      "Design a data-driven roadmap the company can implement within the next year"
    ],
    resources: [
      "Operations across 18 countries",
      "Net-zero commitment by 2035",
      "First annual ESG report due next quarter",
      "Strong financial performance baseline"
    ],
    tasks: [
      "Current State Assessment: Review Solvanta's supply chain and logistics operations. Identify two major ESG risks and two opportunities for improved sustainability performance",
      "Framework Design: Propose a structured ESG framework with measurable indicators for Environmental, Social, and Governance pillars. Define 3–5 KPIs to track quarterly",
      "Strategic Initiative: Design one initiative that reduces Solvanta's carbon footprint by at least 10% over the next year without increasing total operating costs",
      "Executive Brief: Write a 250-word summary for the Chief Sustainability Officer explaining your proposed ESG framework and how it positions Solvanta for future certifications"
    ],
    evaluationMetrics: [
      "Understanding of ESG standards and compliance frameworks",
      "Analytical ability to identify and prioritize sustainability risks",
      "Strategic thinking and measurable impact of recommendations",
      "Data literacy and ROI-based reasoning",
      "Clarity, structure, and persuasiveness of the executive brief"
    ]
  },
  {
    id: "5",
    title: "Design a Scalable Ledger System for Cross-Border Transactions",
    field: "Blockchain Architecture & Distributed Systems",
    description: "You've joined Auralex, a fintech company developing a distributed ledger platform that enables instant, low-cost cross-border payments for small and mid-sized banks. The company currently processes 25,000 transactions per second (TPS) on a hybrid blockchain built on Proof of Stake.",
    difficulty: "Expert",
    timeEstimate: "7-10 days",
    category: "Blockchain & Fintech",
    skills: ["Blockchain Architecture", "Distributed Systems", "Consensus Mechanisms", "Smart Contracts", "Cryptography"],
    industries: ["Fintech", "Blockchain", "Banking", "Payments"],
    company: "Auralex",
    status: "suggested",
    context: "The company struggles with latency, interoperability, and auditability across international systems. You need to design the next-generation ledger architecture that enhances performance while ensuring regulatory compliance.",
    objectives: [
      "Design a ledger architecture that enhances performance, ensures regulatory compliance, and maintains transparency for financial audits",
      "Balance scalability with security and design seamless integration with both public and private blockchains"
    ],
    resources: [
      "Current system: 25,000 TPS on hybrid Proof of Stake blockchain",
      "Target: 100,000 TPS with <3 second transaction finality",
      "Integration needs: Ethereum, Stellar, Hyperledger compatibility"
    ],
    tasks: [
      "System Architecture Proposal: Outline a high-level architecture to reach 100,000 TPS while keeping transaction finality under 3 seconds. Explain your choice of blockchain framework",
      "Interoperability Design: Propose a mechanism for interoperating with existing systems (Ethereum, Stellar, Hyperledger) without compromising data integrity",
      "Security and Governance Model: Identify potential attack vectors and propose mitigation measures. Design a governance structure for validators ensuring accountability and compliance",
      "Executive Summary: Write a 300-word technical brief to the CTO explaining your architecture's scalability benefits and why this positions Auralex as a global leader"
    ],
    evaluationMetrics: [
      "Depth and technical accuracy of architectural design",
      "Understanding of consensus mechanisms and scalability trade-offs",
      "Innovation and feasibility of interoperability approach",
      "Security, compliance, and governance reasoning",
      "Clarity, precision, and structure of the technical summary"
    ]
  }
];

export const getMissionById = (id: string): StaticMission | undefined => {
  return staticMissions.find(mission => mission.id === id);
};

export const getAllMissions = (): StaticMission[] => {
  return staticMissions;
};
