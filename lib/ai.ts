// lib/ai.ts
import { MissionTemplate } from "@/types";
import { StaticMission } from "@/data/staticMissions";
import { storeAIGeneratedMission } from "@/lib/supabaseClient";
import OpenAI from "openai";

// Initialize OpenAI client
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn(
    "OpenAI API key not configured. Mission generation will use fallback method."
  );
}

if (typeof window === "undefined" && process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Enhanced prompt template for comprehensive mission generation
export const COMPREHENSIVE_MISSION_PROMPT = `
You are an expert career coach and technical mentor who creates realistic, engaging coding missions based on actual industry scenarios. Generate a comprehensive mission that feels like a real project from a top-tier company.

CONTEXT:
- User Background: {userBackground}
- Interests: {interests}
- Industry Focus: {industry}
- Difficulty Level: {difficulty}
- Time Estimate: {timeEstimate}

REQUIREMENTS:
Generate a single, detailed mission with the following structure. Make it as comprehensive and detailed as the example missions you might find at companies like Google, Meta, or top startups.

MISSION OUTPUT (JSON):
{
  "title": "Engaging, specific mission title that sounds like a real company project (e.g., 'Build AI-Powered Code Review Assistant' or 'Design Microservices Architecture for E-commerce Platform')",
  "description": "Detailed 3-4 sentence description explaining the scenario, business impact, technical challenges, and what the user will accomplish. Include specific metrics or business goals.",
  "field": "Primary field (e.g., 'Frontend Development', 'Backend Engineering', 'Full Stack', 'Data Science', 'DevOps', 'Mobile Development', 'AI/ML Engineering')",
  "difficulty": "Beginner|Intermediate|Advanced",
  "timeEstimate": "Realistic time estimate matching complexity (e.g., '4-6 hours', '2-3 days', '1-2 weeks')",
  "category": "Specific category (e.g., 'Web Development', 'API Design', 'Data Analysis', 'Machine Learning', 'System Architecture')",
  "company": "Realistic company name that fits the industry (can be fictional but sounds authentic)",
  "context": "Detailed 4-5 sentence background explaining: the company's current situation, specific business constraints, why this project is critical now, what happens if it's not completed, and how it fits into broader company goals. Include specific numbers, deadlines, or business metrics.",
  "skills": ["6-8 specific technical skills needed, ranging from languages to frameworks to tools"],
  "industries": ["2-3 relevant industries this mission applies to"],
  "tasks": [
    "Minimum 5-7 specific, actionable tasks that the user must complete. Each task should be:
    - Specific and measurable (e.g., 'Implement JWT authentication with 2FA support' not 'Add authentication')
    - Include technical details (e.g., 'Design database schema with proper indexing for 1M+ users')
    - Have clear deliverables (e.g., 'Create comprehensive API documentation with OpenAPI 3.0 spec')
    - Build progressively in complexity
    - Include testing, documentation, and deployment aspects"
  ],
  "objectives": [
    "3-4 clear, specific learning objectives that align with career growth:
    - Technical skills the user will master
    - Industry best practices they'll learn
    - Real-world experience they'll gain
    - Career-relevant competencies they'll develop"
  ],
  "resources": [
    "4-6 realistic resources/tools/constraints available:
    - Specific datasets, APIs, or services (e.g., 'Access to Stripe API sandbox environment')
    - Tools and platforms (e.g., 'AWS credits for cloud infrastructure')
    - Sample code or existing systems (e.g., 'Legacy codebase with 50K+ lines to refactor')
    - Team support (e.g., 'Senior architect available for weekly code reviews')
    - Documentation and guidelines (e.g., 'Company's microservices architecture patterns')
    - Realistic constraints (e.g., 'Must maintain 99.9% uptime during migration')"
  ],
  "evaluationMetrics": [
    "4-6 specific, measurable criteria for evaluating success:
    - Performance benchmarks (e.g., 'API response time under 200ms for 95% of requests')
    - Quality standards (e.g., 'Code coverage above 85% with integration tests')
    - Business metrics (e.g., 'Reduce user onboarding time by 40%')
    - Technical requirements (e.g., 'Handle 10K concurrent users without degradation')
    - Security standards (e.g., 'Pass OWASP security scan with zero high-risk vulnerabilities')
    - User experience metrics (e.g., 'Mobile app receives 4.5+ star rating in testing')"
  ]
}

CRITICAL GUIDELINES:
1. COMPANY CONTEXT MUST BE URGENT AND SPECIFIC: Include real business pressures like "Series B funding requires 10x user growth in 6 months" or "Compliance audit in 8 weeks requires GDPR implementation"

2. TASKS MUST BE COMPREHENSIVE: Each task should feel like a real sprint story with acceptance criteria. Include setup, implementation, testing, documentation, and deployment phases.

3. TECHNICAL DEPTH: Match the difficulty level - Beginner tasks focus on fundamentals, Advanced tasks involve system design, scalability, and complex integrations.

4. BUSINESS IMPACT: Every mission should clearly articulate why this work matters to the company's success, with specific metrics or deadlines.

5. REAL-WORLD CONSTRAINTS: Include realistic limitations like legacy system integration, budget constraints, regulatory requirements, or technical debt.

EXAMPLES OF EXCELLENT COMPANY CONTEXTS:
- "StreamingCorp's video platform crashes during peak hours (8-10 PM), losing $50K/hour in ad revenue. The current CDN can't handle 2M concurrent users, and a major sports event next month will triple traffic."
- "FinTechStart must implement PCI compliance before their Series A investor due diligence in 6 weeks, or risk losing $10M funding. Current payment processing stores sensitive data insecurely."
- "HealthcareAI's patient data pipeline processes 500K records daily but takes 6 hours to complete, delaying critical treatment decisions. Doctors need real-time insights to improve patient outcomes."

Generate a mission that reads like it came from a real company's high-priority project backlog, with the depth and detail of actual enterprise software development.
`;

// Production-ready prompt template for AI mission generation (legacy)
export const MISSION_GENERATION_PROMPT = `
You are an expert career coach and technical mentor. Generate personalized coding missions based on the user's background and interests.

CONTEXT:
- Resume/Background: {resumeText}
- Interests: {interests}
- Industry Focus: {industry}
- Difficulty Level: {difficulty}
- Time Estimate: {timeEstimate}

REQUIREMENTS:
1. Generate 3-5 unique, practical coding missions
2. Each mission should be based on real-world scenarios from top companies
3. Missions should progressively build skills relevant to the user's interests
4. Include specific technologies and frameworks mentioned in the resume
5. Ensure missions are achievable within the specified time frame

OUTPUT FORMAT (JSON):
{
  "missions": [
    {
      "id": "generated-{timestamp}-{index}",
      "title": "Clear, engaging mission title",
      "description": "Detailed description (2-3 sentences) explaining what the user will build and learn",
      "skills": ["skill1", "skill2", "skill3"],
      "industries": ["industry1", "industry2"],
      "difficulty": "Beginner|Intermediate|Advanced",
      "time_estimate": "X-Y hours"
    }
  ]
}

GUIDELINES:
- Make titles action-oriented and specific
- Descriptions should explain both the technical challenge and business context
- Skills should include 4-6 relevant technologies
- Industries should reflect where this type of work is common
- Difficulty should match the user's experience level
- Time estimates should be realistic for the complexity

Generate missions that feel like real projects from companies like Google, Netflix, Stripe, or Airbnb.
`;

// Generate a single comprehensive mission using ChatGPT
export async function generateComprehensiveMission(
  userBackground: string,
  interests: string[],
  industry: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  timeEstimate: string
): Promise<StaticMission> {
  if (!openai) {
    console.warn("OpenAI not configured. Using fallback generation.");
    return generateFallbackMission(
      userBackground,
      interests,
      industry,
      difficulty,
      timeEstimate
    );
  }

  try {
    const prompt = COMPREHENSIVE_MISSION_PROMPT.replace(
      "{userBackground}",
      userBackground
    )
      .replace("{interests}", interests.join(", "))
      .replace("{industry}", industry)
      .replace("{difficulty}", difficulty)
      .replace("{timeEstimate}", timeEstimate);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical career coach and mission designer. Generate comprehensive, realistic coding missions based on actual industry scenarios. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response (defensive): strip code fences and extract first JSON object
    const cleaned = response
      .replace(/^```(?:json)?/im, "")
      .replace(/```$/m, "")
      .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/m);
    const jsonText = jsonMatch ? jsonMatch[0] : cleaned;

    let parsedMission: any;
    try {
      parsedMission = JSON.parse(jsonText);
    } catch (e) {
      const fallbackMatch = response.match(/\{[\s\S]*\}/m);
      if (!fallbackMatch) throw e;
      parsedMission = JSON.parse(fallbackMatch[0]);
    }

    // Transform to StaticMission format
    // Parse tasks - handle both string array and object array formats
    let tasks: string[] = [];
    if (Array.isArray(parsedMission.tasks)) {
      tasks = parsedMission.tasks.map((task: any) => {
        // If task is an object with 'task' property, extract it
        if (typeof task === "object" && task.task) {
          return task.task;
        }
        // If task is already a string, use it
        return String(task);
      });
    }

    console.log("[AI Mission Generation] Parsed mission data:", {
      title: parsedMission.title,
      difficulty: parsedMission.difficulty,
      timeEstimate: parsedMission.timeEstimate,
      company: parsedMission.company,
      taskCount: tasks.length,
      tasksPreview: tasks.slice(0, 2),
    });

    const mission: StaticMission = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: parsedMission.title,
      description: parsedMission.description,
      field: parsedMission.field,
      difficulty: parsedMission.difficulty,
      timeEstimate: parsedMission.timeEstimate,
      category: parsedMission.category,
      company: parsedMission.company,
      context: parsedMission.context,
      status: "suggested",
      skills: parsedMission.skills || [],
      industries: parsedMission.industries || [],
      tasks: tasks,
      objectives: parsedMission.objectives || [],
      resources: parsedMission.resources || [],
      evaluationMetrics: parsedMission.evaluationMetrics || [],
    };

    return mission;
  } catch (error) {
    console.error("Error generating mission with OpenAI:", error);
    return generateFallbackMission(
      userBackground,
      interests,
      industry,
      difficulty,
      timeEstimate
    );
  }
}

// Generate and store multiple missions
export async function generateAndStoreMissions(
  userBackground: string,
  interests: string[],
  industry: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  count: number = 3
): Promise<string[]> {
  const generatedMissionIds: string[] = [];

  for (let i = 0; i < count; i++) {
    try {
      // Generate a mission
      const mission = await generateComprehensiveMission(
        userBackground,
        interests,
        industry,
        difficulty,
        `${Math.floor(Math.random() * 8) + 2}-${
          Math.floor(Math.random() * 8) + 6
        } hours`
      );

      // Store in Supabase
      const missionId = await storeAIGeneratedMission(mission);
      generatedMissionIds.push(missionId);

      console.log(
        `Generated and stored mission ${i + 1}/${count}: ${mission.title}`
      );

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generating mission ${i + 1}:`, error);
    }
  }

  return generatedMissionIds;
}

// Fallback mission generation for when OpenAI is not available
export function generateFallbackMission(
  userBackground: string,
  interests: string[],
  industry: string,
  difficulty: string,
  timeEstimate: string
): StaticMission {
  // Comprehensive mission templates based on real industry scenarios
  const missionTemplates = [
    {
      title: "Build Real-Time Analytics Dashboard for E-commerce Platform",
      description:
        "Design and implement a comprehensive analytics dashboard that processes live data streams from 500K+ daily users, providing actionable insights for business decision-making. The system must handle Black Friday traffic spikes while maintaining sub-second response times and supporting real-time fraud detection.",
      field: "Full Stack Development",
      company: "DataFlow Commerce",
      context:
        "The company's current reporting system crashes during peak traffic, losing $75K/hour in potential sales insights. With Black Friday approaching in 8 weeks, the executive team needs real-time visibility into user behavior, conversion funnels, and fraud patterns to make split-second pricing and inventory decisions. The legacy dashboard takes 30+ minutes to load basic reports, making it unusable for time-sensitive business operations.",
      skills: [
        "React",
        "Node.js",
        "WebSockets",
        "PostgreSQL",
        "Redis",
        "Chart.js",
        "Kafka",
        "Docker",
      ],
      industries: ["E-commerce", "Analytics", "SaaS"],
    },
    {
      title: "Design Microservices Architecture for Healthcare Data Platform",
      description:
        "Architect and implement a HIPAA-compliant microservices system that can securely process 2M+ patient records daily while maintaining 99.99% uptime. The system must support real-time data synchronization between hospitals, labs, and insurance providers while ensuring complete audit trails for regulatory compliance.",
      field: "Backend Engineering",
      company: "HealthTech Systems",
      context:
        "The company's monolithic architecture is buckling under the load of 150+ healthcare partners, with database timeouts causing critical delays in patient care coordination. A recent HIPAA audit revealed significant security vulnerabilities, and the FDA is requiring enhanced data lineage tracking within 90 days. Without this migration, the company risks losing its largest client (40% of revenue) and facing regulatory fines up to $2M.",
      skills: [
        "Node.js",
        "Docker",
        "Kubernetes",
        "PostgreSQL",
        "Redis",
        "JWT",
        "API Gateway",
        "Terraform",
      ],
      industries: ["Healthcare", "Compliance", "Enterprise Software"],
    },
    {
      title: "Implement Advanced Multi-Factor Authentication System",
      description:
        "Design and build a comprehensive security authentication system with biometric verification, risk-based authentication, and fraud detection that reduces account takeovers by 95%. The system must support 10M+ users across web, mobile, and API access while maintaining seamless user experience.",
      field: "Security Engineering",
      company: "SecureBank Financial",
      context:
        "Following a security breach at a competitor that affected 5M users, regulatory pressure has intensified, requiring enhanced authentication before the next compliance audit in 12 weeks. Current password-based authentication has a 15% account takeover rate, costing the bank $3M annually in fraud losses and customer compensation. The new system must integrate with legacy mainframe systems while supporting modern OAuth2 and WebAuthn standards.",
      skills: [
        "JWT",
        "OAuth2",
        "WebAuthn",
        "Biometrics",
        "Node.js",
        "Redis",
        "Encryption",
        "Risk Analysis",
      ],
      industries: ["FinTech", "Banking", "Security"],
    },
    {
      title: "Develop AI-Powered Content Recommendation Engine",
      description:
        "Build a machine learning recommendation system that increases user engagement by 60% through personalized content delivery, processing 50M+ interactions daily. The system must provide real-time recommendations while respecting user privacy and supporting A/B testing for continuous optimization.",
      field: "AI/ML Engineering",
      company: "StreamTech Media",
      context:
        "User engagement has dropped 25% over six months as competitors with superior recommendation algorithms capture market share. The company's current collaborative filtering approach can't handle the scale of 10M+ users and provides stale recommendations that users ignore. With a major content licensing deal requiring proof of user engagement improvements within 16 weeks, the ML team must deliver a production-ready system that can compete with industry leaders like Netflix and YouTube.",
      skills: [
        "Python",
        "TensorFlow",
        "Apache Kafka",
        "Redis",
        "Kubernetes",
        "MLflow",
        "PostgreSQL",
        "scikit-learn",
      ],
      industries: ["Media", "Entertainment", "Streaming"],
    },
    {
      title: "Create Mobile Performance Optimization Framework for Banking App",
      description:
        "Develop a comprehensive mobile performance optimization framework that reduces app load times by 70% and improves user retention by 40%. The system must work across iOS and Android while maintaining bank-grade security and supporting offline functionality for critical features.",
      field: "Mobile Development",
      company: "AppVelocity Bank",
      context:
        "Customer complaints about app performance have increased 300% over the past quarter, directly correlating with a 20% drop in mobile banking adoption. App store ratings have fallen from 4.8 to 3.2 stars, putting the bank's digital transformation initiative at risk. Competitors are gaining market share by offering superior mobile experiences, and the CEO has mandated that app performance must match industry benchmarks within 10 weeks or face potential regulatory scrutiny for inadequate digital services.",
      skills: [
        "React Native",
        "Performance Optimization",
        "CDN",
        "Caching",
        "Analytics",
        "iOS",
        "Android",
        "Security",
      ],
      industries: ["Mobile", "Banking", "FinTech"],
    },
    {
      title:
        "Build Cross-Platform Data Synchronization System for Productivity Suite",
      description:
        "Engineer a real-time data synchronization solution that keeps user data consistent across web, mobile, and desktop applications while supporting offline editing and conflict resolution. The system must handle 100M+ documents with sub-100ms sync times while maintaining data integrity.",
      field: "Full Stack Development",
      company: "SyncWorks Productivity",
      context:
        "Users are experiencing data loss and sync conflicts that undermine trust in the platform, with support tickets increasing 400% month-over-month. Major enterprise clients are threatening to cancel contracts worth $15M annually due to productivity losses from data inconsistencies. The current eventual consistency model creates confusion when teams collaborate on documents, and the upcoming enterprise sales cycle requires demonstrable reliability improvements to close $50M in pending deals.",
      skills: [
        "WebSockets",
        "React",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Conflict Resolution",
        "Electron",
        "API Design",
      ],
      industries: ["SaaS", "Productivity", "Collaboration"],
    },
    {
      title: "Implement HIPAA-Compliant DevOps Pipeline for Medical Devices",
      description:
        "Design a comprehensive CI/CD pipeline for medical device software that ensures zero-downtime deployments while maintaining FDA compliance and HIPAA security standards. The system must support automated testing, security scanning, and audit trails for regulatory submissions.",
      field: "DevOps Engineering",
      company: "MedTech Innovations",
      context:
        "The company's manual deployment process takes 6 weeks per release, delaying critical bug fixes that affect patient safety. An upcoming FDA inspection requires demonstrable software lifecycle management, and current practices don't meet regulatory standards for medical devices. With 50+ hospitals depending on continuous software updates for life-critical equipment, the DevOps team must implement a validated pipeline that reduces deployment time to under 24 hours while ensuring 100% regulatory compliance.",
      skills: [
        "Docker",
        "Kubernetes",
        "Jenkins",
        "AWS",
        "Security Scanning",
        "Compliance",
        "Terraform",
        "Ansible",
      ],
      industries: ["Healthcare", "Medical Devices", "Compliance"],
    },
    {
      title:
        "Create Advanced Data Visualization Platform for Financial Trading",
      description:
        "Build an interactive data visualization platform that transforms complex financial datasets into actionable trading insights, processing 1M+ market events per second. The system must provide real-time charting, alert systems, and risk analysis tools that help traders make split-second decisions.",
      field: "Data Science",
      company: "QuantTrade Analytics",
      context:
        "Traders are losing competitive advantage due to outdated visualization tools that can't keep pace with high-frequency market data. Manual analysis of trading patterns takes hours instead of seconds, resulting in missed opportunities worth millions. The firm's largest client has threatened to switch to a competitor with superior analytics capabilities, potentially costing $25M in annual trading fees. The new platform must be operational before the next earnings season to retain key institutional clients.",
      skills: [
        "Python",
        "D3.js",
        "pandas",
        "Apache Kafka",
        "Redis",
        "WebSockets",
        "PostgreSQL",
        "Real-time Analytics",
      ],
      industries: ["FinTech", "Trading", "Analytics"],
    },
    {
      title: "Develop Automated Testing Framework for Critical Infrastructure",
      description:
        "Build a comprehensive automated testing suite for power grid management software that ensures 99.999% reliability while reducing manual QA time by 90%. The system must include chaos engineering, performance testing, and security validation for systems that serve 2M+ customers.",
      field: "QA Engineering",
      company: "GridTech Solutions",
      context:
        "A recent power outage caused by software failure affected 500K customers and resulted in $10M in economic losses and regulatory fines. Current manual testing takes 3 months per release cycle, delaying critical infrastructure updates and security patches. With increasing cyber threats targeting power grids and new regulatory requirements mandating faster response times, the testing framework must enable weekly releases while maintaining the highest reliability standards for critical infrastructure.",
      skills: [
        "Selenium",
        "Jest",
        "Cypress",
        "Performance Testing",
        "Security Testing",
        "Python",
        "CI/CD",
        "Chaos Engineering",
      ],
      industries: ["Critical Infrastructure", "Energy", "Government"],
    },
    {
      title: "Design Blockchain-Based Supply Chain Transparency Platform",
      description:
        "Create a transparent supply chain tracking system using blockchain technology that ensures product authenticity and reduces fraud by 85%. The system must handle 100K+ transactions daily while providing real-time visibility into product origins, handling, and environmental impact.",
      field: "Blockchain Development",
      company: "SupplyChain Pro",
      context:
        "Counterfeit products are costing the company $50M annually in lost revenue and brand damage, with customers increasingly demanding transparency about product origins and ethical sourcing. Recent supply chain disruptions highlighted the need for real-time visibility across 500+ suppliers and 50+ countries. A major retail partner has mandated full supply chain traceability within 6 months as a condition for renewing their $100M annual contract, making this platform critical for business continuity.",
      skills: [
        "Solidity",
        "Web3.js",
        "Ethereum",
        "Node.js",
        "Smart Contracts",
        "IPFS",
        "React",
        "API Integration",
      ],
      industries: ["Supply Chain", "Logistics", "Retail"],
    },
  ];

  // Dynamic task generation based on field and difficulty
  const generateTasks = (field: string, difficulty: string): string[] => {
    const comprehensiveTasks = {
      "Full Stack Development": [
        "Set up comprehensive development environment with Docker containers, database migrations, and environment configuration management",
        "Design and implement responsive user interface components using modern CSS Grid/Flexbox with accessibility compliance (WCAG 2.1)",
        "Build robust backend API endpoints with proper error handling, input validation, rate limiting, and comprehensive logging",
        "Implement real-time features using WebSockets with connection pooling, message queuing, and automatic reconnection logic",
        "Create comprehensive database schema with proper indexing, foreign key constraints, and performance optimization for 1M+ records",
        "Integrate frontend with backend services using proper state management, error boundaries, and loading states",
        "Implement authentication and authorization with JWT tokens, refresh mechanisms, and role-based access control",
        "Add comprehensive testing suite including unit tests (90%+ coverage), integration tests, and end-to-end scenarios",
        "Set up monitoring and analytics with custom dashboards, error tracking, and performance metrics collection",
        "Deploy to production with CI/CD pipeline, blue-green deployment, and automated rollback capabilities",
        "Implement caching strategies at multiple levels (browser, CDN, application, database) for optimal performance",
        "Add data export/import functionality with CSV, JSON, and Excel formats plus data validation and error reporting",
      ],
      "Backend Engineering": [
        "Design scalable system architecture with microservices boundaries, API contracts, and service mesh communication patterns",
        "Implement core business logic with domain-driven design principles, proper abstractions, and comprehensive error handling",
        "Set up robust authentication and authorization using OAuth2, JWT tokens, and role-based permissions with audit logging",
        "Create comprehensive API documentation using OpenAPI 3.0 specification with interactive examples and testing endpoints",
        "Design and implement database schema with proper normalization, indexing strategies, and query optimization for high throughput",
        "Implement advanced caching mechanisms with Redis cluster, cache invalidation strategies, and cache warming procedures",
        "Add comprehensive monitoring with custom metrics, distributed tracing, structured logging, and alerting for SLA violations",
        "Implement message queue processing with Apache Kafka or RabbitMQ including dead letter queues and retry mechanisms",
        "Set up automated backup and disaster recovery procedures with point-in-time recovery and cross-region replication",
        "Ensure security best practices including input validation, SQL injection prevention, and OWASP compliance scanning",
        "Implement rate limiting and DDoS protection with sliding window algorithms and IP reputation scoring",
        "Create load testing scenarios and performance benchmarking with JMeter or Artillery to validate system capacity",
      ],
      "AI/ML Engineering": [
        "Collect and preprocess large-scale training datasets with data cleaning, feature engineering, and statistical validation",
        "Design and implement machine learning pipeline with data versioning, experiment tracking, and reproducible model training",
        "Train and validate multiple model architectures with hyperparameter tuning, cross-validation, and statistical significance testing",
        "Implement model evaluation framework with comprehensive metrics, bias detection, and fairness assessment across demographic groups",
        "Create real-time model inference API with batching, caching, and A/B testing capabilities for production deployment",
        "Set up model monitoring and drift detection with automated retraining triggers and performance degradation alerts",
        "Implement feature store with real-time and batch feature computation, versioning, and lineage tracking",
        "Deploy models to production with containerization, auto-scaling, and zero-downtime model updates",
        "Create comprehensive model documentation including data sources, training procedures, limitations, and ethical considerations",
        "Implement data privacy and security measures including differential privacy and secure multi-party computation where applicable",
        "Set up automated model testing pipeline with data validation, model validation, and integration testing",
        "Create model interpretability tools and explanations for stakeholder communication and regulatory compliance",
      ],
      "Mobile Development": [
        "Set up cross-platform development environment with React Native, Expo, and native module integration capabilities",
        "Design responsive mobile UI components with platform-specific design patterns (Material Design for Android, Human Interface Guidelines for iOS)",
        "Implement core application functionality with navigation, state management, and deep linking support",
        "Integrate with RESTful APIs and GraphQL endpoints with proper error handling, offline synchronization, and conflict resolution",
        "Add comprehensive offline functionality with local database (SQLite/Realm), data synchronization, and conflict resolution strategies",
        "Implement push notifications with Firebase Cloud Messaging, rich notifications, and deep linking to specific app content",
        "Add mobile-specific features like camera integration, geolocation services, biometric authentication, and device sensors",
        "Implement comprehensive testing strategy including unit tests, integration tests, and automated UI testing with Detox or Appium",
        "Optimize app performance with code splitting, image optimization, lazy loading, and memory management best practices",
        "Set up analytics and crash reporting with Firebase Analytics, custom event tracking, and user behavior analysis",
        "Prepare for app store deployment with proper signing, metadata optimization, and store compliance requirements",
        "Implement security best practices including certificate pinning, secure storage, and API key protection",
      ],
      "DevOps Engineering": [
        "Design cloud infrastructure architecture using Infrastructure as Code (Terraform/CloudFormation) with multi-environment support",
        "Set up comprehensive CI/CD pipeline with automated testing, security scanning, and deployment approval workflows",
        "Implement container orchestration with Kubernetes including service mesh, ingress controllers, and horizontal pod autoscaling",
        "Configure monitoring and observability stack with Prometheus, Grafana, ELK stack, and distributed tracing using Jaeger",
        "Set up automated security scanning including SAST, DAST, dependency scanning, and compliance validation (SOC2, HIPAA)",
        "Implement disaster recovery procedures with automated backups, cross-region replication, and RTO/RPO testing",
        "Configure auto-scaling policies for applications and infrastructure with predictive scaling and cost optimization",
        "Set up log aggregation and analysis with structured logging, log retention policies, and automated alerting",
        "Implement secrets management using HashiCorp Vault, AWS Secrets Manager, or similar with automatic rotation",
        "Create comprehensive documentation including runbooks, incident response procedures, and architecture decision records",
        "Set up automated compliance monitoring and reporting with policy as code and continuous compliance validation",
        "Implement blue-green deployment strategies with automated rollback triggers and canary deployment capabilities",
      ],
      "Security Engineering": [
        "Design comprehensive threat model with attack surface analysis, threat intelligence integration, and risk assessment",
        "Implement multi-factor authentication with support for TOTP, WebAuthn, SMS, and biometric verification methods",
        "Set up comprehensive security monitoring with SIEM integration, anomaly detection, and automated incident response",
        "Implement end-to-end encryption for data in transit and at rest with proper key management and rotation procedures",
        "Create penetration testing framework with automated vulnerability scanning and manual security assessment procedures",
        "Set up identity and access management with role-based access control, just-in-time access, and privilege escalation monitoring",
        "Implement security compliance validation for standards like SOC2, HIPAA, PCI DSS with automated evidence collection",
        "Create incident response procedures with automated threat containment, forensic data collection, and stakeholder communication",
        "Set up secure development lifecycle with security code review, dependency scanning, and security testing integration",
        "Implement zero-trust network architecture with micro-segmentation, device verification, and continuous authentication",
        "Create security awareness training program with phishing simulation and security metrics tracking",
        "Set up data loss prevention with data classification, content inspection, and automated policy enforcement",
      ],
    };

    const fieldTasks =
      comprehensiveTasks[field as keyof typeof comprehensiveTasks] ||
      comprehensiveTasks["Full Stack Development"];
    const taskCount =
      difficulty === "Advanced" ? 8 : difficulty === "Intermediate" ? 6 : 5;

    // Shuffle and select tasks to ensure variety
    const shuffled = [...fieldTasks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, taskCount);
  };

  // Dynamic objectives based on field
  const generateObjectives = (field: string): string[] => {
    const objectives = {
      "Full Stack Development": [
        "Master end-to-end application development",
        "Learn modern development best practices",
        "Understand system integration patterns",
      ],
      "Backend Engineering": [
        "Design scalable system architectures",
        "Implement robust API design patterns",
        "Learn advanced database optimization",
      ],
      "AI/ML Engineering": [
        "Apply machine learning algorithms to real problems",
        "Master model training and evaluation techniques",
        "Learn MLOps and production deployment",
      ],
      "Mobile Development": [
        "Master cross-platform mobile development",
        "Learn mobile-specific optimization techniques",
        "Understand mobile user experience patterns",
      ],
      "DevOps Engineering": [
        "Master infrastructure as code practices",
        "Learn advanced automation and orchestration",
        "Understand security and compliance requirements",
      ],
    };

    const fieldObjectives =
      objectives[field as keyof typeof objectives] ||
      objectives["Full Stack Development"];
    return fieldObjectives.slice(0, Math.floor(Math.random() * 2) + 2);
  };

  // Dynamic resources based on field and company context
  const generateResources = (field: string, company: string): string[] => {
    const baseResources = [
      "Comprehensive project documentation and requirements",
      "Access to development and staging environments",
      "Sample datasets and testing data",
      "Technical mentor support and code reviews",
      "Industry best practices and architecture guidelines",
      "Performance benchmarking and monitoring tools",
      "Security scanning and compliance validation tools",
    ];

    // Add field-specific resources
    if (field.includes("AI") || field.includes("ML")) {
      baseResources.push(
        "Pre-trained models and ML frameworks",
        "GPU compute resources for training"
      );
    }
    if (field.includes("Mobile")) {
      baseResources.push(
        "Device testing lab and simulators",
        "App store publishing guidelines"
      );
    }
    if (field.includes("DevOps")) {
      baseResources.push(
        "Cloud infrastructure credits",
        "Container orchestration platforms"
      );
    }

    // Shuffle and return 4-5 resources
    const shuffled = [...baseResources].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 4);
  };

  // Dynamic evaluation metrics
  const generateEvaluationMetrics = (
    field: string,
    difficulty: string
  ): string[] => {
    const comprehensiveMetrics = {
      "Full Stack Development": [
        "Application performance: Page load times under 2 seconds, API response times under 200ms for 95% of requests",
        "Code quality: Minimum 85% test coverage with comprehensive unit, integration, and end-to-end tests",
        "User experience: Responsive design working on all devices, accessibility compliance (WCAG 2.1 AA), and intuitive navigation",
        "Security standards: Pass OWASP security scan with zero high-risk vulnerabilities and proper authentication implementation",
        "Scalability requirements: Handle 10K+ concurrent users without performance degradation and auto-scaling capabilities",
        "Database optimization: Query performance under 100ms for complex operations and proper indexing implementation",
        "Deployment success: Zero-downtime deployment with automated rollback capabilities and comprehensive monitoring",
        "Documentation quality: Complete API documentation, setup instructions, and architectural decision records",
      ],
      "Backend Engineering": [
        "Performance benchmarks: API throughput of 1000+ requests/second with p99 latency under 500ms",
        "System reliability: 99.9% uptime with automated failover and disaster recovery capabilities",
        "Security compliance: Zero critical vulnerabilities, proper authentication/authorization, and data encryption at rest/transit",
        "Code quality: Clean architecture with SOLID principles, 90%+ test coverage, and comprehensive error handling",
        "Scalability validation: Horizontal scaling capabilities tested under load with auto-scaling policies",
        "Database performance: Optimized queries with proper indexing, connection pooling, and sub-100ms response times",
        "Monitoring coverage: Complete observability with metrics, logs, traces, and automated alerting for SLA violations",
        "API design excellence: RESTful design principles, comprehensive OpenAPI documentation, and versioning strategy",
      ],
      "AI/ML Engineering": [
        "Model performance: Achieve target accuracy/precision/recall metrics with statistical significance testing",
        "Production readiness: Model serves predictions with sub-200ms latency at 1000+ requests/second",
        "Data quality validation: Comprehensive data pipeline testing with automated data quality checks and monitoring",
        "Model interpretability: Provide feature importance, prediction explanations, and bias detection reports",
        "MLOps implementation: Automated model training, validation, deployment pipeline with A/B testing capabilities",
        "Monitoring and alerting: Model drift detection, performance degradation alerts, and automated retraining triggers",
        "Ethical AI compliance: Fairness assessment across demographic groups and comprehensive bias mitigation strategies",
        "Documentation standards: Complete model cards, data lineage documentation, and reproducible experiment tracking",
      ],
      "Mobile Development": [
        "Performance optimization: App launch time under 3 seconds, smooth 60fps animations, and memory usage under 200MB",
        "Cross-platform compatibility: Consistent functionality and design across iOS and Android with platform-specific optimizations",
        "User experience quality: Intuitive navigation, accessibility features, and offline functionality with data synchronization",
        "App store readiness: Pass platform review guidelines, achieve 4.5+ star ratings in testing, and complete store metadata",
        "Security implementation: Secure data storage, API communication encryption, and biometric authentication where applicable",
        "Testing coverage: Comprehensive automated testing including unit tests, integration tests, and UI automation",
        "Analytics integration: User behavior tracking, crash reporting, and performance monitoring with actionable insights",
        "Battery and network optimization: Efficient battery usage, optimized network requests, and graceful offline handling",
      ],
      "DevOps Engineering": [
        "Infrastructure reliability: 99.99% uptime with automated failover, load balancing, and disaster recovery testing",
        "Deployment efficiency: Automated CI/CD pipeline with under 10-minute deployment times and zero-downtime deployments",
        "Security posture: Comprehensive security scanning in pipeline, secrets management, and compliance validation (SOC2/HIPAA)",
        "Monitoring excellence: Complete observability stack with custom dashboards, alerting, and incident response automation",
        "Cost optimization: Infrastructure costs optimized with auto-scaling, resource right-sizing, and cost monitoring",
        "Scalability validation: Load testing validates system can handle 10x current traffic with automatic scaling",
        "Documentation quality: Complete runbooks, architecture diagrams, and incident response procedures",
        "Compliance adherence: Automated compliance checking, audit trail maintenance, and regulatory requirement validation",
      ],
      "Security Engineering": [
        "Vulnerability assessment: Zero critical and high-risk vulnerabilities with automated scanning and remediation",
        "Penetration testing: Pass comprehensive security assessment including OWASP Top 10 and industry-specific threats",
        "Compliance validation: Meet relevant standards (SOC2, HIPAA, PCI DSS) with automated evidence collection",
        "Incident response: Sub-1-hour detection and response times with automated threat containment capabilities",
        "Identity and access management: Proper RBAC implementation with principle of least privilege and regular access reviews",
        "Data protection: End-to-end encryption implementation with proper key management and rotation procedures",
        "Security monitoring: SIEM integration with automated threat detection and behavioral analysis capabilities",
        "Security training: Comprehensive security awareness program with measurable improvement in security posture",
      ],
    };

    const fieldMetrics =
      comprehensiveMetrics[field as keyof typeof comprehensiveMetrics] ||
      comprehensiveMetrics["Full Stack Development"];
    const metricCount =
      difficulty === "Advanced" ? 6 : difficulty === "Intermediate" ? 5 : 4;
    const shuffled = [...fieldMetrics].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, metricCount);
  };

  // Select a random mission template
  const selectedTemplate =
    missionTemplates[Math.floor(Math.random() * missionTemplates.length)];

  // Add randomization to make each mission unique
  const companies = [
    "TechFlow",
    "DataCorp",
    "InnovateX",
    "ScaleTech",
    "CloudFirst",
    "AppMasters",
    "CodeCraft",
    "SystemPro",
  ];
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];

  // Create unique mission ID with timestamp for uniqueness
  const uniqueId = `fallback-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return {
    id: uniqueId,
    title: selectedTemplate.title,
    description: selectedTemplate.description,
    field: selectedTemplate.field,
    company: Math.random() > 0.5 ? selectedTemplate.company : randomCompany,
    context: selectedTemplate.context,
    difficulty,
    timeEstimate,
    category: selectedTemplate.field,
    status: "suggested",
    skills: selectedTemplate.skills,
    industries: selectedTemplate.industries,
    tasks: generateTasks(selectedTemplate.field, difficulty),
    objectives: generateObjectives(selectedTemplate.field),
    resources: generateResources(
      selectedTemplate.field,
      selectedTemplate.company
    ),
    evaluationMetrics: generateEvaluationMetrics(
      selectedTemplate.field,
      difficulty
    ),
  };
}

// Generate personalized missions using ChatGPT (legacy function)
export async function generatePersonalizedMissions(
  userSurveyData: any,
  companyProjects: any[] = [],
  count: number = 3
): Promise<MissionTemplate[]> {
  if (!openai) {
    console.warn("OpenAI not configured. Using fallback generation.");
    return generateMissionsFromResume(
      userSurveyData?.resume_text || "",
      userSurveyData?.interests || [],
      userSurveyData?.industry_preferences?.[0],
      userSurveyData?.experience_level || "Intermediate"
    );
  }

  try {
    const prompt = createPersonalizedPrompt(
      userSurveyData,
      companyProjects,
      count
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical career coach and mission designer. Generate personalized coding missions based on real company projects and user preferences. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const parsedResponse = JSON.parse(response);
    const missions = parsedResponse.missions || [];

    // Ensure missions have proper IDs and timestamps
    return missions.map((mission: any, index: number) => ({
      ...mission,
      id: mission.id || `generated-${Date.now()}-${index}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: inferCategory(mission.skills || []),
      tags: (mission.skills || []).slice(0, 3),
      timeLimit:
        mission.timeLimit || `${3 + Math.floor(Math.random() * 5)} days`,
      submissions: Math.floor(Math.random() * 200) + 50,
      details: mission.details || {
        overview: mission.description,
        requirements: generateRequirements(
          mission.title,
          mission.skills || [],
          () => Math.random()
        ),
        technologies: mission.skills || [],
        learningOutcomes: generateLearningOutcomes(mission.skills || [], () =>
          Math.random()
        ),
      },
    }));
  } catch (error) {
    console.error("Error generating missions with ChatGPT:", error);
    // Fallback to deterministic generation
    return generateMissionsFromResume(
      userSurveyData?.resume_text || "",
      userSurveyData?.interests || [],
      userSurveyData?.industry_preferences?.[0],
      userSurveyData?.experience_level || "Intermediate"
    );
  }
}

function createPersonalizedPrompt(
  userSurveyData: any,
  companyProjects: any[],
  count: number
): string {
  const {
    experience_level = "Intermediate",
    programming_languages = [],
    interests = [],
    career_goals = [],
    industry_preferences = [],
    preferred_project_types = [],
    resume_text = "",
    availability_hours_per_week = 5,
  } = userSurveyData || {};

  // Calculate time estimate based on availability
  const timeEstimate =
    availability_hours_per_week >= 10
      ? "4-6 hours"
      : availability_hours_per_week >= 5
      ? "2-4 hours"
      : "1-2 hours";

  // Select relevant company projects
  const relevantProjects = companyProjects.slice(0, 3);

  return `
Generate ${count} personalized coding missions based on the following user profile and real company projects:

USER PROFILE:
- Experience Level: ${experience_level}
- Programming Languages: ${programming_languages.join(", ")}
- Interests: ${interests.join(", ")}
- Career Goals: ${career_goals.join(", ")}
- Industry Preferences: ${industry_preferences.join(", ")}
- Preferred Project Types: ${preferred_project_types.join(", ")}
- Time Availability: ${timeEstimate} per mission
- Resume/Background: ${resume_text.substring(0, 500)}...

REAL COMPANY PROJECTS TO INSPIRE FROM:
${relevantProjects
  .map(
    (project) => `
- Company: ${project.company_name}
- Project: ${project.project_title}
- Description: ${project.project_description}
- Technologies: ${project.technologies_used?.join(", ")}
- Business Context: ${project.business_context}
`
  )
  .join("\n")}

REQUIREMENTS:
1. Generate exactly ${count} unique missions
2. Each mission should be inspired by the company projects above but personalized to the user's profile
3. Difficulty should match: ${experience_level}
4. Include technologies from user's known languages: ${programming_languages.join(
    ", "
  )}
5. Time estimate should be: ${timeEstimate}
6. Focus on industries: ${industry_preferences.join(", ") || "Technology"}

RESPONSE FORMAT (JSON only, no markdown):
{
  "missions": [
    {
      "title": "Clear, specific mission title",
      "description": "2-3 sentences describing what to build and why it matters",
      "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
      "industries": ["industry1", "industry2", "industry3"],
      "difficulty": "${experience_level}",
      "time_estimate": "${timeEstimate}",
      "details": {
        "overview": "Detailed explanation of the mission and learning goals",
        "requirements": ["requirement1", "requirement2", "requirement3", "requirement4"],
        "technologies": ["tech1", "tech2", "tech3", "tech4"],
        "learningOutcomes": ["outcome1", "outcome2", "outcome3", "outcome4"]
      }
    }
  ]
}

Make each mission feel like a real project from a top tech company. Be specific about technologies and business value.
`;
}

// Deterministic simulation function for generating missions
export function generateMissionsFromResume(
  resumeText: string = "",
  interests: string[] = [],
  industry?: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced" = "Intermediate",
  timeEstimate: string = "3-5 hours"
): MissionTemplate[] {
  // Create a deterministic seed based on input
  const seed = hashString(
    resumeText + interests.join("") + (industry || "") + difficulty
  );
  const rng = createSeededRandom(seed);

  // Base mission templates that can be customized
  const baseMissions = [
    {
      title: "Full-Stack E-commerce Platform",
      description:
        "Build a complete e-commerce solution with user authentication, product catalog, shopping cart, and payment integration. Focus on scalable architecture and responsive design.",
      baseSkills: ["React", "Node.js", "PostgreSQL", "Stripe API"],
      baseIndustries: ["E-commerce", "Retail", "Technology"],
    },
    {
      title: "Real-time Chat Application",
      description:
        "Create a scalable chat application with real-time messaging, user presence, file sharing, and message history. Implement WebSocket connections and optimize for performance.",
      baseSkills: ["WebSocket", "React", "Express", "MongoDB"],
      baseIndustries: ["Technology", "Communication", "Social Media"],
    },
    {
      title: "Data Analytics Dashboard",
      description:
        "Develop an interactive dashboard that processes large datasets, generates insights, and provides real-time visualizations. Include data filtering, export capabilities, and responsive charts.",
      baseSkills: ["Python", "Pandas", "D3.js", "FastAPI"],
      baseIndustries: ["Finance", "Healthcare", "Technology"],
    },
    {
      title: "AI-Powered Content Recommendation",
      description:
        "Build a machine learning system that analyzes user behavior and preferences to provide personalized content recommendations. Implement collaborative filtering and content-based algorithms.",
      baseSkills: ["Python", "TensorFlow", "Redis", "FastAPI"],
      baseIndustries: ["Media", "E-commerce", "Technology"],
    },
    {
      title: "Microservices API Gateway",
      description:
        "Design and implement a robust API gateway that handles authentication, rate limiting, load balancing, and service discovery for a microservices architecture.",
      baseSkills: ["Docker", "Kubernetes", "Go", "Redis"],
      baseIndustries: ["Technology", "Finance", "Healthcare"],
    },
    {
      title: "Mobile-First Progressive Web App",
      description:
        "Create a high-performance PWA with offline capabilities, push notifications, and native-like user experience. Focus on performance optimization and accessibility.",
      baseSkills: ["React", "Service Workers", "IndexedDB", "Web APIs"],
      baseIndustries: ["Technology", "Media", "E-commerce"],
    },
  ];

  // Select and customize missions based on interests and resume
  const selectedMissions = baseMissions
    .sort(() => rng() - 0.5) // Deterministic shuffle
    .slice(0, 3 + Math.floor(rng() * 3)) // 3-5 missions
    .map((mission, index) => {
      const customizedSkills = customizeSkills(
        mission.baseSkills,
        resumeText,
        interests,
        rng
      );
      const customizedIndustries = customizeIndustries(
        mission.baseIndustries,
        rng,
        industry,
        interests
      );

      const missionId = `generated-${Date.now()}-${index}`;
      return {
        id: missionId,
        title: customizeTitle(mission.title, interests, rng),
        description: mission.description,
        skills: customizedSkills,
        industries: customizedIndustries,
        difficulty,
        time_estimate: timeEstimate,
        category: inferCategory(customizedSkills),
        tags: customizedSkills.slice(0, 3),
        timeLimit: `${3 + Math.floor(rng() * 5)} days`,
        submissions: Math.floor(rng() * 200) + 50,
        details: {
          overview: `${
            mission.description
          } This comprehensive challenge will test your skills in ${customizedSkills
            .slice(0, 2)
            .join(" and ")} while building real-world solutions.`,
          requirements: generateRequirements(
            mission.title,
            customizedSkills,
            rng
          ),
          technologies: customizedSkills,
          learningOutcomes: generateLearningOutcomes(customizedSkills, rng),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

  return selectedMissions;
}

// Helper functions for deterministic customization
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function createSeededRandom(seed: number): () => number {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
    return state / Math.pow(2, 32);
  };
}

function customizeSkills(
  baseSkills: string[],
  resumeText: string,
  interests: string[],
  rng: () => number
): string[] {
  const additionalSkills = [
    "TypeScript",
    "GraphQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Redis",
    "MongoDB",
    "PostgreSQL",
    "Jest",
    "Cypress",
    "Terraform",
    "Jenkins",
    "Git",
    "Linux",
  ];

  // Add skills mentioned in resume or interests
  const resumeSkills = extractSkillsFromText(resumeText);
  const interestSkills = extractSkillsFromInterests(interests);

  const customizedSkills = [...baseSkills];

  // Add 2-3 additional relevant skills
  const relevantSkills = [
    ...resumeSkills,
    ...interestSkills,
    ...additionalSkills,
  ]
    .filter((skill) => !customizedSkills.includes(skill))
    .sort(() => rng() - 0.5)
    .slice(0, 2 + Math.floor(rng() * 2));

  return [...customizedSkills, ...relevantSkills].slice(0, 6);
}

function customizeIndustries(
  baseIndustries: string[],
  rng: () => number,
  industry?: string,
  interests: string[] = []
): string[] {
  const allIndustries = [
    "Technology",
    "Finance",
    "Healthcare",
    "E-commerce",
    "Media",
    "Education",
    "Gaming",
    "Automotive",
  ];

  let customizedIndustries = [...baseIndustries];

  if (industry && !customizedIndustries.includes(industry)) {
    customizedIndustries.push(industry);
  }

  // Add one more relevant industry
  const additionalIndustry = allIndustries
    .filter((ind) => !customizedIndustries.includes(ind))
    .sort(() => rng() - 0.5)[0];

  if (additionalIndustry) {
    customizedIndustries.push(additionalIndustry);
  }

  return customizedIndustries.slice(0, 3);
}

function customizeTitle(
  baseTitle: string,
  interests: string[],
  rng: () => number
): string {
  // Add slight variations based on interests
  const variations = {
    "Full-Stack E-commerce Platform": [
      "Modern E-commerce Platform",
      "Scalable Online Marketplace",
      "E-commerce Solution",
    ],
    "Real-time Chat Application": [
      "Live Messaging Platform",
      "Team Communication App",
      "Real-time Collaboration Tool",
    ],
    "Data Analytics Dashboard": [
      "Business Intelligence Dashboard",
      "Analytics Visualization Platform",
      "Data Insights Dashboard",
    ],
    "AI-Powered Content Recommendation": [
      "ML Recommendation Engine",
      "Personalization System",
      "Smart Content Platform",
    ],
    "Microservices API Gateway": [
      "Distributed Systems Gateway",
      "Service Mesh Architecture",
      "Cloud-Native API Platform",
    ],
    "Mobile-First Progressive Web App": [
      "Cross-Platform Web App",
      "Responsive PWA",
      "Mobile Web Application",
    ],
  };

  const titleVariations = variations[baseTitle as keyof typeof variations];
  if (titleVariations && rng() > 0.5) {
    return titleVariations[Math.floor(rng() * titleVariations.length)];
  }

  return baseTitle;
}

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
  ];

  return commonSkills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractSkillsFromInterests(interests: string[]): string[] {
  const interestToSkills: Record<string, string[]> = {
    "Frontend Development": ["React", "Vue", "Angular", "TypeScript"],
    "Backend Development": ["Node.js", "Python", "Java", "PostgreSQL"],
    "Full Stack Development": ["React", "Node.js", "PostgreSQL", "TypeScript"],
    "Mobile Development": ["React Native", "Flutter", "Swift", "Kotlin"],
    "Data Science": ["Python", "Pandas", "NumPy", "Jupyter"],
    "Machine Learning": ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
    DevOps: ["Docker", "Kubernetes", "AWS", "Terraform"],
    "Cloud Computing": ["AWS", "Azure", "GCP", "Docker"],
  };

  return interests.flatMap((interest) => interestToSkills[interest] || []);
}

function inferCategory(skills: string[]): string {
  const categoryKeywords = {
    Frontend: ["React", "Vue", "Angular", "CSS", "HTML"],
    Backend: ["Node.js", "Express", "Django", "Flask", "Spring"],
    "AI/ML": ["TensorFlow", "PyTorch", "Machine Learning", "AI"],
    DevOps: ["Docker", "Kubernetes", "AWS", "Terraform"],
    "Data Science": ["Pandas", "NumPy", "Jupyter", "Analytics"],
    Mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (
      keywords.some((keyword) =>
        skills.some((skill) => skill.includes(keyword))
      )
    ) {
      return category;
    }
  }

  return "Full Stack";
}

function generateRequirements(
  title: string,
  skills: string[],
  rng: () => number
): string[] {
  const baseRequirements = [
    "Design and implement the core system architecture",
    "Write comprehensive documentation",
    "Include proper error handling and validation",
    "Implement testing strategies",
    "Optimize for performance and scalability",
  ];

  const skillSpecificRequirements: Record<string, string[]> = {
    React: ["Create responsive user interfaces", "Implement state management"],
    "Node.js": ["Build RESTful APIs", "Handle asynchronous operations"],
    Python: ["Write clean, pythonic code", "Implement data processing logic"],
    Docker: ["Containerize the application", "Create multi-stage builds"],
    AWS: ["Deploy to cloud infrastructure", "Configure auto-scaling"],
    PostgreSQL: [
      "Design efficient database schemas",
      "Optimize query performance",
    ],
    TypeScript: [
      "Implement strict type checking",
      "Create reusable type definitions",
    ],
  };

  const requirements = [...baseRequirements];

  // Add skill-specific requirements
  skills.forEach((skill) => {
    const specificReqs = skillSpecificRequirements[skill];
    if (specificReqs && rng() > 0.5) {
      requirements.push(specificReqs[Math.floor(rng() * specificReqs.length)]);
    }
  });

  return requirements.slice(0, 5).sort(() => rng() - 0.5);
}

function generateLearningOutcomes(
  skills: string[],
  rng: () => number
): string[] {
  const baseOutcomes = [
    "Best practices for software architecture",
    "Code organization and maintainability",
    "Testing and quality assurance",
    "Performance optimization techniques",
  ];

  const skillSpecificOutcomes: Record<string, string[]> = {
    React: [
      "Modern React patterns and hooks",
      "Component composition strategies",
    ],
    "Node.js": ["Asynchronous programming patterns", "Server-side development"],
    Python: ["Data manipulation and analysis", "Object-oriented programming"],
    Docker: ["Containerization strategies", "DevOps fundamentals"],
    AWS: ["Cloud architecture patterns", "Scalable infrastructure design"],
    "Machine Learning": [
      "ML model development",
      "Data preprocessing techniques",
    ],
    TypeScript: ["Type-safe development", "Advanced TypeScript features"],
  };

  const outcomes = [...baseOutcomes];

  // Add skill-specific outcomes
  skills.forEach((skill) => {
    const specificOutcomes = skillSpecificOutcomes[skill];
    if (specificOutcomes && rng() > 0.4) {
      outcomes.push(
        specificOutcomes[Math.floor(rng() * specificOutcomes.length)]
      );
    }
  });

  return outcomes.slice(0, 4).sort(() => rng() - 0.5);
}
