# Guía de Configuración Paso a Paso - Glucamia

Esta guía te ayudará a configurar la aplicación completa desde cero.

## Paso 1: Configurar Supabase

### 1.1 Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa el formulario:
   - **Name**: `glucamia` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Elige la más cercana a ti
   - **Pricing Plan**: Free tier es suficiente para empezar
5. Haz clic en "Create new project"
6. Espera 2-3 minutos mientras se crea el proyecto

### 1.2 Obtener credenciales de Supabase

1. En el dashboard de tu proyecto, ve a **Settings** (⚙️) > **API**
2. Copia los siguientes valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Mantén esto secreto)

### 1.3 Ejecutar la migración SQL

1. En el dashboard de Supabase, ve a **SQL Editor** (en el menú lateral)
2. Haz clic en "New query"
3. Abre el archivo `supabase/migrations/001_initial_schema.sql` en tu editor
4. Copia TODO el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en "Run" (o presiona Cmd/Ctrl + Enter)
7. Deberías ver "Success. No rows returned" o similar
8. Verifica que las tablas se crearon:
   - Ve a **Table Editor** en el menú lateral
   - Deberías ver: `users`, `user_preferences`, `measurements`, `guests`, `alerts`, `medications`

### 1.4 Verificar RLS (Row Level Security)

1. En **Table Editor**, selecciona cualquier tabla
2. Ve a la pestaña "Policies"
3. Deberías ver políticas creadas automáticamente por la migración

---

## Paso 2: Configurar Google OAuth

### 2.1 Crear proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Si no tienes un proyecto, crea uno:
   - Haz clic en el selector de proyectos (arriba)
   - "New Project"
   - Nombre: `Glucamia` (o el que prefieras)
   - Haz clic en "Create"

### 2.2 Habilitar Google+ API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google+ API" o "Google Identity"
3. Haz clic en "Enable" (si no está habilitada)

### 2.3 Crear credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en "Create Credentials" > "OAuth client ID"
3. Si es la primera vez, configura la pantalla de consentimiento:
   - **User Type**: External
   - **App name**: `Glucamia`
   - **User support email**: Tu email
   - **Developer contact**: Tu email
   - Haz clic en "Save and Continue"
   - En "Scopes", haz clic en "Save and Continue"
   - En "Test users", agrega tu email de Google
   - Haz clic en "Save and Continue"
   - Revisa y haz clic en "Back to Dashboard"

4. Ahora crea las credenciales:
   - **Application type**: Web application
   - **Name**: `Glucamia Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (para desarrollo)
     - Tu URL de Supabase: `https://[tu-proyecto].supabase.co` (la encontrarás en Settings > API de Supabase)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (para desarrollo)
     - `https://[tu-proyecto].supabase.co/auth/v1/callback` (para producción)
   - Haz clic en "Create"
5. **Copia el Client ID y Client Secret** (los necesitarás en el siguiente paso)

### 2.4 Configurar Google OAuth en Supabase

1. En el dashboard de Supabase, ve a **Authentication** > **Providers**
2. Busca "Google" en la lista
3. Haz clic en el toggle para activarlo
4. Ingresa:
   - **Client ID (for OAuth)**: El Client ID que copiaste de Google Cloud
   - **Client Secret (for OAuth)**: El Client Secret que copiaste
5. Haz clic en "Save"
6. Opcional: Puedes personalizar el mensaje de error si lo deseas

---

## Paso 3: Configurar Resend (para emails)

### 3.1 Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta (puedes usar GitHub para login rápido)
3. Verifica tu email

### 3.2 Usar dominio de prueba de Resend (para desarrollo)

**Para desarrollo, puedes usar el dominio de prueba de Resend:**

1. En Resend, ve a **Domains** en el menú lateral
2. Verás un dominio de prueba automático (generalmente `onboarding.resend.com`)
3. **Copia el nombre del dominio** (ej: `onboarding.resend.com`)
4. Este dominio ya está configurado y listo para usar
5. **Nota**: Los emails enviados desde este dominio pueden ir a la carpeta de spam

**Alternativa**: Si no ves un dominio de prueba, puedes usar directamente `onboarding.resend.com` que es el dominio de prueba por defecto de Resend.

**Para producción más adelante**: Cuando quieras usar tu propio dominio, ve a **Domains** > **Add Domain** y sigue las instrucciones.

### 3.3 Obtener API Key

1. En Resend, ve a **API Keys**
2. Haz clic en "Create API Key"
3. Nombre: `Glucamia Production` (o el que prefieras)
4. Selecciona los permisos: "Sending access"
5. Haz clic en "Create"
6. **Copia el API Key** (solo se muestra una vez)

### 3.4 Configurar dominio en variables de entorno

El código ya está configurado para usar una variable de entorno. Solo necesitas agregarla a `.env.local`:

- Si usas el dominio de prueba: `RESEND_DOMAIN=onboarding.resend.com`
- Si más adelante verificas tu propio dominio: `RESEND_DOMAIN=tu-dominio.com`

**Nota**: Si no defines esta variable, se usará `onboarding.resend.com` por defecto.

---

## Paso 4: Configurar variables de entorno

### 4.1 Actualizar .env.local

Abre el archivo `.env.local` y reemplaza los valores placeholder con los reales:

```env
# Supabase (del Paso 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Resend (del Paso 3.3)
RESEND_API_KEY=re_tu_api_key_aqui
RESEND_DOMAIN=onboarding.resend.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (genera uno aleatorio)
CRON_SECRET=tu_secreto_aleatorio_aqui

# Push Notifications (opcional - puedes dejarlo vacío por ahora)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

### 4.2 Generar CRON_SECRET

Puedes generar un secreto aleatorio con:

```bash
openssl rand -base64 32
```

O usa cualquier generador de strings aleatorios.

---

## Paso 5: Probar localmente

### 5.1 Iniciar el servidor

```bash
npm run dev
```

### 5.2 Probar el flujo completo

1. Abre `http://localhost:3000`
2. Deberías ser redirigido a `/login`
3. Haz clic en "Iniciar sesión con Google"
4. Deberías ver la pantalla de Google OAuth
5. Selecciona tu cuenta de Google
6. Deberías ser redirigido de vuelta a la app
7. Si es tu primera vez, verás el onboarding
8. Completa el onboarding
9. Deberías ver el dashboard principal

### 5.3 Probar funcionalidades

- ✅ Registrar una medición de glucemia
- ✅ Ver el gráfico
- ✅ Invitar a un invitado (en Settings)
- ✅ Verificar que se reciben emails (revisa tu carpeta de spam si usas dominio de prueba)

---

## Paso 6: Desplegar en Vercel

### 6.1 Preparar el repositorio

1. Asegúrate de que tu código esté en Git:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **IMPORTANTE**: No subas `.env.local` a Git (ya está en `.gitignore`)

### 6.2 Conectar con Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Haz clic en "Add New..." > "Project"
4. Importa tu repositorio de GitHub
5. Configura el proyecto:
   - **Framework Preset**: Next.js (debería detectarlo automáticamente)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (por defecto)
   - **Output Directory**: `.next` (por defecto)

### 6.3 Configurar variables de entorno en Vercel

Antes de hacer deploy, configura las variables:

1. En la página de configuración del proyecto, ve a **Environment Variables**
2. Agrega todas las variables de `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` → Cambia a tu URL de Vercel (ej: `https://glucamia.vercel.app`)
   - `CRON_SECRET`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (opcional)
   - `VAPID_PRIVATE_KEY` (opcional)

3. **IMPORTANTE**: Para `NEXT_PUBLIC_APP_URL`, usa la URL que Vercel te asigne (la verás después del primer deploy)

### 6.4 Actualizar Google OAuth con URL de producción

1. Ve a Google Cloud Console > Credentials
2. Edita tu OAuth Client ID
3. Agrega a **Authorized redirect URIs**:
   - `https://tu-proyecto.vercel.app/auth/callback`
   - `https://tu-proyecto.supabase.co/auth/v1/callback` (si no está ya)

### 6.5 Hacer deploy

1. Haz clic en "Deploy"
2. Espera a que termine el build (2-3 minutos)
3. Una vez completado, Vercel te dará una URL (ej: `https://glucamia.vercel.app`)

### 6.6 Actualizar variables después del primer deploy

1. Copia la URL que Vercel te dio
2. Ve a **Settings** > **Environment Variables** en Vercel
3. Actualiza `NEXT_PUBLIC_APP_URL` con la URL real de Vercel
4. Haz un nuevo deploy (o espera a que se actualice automáticamente)

### 6.7 Configurar dominio personalizado (opcional)

1. En Vercel, ve a **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS
4. Una vez configurado, actualiza `NEXT_PUBLIC_APP_URL` con tu dominio personalizado

---

## Verificación Final

Después de completar todos los pasos, verifica:

- ✅ Login con Google funciona
- ✅ Puedes registrar mediciones
- ✅ Los emails se envían correctamente
- ✅ Los invitados pueden activar sus cuentas
- ✅ El cron job está configurado (se ejecutará automáticamente los domingos)

## Troubleshooting

### Error: "Invalid API key" en Supabase
- Verifica que copiaste las keys correctas
- Asegúrate de que no hay espacios extra

### Error: "OAuth redirect mismatch"
- Verifica que las URIs en Google Cloud Console coincidan exactamente
- Incluye `http://localhost:3000/auth/callback` para desarrollo

### Emails no se envían
- Verifica que el dominio esté verificado en Resend
- Revisa la carpeta de spam
- Verifica los logs en Resend dashboard

### Error en Vercel build
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

---

¡Listo! Tu aplicación debería estar funcionando completamente. 🎉

