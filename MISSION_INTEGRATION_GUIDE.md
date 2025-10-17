# Velric Mission Integration Setup Guide

This guide explains how to connect your Mission Dashboard and mission description pages with the backend and ChatGPT for personalized mission generation.

## What We've Implemented

### 1. Database Schema
- **Complete database schema** (`migrations/create_complete_schema.sql`) with:
  - `users` - User profiles
  - `user_surveys` - User survey responses for personalization
  - `mission_templates` - Catalog of available missions
  - `user_missions` - Tracks user's progress with missions
  - `company_projects` - Real projects from companies to inspire missions
  - All supporting tables for projects, docs, tags, and roles

### 2. Backend APIs
- **`/api/personalized_missions`** - Generate personalized missions using ChatGPT
- **`/api/user/missions`** - Get user's missions filtered by status
- **`/api/user_missions`** - Update mission status (star, start, submit, complete)
- **`/api/missions/[id]`** - Get individual mission details
- **Enhanced Supabase client** with personalized mission functions

### 3. Frontend Updates
- **Dashboard** (`pages/dashboard.tsx`) now fetches real missions and can generate personalized ones
- **Mission Submission** (`pages/submission/[missionId].tsx`) connects to backend for real submissions
- **Loading states and error handling** throughout

## Setup Instructions

### Step 1: Set up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/yzszgcnuxpkvxueivbyx) (your database)
2. Navigate to SQL Editor
3. Run the complete schema from `migrations/create_complete_schema.sql`

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your actual values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yzszgcnuxpkvxueivbyx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
NODE_ENV=development
USE_DUMMY_DATA=false  # Set to false to use real Supabase
```

### Step 3: Install Dependencies (Already Done)

Dependencies are already installed:
- `@supabase/supabase-js` - Supabase client
- `openai` - OpenAI SDK for ChatGPT integration

### Step 4: Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Mission Generation:**
   - Go to `/dashboard`
   - Click "Generate Personalized Missions"
   - This will call ChatGPT to create missions based on company projects

3. **Test Mission Flow:**
   - View missions on dashboard
   - Click on a mission to see details (`/missions/[id]`)
   - Submit a mission (`/submission/[missionId]`)

## Key Features

### Personalized Mission Generation
- Uses ChatGPT to analyze user survey data
- Incorporates real company projects from database
- Matches user's experience level and interests
- Creates realistic, challenging missions

### Mission Status Tracking
- **Suggested** - New missions for the user
- **Starred** - User favorited missions
- **In Progress** - User started working
- **Submitted** - User submitted their work
- **Completed** - Mission graded and completed

### Real Company Projects
The database includes sample projects from:
- Netflix (Recommendation Engine)
- Stripe (Payment Processing)
- Airbnb (Property Listing Platform)
- Spotify (Music Streaming Dashboard)
- Uber (Real-time Location Tracking)

## How It Works

### Mission Generation Flow
1. User completes survey (stored in `user_surveys`)
2. System fetches relevant company projects
3. ChatGPT generates personalized missions based on:
   - User's experience level
   - Programming languages they know
   - Career interests and goals
   - Industry preferences
   - Real company project challenges
4. Generated missions are stored and assigned to user

### Dashboard Integration
- Fetches user's personalized missions via API
- Groups missions by status (starred, in progress, completed, suggested)
- Allows generating new missions or refreshing existing ones
- Shows loading states and error handling

### Mission Submission Flow
1. User selects mission from dashboard
2. Mission details page shows full requirements
3. Submission page allows user to submit their work
4. Backend updates mission status and stores submission data

## Database Seeding

The schema includes sample data:
- **Industry tags** (Technology, Finance, Healthcare, etc.)
- **Target roles** (Software Engineer, Data Scientist, etc.)
- **Company projects** (5 realistic projects from major companies)

## Testing Without Real APIs

The system supports a "dummy mode" that works without Supabase or OpenAI:
- Set `USE_DUMMY_DATA=true` in environment
- Uses in-memory mock data
- Deterministic mission generation based on input

## Next Steps

1. **Complete user survey form** - Add a survey form to collect user preferences
2. **Add authentication** - Replace hardcoded user IDs with real auth
3. **Mission grading** - Add AI-powered code review and grading
4. **Enhanced UI** - Add more interactive elements and animations
5. **Analytics** - Track user engagement and mission completion rates

## Troubleshooting

### Common Issues

1. **"Mission generation failed"** - Check OpenAI API key configuration
2. **"Database connection failed"** - Verify Supabase credentials
3. **"Missions not loading"** - Check network tab for API errors
4. **TypeScript errors** - Run `npm run build` to check for type issues

### Debugging Tips

- Check browser console for API errors
- Verify environment variables are loaded
- Test APIs directly using tools like Postman
- Use dummy mode for offline development

The integration is now complete and ready for testing!