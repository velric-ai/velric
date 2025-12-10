/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { 
    unoptimized: true,
    domains: ['localhost'] 
  },
  output: 'standalone',
  // Ensure environment variables are available during build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yzszgcnuxpkvxueivbyx.supabase.co',
    // Do not force a default here; allow .env.local to control this explicitly
    USE_DUMMY_DATA: process.env.USE_DUMMY_DATA,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
