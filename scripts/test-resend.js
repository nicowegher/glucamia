/**
 * Script de prueba para verificar la configuración de Resend
 * Ejecuta: node scripts/test-resend.js
 */

require("dotenv").config({ path: ".env.local" });

const { Resend } = require("resend");

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  const domain = process.env.RESEND_DOMAIN || "onboarding.resend.com";

  console.log("🔍 Verificando configuración de Resend...\n");

  if (!apiKey) {
    console.error("❌ ERROR: RESEND_API_KEY no está configurada en .env.local");
    console.log("\n📝 Pasos para solucionarlo:");
    console.log("1. Ve a https://resend.com/api-keys");
    console.log("2. Crea una nueva API Key");
    console.log("3. Agrega RESEND_API_KEY=tu_api_key_aqui a .env.local");
    process.exit(1);
  }

  console.log("✅ RESEND_API_KEY encontrada");
  console.log(`✅ RESEND_DOMAIN: ${domain}\n`);

  const resend = new Resend(apiKey);

  // Email de prueba (puede venir de argumento o variable de entorno)
  const testEmail = process.argv[2] || process.env.TEST_EMAIL || "test@example.com";

  if (testEmail === "test@example.com") {
    console.error("❌ ERROR: Debes proporcionar un email de prueba");
    console.log("\n📝 Uso:");
    console.log("   node scripts/test-resend.js tu-email@ejemplo.com");
    console.log("   O define TEST_EMAIL en .env.local");
    process.exit(1);
  }

  console.log(`📧 Intentando enviar email de prueba a: ${testEmail}`);
  
  // Intentar primero con el dominio configurado
  let fromEmail = `Glucamia Test <onboarding@${domain}>`;
  console.log(`📤 Intentando desde: ${fromEmail}\n`);

  try {
    let result = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "Prueba de Resend - Glucamia",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Prueba de Resend</h1>
          <p>Si recibes este email, Resend está configurado correctamente ✅</p>
        </div>
      `,
    });

    // Verificar si hay error en el resultado
    if (result.error) {
      throw new Error(result.error.message || "Error desconocido de Resend");
    }

    console.log("✅ Email enviado exitosamente!");
    console.log("📊 Resultado:", JSON.stringify(result, null, 2));
    console.log("\n💡 Revisa tu bandeja de entrada (y spam) para confirmar.");
    return;
  } catch (error) {
    console.error("❌ Error al enviar email:");
    console.error("Mensaje:", error.message);
    console.error("Detalles:", JSON.stringify(error, null, 2));
    
    if (error.message?.includes("API key")) {
      console.log("\n💡 El API key puede ser inválido. Verifica que:");
      console.log("   - El API key esté correctamente copiado");
      console.log("   - No tenga espacios extra");
      console.log("   - Esté activo en tu cuenta de Resend");
    }
    
    if (error.message?.includes("domain") || error.message?.includes("not verified")) {
      console.log("\n💡 El dominio no está verificado. Intentando con email directo...\n");
      
      // Intentar con el email del usuario directamente (si está verificado en Resend)
      // Necesitas usar un email que esté verificado en tu cuenta de Resend
      const verifiedEmail = process.env.RESEND_VERIFIED_EMAIL || "digitalhotelero@gmail.com";
      fromEmail = `Glucamia Test <${verifiedEmail}>`;
      
      console.log(`📤 Intentando desde email verificado: ${fromEmail}\n`);
      
      try {
        result = await resend.emails.send({
          from: fromEmail,
          to: testEmail,
          subject: "Prueba de Resend - Glucamia",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Prueba de Resend</h1>
              <p>Si recibes este email, Resend está configurado correctamente ✅</p>
            </div>
          `,
        });
        
        // Verificar si hay error en el resultado
        if (result.error) {
          throw new Error(result.error.message || "Error desconocido de Resend");
        }
        
        console.log("✅ Email enviado exitosamente con email verificado!");
        console.log("📊 Resultado:", JSON.stringify(result, null, 2));
        console.log("\n💡 Revisa tu bandeja de entrada (y spam) para confirmar.");
        return;
      } catch (emailError) {
        console.error("❌ También falló con email directo:");
        console.error("Mensaje:", emailError.message);
        console.log("\n💡 SOLUCIÓN REQUERIDA:");
        console.log("   Necesitas verificar un dominio en Resend para poder enviar emails.");
        console.log("\n   Pasos:");
        console.log("   1. Ve a https://resend.com/domains");
        console.log("   2. Haz clic en 'Add Domain'");
        console.log("   3. Ingresa un dominio que controles (ej: tu-dominio.com)");
        console.log("   4. Sigue las instrucciones para verificar el dominio (DNS)");
        console.log("   5. Una vez verificado, actualiza RESEND_DOMAIN en .env.local");
        console.log("\n   O si Resend ofrece onboarding.resend.com:");
        console.log("   - Verifica que el dominio aparezca en tu lista de dominios");
        console.log("   - Si no aparece, contacta a Resend para habilitarlo");
      }
    }
    
    process.exit(1);
  }
}

testResend();

