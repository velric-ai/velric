# Velric

AI-powered mission generation for skills-based recruiting.  

**Website:** https://velric.ai/

## Prerequisites
- Node.js 20.x (LTS) and npm 10+  
- macOS / Linux / Windows  

Tech Stack
Frontend: Next.js 14 (App Router) + TypeScript
Styling: TailwindCSS + Framer Motion
APIs: Next.js API Routes
Database & Auth: Supabase (PostgreSQL + Auth + Storage)
AI: OpenAI API (server-side only)
Version Control: Git + GitHub

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/velric/velric.git
cd velric

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# OPENAI_API_KEY=

# 4. Run the app
npm run dev

then open http://localhost:3000 in your browser

##Common Scripts
npm run dev – start Next.js in development with hot reload
npm run build – production build
npm run start – run the production build locally
npm run lint – run TypeScript/ESLint checks

Features
/generate Missions Page
AI-powered mission recommendations
Multi-select survey form (React Hook Form + Zod)
Responsive mission grid (difficulty, skills, details)
Loading animations with Framer Motion
Regenerate button to start over
Components & Utilities
MissionCard.tsx – mission info with hover animations
SubmissionForm.tsx – survey form with validation and loading states
LoadingSpinner.tsx – reusable loading spinner
Button.tsx – consistent button component
lib/missionHelpers.ts – mock mission data + filtering helpers
lib/supabaseClient.ts – Supabase client
Notes

Do not commit real API keys. Use .env.local only.

All OpenAI calls must be server-side (never from client code).
