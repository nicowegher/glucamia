import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Vercel
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
