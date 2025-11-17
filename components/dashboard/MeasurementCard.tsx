import { Measurement } from "@/types";
import Card from "@/components/ui/Card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MeasurementCardProps {
  measurement: Measurement;
}

export default function MeasurementCard({ measurement }: MeasurementCardProps) {
  const getTypeLabel = () => {
    switch (measurement.type) {
      case "glucose":
        return "Glucemia";
      case "bp":
        return "Presión arterial";
      case "med":
        return "Medicamento";
      case "weight":
        return "Peso";
      default:
        return measurement.type;
    }
  };

  const getTypeIcon = () => {
    switch (measurement.type) {
      case "glucose":
        return "🩸";
      case "bp":
        return "❤️";
      case "med":
        return "💊";
      case "weight":
        return "⚖️";
      default:
        return "📊";
    }
  };

  const getValueDisplay = () => {
    if (measurement.type === "bp" && measurement.value2) {
      return { value: `${measurement.value}/${measurement.value2}`, unit: "mmHg" };
    }
    if (measurement.type === "glucose") {
      return { value: measurement.value.toString(), unit: "mg/dL" };
    }
    if (measurement.type === "weight") {
      return { value: measurement.value.toString(), unit: "kg" };
    }
    return { value: measurement.value.toString(), unit: "" };
  };

  const getAlertClass = () => {
    if (measurement.type === "glucose") {
      if (measurement.value > 180) {
        return "border-l-4 border-destructive";
      }
      if (measurement.value < 70) {
        return "border-l-4 border-[var(--alert-low)]";
      }
    }
    return "";
  };

  const valueDisplay = getValueDisplay();
  const date = new Date(measurement.date);
  const formattedDate = format(date, "dd/MMM", { locale: es });
  const formattedTime = format(date, "HH:mm", { locale: es });

  return (
    <Card className={`${getAlertClass()} mb-2`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base flex-shrink-0">{getTypeIcon()}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">
              {getTypeLabel()}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-sm font-medium text-card-foreground">
                {formattedDate}
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                {formattedTime}
              </p>
            </div>
            {measurement.comment && (
              <p className="text-xs text-card-foreground mt-0.5 line-clamp-1">{measurement.comment}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-card-foreground">
              {valueDisplay.value}
            </span>
            {valueDisplay.unit && (
              <span className="text-base font-normal text-card-foreground">
                {valueDisplay.unit}
              </span>
            )}
          </div>
          {measurement.label && (
            <span className="inline-block px-1.5 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
              {measurement.label}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

