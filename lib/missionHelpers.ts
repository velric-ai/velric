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