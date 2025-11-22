// Skill clustering system for organizing skills into high-level topics and subtopics

export interface SkillCluster {
  id: string;
  name: string;
  category: 'technical' | 'non-technical';
  parent?: string; // ID of parent cluster for subtopics
  keywords: string[]; // Skills/keywords that map to this cluster
  color: string;
}

export interface CandidateClusters {
  core_stack: string[]; // Primary technical clusters (3-6)
  domain_tags: string[]; // Domain expertise areas
  strength_tags: string[]; // Key strengths
  coverage_scores: Record<string, number>; // Coverage scores for each area
}

// Define skill clusters with hierarchy
export const skillClusters: SkillCluster[] = [
  // High-level: Finance
  {
    id: 'finance',
    name: 'Finance',
    category: 'non-technical',
    keywords: ['finance', 'financial', 'accounting', 'banking', 'investment'],
    color: '#10b981'
  },
  {
    id: 'consulting',
    name: 'Consulting',
    category: 'non-technical',
    parent: 'finance',
    keywords: ['consulting', 'strategy', 'management consulting', 'mckinsey', 'bain', 'bcg'],
    color: '#3b82f6'
  },
  {
    id: 'investment_banking',
    name: 'Investment Banking',
    category: 'non-technical',
    parent: 'finance',
    keywords: ['investment banking', 'ib', 'm&a', 'mergers', 'acquisitions', 'capital markets'],
    color: '#8b5cf6'
  },
  {
    id: 'quantitative_finance',
    name: 'Quantitative Finance',
    category: 'non-technical',
    parent: 'finance',
    keywords: ['quant', 'quantitative', 'trading', 'risk', 'derivatives', 'options'],
    color: '#f59e0b'
  },

  // High-level: Marketing
  {
    id: 'marketing',
    name: 'Marketing',
    category: 'non-technical',
    keywords: ['marketing', 'brand', 'advertising', 'promotion'],
    color: '#ec4899'
  },
  {
    id: 'digital_marketing',
    name: 'Digital Marketing',
    category: 'non-technical',
    parent: 'marketing',
    keywords: ['digital marketing', 'seo', 'sem', 'ppc', 'google ads', 'facebook ads'],
    color: '#06b6d4'
  },
  {
    id: 'social_media',
    name: 'Social Media',
    category: 'non-technical',
    parent: 'marketing',
    keywords: ['social media', 'instagram', 'twitter', 'tiktok', 'linkedin marketing'],
    color: '#a78bfa'
  },
  {
    id: 'ugc',
    name: 'UGC',
    category: 'non-technical',
    parent: 'marketing',
    keywords: ['ugc', 'user generated content', 'content creation', 'influencer'],
    color: '#f472b6'
  },
  {
    id: 'content_strategy',
    name: 'Content Strategy',
    category: 'non-technical',
    parent: 'marketing',
    keywords: ['content strategy', 'content marketing', 'copywriting', 'blogging'],
    color: '#14b8a6'
  },
  {
    id: 'growth',
    name: 'Growth',
    category: 'non-technical',
    parent: 'marketing',
    keywords: ['growth', 'growth marketing', 'growth hacking', 'user acquisition'],
    color: '#f97316'
  },

  // High-level: Engineering
  {
    id: 'engineering',
    name: 'Engineering',
    category: 'technical',
    keywords: ['engineering', 'software', 'development'],
    color: '#3b82f6'
  },
  {
    id: 'frontend',
    name: 'Frontend Engineering',
    category: 'technical',
    parent: 'engineering',
    keywords: ['frontend', 'react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'next.js'],
    color: '#00f5ff'
  },
  {
    id: 'backend',
    name: 'Backend Engineering',
    category: 'technical',
    parent: 'engineering',
    keywords: ['backend', 'node.js', 'python', 'java', 'go', 'rust', 'api', 'rest', 'graphql', 'server'],
    color: '#f472b6'
  },
  {
    id: 'fullstack',
    name: 'Full Stack',
    category: 'technical',
    parent: 'engineering',
    keywords: ['fullstack', 'full stack', 'full-stack'],
    color: '#8b5cf6'
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    category: 'technical',
    parent: 'engineering',
    keywords: ['mobile', 'ios', 'android', 'react native', 'swift', 'kotlin', 'flutter'],
    color: '#3b82f6'
  },
  {
    id: 'devops',
    name: 'DevOps & Infrastructure',
    category: 'technical',
    parent: 'engineering',
    keywords: ['devops', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'terraform'],
    color: '#f59e0b'
  },

  // High-level: AI/ML
  {
    id: 'ai_ml',
    name: 'AI & Machine Learning',
    category: 'technical',
    keywords: ['ai', 'machine learning', 'ml', 'deep learning', 'neural network', 'tensorflow', 'pytorch', 'nlp'],
    color: '#a78bfa'
  },

  // High-level: Data
  {
    id: 'data',
    name: 'Data',
    category: 'technical',
    keywords: ['data', 'analytics', 'sql', 'python', 'pandas', 'tableau', 'power bi'],
    color: '#00ff87'
  },
  {
    id: 'data_engineering',
    name: 'Data Engineering',
    category: 'technical',
    parent: 'data',
    keywords: ['data engineering', 'etl', 'airflow', 'dbt', 'data pipeline', 'spark'],
    color: '#06b6d4'
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics',
    category: 'technical',
    parent: 'data',
    keywords: ['data analytics', 'business intelligence', 'bi', 'analytics', 'reporting'],
    color: '#10b981'
  },
  {
    id: 'data_science',
    name: 'Data Science',
    category: 'technical',
    parent: 'data',
    keywords: ['data science', 'statistics', 'modeling', 'predictive', 'scikit-learn'],
    color: '#8b5cf6'
  },

  // High-level: Product
  {
    id: 'product',
    name: 'Product',
    category: 'non-technical',
    keywords: ['product', 'product management', 'pm', 'product strategy'],
    color: '#f59e0b'
  },
  {
    id: 'product_design',
    name: 'Product Design',
    category: 'non-technical',
    parent: 'product',
    keywords: ['product design', 'ux', 'ui', 'user experience', 'user interface', 'figma', 'design'],
    color: '#ec4899'
  },
  {
    id: 'ui_ux',
    name: 'UI/UX',
    category: 'non-technical',
    parent: 'product',
    keywords: ['ui/ux', 'ui', 'ux', 'user experience', 'user interface', 'figma', 'sketch'],
    color: '#a78bfa'
  },

  // High-level: Consulting (standalone)
  {
    id: 'strategy',
    name: 'Strategy',
    category: 'non-technical',
    keywords: ['strategy', 'strategic planning', 'business strategy'],
    color: '#06b6d4'
  },
];

/**
 * Maps a skill to relevant clusters
 */
export function mapSkillToClusters(skill: string): string[] {
  const skillLower = skill.toLowerCase();
  const matchedClusters: string[] = [];

  for (const cluster of skillClusters) {
    if (cluster.keywords.some(keyword => skillLower.includes(keyword.toLowerCase()))) {
      matchedClusters.push(cluster.id);
      // Also include parent if it's a subtopic
      if (cluster.parent) {
        matchedClusters.push(cluster.parent);
      }
    }
  }

  return [...new Set(matchedClusters)]; // Remove duplicates
}

/**
 * Generates clusters for a candidate based on their skills
 */
export function generateCandidateClusters(skills: string[]): CandidateClusters {
  const clusterCounts: Record<string, number> = {};
  const allMatchedClusters: string[] = [];

  // Count matches for each cluster
  for (const skill of skills) {
    const matched = mapSkillToClusters(skill);
    allMatchedClusters.push(...matched);
    for (const clusterId of matched) {
      clusterCounts[clusterId] = (clusterCounts[clusterId] || 0) + 1;
    }
  }

  // Get top clusters (prioritize subtopics over parents)
  const sortedClusters = Object.entries(clusterCounts)
    .sort((a, b) => {
      const clusterA = skillClusters.find(c => c.id === a[0]);
      const clusterB = skillClusters.find(c => c.id === b[0]);
      
      // Prefer subtopics (those with parents) over high-level clusters
      if (clusterA?.parent && !clusterB?.parent) return -1;
      if (!clusterA?.parent && clusterB?.parent) return 1;
      
      // Then sort by count
      return b[1] - a[1];
    })
    .slice(0, 6); // Top 6 clusters

  const coreStack = sortedClusters.map(([id]) => id);
  
  // Domain tags: high-level categories
  const domainTags = [...new Set(
    coreStack
      .map(id => {
        const cluster = skillClusters.find(c => c.id === id);
        return cluster?.parent || id;
      })
      .filter(id => {
        const cluster = skillClusters.find(c => c.id === id);
        return !cluster?.parent; // Only high-level
      })
  )];

  // Strength tags: top subtopics
  const strengthTags = coreStack.filter(id => {
    const cluster = skillClusters.find(c => c.id === id);
    return cluster?.parent; // Only subtopics
  });

  // Coverage scores: percentage of skills matching each area
  const totalSkills = skills.length;
  const coverageScores: Record<string, number> = {};
  
  for (const cluster of skillClusters) {
    const matches = skills.filter(skill => 
      cluster.keywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
    ).length;
    coverageScores[cluster.id] = totalSkills > 0 ? Math.round((matches / totalSkills) * 100) : 0;
  }

  return {
    core_stack: coreStack,
    domain_tags: domainTags,
    strength_tags: strengthTags,
    coverage_scores: coverageScores
  };
}

/**
 * Get cluster by ID
 */
export function getClusterById(id: string): SkillCluster | undefined {
  return skillClusters.find(c => c.id === id);
}

/**
 * Get all high-level clusters (no parent)
 */
export function getHighLevelClusters(): SkillCluster[] {
  return skillClusters.filter(c => !c.parent);
}

/**
 * Get subtopics for a parent cluster
 */
export function getSubtopics(parentId: string): SkillCluster[] {
  return skillClusters.filter(c => c.parent === parentId);
}

/**
 * Get all clusters for filtering (high-level + subtopics)
 */
export function getAllFilterClusters(): SkillCluster[] {
  return skillClusters;
}

