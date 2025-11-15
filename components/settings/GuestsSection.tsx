"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Guest } from "@/types";

export default function GuestsSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      if (response.ok) {
        const data = await response.json();
        setGuests(data);
      }
    } catch (err) {
      console.error("Error fetching guests:", err);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/guests/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Mostrar el error detallado del servidor
        const errorMessage = data.error || "Error al enviar invitación";
        console.error("Error del servidor:", data);
        throw new Error(errorMessage);
      }

      setEmail("");
      await fetchGuests();
      alert("Invitación enviada correctamente");
    } catch (err: any) {
      const errorMessage = err.message || "Error al enviar invitación";
      setError(errorMessage);
      console.error("Error completo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Invitados</h2>
      <p className="text-lg text-muted-foreground">
        Invita a familiares para que puedan ver tus registros y recibir alertas
      </p>

      <Card>
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Email del invitado"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@email.com"
            required
            error={error}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar invitación"}
          </Button>
        </form>
      </Card>

      {guests.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Invitados activos
          </h3>
          <div className="space-y-3">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {guest.guest_email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {guest.status === "active" ? "Activo" : "Pendiente"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    guest.status === "active"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {guest.status === "active" ? "Activo" : "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

