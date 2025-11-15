# Solución para usar Resend sin dominio propio

## Problema
Resend requiere un dominio verificado para enviar emails, pero no tienes un dominio propio.

## Opciones disponibles

### Opción 1: Verificar el dominio de prueba en Resend (Recomendado primero)

1. **Ve a tu dashboard de Resend**: https://resend.com/domains
2. **Busca si aparece `onboarding.resend.com`** en la lista de dominios
3. Si aparece pero está "pendiente" o "no verificado":
   - Haz clic en el dominio
   - Sigue las instrucciones para verificar (puede requerir agregar registros DNS)
4. Si NO aparece en absoluto:
   - Contacta al soporte de Resend: support@resend.com
   - Pregunta cómo habilitar el dominio de prueba `onboarding.resend.com`
   - O pregunta si hay un dominio de prueba disponible para tu cuenta

### Opción 2: Adquirir un dominio barato (Solución permanente)

Puedes adquirir un dominio por menos de $1/año en servicios como:
- **Namecheap**: https://www.namecheap.com (dominios desde $0.99/año)
- **Cloudflare Registrar**: https://www.cloudflare.com/products/registrar (precios al costo)
- **Google Domains**: https://domains.google (ahora parte de Squarespace)

**Pasos:**
1. Compra un dominio (ej: `glucamia-app.com` o similar)
2. En Resend, ve a **Domains** > **Add Domain**
3. Ingresa tu dominio
4. Resend te dará registros DNS para agregar
5. Ve a tu proveedor de dominio y agrega los registros DNS
6. Resend verificará automáticamente (puede tomar unos minutos)
7. Actualiza `.env.local`: `RESEND_DOMAIN=tu-dominio.com`

### Opción 3: Usar un servicio alternativo temporal

Si necesitas una solución inmediata mientras consigues un dominio, puedes usar:

**SendGrid** (tiene dominio de prueba):
- Tiene un dominio de prueba que no requiere verificación
- Límite: 100 emails/día en plan gratuito
- Requiere cambiar el código para usar SendGrid en lugar de Resend

**Brevo (anteriormente Sendinblue)**:
- Plan gratuito: 300 emails/día
- Requiere verificación de email pero no de dominio para algunos casos

## Recomendación

**Para desarrollo/testing inmediato:**
1. Contacta a Resend para habilitar `onboarding.resend.com`
2. O adquiere un dominio barato ($1-2/año)

**Para producción:**
- Definitivamente necesitas un dominio propio verificado
- Esto mejora la deliverability y evita que los emails vayan a spam

## Contacto con Resend

Si el dominio de prueba no está disponible, contacta a:
- **Email**: support@resend.com
- **Documentación**: https://resend.com/docs
- **Discord**: https://resend.com/discord

Pregunta específicamente: "¿Cómo puedo habilitar el dominio de prueba onboarding.resend.com para mi cuenta?"

