"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import ReportTemplate from "@/components/pdf/ReportTemplate";
import { Measurement, UserPreferences } from "@/types";
import { subDays } from "date-fns";

interface ExportPDFButtonProps {
  measurements: Measurement[];
  user: any;
  preferences: UserPreferences;
}

export default function ExportPDFButton({
  measurements,
  user,
  preferences,
}: ExportPDFButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(
    formatDateInput(subDays(new Date(), 30))
  );
  const [endDate, setEndDate] = useState(formatDateInput(new Date()));

  function formatDateInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  const filteredMeasurements = measurements.filter((m) => {
    const mDate = new Date(m.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return mDate >= start && mDate <= end;
  });

  if (measurements.length === 0) {
    return null;
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setShowModal(true)}>
        Exportar a PDF
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Exportar a PDF
            </h2>
            <div className="space-y-4 mb-6">
              <Input
                label="Fecha inicial"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Fecha final"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {filteredMeasurements.length === 0 ? (
              <p className="text-destructive mb-4">
                No hay mediciones en el rango seleccionado
              </p>
            ) : (
              <div className="flex gap-4">
                <PDFDownloadLink
                  document={
                    <ReportTemplate
                      user={user}
                      measurements={filteredMeasurements}
                      preferences={preferences}
                      startDate={new Date(startDate)}
                      endDate={new Date(endDate)}
                    />
                  }
                  fileName={`reporte-glucamia-${startDate}-${endDate}.pdf`}
                  className="flex-1"
                >
                  {({ loading }) => (
                    <Button disabled={loading} className="w-full">
                      {loading ? "Generando..." : "Descargar PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="w-full mt-4"
            >
              Cancelar
            </Button>
          </Card>
        </div>
      )}
    </>
  );
}

