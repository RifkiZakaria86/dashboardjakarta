/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript build errors (we use JS files)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turbopack config (Next.js 16+ default)
  turbopack: {},
};

module.exports = nextConfig;
