# Solución al problema de Resend

## Problema identificado

El dominio `onboarding.resend.com` no está verificado en tu cuenta de Resend. Esto ocurre porque estás usando la API key de "onboarding" (la que Resend da por defecto para pruebas), pero esa API key no tiene acceso al dominio de prueba.

## Solución

### Opción 1: Usar la API key de Glucamia (Recomendado)

1. Ve a https://resend.com/api-keys
2. Busca la API key que creaste específicamente para "Glucamia"
3. Cópiala
4. Actualiza tu `.env.local`:

```env
RESEND_API_KEY=re_tu_api_key_de_glucamia_aqui
RESEND_DOMAIN=onboarding.resend.com
```

5. Reinicia el servidor de desarrollo (`npm run dev`)

### Opción 2: Verificar el dominio en Resend

Si quieres seguir usando la API key de onboarding:

1. Ve a https://resend.com/domains
2. Verifica el dominio `onboarding.resend.com` (si está disponible)
3. O agrega y verifica tu propio dominio

## Verificar que funciona

Después de cambiar la API key, ejecuta:

```bash
node scripts/test-resend.js tu-email@gmail.com
```

Deberías ver un mensaje de éxito sin errores.

## Nota importante

La API key de "onboarding" que Resend da por defecto es solo para pruebas iniciales y puede tener limitaciones. La API key específica de "Glucamia" que creaste debería funcionar mejor y tener más permisos.

