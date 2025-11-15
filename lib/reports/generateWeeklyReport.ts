import { createServiceRoleClient } from "@/lib/supabase/server";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { es } from "date-fns/locale";

export async function generateWeeklyReport(userId: string) {
  const supabase = await createServiceRoleClient();

  // Get user info
  const { data: user } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", userId)
    .single();

  if (!user) return null;

  // Get user preferences
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  // Calculate week range
  const now = new Date();
  const weekStart = startOfWeek(now, { locale: es });
  const weekEnd = endOfWeek(now, { locale: es });

  // Get measurements for the week
  const { data: measurements } = await supabase
    .from("measurements")
    .select("*")
    .eq("user_id", userId)
    .gte("date", weekStart.toISOString())
    .lte("date", weekEnd.toISOString())
    .order("date", { ascending: true });

  if (!measurements || measurements.length === 0) {
    return {
      user,
      preferences,
      weekStart,
      weekEnd,
      measurements: [],
      stats: null,
    };
  }

  // Calculate statistics for glucose
  const glucoseMeasurements = measurements.filter((m) => m.type === "glucose");
  let stats = null;

  if (glucoseMeasurements.length > 0) {
    const values = glucoseMeasurements.map((m) => Number(m.value));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    const highCount = values.filter((v) => v > (preferences?.glucose_high_threshold || 180)).length;
    const lowCount = values.filter((v) => v < (preferences?.glucose_low_threshold || 70)).length;

    stats = {
      total: measurements.length,
      glucose: {
        count: glucoseMeasurements.length,
        average: Math.round(avg * 10) / 10,
        max,
        min,
        highCount,
        lowCount,
      },
    };
  } else {
    stats = {
      total: measurements.length,
      glucose: null,
    };
  }

  return {
    user,
    preferences,
    weekStart,
    weekEnd,
    measurements,
    stats,
  };
}

