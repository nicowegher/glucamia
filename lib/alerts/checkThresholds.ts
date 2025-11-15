import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendAlertEmail } from "./sendEmail";
import { sendPushNotification } from "@/lib/push/send";

export async function checkGlucoseThresholds(
  measurementId: string,
  value: number,
  userId: string
) {
  const supabase = await createServiceRoleClient();

  // Get user preferences
  const { data: preferences, error: prefError } = await (supabase as any)
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (prefError) {
    console.error("Error fetching user preferences:", prefError);
    return null;
  }

  if (!preferences) {
    console.warn(`No preferences found for user ${userId}`);
    return null;
  }

  const highThreshold = preferences.glucose_high_threshold || 180;
  const lowThreshold = preferences.glucose_low_threshold || 70;

  console.log(`Checking thresholds: value=${value}, high=${highThreshold}, low=${lowThreshold}`);

  let alertType: "high_glucose" | "low_glucose" | null = null;

  if (value > highThreshold) {
    alertType = "high_glucose";
    console.log(`⚠️ High glucose alert triggered: ${value} > ${highThreshold}`);
  } else if (value < lowThreshold) {
    alertType = "low_glucose";
    console.log(`⚠️ Low glucose alert triggered: ${value} < ${lowThreshold}`);
  }

  if (!alertType) {
    console.log(`No alert needed: value ${value} is within normal range`);
    return null;
  }

  // Create alert record
  const { data: alert, error } = await (supabase as any)
    .from("alerts")
    .insert({
      user_id: userId,
      measurement_id: measurementId,
      alert_type: alertType,
      notified_guests: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating alert:", error);
    return null;
  }

  // Send emails to active guests
  await sendAlertEmail(userId, alert.id, alertType, value);

  // Send push notification
  const alertMessage =
    alertType === "high_glucose"
      ? `ALERTA: Glucosa alta (${value} mg/dL)`
      : `ALERTA: Glucosa baja (${value} mg/dL)`;
  await sendPushNotification(
    userId,
    "Glucamia - Alerta",
    alertMessage
  );

  // Update alert as notified
  await (supabase as any)
    .from("alerts")
    .update({ notified_guests: true })
    .eq("id", alert.id);

  return alert;
}

