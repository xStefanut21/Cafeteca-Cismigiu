import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['your-supabase-url.supabase.co'], // Replace with your Supabase URL
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
