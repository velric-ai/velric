// lib/ai.ts
import { MissionTemplate } from '@/types';
import OpenAI from 'openai';

// Initialize OpenAI client
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('OpenAI API key not configured. Mission generation will use fallback method.');
}

if (typeof window === 'undefined' && process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Production-ready prompt template for AI mission generation
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

// Generate personalized missions using ChatGPT
export async function generatePersonalizedMissions(
  userSurveyData: any,
  companyProjects: any[] = [],
  count: number = 3
): Promise<MissionTemplate[]> {
  if (!openai) {
    console.warn('OpenAI not configured. Using fallback generation.');
    return generateMissionsFromResume(
      userSurveyData?.resume_text || '',
      userSurveyData?.interests || [],
      userSurveyData?.industry_preferences?.[0],
      userSurveyData?.experience_level || 'Intermediate'
    );
  }

  try {
    const prompt = createPersonalizedPrompt(userSurveyData, companyProjects, count);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert technical career coach and mission designer. Generate personalized coding missions based on real company projects and user preferences. Return valid JSON only."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
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
      timeLimit: mission.timeLimit || `${3 + Math.floor(Math.random() * 5)} days`,
      submissions: Math.floor(Math.random() * 200) + 50,
      details: mission.details || {
        overview: mission.description,
        requirements: generateRequirements(mission.title, mission.skills || [], () => Math.random()),
        technologies: mission.skills || [],
        learningOutcomes: generateLearningOutcomes(mission.skills || [], () => Math.random())
      }
    }));
  } catch (error) {
    console.error('Error generating missions with ChatGPT:', error);
    // Fallback to deterministic generation
    return generateMissionsFromResume(
      userSurveyData?.resume_text || '',
      userSurveyData?.interests || [],
      userSurveyData?.industry_preferences?.[0],
      userSurveyData?.experience_level || 'Intermediate'
    );
  }
}

function createPersonalizedPrompt(userSurveyData: any, companyProjects: any[], count: number): string {
  const {
    experience_level = 'Intermediate',
    programming_languages = [],
    interests = [],
    career_goals = [],
    industry_preferences = [],
    preferred_project_types = [],
    resume_text = '',
    availability_hours_per_week = 5
  } = userSurveyData || {};

  // Calculate time estimate based on availability
  const timeEstimate = availability_hours_per_week >= 10 ? '4-6 hours' : 
                      availability_hours_per_week >= 5 ? '2-4 hours' : '1-2 hours';

  // Select relevant company projects
  const relevantProjects = companyProjects.slice(0, 3);

  return `
Generate ${count} personalized coding missions based on the following user profile and real company projects:

USER PROFILE:
- Experience Level: ${experience_level}
- Programming Languages: ${programming_languages.join(', ')}
- Interests: ${interests.join(', ')}
- Career Goals: ${career_goals.join(', ')}
- Industry Preferences: ${industry_preferences.join(', ')}
- Preferred Project Types: ${preferred_project_types.join(', ')}
- Time Availability: ${timeEstimate} per mission
- Resume/Background: ${resume_text.substring(0, 500)}...

REAL COMPANY PROJECTS TO INSPIRE FROM:
${relevantProjects.map(project => `
- Company: ${project.company_name}
- Project: ${project.project_title}
- Description: ${project.project_description}
- Technologies: ${project.technologies_used?.join(', ')}
- Business Context: ${project.business_context}
`).join('\n')}

REQUIREMENTS:
1. Generate exactly ${count} unique missions
2. Each mission should be inspired by the company projects above but personalized to the user's profile
3. Difficulty should match: ${experience_level}
4. Include technologies from user's known languages: ${programming_languages.join(', ')}
5. Time estimate should be: ${timeEstimate}
6. Focus on industries: ${industry_preferences.join(', ') || 'Technology'}

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
  resumeText: string = '',
  interests: string[] = [],
  industry?: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
  timeEstimate: string = '3-5 hours'
): MissionTemplate[] {
  // Create a deterministic seed based on input
  const seed = hashString(resumeText + interests.join('') + (industry || '') + difficulty);
  const rng = createSeededRandom(seed);
  
  // Base mission templates that can be customized
  const baseMissions = [
    {
      title: 'Full-Stack E-commerce Platform',
      description: 'Build a complete e-commerce solution with user authentication, product catalog, shopping cart, and payment integration. Focus on scalable architecture and responsive design.',
      baseSkills: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
      baseIndustries: ['E-commerce', 'Retail', 'Technology']
    },
    {
      title: 'Real-time Chat Application',
      description: 'Create a scalable chat application with real-time messaging, user presence, file sharing, and message history. Implement WebSocket connections and optimize for performance.',
      baseSkills: ['WebSocket', 'React', 'Express', 'MongoDB'],
      baseIndustries: ['Technology', 'Communication', 'Social Media']
    },
    {
      title: 'Data Analytics Dashboard',
      description: 'Develop an interactive dashboard that processes large datasets, generates insights, and provides real-time visualizations. Include data filtering, export capabilities, and responsive charts.',
      baseSkills: ['Python', 'Pandas', 'D3.js', 'FastAPI'],
      baseIndustries: ['Finance', 'Healthcare', 'Technology']
    },
    {
      title: 'AI-Powered Content Recommendation',
      description: 'Build a machine learning system that analyzes user behavior and preferences to provide personalized content recommendations. Implement collaborative filtering and content-based algorithms.',
      baseSkills: ['Python', 'TensorFlow', 'Redis', 'FastAPI'],
      baseIndustries: ['Media', 'E-commerce', 'Technology']
    },
    {
      title: 'Microservices API Gateway',
      description: 'Design and implement a robust API gateway that handles authentication, rate limiting, load balancing, and service discovery for a microservices architecture.',
      baseSkills: ['Docker', 'Kubernetes', 'Go', 'Redis'],
      baseIndustries: ['Technology', 'Finance', 'Healthcare']
    },
    {
      title: 'Mobile-First Progressive Web App',
      description: 'Create a high-performance PWA with offline capabilities, push notifications, and native-like user experience. Focus on performance optimization and accessibility.',
      baseSkills: ['React', 'Service Workers', 'IndexedDB', 'Web APIs'],
      baseIndustries: ['Technology', 'Media', 'E-commerce']
    }
  ];
  
  // Select and customize missions based on interests and resume
  const selectedMissions = baseMissions
    .sort(() => rng() - 0.5) // Deterministic shuffle
    .slice(0, 3 + Math.floor(rng() * 3)) // 3-5 missions
    .map((mission, index) => {
      const customizedSkills = customizeSkills(mission.baseSkills, resumeText, interests, rng);
      const customizedIndustries = customizeIndustries(mission.baseIndustries, rng, industry, interests);
      
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
          overview: `${mission.description} This comprehensive challenge will test your skills in ${customizedSkills.slice(0, 2).join(' and ')} while building real-world solutions.`,
          requirements: generateRequirements(mission.title, customizedSkills, rng),
          technologies: customizedSkills,
          learningOutcomes: generateLearningOutcomes(customizedSkills, rng)
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
  
  return selectedMissions;
}

// Helper functions for deterministic customization
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function createSeededRandom(seed: number): () => number {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
    return state / Math.pow(2, 32);
  };
}

function customizeSkills(baseSkills: string[], resumeText: string, interests: string[], rng: () => number): string[] {
  const additionalSkills = [
    'TypeScript', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'MongoDB',
    'PostgreSQL', 'Jest', 'Cypress', 'Terraform', 'Jenkins', 'Git', 'Linux'
  ];
  
  // Add skills mentioned in resume or interests
  const resumeSkills = extractSkillsFromText(resumeText);
  const interestSkills = extractSkillsFromInterests(interests);
  
  const customizedSkills = [...baseSkills];
  
  // Add 2-3 additional relevant skills
  const relevantSkills = [...resumeSkills, ...interestSkills, ...additionalSkills]
    .filter(skill => !customizedSkills.includes(skill))
    .sort(() => rng() - 0.5)
    .slice(0, 2 + Math.floor(rng() * 2));
  
  return [...customizedSkills, ...relevantSkills].slice(0, 6);
}

function customizeIndustries(baseIndustries: string[], rng: () => number, industry?: string, interests: string[] = []): string[] {
  const allIndustries = ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Media', 'Education', 'Gaming', 'Automotive'];
  
  let customizedIndustries = [...baseIndustries];
  
  if (industry && !customizedIndustries.includes(industry)) {
    customizedIndustries.push(industry);
  }
  
  // Add one more relevant industry
  const additionalIndustry = allIndustries
    .filter(ind => !customizedIndustries.includes(ind))
    .sort(() => rng() - 0.5)[0];
  
  if (additionalIndustry) {
    customizedIndustries.push(additionalIndustry);
  }
  
  return customizedIndustries.slice(0, 3);
}

function customizeTitle(baseTitle: string, interests: string[], rng: () => number): string {
  // Add slight variations based on interests
  const variations = {
    'Full-Stack E-commerce Platform': ['Modern E-commerce Platform', 'Scalable Online Marketplace', 'E-commerce Solution'],
    'Real-time Chat Application': ['Live Messaging Platform', 'Team Communication App', 'Real-time Collaboration Tool'],
    'Data Analytics Dashboard': ['Business Intelligence Dashboard', 'Analytics Visualization Platform', 'Data Insights Dashboard'],
    'AI-Powered Content Recommendation': ['ML Recommendation Engine', 'Personalization System', 'Smart Content Platform'],
    'Microservices API Gateway': ['Distributed Systems Gateway', 'Service Mesh Architecture', 'Cloud-Native API Platform'],
    'Mobile-First Progressive Web App': ['Cross-Platform Web App', 'Responsive PWA', 'Mobile Web Application']
  };
  
  const titleVariations = variations[baseTitle as keyof typeof variations];
  if (titleVariations && rng() > 0.5) {
    return titleVariations[Math.floor(rng() * titleVariations.length)];
  }
  
  return baseTitle;
}

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue', 'Angular',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'PostgreSQL', 'MySQL',
    'MongoDB', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractSkillsFromInterests(interests: string[]): string[] {
  const interestToSkills: Record<string, string[]> = {
    'Frontend Development': ['React', 'Vue', 'Angular', 'TypeScript'],
    'Backend Development': ['Node.js', 'Python', 'Java', 'PostgreSQL'],
    'Full Stack Development': ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    'Data Science': ['Python', 'Pandas', 'NumPy', 'Jupyter'],
    'Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    'Cloud Computing': ['AWS', 'Azure', 'GCP', 'Docker']
  };
  
  return interests.flatMap(interest => interestToSkills[interest] || []);
}

function inferCategory(skills: string[]): string {
  const categoryKeywords = {
    'Frontend': ['React', 'Vue', 'Angular', 'CSS', 'HTML'],
    'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring'],
    'AI/ML': ['TensorFlow', 'PyTorch', 'Machine Learning', 'AI'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    'Data Science': ['Pandas', 'NumPy', 'Jupyter', 'Analytics'],
    'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => skills.some(skill => skill.includes(keyword)))) {
      return category;
    }
  }
  
  return 'Full Stack';
}

function generateRequirements(title: string, skills: string[], rng: () => number): string[] {
  const baseRequirements = [
    'Design and implement the core system architecture',
    'Write comprehensive documentation',
    'Include proper error handling and validation',
    'Implement testing strategies',
    'Optimize for performance and scalability'
  ];
  
  const skillSpecificRequirements: Record<string, string[]> = {
    'React': ['Create responsive user interfaces', 'Implement state management'],
    'Node.js': ['Build RESTful APIs', 'Handle asynchronous operations'],
    'Python': ['Write clean, pythonic code', 'Implement data processing logic'],
    'Docker': ['Containerize the application', 'Create multi-stage builds'],
    'AWS': ['Deploy to cloud infrastructure', 'Configure auto-scaling'],
    'PostgreSQL': ['Design efficient database schemas', 'Optimize query performance'],
    'TypeScript': ['Implement strict type checking', 'Create reusable type definitions']
  };
  
  const requirements = [...baseRequirements];
  
  // Add skill-specific requirements
  skills.forEach(skill => {
    const specificReqs = skillSpecificRequirements[skill];
    if (specificReqs && rng() > 0.5) {
      requirements.push(specificReqs[Math.floor(rng() * specificReqs.length)]);
    }
  });
  
  return requirements.slice(0, 5).sort(() => rng() - 0.5);
}

function generateLearningOutcomes(skills: string[], rng: () => number): string[] {
  const baseOutcomes = [
    'Best practices for software architecture',
    'Code organization and maintainability',
    'Testing and quality assurance',
    'Performance optimization techniques'
  ];
  
  const skillSpecificOutcomes: Record<string, string[]> = {
    'React': ['Modern React patterns and hooks', 'Component composition strategies'],
    'Node.js': ['Asynchronous programming patterns', 'Server-side development'],
    'Python': ['Data manipulation and analysis', 'Object-oriented programming'],
    'Docker': ['Containerization strategies', 'DevOps fundamentals'],
    'AWS': ['Cloud architecture patterns', 'Scalable infrastructure design'],
    'Machine Learning': ['ML model development', 'Data preprocessing techniques'],
    'TypeScript': ['Type-safe development', 'Advanced TypeScript features']
  };
  
  const outcomes = [...baseOutcomes];
  
  // Add skill-specific outcomes
  skills.forEach(skill => {
    const specificOutcomes = skillSpecificOutcomes[skill];
    if (specificOutcomes && rng() > 0.4) {
      outcomes.push(specificOutcomes[Math.floor(rng() * specificOutcomes.length)]);
    }
  });
  
  return outcomes.slice(0, 4).sort(() => rng() - 0.5);
}