/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jornadas/ui', '@jornadas/types', '@jornadas/database'],
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
