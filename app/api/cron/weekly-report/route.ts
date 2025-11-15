import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateWeeklyReport } from "@/lib/reports/generateWeeklyReport";
import { sendEmail } from "@/lib/email/client";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Guest } from "@/types";

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    // Get all users
    const { data: users } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("onboarding_completed", true)
      .returns<User[]>();

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users to process" });
    }

    // Process each user
    for (const user of users) {
      try {
        const report = await generateWeeklyReport(user.id);

        if (!report || !report.stats) {
          continue; // Skip if no data
        }

        // Get active guests
        const { data: guests } = await (supabase as any)
          .from("guests")
          .select("guest_email")
          .eq("user_id", user.id)
          .eq("status", "active");

        const recipients = [user.email, ...(guests?.map((g) => g.guest_email) || [])];

        // Generate email content
        const weekRange = `${format(report.weekStart, "dd/MM", { locale: es })} - ${format(report.weekEnd, "dd/MM/yyyy", { locale: es })}`;

        let emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Reporte Semanal - Glucamia</h1>
            <p style="font-size: 18px; color: #333;">
              Hola ${user.name || "Usuario"},
            </p>
            <p style="font-size: 16px; color: #666;">
              Resumen de la semana: ${weekRange}
            </p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #111827; margin-top: 0;">Estadísticas</h2>
              <p style="font-size: 16px; color: #333;">
                <strong>Total de registros:</strong> ${report.stats.total}
              </p>
        `;

        if (report.stats.glucose) {
          emailContent += `
            <p style="font-size: 16px; color: #333;">
              <strong>Registros de glucemia:</strong> ${report.stats.glucose.count}
            </p>
            <p style="font-size: 16px; color: #333;">
              <strong>Promedio:</strong> ${report.stats.glucose.average} mg/dL
            </p>
            <p style="font-size: 16px; color: #333;">
              <strong>Máximo:</strong> ${report.stats.glucose.max} mg/dL
            </p>
            <p style="font-size: 16px; color: #333;">
              <strong>Mínimo:</strong> ${report.stats.glucose.min} mg/dL
            </p>
          `;

          if (report.stats.glucose.highCount > 0) {
            emailContent += `
              <p style="font-size: 16px; color: #ef4444; font-weight: bold;">
                ⚠️ ${report.stats.glucose.highCount} registro(s) alto(s) esta semana
              </p>
            `;
          }

          if (report.stats.glucose.lowCount > 0) {
            emailContent += `
              <p style="font-size: 16px; color: #f59e0b; font-weight: bold;">
                ⚠️ ${report.stats.glucose.lowCount} registro(s) bajo(s) esta semana
              </p>
            `;
          }
        }

        emailContent += `
            </div>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Este es un reporte automático de Glucamia.
            </p>
          </div>
        `;

        // Send email to all recipients
        await Promise.allSettled(
          recipients.map((email) =>
            sendEmail({
              to: email,
              subject: `Reporte Semanal - ${weekRange}`,
              html: emailContent,
            })
          )
        );
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        // Continue with next user
      }
    }

    return NextResponse.json({ success: true, processed: users.length });
  } catch (error) {
    console.error("Error in weekly report cron:", error);
    return NextResponse.json(
      { error: "Error al generar reportes" },
      { status: 500 }
    );
  }
}

