import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Guest, User } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    // Check if guest already exists
    const serviceSupabase = await createServiceRoleClient();
    const { data: existingGuest } = await serviceSupabase
      .from("guests")
      .select("*")
      .eq("user_id", user.id)
      .eq("guest_email", email)
      .single()
      .returns<Guest>();

    if (existingGuest) {
      return NextResponse.json(
        { error: "Este email ya está invitado" },
        { status: 400 }
      );
    }

    // Generate token
    const token = randomBytes(32).toString("hex");

    // Create guest record
    const { data: guest, error: guestError } = await serviceSupabase
      .from("guests")
      .insert({
        user_id: user.id,
        guest_email: email,
        status: "pending" as const,
        token,
      })
      .select()
      .single()
      .returns<Guest>();

    if (guestError) {
      throw guestError;
    }

    // Get user info
    const { data: userData } = await serviceSupabase
      .from("users")
      .select("name, email")
      .eq("id", user.id)
      .single()
      .returns<Pick<User, "name" | "email">>();

    // Validate Gmail configuration
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("GMAIL_USER o GMAIL_APP_PASSWORD no están configuradas");
      return NextResponse.json(
        { error: "Error de configuración: GMAIL_USER y GMAIL_APP_PASSWORD deben estar configuradas" },
        { status: 500 }
      );
    }

    // Send invitation email
    const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest/${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Invitación a Glucamia",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Invitación a Glucamia</h1>
            <p style="font-size: 18px; color: #333;">
              ${userData?.name || userData?.email} te ha invitado a ver sus registros de salud en Glucamia.
            </p>
            <p style="font-size: 16px; color: #666;">
              Haz clic en el siguiente enlace para activar tu acceso:
            </p>
            <a href="${activationUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-size: 18px;">
              Activar acceso
            </a>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Si no solicitaste esta invitación, puedes ignorar este email.
            </p>
          </div>
        `,
      });

      console.log("Email de invitación enviado exitosamente");

      return NextResponse.json({ success: true, guest });
    } catch (emailError: any) {
      console.error("Error al enviar email con Gmail:", emailError);
      console.error("Detalles del error:", JSON.stringify(emailError, null, 2));
      
      // Return more detailed error message
      const errorMessage = emailError?.message || "Error desconocido al enviar email";
      return NextResponse.json(
        { 
          error: `Error al enviar email: ${errorMessage}. Verifica que GMAIL_USER y GMAIL_APP_PASSWORD estén configuradas correctamente.` 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error inviting guest:", error);
    console.error("Stack trace:", error?.stack);
    return NextResponse.json(
      { 
        error: error?.message || "Error al enviar invitación",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

