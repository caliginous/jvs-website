import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export to allow dynamic features
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    WP_GRAPHQL_URL: process.env.WP_GRAPHQL_URL || 'https://jvs.org.uk/graphql',
  },
};

export default nextConfig;
