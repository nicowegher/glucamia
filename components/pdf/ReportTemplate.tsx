import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Measurement, UserPreferences } from "@/types";
import { formatDate, formatDateShort } from "@/lib/utils/date";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  stats: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});

interface ReportTemplateProps {
  user: any;
  measurements: Measurement[];
  preferences: UserPreferences;
  startDate: Date;
  endDate: Date;
}

export default function ReportTemplate({
  user,
  measurements,
  preferences,
  startDate,
  endDate,
}: ReportTemplateProps) {
  const glucoseMeasurements = measurements.filter((m) => m.type === "glucose");
  const bpMeasurements = measurements.filter((m) => m.type === "bp");
  const weightMeasurements = measurements.filter((m) => m.type === "weight");

  const getGlucoseStats = () => {
    if (glucoseMeasurements.length === 0) return null;
    const values = glucoseMeasurements.map((m) => Number(m.value));
    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
    };
  };

  const glucoseStats = getGlucoseStats();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Salud - Glucamia</Text>
        <Text style={styles.subtitle}>
          {user?.name || user?.email || "Usuario"}
        </Text>
        <Text style={styles.subtitle}>
          Período: {formatDateShort(startDate)} - {formatDateShort(endDate)}
        </Text>

        {glucoseStats && (
          <View style={styles.stats}>
            <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "bold" }}>
              Estadísticas de Glucemia
            </Text>
            <View style={styles.statRow}>
              <Text>Total de registros:</Text>
              <Text>{glucoseStats.count}</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Promedio:</Text>
              <Text>{glucoseStats.avg.toFixed(1)} mg/dL</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Máximo:</Text>
              <Text>{glucoseStats.max} mg/dL</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Mínimo:</Text>
              <Text>{glucoseStats.min} mg/dL</Text>
            </View>
          </View>
        )}

        {preferences.track_glucose && glucoseMeasurements.length > 0 && (
          <View style={styles.section}>
            <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "bold" }}>
              Registros de Glucemia
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Fecha</Text>
                <Text style={styles.tableCell}>Valor (mg/dL)</Text>
                <Text style={styles.tableCell}>Etiqueta</Text>
                <Text style={styles.tableCell}>Comentario</Text>
              </View>
              {glucoseMeasurements.map((m) => (
                <View key={m.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{formatDate(m.date)}</Text>
                  <Text style={styles.tableCell}>{m.value}</Text>
                  <Text style={styles.tableCell}>{m.label || "-"}</Text>
                  <Text style={styles.tableCell}>{m.comment || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {preferences.track_bp && bpMeasurements.length > 0 && (
          <View style={styles.section}>
            <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "bold" }}>
              Registros de Presión Arterial
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Fecha</Text>
                <Text style={styles.tableCell}>Presión</Text>
                <Text style={styles.tableCell}>Comentario</Text>
              </View>
              {bpMeasurements.map((m) => (
                <View key={m.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{formatDate(m.date)}</Text>
                  <Text style={styles.tableCell}>
                    {m.value}/{m.value2} mmHg
                  </Text>
                  <Text style={styles.tableCell}>{m.comment || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {preferences.track_weight && weightMeasurements.length > 0 && (
          <View style={styles.section}>
            <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "bold" }}>
              Registros de Peso
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Fecha</Text>
                <Text style={styles.tableCell}>Peso (kg)</Text>
                <Text style={styles.tableCell}>Comentario</Text>
              </View>
              {weightMeasurements.map((m) => (
                <View key={m.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{formatDate(m.date)}</Text>
                  <Text style={styles.tableCell}>{m.value} kg</Text>
                  <Text style={styles.tableCell}>{m.comment || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

