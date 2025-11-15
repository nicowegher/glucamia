# Solución al Error: redirect_uri_mismatch

## El Problema

Cuando usas Supabase con Google OAuth, el flujo es:
1. Tu app → Supabase
2. Supabase → Google
3. Google → Supabase (aquí está el problema)
4. Supabase → Tu app

Google necesita redirigir a Supabase, NO directamente a tu app local.

## Solución Rápida

### Paso 1: Obtener tu URL de Supabase

1. Ve a tu dashboard de Supabase
2. Ve a **Settings** > **API**
3. Copia tu **Project URL** (algo como: `https://abcdefgh.supabase.co`)

### Paso 2: Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Ve a **APIs & Services** > **Credentials**
3. Haz clic en tu OAuth 2.0 Client ID (el que creaste para Glucamia)
4. En **Authorized redirect URIs**, asegúrate de tener EXACTAMENTE:

```
https://[tu-proyecto].supabase.co/auth/v1/callback
```

**Reemplaza `[tu-proyecto]` con tu Project URL de Supabase** (sin el `https://`)

Ejemplo: Si tu Project URL es `https://abcdefgh.supabase.co`, entonces la URI debe ser:
```
https://abcdefgh.supabase.co/auth/v1/callback
```

5. **IMPORTANTE**: También agrega (para desarrollo local):
```
http://localhost:3000/auth/callback
```

6. Haz clic en **Save**

### Paso 3: Configurar Supabase Redirect URLs

1. Ve a tu dashboard de Supabase
2. Ve a **Authentication** > **URL Configuration**
3. En **Site URL**, pon:
```
http://localhost:3000
```

4. En **Redirect URLs**, agrega:
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

5. Haz clic en **Save**

### Paso 4: Verificar que Google OAuth esté activado en Supabase

1. En Supabase, ve a **Authentication** > **Providers**
2. Verifica que **Google** esté activado (toggle ON)
3. Verifica que tengas el **Client ID** y **Client Secret** correctos

### Paso 5: Probar de nuevo

1. Cierra completamente el navegador (o usa modo incógnito)
2. Ve a `http://localhost:3000`
3. Intenta iniciar sesión de nuevo

## Verificación

Las URIs deben coincidir EXACTAMENTE (incluyendo http/https, puertos, paths):

✅ **En Google Cloud Console:**
- `https://[tu-proyecto].supabase.co/auth/v1/callback`
- `http://localhost:3000/auth/callback`

✅ **En Supabase URL Configuration:**
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

## Si aún no funciona

1. Espera 1-2 minutos después de guardar los cambios (puede tardar en propagarse)
2. Limpia las cookies del navegador para `localhost:3000`
3. Verifica que no haya espacios extra en las URIs
4. Asegúrate de que estés usando `http://` (no `https://`) para localhost

