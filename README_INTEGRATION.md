# Velric Integration Guide - Week 1 to Week 2

This guide provides step-by-step instructions to integrate the new mission generation and management features into the Velric application.

## Overview

The implementation includes:
- AI-powered mission generation from resume text and interests
- Mission detail pages with user interaction (star/start missions)
- Type-safe API routes with proper error handling
- Comprehensive form validation
- Database schema for projects and related entities
- Test coverage for critical functionality

## Quick Start (Dummy Mode)

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:3000` with dummy data enabled by default.

### 3. Test the Features

1. Navigate to `/generate`
2. Fill in interests and/or resume text
3. Click "Generate My Missions"
4. Click on any mission card to view details
5. Try starring or starting missions

### 4. Run Tests

```bash
npm test
```

## Switching to Real Supabase

### Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 2: Set Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Run Database Migration

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `migrations/create_projects_schema.sql`
4. Execute the migration

This will create:
- `projects` table for user projects
- `project_docs` table for project documentation
- `industry_tags` and `target_roles` tables with junction tables
- Proper indexes and constraints
- Default data for industries and roles

### Step 4: Create Mission Templates Table

Add this to your Supabase database:

```sql
-- Create mission_templates table
CREATE TABLE IF NOT EXISTS mission_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    industries TEXT[] NOT NULL DEFAULT '{}',
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    time_estimate VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_missions table
CREATE TABLE IF NOT EXISTS user_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mission_id UUID NOT NULL REFERENCES mission_templates(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'starred', 'in_progress', 'completed', 'submitted')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mission_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mission_templates_difficulty ON mission_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_mission_templates_category ON mission_templates(category);
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_status ON user_missions(status);

-- Insert sample mission templates
INSERT INTO mission_templates (title, description, skills, industries, difficulty, time_estimate, category) VALUES
('AI System Design Challenge', 'Design and implement a scalable AI system architecture that can handle real-time inference for a recommendation engine.', ARRAY['Python', 'System Design', 'LLMs', 'Architecture', 'Redis', 'Docker'], ARRAY['Technology', 'E-commerce', 'Media'], 'Advanced', '4-6 hours', 'AI/ML'),
('Security & Authentication Implementation', 'Build a comprehensive authentication system with JWT tokens, OAuth2 integration, and role-based access control.', ARRAY['JWT', 'OAuth2', 'Security', 'Authentication', 'Node.js', 'Express'], ARRAY['Technology', 'Finance', 'Healthcare'], 'Intermediate', '3-4 hours', 'Security'),
('Frontend Performance Optimization', 'Identify and fix performance bottlenecks in a React application. Implement code splitting, lazy loading, and optimization.', ARRAY['React', 'TypeScript', 'Performance', 'Webpack', 'Testing'], ARRAY['Technology', 'E-commerce', 'Media'], 'Intermediate', '2-3 hours', 'Frontend');
```

### Step 5: Update Supabase Client Configuration

In `lib/supabaseClient.ts`, make these changes:

1. Change `USE_DUMMY` to `false`:
```typescript
export const USE_DUMMY = false;
```

2. Uncomment the Supabase client initialization:
```typescript
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
supabase = createClient(supabaseUrl, supabaseKey);
```

### Step 6: Set Up Authentication (Optional)

For user-specific features, integrate Supabase Auth:

```bash
npm install @supabase/auth-helpers-nextjs
```

Update your `_app.tsx` to include auth context and modify the user ID handling in API routes.

### Step 7: Test Real Database Integration

1. Restart your development server
2. Test mission generation and user interactions
3. Verify data is being stored in Supabase
4. Check the Supabase dashboard to see created records

## API Endpoints

### GET `/api/missions`
- Returns list of mission templates
- Query params: `?status=starred` to filter by user mission status

### GET `/api/missions/[id]`
- Returns single mission template by ID
- Returns 404 if mission not found

### POST `/api/generate_missions`
- Generates personalized missions from resume/interests
- Body: `{ resumeText?: string, resumeUrl?: string, interests?: string[] }`
- Returns: `{ success: boolean, missions: MissionTemplate[], error?: string }`

### POST `/api/user_missions`
- Updates user mission status (star, start, submit, complete)
- Body: `{ userId: string, missionId: string, action: string }`
- Returns: `{ success: boolean, userMission: UserMission, error?: string }`

## File Structure

```
├── components/
│   ├── MissionCard.tsx          # Updated with navigation
│   ├── MissionDescription.tsx   # New mission detail component
│   └── SubmissionForm.tsx       # Updated with resume input
├── data/
│   └── mockMissions.ts          # Mock data and in-memory store
├── lib/
│   ├── ai.ts                    # AI mission generation logic
│   └── supabaseClient.ts        # Database abstraction layer
├── migrations/
│   └── create_projects_schema.sql # Database schema
├── pages/
│   ├── api/
│   │   ├── generate_missions.ts # Mission generation endpoint
│   │   ├── user_missions.ts     # User mission actions
│   │   └── missions/
│   │       ├── index.ts         # List missions
│   │       └── [id].ts          # Get single mission
│   ├── missions/
│   │   └── [id].tsx             # Mission detail page
│   └── generate.tsx             # Updated with API integration
├── tests/
│   └── formValidation.test.ts   # Form validation tests
├── types/
│   └── index.ts                 # TypeScript type definitions
└── README_INTEGRATION.md        # This file
```

## Testing

### Unit Tests
```bash
npm test
```

### Manual Testing Checklist

- [ ] Mission generation works with interests only
- [ ] Mission generation works with resume text only
- [ ] Mission generation works with both interests and resume
- [ ] Form validation prevents submission with no input
- [ ] Mission cards navigate to detail pages
- [ ] Mission detail page loads correctly
- [ ] Star mission functionality works
- [ ] Start mission functionality works
- [ ] Error handling displays appropriate messages
- [ ] Loading states show during API calls

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure all types are properly imported from `@/types`
2. **API errors**: Check that `USE_DUMMY` is set correctly in `lib/supabaseClient.ts`
3. **Database connection**: Verify environment variables are set correctly
4. **Test failures**: Ensure Jest configuration matches your project structure

### Debug Mode

To enable debug logging, add this to your `.env.local`:
```env
DEBUG=true
```

## Role-Based Access Control

When implementing authentication:

1. Add user roles to your user table
2. Implement middleware to check permissions
3. Restrict API endpoints based on user roles
4. Update the UI to show/hide features based on permissions

## Performance Considerations

- Mission generation is currently synchronous - consider implementing background jobs for production
- Add caching for frequently accessed missions
- Implement pagination for large mission lists
- Consider CDN for static assets

## Security Notes

- Validate all user inputs on both client and server
- Implement rate limiting for API endpoints
- Use environment variables for sensitive configuration
- Enable RLS (Row Level Security) in Supabase for production

## Next Steps

1. Implement file upload for resume parsing
2. Add mission completion tracking
3. Build user dashboard with progress analytics
4. Implement mission recommendations based on user history
5. Add social features (sharing, comments)

## Support

For issues or questions:
1. Check the console for error messages
2. Verify database schema matches the migration
3. Ensure all environment variables are set
4. Test with dummy mode first before switching to real database