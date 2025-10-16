/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }, // TEMPORARY
  images: { unoptimized: true },
  
};

module.exports = nextConfig;
