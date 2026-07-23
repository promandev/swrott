import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  webpack(config, { dev, isServer }) {
    // Console Ninja injects truncated code into the eval-source-map runtime
    // and breaks client-side hydration with SyntaxError. Switch to a devtool
    // that it does not patch.
    if (dev && !isServer) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

export default nextConfig;
