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
The database schema will be automatically created when you first run the application. The system will create these tables:
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