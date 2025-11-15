import nodemailer from "nodemailer";

// Configuración de Gmail SMTP
const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser || !gmailAppPassword) {
  console.warn(
    "⚠️ GMAIL_USER o GMAIL_APP_PASSWORD no están configuradas. Los emails no se enviarán."
  );
}

// Crear transporter de nodemailer
export const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailAppPassword,
  },
});

// Función helper para enviar emails
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  if (!gmailUser || !gmailAppPassword) {
    throw new Error(
      "GMAIL_USER y GMAIL_APP_PASSWORD deben estar configuradas en las variables de entorno"
    );
  }

  const fromEmail = from || `Glucamia <${gmailUser}>`;

  try {
    const result = await emailTransporter.sendMail({
      from: fromEmail,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });

    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Error al enviar email:", error);
    throw new Error(
      error.message || "Error desconocido al enviar email con Gmail"
    );
  }
}

