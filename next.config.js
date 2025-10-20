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
    USE_DUMMY_DATA: process.env.USE_DUMMY_DATA || 'true',
  },
};

module.exports = nextConfig;
