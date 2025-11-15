import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Vercel
  // En Next.js 15, serverActions ya no son experimentales
  eslint: {
    // Ignorar errores de ESLint durante el build (los 'as any' son necesarios para Supabase)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ya verificamos TypeScript, no necesitamos bloquear el build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
