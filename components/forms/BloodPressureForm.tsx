"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { dateToDatetimeLocal, datetimeLocalToISO } from "@/lib/utils/date";

interface BloodPressureFormProps {
  onSubmit: (data: {
    value: number;
    value2: number;
    date: string;
    comment?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function BloodPressureForm({
  onSubmit,
  onCancel,
}: BloodPressureFormProps) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [date, setDate] = useState(dateToDatetimeLocal(new Date()));
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const sys = Number(systolic);
    const dia = Number(diastolic);

    if (isNaN(sys) || sys < 50 || sys > 250) {
      setError("La presión sistólica debe estar entre 50 y 250");
      return;
    }
    if (isNaN(dia) || dia < 30 || dia > 150) {
      setError("La presión diastólica debe estar entre 30 y 150");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        value: sys,
        value2: dia,
        date: datetimeLocalToISO(date),
        comment: comment || undefined,
      });
    } catch (err) {
      setError("Error al guardar. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Presión sistólica"
          type="number"
          value={systolic}
          onChange={(e) => setSystolic(e.target.value)}
          placeholder="Ej: 120"
          min="50"
          max="250"
          required
        />
        <Input
          label="Presión diastólica"
          type="number"
          value={diastolic}
          onChange={(e) => setDiastolic(e.target.value)}
          placeholder="Ej: 80"
          min="30"
          max="150"
          required
        />
      </div>

      <Input
        label="Fecha y hora"
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="w-full">
        <label className="block text-lg font-medium text-foreground mb-2">
          Comentario (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ej: Después de ejercicio..."
          className="w-full h-24 px-4 py-3 text-lg border-2 border-input rounded-lg focus:outline-none focus:ring-4 focus:border-ring focus:ring-ring/50 bg-background text-foreground resize-none"
        />
      </div>

      {error && <p className="text-destructive text-lg">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

