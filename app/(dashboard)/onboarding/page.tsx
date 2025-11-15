"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { subscribeToPushNotifications } from "@/lib/push/subscribe";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    track_glucose: false,
    track_bp: false,
    track_medications: false,
    track_weight: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    // Request push notification permission on mount (optional, don't block on errors)
    if ("Notification" in window && Notification.permission === "default") {
      subscribeToPushNotifications().catch(() => {
        // Silently fail - push notifications are optional
      });
    }
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Error al guardar preferencias");
      }

      // Request push notifications if not already done (optional, don't block on errors)
      if ("Notification" in window) {
        try {
          await subscribeToPushNotifications();
        } catch (error) {
          // Silently fail - push notifications are optional
          console.log("Push notifications setup failed (optional):", error);
        }
      }

      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar preferencias. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Configuración inicial
          </h1>
          <p className="text-xl text-muted-foreground">
            Selecciona qué quieres seguir
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Toggle
            label="Glucemia"
            description="Registra tus niveles de glucosa en sangre"
            checked={preferences.track_glucose}
            onChange={() => handleToggle("track_glucose")}
          />
          <Toggle
            label="Presión arterial"
            description="Registra tu presión sistólica y diastólica"
            checked={preferences.track_bp}
            onChange={() => handleToggle("track_bp")}
          />
          <Toggle
            label="Medicamentos"
            description="Registra los medicamentos que tomas"
            checked={preferences.track_medications}
            onChange={() => handleToggle("track_medications")}
          />
          <Toggle
            label="Peso"
            description="Registra tu peso corporal"
            checked={preferences.track_weight}
            onChange={() => handleToggle("track_weight")}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}

