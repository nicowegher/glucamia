# Migración de Resend a Gmail SMTP - Completada ✅

## Cambios realizados

### 1. Nuevo cliente de email
- **Creado**: `lib/email/client.ts`
- Reemplaza `lib/resend/client.ts`
- Usa `nodemailer` con Gmail SMTP

### 2. Archivos actualizados
- ✅ `app/api/guests/invite/route.ts` - Invitaciones de invitados
- ✅ `lib/alerts/sendEmail.ts` - Alertas de glucosa
- ✅ `app/api/cron/weekly-report/route.ts` - Reportes semanales

### 3. Nuevas dependencias
- ✅ `nodemailer` - Cliente SMTP
- ✅ `@types/nodemailer` - Tipos TypeScript

### 4. Documentación creada
- ✅ `GMAIL_SETUP.md` - Guía de configuración de Gmail
- ✅ `scripts/test-gmail.js` - Script de prueba

## Variables de entorno necesarias

Agrega a tu `.env.local`:

```env
# Gmail SMTP (reemplaza las de Resend)
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

## Próximos pasos

1. **Generar contraseña de aplicación de Gmail**:
   - Ve a: https://myaccount.google.com/apppasswords
   - Genera una contraseña para "Correo" > "Glucamia"
   - Copia la contraseña de 16 caracteres

2. **Actualizar `.env.local`**:
   - Agrega `GMAIL_USER` con tu email de Gmail
   - Agrega `GMAIL_APP_PASSWORD` con la contraseña generada

3. **Probar la configuración**:
   ```bash
   node scripts/test-gmail.js tu-email-destino@gmail.com
   ```

4. **Reiniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## Notas importantes

- **Límite de Gmail**: 500 emails/día para cuentas personales
- **Remitente**: Los emails saldrán desde tu Gmail personal
- **Para producción**: Considera migrar a Resend con dominio propio cuando tengas más usuarios

## Archivos que ya no se usan (pero se mantienen)

- `lib/resend/client.ts` - Puede eliminarse si no planeas volver a Resend
- Variables `RESEND_API_KEY` y `RESEND_DOMAIN` - Ya no son necesarias

