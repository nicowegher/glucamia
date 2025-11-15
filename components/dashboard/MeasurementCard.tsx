import { Measurement } from "@/types";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/date";

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
      return `${measurement.value}/${measurement.value2} mmHg`;
    }
    if (measurement.type === "glucose") {
      return `${measurement.value} mg/dL`;
    }
    if (measurement.type === "weight") {
      return `${measurement.value} kg`;
    }
    return measurement.value.toString();
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

  return (
    <Card className={`${getAlertClass()} mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{getTypeIcon()}</span>
            <h3 className="text-xl font-semibold text-card-foreground">
              {getTypeLabel()}
            </h3>
          </div>
          <p className="text-3xl font-bold text-card-foreground mb-2">
            {getValueDisplay()}
          </p>
          <p className="text-base text-muted-foreground mb-1">
            {formatDate(measurement.date)}
          </p>
          {measurement.label && (
            <span className="inline-block px-3 py-1 text-sm font-medium bg-accent text-accent-foreground rounded-full mb-2">
              {measurement.label}
            </span>
          )}
          {measurement.comment && (
            <p className="text-base text-card-foreground mt-2">{measurement.comment}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

