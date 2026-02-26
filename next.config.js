/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
  images: {
    // Remote image patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'oqhubs.store',
      },{
        protocol: 'https',
        hostname: 'oqhubs.com',
      }
    ],
  },
};

module.exports = nextConfig;
