"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import GuestsSection from "@/components/settings/GuestsSection";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setPreferences(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase.auth]);

  const handleToggle = async (key: string, value: boolean) => {
    if (!preferences) return;

    const updated = { ...preferences, [key]: value };
    setPreferences(updated);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          track_glucose: updated.track_glucose,
          track_bp: updated.track_bp,
          track_medications: updated.track_medications,
          track_weight: updated.track_weight,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar preferencias");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Configuración</h1>
          <button
            onClick={() => router.push("/")}
            className="text-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver
          </button>
        </div>

        <div className="space-y-8">
          <Card>
            <h2 className="text-2xl font-bold text-card-foreground mb-6">
              Seguimientos
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Glucemia"
                checked={preferences?.track_glucose ?? false}
                onChange={(checked) => handleToggle("track_glucose", checked)}
              />
              <Toggle
                label="Presión arterial"
                checked={preferences?.track_bp ?? false}
                onChange={(checked) => handleToggle("track_bp", checked)}
              />
              <Toggle
                label="Medicamentos"
                checked={preferences?.track_medications ?? false}
                onChange={(checked) =>
                  handleToggle("track_medications", checked)
                }
              />
              <Toggle
                label="Peso"
                checked={preferences?.track_weight ?? false}
                onChange={(checked) => handleToggle("track_weight", checked)}
              />
            </div>
          </Card>

          <GuestsSection />

          <Card>
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Cuenta
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Email: {user?.email}
            </p>
            <Button variant="secondary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

