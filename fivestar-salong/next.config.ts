import type { NextConfig } from "next";

/**
 * This config works on:
 * - Netlify (automatically detected via @netlify/plugin-nextjs)
 * - Render / Vercel (standard Next.js build)
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;
