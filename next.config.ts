import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    WP_GRAPHQL_URL: process.env.WP_GRAPHQL_URL || 'https://jvs.org.uk/graphql',
  },
};

export default nextConfig;
