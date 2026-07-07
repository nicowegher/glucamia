# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del proyecto

Glucamia es una app web de seguimiento de glucemia y salud básica, diseñada para adultos mayores (60+). La UI debe mantenerse extremadamente simple y accesible: botones grandes (60px+), textos grandes (20px+), alto contraste. Cualquier cambio de UI debe respetar estos criterios de accesibilidad.

## Comandos

```bash
npm run dev             # Servidor de desarrollo (http://localhost:3000)
npm run build           # Build de producción
npm run start           # Servidor de producción
npm run lint            # ESLint (next/core-web-vitals + next/typescript)
npm run generate-icons  # Regenerar íconos PWA a partir de public/ (usa sharp)
node scripts/test-gmail.js <email-destino>   # Probar envío de email vía Gmail SMTP
node scripts/test-resend.js                  # Probar envío de email vía Resend (legacy, no usado actualmente)
```

No hay suite de tests configurada (no jest/vitest/playwright).

Sin variables de entorno reales configuradas (`.env.local` con placeholders), la app arranca y muestra el login, pero no persiste datos ni autentica de verdad. Ver README.md para la lista completa de variables requeridas.

## Arquitectura

### Stack
Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS 4, Supabase (Auth + Postgres), nodemailer/Gmail SMTP (envío de emails), Recharts (gráficos), `@react-pdf/renderer` (export PDF), `web-push` (notificaciones push), hosting en Vercel. Alias de import `@/*` apunta a la raíz del repo.

### Rutas (`app/`)
- `(auth)/login` y `auth/callback`: flujo de login con Google OAuth vía Supabase.
- `(dashboard)/*`: rutas protegidas (record, settings, onboarding) más `guest/[token]` para la vista de solo lectura de invitados.
- `api/*`: toda la lógica de backend vive en API routes (measurements, alerts, guests, push, cron, preferences), no hay server actions.

`middleware.ts` protege las rutas: sin sesión redirige a `/login`, con sesión bloquea el acceso a `/login`. Tiene un fallback especial — si `NEXT_PUBLIC_SUPABASE_URL` no está seteada o contiene `"placeholder"`, deja pasar solo a `/login` sin intentar hablar con Supabase (para poder correr la UI sin backend configurado).

### Clientes de Supabase (`lib/supabase/`)
Hay tres formas de crear cliente, cada una para un contexto distinto:
- `client.ts` (`createClient`, browser): usado en componentes cliente.
- `server.ts` (`createClient`, server): usado en Server Components/API routes que operan **como el usuario logueado**, respeta RLS via cookies de sesión.
- `server.ts` (`createServiceRoleClient`): usa `SUPABASE_SERVICE_ROLE_KEY`, **bypassea RLS**. Se usa en flujos donde no hay sesión de usuario del dueño de los datos (activación de invitados por token, alertas, cron de reportes semanales). Usar con cuidado y solo server-side.

Los tipos de la tabla (`types/database.ts`) no siempre están completos para `insert`/`update` sobre el cliente tipado, por eso es común ver casteos `(supabase as any)` en las queries de escritura — es un patrón existente, no un error a "corregir" sin más contexto.

### Modelo de datos (`supabase/migrations/001_initial_schema.sql`)
Tablas: `users` (extiende `auth.users` de Supabase, se crea automáticamente vía trigger `handle_new_user` al registrarse), `user_preferences` (qué trackear + umbrales de alerta de glucosa), `measurements` (tipo `glucose|bp|med|weight`, un solo modelo genérico para todas las mediciones), `guests` (invitados con `token` único y estado `pending|active`), `alerts`, `medications`. RLS activado en todas las tablas: cada usuario solo ve/edita sus propias filas (`auth.uid() = user_id`); el acceso de invitados a los datos de otro usuario se resuelve vía las API routes con `createServiceRoleClient`, no vía RLS de invitado.

### Sistema de alertas
Al crear una medición de tipo `glucose` (`app/api/measurements/route.ts` POST), se llama sincrónicamente a `checkGlucoseThresholds` (`lib/alerts/checkThresholds.ts`), que compara contra los umbrales de `user_preferences`, inserta un registro en `alerts` si corresponde, y dispara en paralelo un email (`lib/alerts/sendEmail.ts`) y una push notification (`lib/push/send.ts`). Un fallo en el chequeo de alertas se loguea pero no debe romper la creación de la medición (ver el `try/catch` que lo envuelve).

### Invitados (guests)
Flujo: se invita por email (`api/guests/invite`) generando un `token`, el invitado activa su acceso (`api/guests/activate`) marcando `status: "active"`, y accede de solo lectura vía `app/(dashboard)/guest/[token]/page.tsx` y `api/guests/measurements`. Todo este flujo usa `createServiceRoleClient` porque el invitado no es un usuario autenticado de Supabase.

### Email
El envío de emails migró de Resend a Gmail SMTP (ver `MIGRACION_GMAIL.md`). El cliente activo es `lib/email/client.ts` (nodemailer + `GMAIL_USER`/`GMAIL_APP_PASSWORD`). `lib/resend/client.ts` y las env vars `RESEND_API_KEY`/`RESEND_DOMAIN` quedaron como código muerto, mantenidos por si se vuelve a Resend al crecer el volumen de usuarios (límite actual: 500 emails/día de Gmail).

### Reportes semanales
`vercel.json` define un cron (`0 8 * * 0`, domingos 8am) que pega a `api/cron/weekly-report`, protegido por `CRON_SECRET`. La generación del contenido está en `lib/reports/generateWeeklyReport.ts`; el mismo `ReportTemplate` (`components/pdf/ReportTemplate.tsx`) se reusa tanto para el email semanal como para la exportación manual a PDF (`components/dashboard/ExportPDFButton.tsx`).

### Convenciones de código
Prettier: comillas dobles, `;` obligatorio, `printWidth` 80, 2 espacios de indentación (ver `.prettierrc`). Componentes UI base en `components/ui/` (Button, Card, Input, Select, Toggle) siguiendo el patrón `class-variance-authority` + `tailwind-merge` (`lib/utils.ts`); reusarlos en vez de crear estilos ad-hoc para mantener consistencia de accesibilidad (tamaños grandes, contraste).
