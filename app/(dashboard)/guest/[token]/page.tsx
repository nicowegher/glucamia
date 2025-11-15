"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Measurement } from "@/types";
import Card from "@/components/ui/Card";
import MeasurementCard from "@/components/dashboard/MeasurementCard";
import GlucoseChart from "@/components/dashboard/GlucoseChart";

export default function GuestDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (token) {
      activateAndFetch();
    }
  }, [token]);

  const activateAndFetch = async () => {
    try {
      // Activate guest
      const activateResponse = await fetch("/api/guests/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!activateResponse.ok) {
        throw new Error("Token inválido");
      }

      setActivated(true);

      // Fetch measurements
      const measurementsResponse = await fetch(
        `/api/guests/measurements?token=${token}`
      );
      if (measurementsResponse.ok) {
        const data = await measurementsResponse.json();
        setMeasurements(data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar datos. El token puede ser inválido.");
    } finally {
      setLoading(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Vista de Invitado
          </h1>
          <p className="text-lg text-muted-foreground">
            Solo lectura - Registros de salud compartidos
          </p>
        </div>

        {activated && (
          <Card className="mb-6 bg-accent border-accent-foreground/20">
            <p className="text-lg text-accent-foreground">
              ✓ Acceso activado correctamente
            </p>
          </Card>
        )}

        {measurements.filter((m) => m.type === "glucose").length > 0 && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Gráfico de Glucemia
            </h2>
            <GlucoseChart measurements={measurements} />
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Registros recientes
          </h2>
          {measurements.length === 0 ? (
            <Card>
              <p className="text-center py-8 text-muted-foreground text-xl">
                No hay registros disponibles
              </p>
            </Card>
          ) : (
            <div>
              {measurements.map((measurement) => (
                <MeasurementCard
                  key={measurement.id}
                  measurement={measurement}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

