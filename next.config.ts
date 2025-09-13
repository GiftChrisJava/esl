import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow explicit domain plus remotePatterns (some setups prefer domains array)
    domains: ["images.pexels.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
