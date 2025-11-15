"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { dateToDatetimeLocal, datetimeLocalToISO } from "@/lib/utils/date";

interface WeightFormProps {
  onSubmit: (data: {
    value: number;
    date: string;
    comment?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function WeightForm({ onSubmit, onCancel }: WeightFormProps) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(dateToDatetimeLocal(new Date()));
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const weight = Number(value);
    if (isNaN(weight) || weight < 20 || weight > 300) {
      setError("El peso debe estar entre 20 y 300 kg");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        value: weight,
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
      <Input
        label="Peso (kg)"
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ej: 75.5"
        min="20"
        max="300"
        required
        error={error}
      />

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

