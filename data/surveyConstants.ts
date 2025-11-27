// data/surveyConstants.ts
// Centralized constants for survey form and application form
// These are the same options used in both candidate surveys and recruiter applications

export const REGIONS = [
  "North America",
  "Latin America",
  "Europe",
  "Middle East",
  "Africa",
  "South Asia",
  "East Asia",
  "Southeast Asia",
  "Oceania",
  "Remote only",
];

export const INDUSTRIES = [
  'Technology & Software',
  'Artificial Intelligence & ML',
  'Finance & Banking',
  'Healthcare & Medical',
  'E-commerce & Retail',
  'Education & Learning',
  'Product Management',
  'Consulting & Services',
  'Marketing & Advertising',
  'Operations & Supply Chain',
  'Data Science & Analytics',
  'Design & Creative',
  'Startup Founder',
  'Government & Public Sector',
  'Non-profit',
  'Transportation & Logistics',
  'Real Estate & Property',
  'Manufacturing',
  'Agriculture & Food',
  'Media & Entertainment',
  'Legal Services',
  'Hospitality & Tourism',
  'Human Resources',
  'Sales & Business Development',
  'Research & Development',
  'Quality Assurance',
  'Customer Support',
  'IT Infrastructure',
  'Other'
];

export const EDUCATION_LEVELS = [
  'High School',
  'Some College',
  'Bachelors Degree',
  'Masters Degree',
  'PhD',
  'Self-Taught',
  'Other'
];

export const VALID_STRENGTHS = [
  'Leadership & Management',
  'Problem Solving',
  'Coding & Development',
  'Design Thinking',
  'Storytelling & Communication',
  'Data Analysis',
  'Marketing Strategy',
  'Technical Communication',
  'Teamwork & Collaboration'
];

export const VALID_LEARNING_PREFERENCES = ['trial-error', 'reading', 'both'];

export const SPONSORSHIP_OPTIONS = [
  { value: "yes", label: "Yes – specify regions" },
  { value: "no", label: "No" },
  { value: "only_remote", label: "Only remote" },
  { value: "depends", label: "Depends" },
];

export const RELOCATION_OPTIONS = [
  { value: "anywhere", label: "Anywhere" },
  { value: "only_some", label: "Only some regions" },
  { value: "no", label: "No" },
  { value: "depends", label: "Depends" },
];

export const REMOTE_WORK_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "depends", label: "Depends" },
];

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary'
];

export const EXPERIENCE_LEVELS = [
  'Entry-level',
  'Mid-level',
  'Senior',
  'Executive'
];

export const APPLICATION_STATUSES = [
  'draft',
  'active',
  'closed',
  'archived'
];

