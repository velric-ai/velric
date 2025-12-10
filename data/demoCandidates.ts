// data/demoCandidates.ts
// Demo candidate profiles for showcasing the platform

export interface DemoCandidate {
  id: string;
  name: string;
  email: string;
  onboarded: boolean;
  profile_complete: boolean;
  velricScore: number;
  missionsCompleted: number;
  domain?: string;
  location?: string;
  industry?: string;
  mission_focus?: string[];
  strength_areas?: string[];
  experience_summary?: string;
  education_level?: string;
  learning_preference?: string;
  skills?: string[];
  clusters?: string[];
  profile_image?: string | null;
  logistics_preferences?: {
    current_region?: string;
    legal_work_regions?: string[];
    sponsorship_consideration?: string;
    relocation_openness?: string;
    remote_work_international?: string;
  };
  interview_availability?: {
    timeSlots?: Array<{ day: string; startTime: string; endTime: string }>;
    timezone?: string;
  };
  about?: string;
  linkedin?: string;
  github?: string;
}

export const demoCandidates: DemoCandidate[] = [
  {
    id: "demo_1",
    name: "Alexandra Chen",
    email: "alexandra.chen@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 9.4,
    missionsCompleted: 12,
    domain: "Frontend Development",
    location: "San Francisco, CA",
    industry: "Technology & Software",
    mission_focus: ["Frontend Development", "React", "TypeScript"],
    strength_areas: ["Problem Solving", "Technical Implementation", "UI/UX Design"],
    experience_summary: "Senior Frontend Engineer with 6+ years building scalable web applications. Expert in React, TypeScript, and modern design systems. Led UI redesigns that increased user engagement by 45%.",
    education_level: "Bachelor's Degree in Computer Science",
    learning_preference: "Hands-on projects",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Figma", "Jest", "Cypress"],
    clusters: ["Technology & Software", "Frontend Development"],
    about: "Passionate about creating beautiful, accessible user interfaces. Love working with design systems and building component libraries. Always learning new frameworks and best practices.",
    linkedin: "linkedin.com/in/alexandrachen",
    github: "github.com/alexandrachen",
    logistics_preferences: {
      current_region: "San Francisco Bay Area",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "only_some",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Pacific Time (PT)",
      timeSlots: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "10:00", endTime: "15:00" }
      ]
    }
  },
  {
    id: "demo_2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 9.1,
    missionsCompleted: 15,
    domain: "Backend Development",
    location: "Austin, TX",
    industry: "Technology & Software",
    mission_focus: ["Backend Development", "System Design", "Cloud Infrastructure"],
    strength_areas: ["System Architecture", "Performance Optimization", "Technical Leadership"],
    experience_summary: "Backend Engineer specializing in distributed systems and microservices. Built APIs handling 10M+ requests daily. Expert in Node.js, Python, and AWS cloud infrastructure.",
    education_level: "Master's Degree in Software Engineering",
    learning_preference: "Technical deep-dives",
    skills: ["Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes", "GraphQL", "gRPC"],
    clusters: ["Technology & Software", "Backend Development"],
    about: "Fascinated by scalable systems and distributed computing. Enjoy solving complex technical challenges and mentoring junior engineers. Open source contributor.",
    linkedin: "linkedin.com/in/marcusrodriguez",
    github: "github.com/marcusrodriguez",
    logistics_preferences: {
      current_region: "Austin, Texas",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "anywhere",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Central Time (CT)",
      timeSlots: [
        { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
        { day: "Thursday", startTime: "10:00", endTime: "18:00" }
      ]
    }
  },
  {
    id: "demo_3",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 8.9,
    missionsCompleted: 10,
    domain: "Full Stack Development",
    location: "Seattle, WA",
    industry: "Technology & Software",
    mission_focus: ["Full Stack Development", "React", "Node.js"],
    strength_areas: ["Full Stack Implementation", "API Design", "Database Optimization"],
    experience_summary: "Full Stack Developer with 5 years of experience building end-to-end web applications. Proficient in React, Node.js, and PostgreSQL. Delivered multiple production applications from concept to deployment.",
    education_level: "Bachelor's Degree in Computer Science",
    learning_preference: "Project-based learning",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Express", "Next.js", "AWS"],
    clusters: ["Technology & Software", "Full Stack Development"],
    about: "Love building products from the ground up. Strong believer in clean code and test-driven development. Always excited to work on challenging problems.",
    linkedin: "linkedin.com/in/priyasharma",
    github: "github.com/priyasharma",
    logistics_preferences: {
      current_region: "Seattle, Washington",
      legal_work_regions: ["United States", "Canada"],
      sponsorship_consideration: "no",
      relocation_openness: "only_some",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Pacific Time (PT)",
      timeSlots: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "09:00", endTime: "16:00" }
      ]
    }
  },
  {
    id: "demo_4",
    name: "David Kim",
    email: "david.kim@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 9.6,
    missionsCompleted: 18,
    domain: "Data Science",
    location: "New York, NY",
    industry: "Data Science & Analytics",
    mission_focus: ["Data Science", "Machine Learning", "Python"],
    strength_areas: ["Statistical Analysis", "Machine Learning", "Data Visualization"],
    experience_summary: "Data Scientist with 7+ years transforming raw data into actionable insights. Built predictive models with 90%+ accuracy. Expert in Python, SQL, and machine learning frameworks.",
    education_level: "Ph.D. in Data Science",
    learning_preference: "Research and experimentation",
    skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "SQL", "Tableau", "Jupyter"],
    clusters: ["Data Science & Analytics"],
    about: "Passionate about using data to solve real-world problems. Published researcher in machine learning. Love working on challenging datasets and building models that make a difference.",
    linkedin: "linkedin.com/in/davidkim",
    github: "github.com/davidkim",
    logistics_preferences: {
      current_region: "New York, New York",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "depends",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Eastern Time (ET)",
      timeSlots: [
        { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
        { day: "Thursday", startTime: "10:00", endTime: "18:00" }
      ]
    }
  },
  {
    id: "demo_5",
    name: "Sophie Anderson",
    email: "sophie.anderson@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 8.7,
    missionsCompleted: 9,
    domain: "Product Management",
    location: "Los Angeles, CA",
    industry: "Product Management",
    mission_focus: ["Product Strategy", "User Research", "Roadmap Planning"],
    strength_areas: ["Strategic Thinking", "User Research", "Cross-functional Collaboration"],
    experience_summary: "Product Manager with 5 years leading product initiatives at fast-growing startups. Launched 3 successful products with 100K+ users. Strong background in user research and data-driven decision making.",
    education_level: "MBA in Product Management",
    learning_preference: "Case studies and mentorship",
    skills: ["Product Strategy", "User Research", "Data Analysis", "Figma", "Jira", "SQL", "A/B Testing"],
    clusters: ["Product Management"],
    about: "Love building products that users actually want. Strong believer in user-centric design and iterative development. Enjoy working closely with engineering and design teams.",
    linkedin: "linkedin.com/in/sophieanderson",
    logistics_preferences: {
      current_region: "Los Angeles, California",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "only_some",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Pacific Time (PT)",
      timeSlots: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "10:00", endTime: "15:00" }
      ]
    }
  },
  {
    id: "demo_6",
    name: "James Park",
    email: "james.park@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 9.3,
    missionsCompleted: 14,
    domain: "DevOps",
    location: "Chicago, IL",
    industry: "Technology & Software",
    mission_focus: ["DevOps", "Cloud Infrastructure", "CI/CD"],
    strength_areas: ["Infrastructure Automation", "System Reliability", "Performance Optimization"],
    experience_summary: "DevOps Engineer with 6 years automating infrastructure and building scalable CI/CD pipelines. Reduced deployment time by 80% and improved system uptime to 99.9%. Expert in AWS, Kubernetes, and Terraform.",
    education_level: "Bachelor's Degree in Computer Engineering",
    learning_preference: "Hands-on infrastructure work",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "GitLab CI", "Ansible", "Python", "Bash"],
    clusters: ["Technology & Software", "DevOps"],
    about: "Passionate about infrastructure as code and automation. Love building reliable systems that scale. Always exploring new tools and best practices in DevOps.",
    linkedin: "linkedin.com/in/jamespark",
    github: "github.com/jamespark",
    logistics_preferences: {
      current_region: "Chicago, Illinois",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "anywhere",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Central Time (CT)",
      timeSlots: [
        { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
        { day: "Thursday", startTime: "09:00", endTime: "17:00" }
      ]
    }
  },
  {
    id: "demo_7",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 8.8,
    missionsCompleted: 11,
    domain: "UI/UX Design",
    location: "Portland, OR",
    industry: "Design & Creative",
    mission_focus: ["UI/UX Design", "User Research", "Design Systems"],
    strength_areas: ["Visual Design", "User Experience", "Prototyping"],
    experience_summary: "Senior UI/UX Designer with 5+ years creating intuitive digital experiences. Designed products used by millions. Expert in Figma, user research, and design systems.",
    education_level: "Bachelor's Degree in Design",
    learning_preference: "Design critiques and workshops",
    skills: ["Figma", "Sketch", "Adobe XD", "User Research", "Prototyping", "Design Systems", "HTML", "CSS"],
    clusters: ["Design & Creative"],
    about: "Believe great design is invisible - it just works. Love solving complex UX problems and creating beautiful, accessible interfaces. Always learning from users.",
    linkedin: "linkedin.com/in/emmawilson",
    logistics_preferences: {
      current_region: "Portland, Oregon",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "only_some",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Pacific Time (PT)",
      timeSlots: [
        { day: "Monday", startTime: "10:00", endTime: "18:00" },
        { day: "Wednesday", startTime: "10:00", endTime: "18:00" }
      ]
    }
  },
  {
    id: "demo_8",
    name: "Ryan O'Connor",
    email: "ryan.oconnor@example.com",
    onboarded: true,
    profile_complete: true,
    velricScore: 9.0,
    missionsCompleted: 13,
    domain: "Mobile Development",
    location: "Boston, MA",
    industry: "Technology & Software",
    mission_focus: ["Mobile Development", "React Native", "iOS"],
    strength_areas: ["Mobile Architecture", "Performance Optimization", "Cross-platform Development"],
    experience_summary: "Mobile Developer with 6 years building iOS and Android applications. Launched 5 apps with 500K+ downloads. Expert in React Native, Swift, and Kotlin.",
    education_level: "Bachelor's Degree in Computer Science",
    learning_preference: "Building real apps",
    skills: ["React Native", "Swift", "Kotlin", "iOS", "Android", "TypeScript", "Firebase", "App Store"],
    clusters: ["Technology & Software", "Mobile Development"],
    about: "Love building mobile apps that people use every day. Passionate about smooth animations and great user experiences. Always keeping up with latest mobile trends.",
    linkedin: "linkedin.com/in/ryanoconnor",
    github: "github.com/ryanoconnor",
    logistics_preferences: {
      current_region: "Boston, Massachusetts",
      legal_work_regions: ["United States"],
      sponsorship_consideration: "no",
      relocation_openness: "depends",
      remote_work_international: "yes"
    },
    interview_availability: {
      timezone: "Eastern Time (ET)",
      timeSlots: [
        { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
        { day: "Thursday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "10:00", endTime: "15:00" }
      ]
    }
  }
];
