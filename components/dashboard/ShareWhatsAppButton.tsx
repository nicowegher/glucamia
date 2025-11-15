"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import ReportTemplate from "@/components/pdf/ReportTemplate";
import { Measurement, UserPreferences } from "@/types";
import { subDays } from "date-fns";
import { Share2 } from "lucide-react";

interface ShareWhatsAppButtonProps {
  measurements: Measurement[];
  user: any;
  preferences: UserPreferences;
}

export default function ShareWhatsAppButton({
  measurements,
  user,
  preferences,
}: ShareWhatsAppButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(
    formatDateInput(subDays(new Date(), 30))
  );
  const [endDate, setEndDate] = useState(formatDateInput(new Date()));
  const [loading, setLoading] = useState(false);

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

  const handleShare = async () => {
    if (filteredMeasurements.length === 0) {
      alert("No hay mediciones en el rango seleccionado");
      return;
    }

    try {
      setLoading(true);

      // Generate PDF blob
      const doc = (
        <ReportTemplate
          user={user}
          measurements={filteredMeasurements}
          preferences={preferences}
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
        />
      );

      const blob = await pdf(doc).toBlob();
      const fileName = `reporte-glucamia-${startDate}-${endDate}.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      // Check if Web Share API is available (mobile browsers)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let canShareFiles = false;
      // @ts-expect-error - canShare check for Web Share API file support
      if (navigator.share && navigator.canShare) {
        try {
          // @ts-expect-error - canShare may not be in all TypeScript definitions
          canShareFiles = navigator.canShare({ files: [file] });
        } catch (e) {
          canShareFiles = false;
        }
      }

      // Try Web Share API first (mobile browsers with file sharing support)
      if (canShareFiles) {
        try {
          await navigator.share({
            title: "Reporte de Glucamia",
            text: `Reporte de salud del ${startDate} al ${endDate}`,
            files: [file],
          });
          setShowModal(false);
          return;
        } catch (error: any) {
          // If user cancels, just return
          if (error.name === "AbortError") {
            setLoading(false);
            return;
          }
          // If share fails, continue to fallback
          console.error("Error sharing:", error);
        }
      }

      // Fallback for desktop or when Web Share API doesn't support files
      // Download PDF first
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show message based on device
      if (isMobile) {
        // On mobile, try to open WhatsApp app
        const message = encodeURIComponent(
          `📊 Reporte de salud de Glucamia\n\n📅 Período: ${startDate} al ${endDate}\n📄 El PDF se ha descargado. Por favor, adjúntalo manualmente.`
        );
        const whatsappUrl = `whatsapp://send?text=${message}`;
        
        // Try WhatsApp app first, fallback to web
        setTimeout(() => {
          window.location.href = whatsappUrl;
          // Fallback to web if app doesn't open
          setTimeout(() => {
            window.open(`https://wa.me/?text=${message}`, "_blank");
          }, 1000);
        }, 500);
      } else {
        // On desktop, open WhatsApp Web with clear instructions
        const message = encodeURIComponent(
          `📊 Reporte de salud de Glucamia\n\n📅 Período: ${startDate} al ${endDate}\n\n📄 El PDF "${fileName}" se ha descargado en tu dispositivo.\nPor favor, adjúntalo manualmente desde la carpeta de descargas.`
        );
        const whatsappUrl = `https://wa.me/?text=${message}`;
        
        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 500);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (measurements.length === 0) {
    return null;
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setShowModal(true)}>
        <Share2 className="mr-2 h-5 w-5" />
        Compartir por WhatsApp
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Compartir Reporte
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
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  {filteredMeasurements.length} medición(es) en el rango
                  seleccionado
                </p>
                <p className="text-xs text-muted-foreground mb-4 p-3 bg-muted rounded-lg">
                  💡 <strong>Nota:</strong> El PDF se descargará y se abrirá WhatsApp. 
                  En móviles, el archivo se puede compartir directamente. 
                  En WhatsApp Web, deberás adjuntarlo manualmente desde tus descargas.
                </p>
              </>
            )}
            <div className="flex gap-4">
              <Button
                disabled={loading || filteredMeasurements.length === 0}
                onClick={handleShare}
                className="flex-1"
              >
                {loading ? "Generando..." : "Compartir"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

