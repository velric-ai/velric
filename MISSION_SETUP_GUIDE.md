# Velric Mission System Setup Guide

This guide explains how to set up and verify the complete mission system with Supabase integration.

## 🎯 Mission Flow Overview

The complete user journey:
1. **Dashboard** (`/dashboard`) - Users see personalized missions in categories
2. **Mission Selection** - Click on mission cards to navigate to detail page
3. **Mission Details** (`/missions/[id]`) - Detailed mission info with start/continue buttons
4. **Mission Submission** (`/submission/[missionId]`) - Complete and submit mission work

## 🗄️ Database Schema

### Mission Tables in Supabase:

1. **`mission_templates`** - Catalog of all available missions
   - `id`, `title`, `description`, `skills[]`, `industries[]`
   - `difficulty`, `time_estimate`, `category`, `tags[]`
   - `details` (JSONB with requirements, technologies, learning outcomes)

2. **`user_missions`** - Tracks user progress on missions
   - Links users to missions with status tracking
   - Status: `suggested` → `starred` → `in_progress` → `submitted` → `completed`

3. **`company_projects`** - Real company projects for inspiration
   - Netflix, Stripe, Airbnb, Spotify, Uber, Tesla, Discord, Amazon projects

## 🚀 Setup Instructions

### 1. Database Setup
Run the SQL migrations in your Supabase dashboard:

```sql
-- 1. First run the complete schema
-- Execute: migrations/create_complete_schema.sql

-- 2. Then insert sample mission data  
-- Execute: migrations/insert_sample_missions.sql
```

### 2. Environment Configuration
Update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yzszgcnuxpkvxueivbyx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_KEY=your_actual_service_role_key_here

# OpenAI Configuration (for AI mission generation)
OPENAI_API_KEY=your_openai_api_key_here

# Use real Supabase data instead of dummy data
USE_DUMMY_DATA=false
```

### 3. Available Sample Missions

The system includes 8 realistic missions based on real company projects:

1. **Netflix Recommendation Engine** (Advanced, AI/ML)
   - Technologies: Python, TensorFlow, FastAPI, Redis
   - Time: 6-8 hours

2. **Stripe Payment Gateway** (Advanced, Backend)
   - Technologies: Node.js, Express, PostgreSQL, Security
   - Time: 5-7 hours

3. **Airbnb Property Platform** (Intermediate, Full-Stack)
   - Technologies: React, Node.js, MongoDB, Google Maps API
   - Time: 4-6 hours

4. **Spotify Analytics Dashboard** (Intermediate, Frontend)
   - Technologies: React, D3.js, WebSocket, Real-time data
   - Time: 3-5 hours

5. **Uber Location Tracking** (Advanced, Backend)
   - Technologies: Go, Redis, WebSocket, Geospatial
   - Time: 5-6 hours

6. **Tesla Battery Management** (Advanced, IoT)
   - Technologies: Python, IoT, Time Series, ML
   - Time: 7-9 hours

7. **Discord Chat Application** (Intermediate, Full-Stack)
   - Technologies: React, Node.js, Socket.io, WebRTC
   - Time: 4-6 hours

8. **Amazon Inventory Management** (Intermediate, Backend)
   - Technologies: Java, Spring Boot, MySQL, ML
   - Time: 5-7 hours

## 🔧 Testing the Flow

### Test Mission Navigation:
1. Visit `/dashboard`
2. Click on any mission card
3. Should navigate to `/missions/[id]` with mission details
4. Click "Start Mission" → should navigate to `/submission/[missionId]`

### API Endpoints:
- `GET /api/missions` - List all missions
- `GET /api/missions/[id]` - Get specific mission details  
- `GET /api/user/missions/[missionId]?userId=X` - Get user's mission status
- `POST /api/user/missions/start` - Start a mission
- `POST /api/personalized_missions` - Generate AI-powered missions

## 🎨 Mission Status Flow

Each mission progresses through these states:
- **Suggested** - Default state, shows "Start Mission" button
- **Starred** - User bookmarked, shows "Start Mission" button
- **In Progress** - Active work, shows "Continue Mission" button  
- **Submitted** - Under review, shows "View Submission" button
- **Completed** - Finished with grade, shows "View Mission Details"

## 🧪 Development Mode

When Supabase keys are not configured, the system automatically uses comprehensive mock data with:
- 8+ realistic missions with full details
- Sample user progress and grades
- Complete mission metadata and requirements

This allows full development and testing without requiring Supabase setup.

## 📋 Current Status

✅ **Completed Features:**
- Complete database schema with missions table
- Dashboard → Mission details → Submission navigation flow  
- Dynamic mission status tracking and UI updates
- Comprehensive sample missions with real company projects
- API endpoints for all mission operations
- Mock data fallback for development

🔄 **Next Steps (for production):**
- Add your actual Supabase API keys
- Run database migrations to populate missions
- Configure OpenAI API for AI mission generation
- Customize missions for your specific use case