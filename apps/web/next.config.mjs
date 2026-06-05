/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jornadas/ui', '@jornadas/types', '@jornadas/database'],
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;
