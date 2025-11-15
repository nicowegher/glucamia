"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import GlucoseForm from "@/components/forms/GlucoseForm";
import BloodPressureForm from "@/components/forms/BloodPressureForm";
import WeightForm from "@/components/forms/WeightForm";
import Select from "@/components/ui/Select";
import { UserPreferences } from "@/types";

type MeasurementFormType = "glucose" | "bp" | "weight" | null;

export default function RecordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formType, setFormType] = useState<MeasurementFormType>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single<UserPreferences>();

      setUserPreferences(data);

      // Si solo hay un tipo de medición habilitado, seleccionarlo automáticamente
      if (data) {
        const enabledTypes: MeasurementFormType[] = [];
        if (data.track_glucose) enabledTypes.push("glucose");
        if (data.track_bp) enabledTypes.push("bp");
        if (data.track_weight) enabledTypes.push("weight");

        if (enabledTypes.length === 1) {
          setFormType(enabledTypes[0]);
        }
      }

      setLoading(false);
    };
    fetchPreferences();
  }, [router, supabase.auth]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formType,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al guardar");
      }

      router.push("/");
    } catch (error: any) {
      alert(error.message || "Error al guardar medición");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!formType) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Registrar Medición
          </h1>
          <Card>
            <Select
              label="¿Qué quieres registrar?"
              value=""
              onChange={(e) =>
                setFormType(e.target.value as MeasurementFormType)
              }
            >
              <option value="">Seleccionar tipo...</option>
              {userPreferences?.track_glucose && (
                <option value="glucose">Glucemia</option>
              )}
              {userPreferences?.track_bp && (
                <option value="bp">Presión arterial</option>
              )}
              {userPreferences?.track_weight && (
                <option value="weight">Peso</option>
              )}
            </Select>
            <button
              onClick={() => router.push("/")}
              className="mt-6 text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Volver
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Registrar {formType === "glucose" ? "Glucemia" : formType === "bp" ? "Presión Arterial" : "Peso"}
        </h1>
        <Card>
          {formType === "glucose" && (
            <GlucoseForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/")}
            />
          )}
          {formType === "bp" && (
            <BloodPressureForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/")}
            />
          )}
          {formType === "weight" && (
            <WeightForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/")}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

