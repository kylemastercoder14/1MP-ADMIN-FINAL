import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "placehold.co",
      "utqpspeicywesqihyelg.supabase.co",
      "images.seeklogo.com",
      "business.inquirer.net",
      "pngimg.com",
      "kenkarlo.com",
      "orangemagazine.ph",
      "images.unsplash.com",
      "img.kwcdn.com",
      "images.pexels.com",
      "s.alicdn.com",
      "isomorphic-furyroad.s3.amazonaws.com",
      "upload.wikimedia.org",
      "one-market-philippines.s3.ap-southeast-2.amazonaws.com",
      "one-market-phil.s3.us-east-1.amazonaws.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
};

export default nextConfig;
