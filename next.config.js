/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to allow dynamic features
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '**.sanity.io' },
      { protocol: 'https', hostname: '**.jvs.org.uk' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined,
  },
};

module.exports = {
  ...nextConfig,
  async redirects() {
    return [
      // Legacy year/month/day permalinks -> articles
      {
        source: '/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})/:slug/',
        destination: '/articles/:slug/',
        permanent: true,
      },
      // Legacy year/month permalinks -> articles
      {
        source: '/:year(\\d{4})/:month(\\d{1,2})/:slug/',
        destination: '/articles/:slug/',
        permanent: true,
      },
      // Legacy recipe singular base -> recipes
      {
        source: '/recipe/:slug/',
        destination: '/recipes/:slug/',
        permanent: true,
      },
      // Legacy recipe-view URLs -> recipes  
      {
        source: '/recipe-view/:slug/',
        destination: '/recipes/:slug/',
        permanent: true,
      },
      // Legacy recipe-view URLs without trailing slash -> recipes
      {
        source: '/recipe-view/:slug',
        destination: '/recipes/:slug/',
        permanent: true,
      },
      // Common category/tag paths -> filterable listings
      {
        source: '/category/:path*',
        destination: '/articles/?category=:path*',
        permanent: true,
      },
      {
        source: '/tag/:path*',
        destination: '/articles/?tag=:path*',
        permanent: true,
      },
      {
        source: '/recipes-category/:path*',
        destination: '/recipes/?category=:path*',
        permanent: true,
      },
      {
        source: '/recipes-tag/:path*',
        destination: '/recipes/?tag=:path*',
        permanent: true,
      },
      // Legacy magazine slugs that used "jvs-mag-online-..." -> normalize to current slug
      {
        source: '/magazine/jvs-mag-online-:rest*/',
        destination: '/magazine/jvs-mag-:rest*/',
        permanent: true,
      },
      {
        source: '/magazine/:legacy(jvs.*magonline-:n)/',
        destination: '/magazine/:legacy/',
        permanent: true,
      },
    ];
  },
};
