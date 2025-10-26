# Supabase Setup Guide for Velric Mission System

## Quick Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/up
2. Click "New Project"
3. Choose your organization and fill in:
   - **Project Name**: `velric-missions` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to your location
4. Wait for project creation (takes ~2 minutes)

### 2. Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOi...`)
   - **service_role key** (starts with `eyJhbGciOi...`)

### 3. Update Your Environment Variables

Update your `.env.local` file with the real values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Set to false to use real Supabase
USE_DUMMY_DATA=false
```

### 4. Set Up Database Schema

#### Required Tables:

Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Complete Velric Mission System Schema
-- Run ALL of this in Supabase SQL Editor

-- Main missions table
CREATE TABLE IF NOT EXISTS missions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  field TEXT NOT NULL DEFAULT 'Technology',
  difficulty TEXT,
  time_estimate TEXT,
  category TEXT,
  company TEXT,
  context TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  generated_by TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Skills reference table
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Industries reference table
CREATE TABLE IF NOT EXISTS industries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mission-Skills junction table
CREATE TABLE IF NOT EXISTS mission_skills (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mission_id, skill_id)
);

-- Mission-Industries junction table
CREATE TABLE IF NOT EXISTS mission_industries (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  industry_id BIGINT NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mission_id, industry_id)
);

-- Mission tasks
CREATE TABLE IF NOT EXISTS mission_tasks (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  task_description TEXT NOT NULL,
  task_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mission objectives
CREATE TABLE IF NOT EXISTS mission_objectives (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  objective_description TEXT NOT NULL,
  objective_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mission resources
CREATE TABLE IF NOT EXISTS mission_resources (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  resource_description TEXT NOT NULL,
  resource_type TEXT,
  resource_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mission evaluation metrics
CREATE TABLE IF NOT EXISTS mission_evaluation_metrics (
  id BIGSERIAL PRIMARY KEY,
  mission_id BIGINT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  metric_description TEXT NOT NULL,
  metric_weight DECIMAL(3,2) DEFAULT 1.0,
  metric_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User missions (tracking progress)
CREATE TABLE IF NOT EXISTS user_missions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'suggested',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY DEFAULT ('submission-' || floor(extract(epoch from now()) * 1000)::text || '-' || substr(md5(random()::text), 1, 8)),
  user_id TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  submission_text TEXT NOT NULL,
  feedback TEXT,
  summary TEXT,
  grades JSONB,
  overall_score INTEGER,
  letter_grade TEXT,
  rubric JSONB,
  positive_templates JSONB,
  improvement_templates JSONB,
  velric_score DECIMAL(3,1),
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  overall_velric_score DECIMAL(3,1),
  total_submissions INTEGER DEFAULT 0,
  completed_missions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_mission_tasks_mission_id ON mission_tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_skills_mission_id ON mission_skills(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_objectives_mission_id ON mission_objectives(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_evaluation_metrics_mission_id ON mission_evaluation_metrics(mission_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mission_id ON submissions(mission_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_missions_updated_at ON missions;
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Mission Tables (created automatically):

- `missions` - Stores AI-generated missions
- `skills` - Mission skill requirements
- `industries` - Mission industry categories
- `tasks` - Mission task lists
- `objectives` - Mission learning objectives
- `resources` - Mission resources and tools
- `evaluation_metrics` - Mission success criteria

### 5. Test the Setup

1. Restart your development server: `npm run dev`
2. Visit `/missions` - should show "Connected to Supabase database" in console
3. Refresh the page - missions should be stored in database
4. Check your Supabase dashboard → **Table Editor** to see stored missions

## Sharing with Other Developers

### For Team Members:

1. **Share the same Supabase project URL and anon key** (safe to share)
2. **Keep the service role key secure** (only share with trusted developers)
3. **All developers use the same .env.local configuration**

### Environment Variables to Share:

```bash
# Safe to share in team
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Share securely with trusted developers only
SUPABASE_KEY=your_service_role_key_here
```

## Verification Steps

### ✅ Check if Supabase is Working:

1. Start dev server: `npm run dev`
2. Check console - should see "Connected to Supabase database"
3. Visit http://localhost:3000/missions
4. Refresh page several times
5. Go to Supabase dashboard → Table Editor → `missions` table
6. You should see new missions being created

### 🔍 Troubleshooting:

- **Still seeing "dummy mode"**: Check environment variables are correct
- **"Invalid API key" errors**: Verify the anon key and service role key
- **Database errors**: Check if schema was created properly
- **Network errors**: Verify the project URL is correct

## Benefits of Supabase Integration

✅ **Persistent Storage**: Missions saved permanently, not lost on restart
✅ **Team Sharing**: All developers see the same mission data  
✅ **Real Database**: Production-ready PostgreSQL database
✅ **Automatic Scaling**: Handles traffic growth automatically
✅ **Built-in Auth**: Ready for user authentication features
✅ **Real-time Updates**: Can add live collaboration features later

## Next Steps

Once Supabase is working:

1. **Add OpenAI API key** for AI-generated missions (optional - fallbacks work great)
2. **Invite team members** to the Supabase project
3. **Set up Row Level Security** for production use
4. **Configure backups** in Supabase dashboard

---

**Need Help?** Check the Supabase documentation or reach out to the team!
