/**
 * Script de prueba para verificar la configuración de Gmail SMTP
 * Ejecuta: node scripts/test-gmail.js tu-email-destino@gmail.com
 */

require("dotenv").config({ path: ".env.local" });

const nodemailer = require("nodemailer");

async function testGmail() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  console.log("🔍 Verificando configuración de Gmail SMTP...\n");

  if (!gmailUser || !gmailAppPassword) {
    console.error("❌ ERROR: GMAIL_USER o GMAIL_APP_PASSWORD no están configuradas en .env.local");
    console.log("\n📝 Pasos para solucionarlo:");
    console.log("1. Ve a https://myaccount.google.com/apppasswords");
    console.log("2. Genera una contraseña de aplicación para 'Correo'");
    console.log("3. Agrega GMAIL_USER=tu-email@gmail.com a .env.local");
    console.log("4. Agrega GMAIL_APP_PASSWORD=tu-contraseña-aplicacion a .env.local");
    process.exit(1);
  }

  console.log("✅ GMAIL_USER encontrada:", gmailUser);
  console.log("✅ GMAIL_APP_PASSWORD encontrada\n");

  // Email de prueba
  const testEmail = process.argv[2] || process.env.TEST_EMAIL || "test@example.com";

  if (testEmail === "test@example.com") {
    console.error("❌ ERROR: Debes proporcionar un email de prueba");
    console.log("\n📝 Uso:");
    console.log("   node scripts/test-gmail.js tu-email-destino@gmail.com");
    console.log("   O define TEST_EMAIL en .env.local");
    process.exit(1);
  }

  console.log(`📧 Intentando enviar email de prueba a: ${testEmail}`);
  console.log(`📤 Desde: ${gmailUser}\n`);

  // Crear transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: `Glucamia Test <${gmailUser}>`,
      to: testEmail,
      subject: "Prueba de Gmail SMTP - Glucamia",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Prueba de Gmail SMTP</h1>
          <p>Si recibes este email, Gmail SMTP está configurado correctamente ✅</p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            Este es un mensaje de prueba desde Glucamia.
          </p>
        </div>
      `,
    });

    console.log("✅ Email enviado exitosamente!");
    console.log("📊 Message ID:", result.messageId);
    console.log("\n💡 Revisa tu bandeja de entrada (y spam) para confirmar.");
  } catch (error) {
    console.error("❌ Error al enviar email:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    
    if (error.code === "EAUTH") {
      console.log("\n💡 Error de autenticación. Verifica que:");
      console.log("   - GMAIL_USER sea tu email completo (ej: tu-email@gmail.com)");
      console.log("   - GMAIL_APP_PASSWORD sea la contraseña de aplicación correcta");
      console.log("   - Hayas generado la contraseña de aplicación en:");
      console.log("     https://myaccount.google.com/apppasswords");
    } else if (error.code === "ECONNECTION") {
      console.log("\n💡 Error de conexión. Verifica tu conexión a internet.");
    } else {
      console.log("\n💡 Detalles completos:", JSON.stringify(error, null, 2));
    }
    
    process.exit(1);
  }
}

testGmail();

