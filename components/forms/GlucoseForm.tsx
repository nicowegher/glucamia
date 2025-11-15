"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { GlucoseLabel } from "@/types";
import { dateToDatetimeLocal, datetimeLocalToISO } from "@/lib/utils/date";

interface GlucoseFormProps {
  onSubmit: (data: {
    value: number;
    date: string;
    comment?: string;
    label?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function GlucoseForm({ onSubmit, onCancel }: GlucoseFormProps) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(
    dateToDatetimeLocal(new Date())
  );
  const [comment, setComment] = useState("");
  const [label, setLabel] = useState<GlucoseLabel | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const glucoseValue = Number(value);
    if (isNaN(glucoseValue) || glucoseValue < 20 || glucoseValue > 600) {
      setError("El valor debe estar entre 20 y 600 mg/dL");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        value: glucoseValue,
        date: datetimeLocalToISO(date),
        comment: comment || undefined,
        label: (label as GlucoseLabel) || undefined,
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
        label="Valor de glucosa (mg/dL)"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ej: 120"
        min="20"
        max="600"
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

      <Select
        label="Etiqueta (opcional)"
        value={label}
        onChange={(e) => setLabel(e.target.value as GlucoseLabel | "")}
      >
        <option value="">Seleccionar...</option>
        <option value="Antes de comer">Antes de comer</option>
        <option value="Después de comer">Después de comer</option>
        <option value="Ayunas">Ayunas</option>
        <option value="Otro">Otro</option>
      </Select>

      <div className="w-full">
        <label className="block text-lg font-medium text-foreground mb-2">
          Comentario (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ej: Después de almorzar, Comí pan..."
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

