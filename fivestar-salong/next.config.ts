import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Allow serving images directly from /public
    unoptimized: true, // Render’s CDN doesn’t optimize automatically like Vercel
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://fivestarsalong.onrender.com",
        "http://localhost:3000",
      ],
    },
  },
};

export default nextConfig;
