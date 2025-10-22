// pages/api/supabase/test.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { testSupabaseConnection, initializeDatabase, USE_DUMMY } from '@/lib/supabaseClient';

interface TestResponse {
  status: 'success' | 'error' | 'dummy';
  message: string;
  connected?: boolean;
  databaseReady?: boolean;
  recommendations?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed'
    });
  }

  try {
    // Check if in dummy mode
    if (USE_DUMMY) {
      return res.status(200).json({
        status: 'dummy',
        message: 'Currently using dummy data mode',
        connected: false,
        databaseReady: false,
        recommendations: [
          '1. Create a Supabase project at https://supabase.com',
          '2. Get your project URL and API keys from Settings → API',
          '3. Update .env.local with real Supabase credentials',
          '4. Set USE_DUMMY_DATA=false in .env.local',
          '5. Run the SQL migration from migrations/create_projects_schema.sql',
          '6. Restart your development server',
          '7. See SUPABASE_SETUP_GUIDE.md for detailed instructions'
        ]
      });
    }

    // Test connection
    const connectionTest = await testSupabaseConnection();
    
    if (!connectionTest.connected) {
      return res.status(500).json({
        status: 'error',
        message: `Supabase connection failed: ${connectionTest.error}`,
        connected: false,
        databaseReady: false,
        recommendations: [
          'Check your SUPABASE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local',
          'Verify your Supabase project is active',
          'Ensure API keys have the correct permissions',
          'Check network connectivity to Supabase'
        ]
      });
    }

    // Test database schema
    const dbTest = await initializeDatabase();
    
    if (!dbTest.success) {
      return res.status(500).json({
        status: 'error',
        message: `Database schema issue: ${dbTest.error}`,
        connected: true,
        databaseReady: false,
        recommendations: [
          'Run the SQL migration in migrations/create_projects_schema.sql',
          'Go to your Supabase dashboard → SQL Editor',
          'Copy and paste the migration SQL and execute it',
          'Refresh this test to verify setup'
        ]
      });
    }

    // All good!
    return res.status(200).json({
      status: 'success',
      message: 'Supabase is properly configured and ready to use!',
      connected: true,
      databaseReady: true,
      recommendations: [
        'Your missions will now be stored permanently in Supabase',
        'Other developers can access the same mission data',
        'Consider adding an OpenAI API key for AI-generated missions',
        'Set up Row Level Security in production'
      ]
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: `Unexpected error: ${error}`,
      connected: false,
      databaseReady: false,
      recommendations: [
        'Check your environment variables',
        'Verify Supabase project configuration',
        'Review the SUPABASE_SETUP_GUIDE.md'
      ]
    });
  }
}