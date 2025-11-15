# Configuración de Gmail SMTP para Glucamia

Esta guía te ayudará a configurar Gmail para enviar emails desde la aplicación.

## Paso 1: Habilitar verificación en dos pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/security
2. Busca "Verificación en dos pasos" y actívala si no está activada
3. Sigue las instrucciones para configurarla

## Paso 2: Generar contraseña de aplicación

1. Ve a: https://myaccount.google.com/apppasswords
   - Si no ves esta opción, asegúrate de tener la verificación en dos pasos activada
2. En "Seleccionar app", elige "Correo"
3. En "Seleccionar dispositivo", elige "Otro (nombre personalizado)"
4. Escribe "Glucamia" y haz clic en "Generar"
5. **Copia la contraseña de 16 caracteres** (solo se muestra una vez)
   - Formato: `xxxx xxxx xxxx xxxx` (sin espacios)

## Paso 3: Configurar variables de entorno

Abre tu archivo `.env.local` y agrega:

```env
# Gmail SMTP
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Importante:**
- `GMAIL_USER`: Tu dirección de Gmail completa (ej: `digitalhotelero@gmail.com`)
- `GMAIL_APP_PASSWORD`: La contraseña de 16 caracteres que generaste (puedes incluir o no los espacios)

## Paso 4: Probar la configuración

Ejecuta el script de prueba:

```bash
node scripts/test-gmail.js tu-email-destino@gmail.com
```

Si todo está bien, deberías recibir un email de prueba.

## Límites de Gmail

- **Límite diario**: 500 emails por día para cuentas personales
- **Límite por minuto**: ~100 emails por minuto
- **Recomendación**: Para producción con muchos usuarios, considera migrar a Resend con dominio propio

## Solución de problemas

### Error: "Invalid login"
- Verifica que `GMAIL_USER` sea tu email completo
- Verifica que `GMAIL_APP_PASSWORD` sea la contraseña correcta (sin espacios o con espacios, ambos funcionan)
- Asegúrate de haber generado una nueva contraseña de aplicación

### Error: "Less secure app access"
- Ya no es necesario habilitar "aplicaciones menos seguras"
- Usa contraseñas de aplicación en su lugar (Paso 2)

### Los emails van a spam
- Es normal cuando se envía desde Gmail personal
- Para producción, considera usar un dominio propio con Resend

## Migración futura a Resend

Cuando tengas un dominio propio, puedes migrar fácilmente:
1. Adquiere un dominio
2. Verifícalo en Resend
3. Reemplaza `lib/email/client.ts` para usar Resend
4. Actualiza las variables de entorno

