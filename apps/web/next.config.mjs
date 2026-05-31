/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jornadas/ui', '@jornadas/types'],
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;
