import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";

export async function sendAlertEmail(
  userId: string,
  alertId: string,
  alertType: "high_glucose" | "low_glucose",
  value: number
) {
  const supabase = await createServiceRoleClient();

  // Get user info
  const { data: user } = await (supabase as any)
    .from("users")
    .select("email, name")
    .eq("id", userId)
    .single();

  if (!user) return;

  // Get active guests
  const { data: guests, error: guestsError } = await (supabase as any)
    .from("guests")
    .select("guest_email")
    .eq("user_id", userId)
    .eq("status", "active");

  if (guestsError) {
    console.error("Error fetching guests:", guestsError);
    return;
  }

  if (!guests || guests.length === 0) {
    console.log(`No active guests found for user ${userId}`);
    return;
  }

  console.log(`📧 Sending alert emails to ${guests.length} active guest(s):`, guests.map((g: any) => g.guest_email));

  const alertMessage =
    alertType === "high_glucose"
      ? `ALERTA: Glucosa alta (${value} mg/dL)`
      : `ALERTA: Glucosa baja (${value} mg/dL)`;

  const alertDescription =
    alertType === "high_glucose"
      ? `Se ha registrado un valor de glucosa alto: ${value} mg/dL. Por favor, verifica el estado de salud.`
      : `Se ha registrado un valor de glucosa bajo: ${value} mg/dL. Por favor, verifica el estado de salud.`;

  // Send email to each guest
  const emailPromises = guests.map((guest: any) =>
    sendEmail({
      to: guest.guest_email,
      subject: alertMessage,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Glucamia - Alerta de Salud</h1>
          <p style="font-size: 18px; color: #333;">
            ${alertDescription}
          </p>
          <p style="font-size: 16px; color: #666;">
            Usuario: ${user.name || user.email}
          </p>
          <p style="font-size: 16px; color: #666;">
            Fecha: ${new Date().toLocaleString("es-ES")}
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            Este es un mensaje automático de Glucamia.
          </p>
        </div>
      `,
    })
  );

  const results = await Promise.allSettled(emailPromises);
  
  // Log results
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`✅ Email sent successfully to ${guests[index].guest_email}`);
    } else {
      console.error(`❌ Failed to send email to ${guests[index].guest_email}:`, result.reason);
    }
  });
}

