# Guía de Configuración de Vercel - Glucamia

Esta guía te ayudará a desplegar la aplicación en Vercel paso a paso.

## Paso 1: Crear cuenta y conectar repositorio

### 1.1 Crear cuenta en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Inicia sesión con tu cuenta de **GitHub** (recomendado para conectar repositorios fácilmente)
4. Autoriza a Vercel para acceder a tus repositorios de GitHub

### 1.2 Importar proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** > **"Project"**
2. Verás una lista de tus repositorios de GitHub
3. Busca y selecciona **`glucamia`** (o el nombre de tu repositorio)
4. Haz clic en **"Import"**

### 1.3 Configurar el proyecto

En la página de configuración, verifica estos valores (Vercel debería detectarlos automáticamente):

- **Framework Preset**: `Next.js` ✅
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `.next` (por defecto)
- **Install Command**: `npm install` (por defecto)

**NO hagas clic en "Deploy" todavía**. Primero necesitamos configurar las variables de entorno.

---

## Paso 2: Configurar variables de entorno

### 2.1 Agregar variables de entorno

En la misma página de configuración del proyecto, desplázate hacia abajo hasta la sección **"Environment Variables"**.

Agrega las siguientes variables una por una:

#### Variables de Supabase (obligatorias)

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - Value: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Value: Tu anon/public key de Supabase
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Value: Tu service_role key de Supabase (⚠️ secreta)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

#### Variables de Gmail SMTP (obligatorias)

4. **`GMAIL_USER`**
   - Value: Tu email de Gmail (ej: `tu-email@gmail.com`)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

5. **`GMAIL_APP_PASSWORD`**
   - Value: Tu contraseña de aplicación de Gmail (16 caracteres)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

#### Variables de la aplicación

6. **`NEXT_PUBLIC_APP_URL`**
   - Value: **Por ahora deja `http://localhost:3000`** (lo actualizaremos después del primer deploy)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - ⚠️ **IMPORTANTE**: Después del primer deploy, Vercel te dará una URL. Deberás actualizar esta variable con esa URL.

7. **`CRON_SECRET`**
   - Value: Un secreto aleatorio (puedes generar uno con: `openssl rand -base64 32`)
   - Environments: ✅ Production (solo Production)
   - Este secreto protege el endpoint del cron job

#### Variables opcionales (Push Notifications)

8. **`NEXT_PUBLIC_VAPID_PUBLIC_KEY`** (opcional)
   - Value: Tu clave pública VAPID (si configuraste push notifications)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

9. **`VAPID_PRIVATE_KEY`** (opcional)
   - Value: Tu clave privada VAPID (si configuraste push notifications)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### 2.2 Verificar variables

Después de agregar todas las variables, deberías tener al menos **7 variables** (5 obligatorias + 2 opcionales si configuraste push notifications).

---

## Paso 3: Hacer el primer deploy

1. Una vez que hayas agregado todas las variables de entorno, haz clic en **"Deploy"**
2. Vercel comenzará a construir tu aplicación (esto tomará 2-3 minutos)
3. Puedes ver el progreso en tiempo real en la página de deploy
4. Cuando termine, verás un mensaje de éxito y una URL como: `https://glucamia-xxxxx.vercel.app`

---

## Paso 4: Actualizar variables después del primer deploy

### 4.1 Obtener la URL de producción

1. Una vez que el deploy termine, copia la URL que Vercel te dio
   - Ejemplo: `https://glucamia-xxxxx.vercel.app`

### 4.2 Actualizar NEXT_PUBLIC_APP_URL

1. En Vercel, ve a tu proyecto
2. Ve a **Settings** > **Environment Variables**
3. Busca `NEXT_PUBLIC_APP_URL`
4. Haz clic en los tres puntos (...) > **Edit**
5. Cambia el valor de `http://localhost:3000` a tu URL de Vercel (ej: `https://glucamia-xxxxx.vercel.app`)
6. Asegúrate de que esté marcado para **Production**, **Preview** y **Development**
7. Haz clic en **Save**

### 4.3 Hacer un nuevo deploy

1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos (...) del último deployment > **Redeploy**
3. O simplemente haz un nuevo commit y push a GitHub (Vercel desplegará automáticamente)

---

## Paso 5: Actualizar Google OAuth con URL de producción

### 5.1 Agregar URL de producción a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Ve a **APIs & Services** > **Credentials**
3. Encuentra tu OAuth 2.0 Client ID y haz clic en el lápiz (Edit)
4. En **Authorized redirect URIs**, agrega:
   - `https://tu-proyecto.vercel.app/auth/callback` (reemplaza con tu URL real de Vercel)
   - `https://tu-proyecto.supabase.co/auth/v1/callback` (si no está ya)
5. Haz clic en **Save**

### 5.2 Verificar que Supabase tenga la URL correcta

1. Ve a tu proyecto en Supabase
2. Ve a **Authentication** > **URL Configuration**
3. Verifica que **Site URL** sea tu URL de Vercel (ej: `https://glucamia-xxxxx.vercel.app`)
4. En **Redirect URLs**, asegúrate de que esté:
   - `https://tu-proyecto.vercel.app/auth/callback`
   - `https://tu-proyecto.vercel.app/**`

---

## Paso 6: Verificar que todo funciona

### 6.1 Probar la aplicación

1. Abre tu URL de Vercel en el navegador
2. Deberías ver la página de login
3. Haz clic en "Iniciar sesión con Google"
4. Deberías poder iniciar sesión correctamente
5. Completa el onboarding si es tu primera vez
6. Prueba registrar una medición

### 6.2 Verificar emails

1. Invita a un invitado desde Settings
2. Verifica que llegue el email de invitación
3. Activa el invitado
4. Registra una medición de glucemia fuera de rango (>180 o <70)
5. Verifica que el invitado reciba el email de alerta

### 6.3 Verificar cron job

El cron job está configurado en `vercel.json` para ejecutarse los domingos a las 8:00 AM. Vercel lo configurará automáticamente.

Para verificar que está configurado:
1. Ve a **Settings** > **Cron Jobs** en Vercel
2. Deberías ver: `/api/cron/weekly-report` con schedule `0 8 * * 0`

---

## Paso 7: Configurar dominio personalizado (opcional)

Si quieres usar tu propio dominio:

1. En Vercel, ve a **Settings** > **Domains**
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: `glucamia.com`)
4. Sigue las instrucciones para configurar los registros DNS
5. Una vez configurado, actualiza `NEXT_PUBLIC_APP_URL` con tu dominio personalizado
6. Actualiza también las URLs en Google Cloud Console y Supabase

---

## Troubleshooting

### Error: "Build failed"

- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel para ver el error específico
- Asegúrate de que `package.json` tenga todas las dependencias necesarias

### Error: "OAuth redirect mismatch"

- Verifica que la URL en Google Cloud Console coincida exactamente con tu URL de Vercel
- Verifica que Supabase tenga la URL correcta en Site URL y Redirect URLs

### Emails no se envían

- Verifica que `GMAIL_USER` y `GMAIL_APP_PASSWORD` estén correctamente configuradas
- Revisa los logs de Vercel (Functions > Logs) para ver errores de email
- Verifica que la contraseña de aplicación de Gmail sea válida

### Error: "Invalid API key" en Supabase

- Verifica que copiaste las keys correctas sin espacios extra
- Asegúrate de que las variables estén marcadas para el ambiente correcto (Production)

### El cron job no se ejecuta

- Verifica que `CRON_SECRET` esté configurado
- Revisa la configuración en **Settings** > **Cron Jobs**
- Los cron jobs solo funcionan en el plan Hobby o superior de Vercel

---

## Resumen de variables de entorno necesarias

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ GMAIL_USER
✅ GMAIL_APP_PASSWORD
✅ NEXT_PUBLIC_APP_URL (actualizar después del primer deploy)
✅ CRON_SECRET
🔲 NEXT_PUBLIC_VAPID_PUBLIC_KEY (opcional)
🔲 VAPID_PRIVATE_KEY (opcional)
```

---

¡Listo! Tu aplicación debería estar funcionando en producción. 🎉

