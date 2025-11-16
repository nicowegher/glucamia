"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-16 md:space-y-20 text-center">
        <div>
          <div className="mx-auto mb-1 flex items-center justify-center gap-2">
            <img
              src="/web-app-manifest-512x512.png"
              alt="glucamia"
              className="h-10 w-10 rounded"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              glucamia
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">
            Seguimiento de glucemia y salud
          </p>
        </div>
        <div className="space-y-1 text-base text-muted-foreground">
          <p>⚡ Registros en segundos</p>
          <p>🔔 Alertas a familiares</p>
          <p>📄 Reportes para tu médico</p>
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Cargando..." : "Iniciar sesión con Google"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Solo necesitas tu cuenta de Google para comenzar
          </p>
        </div>
      </div>
    </div>
  );
}

