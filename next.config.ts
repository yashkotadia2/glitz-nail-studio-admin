import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "100mb", // Increase the body size limit to 10 MB
  },
  // Add other config options here if needed
};

export default nextConfig;
