# Glucamia - Seguimiento de Glucemia y Salud

Aplicación web completa para seguimiento de glucemia y salud básica, diseñada especialmente para adultos mayores (60+ años) con una interfaz extremadamente simple y accesible.

## Características

- ✅ Autenticación con Google OAuth (sin registro manual)
- ✅ Registro de mediciones de glucemia con validación (20-600 mg/dL)
- ✅ Seguimientos opcionales: presión arterial, medicamentos, peso
- ✅ Historial cronológico con filtros (Hoy, Semana, Mes)
- ✅ Gráficos de glucemia en el tiempo
- ✅ Sistema de alertas automáticas (glucosa alta >180, baja <70)
- ✅ Sistema de invitados (familiares pueden ver registros)
- ✅ Reportes semanales automáticos por email
- ✅ Exportación a PDF para llevar al médico
- ✅ Notificaciones push del navegador
- ✅ Interfaz accesible: botones grandes (60px+), textos grandes (20px+), alto contraste

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (Auth, Database)
- **Email**: Resend
- **PDF**: @react-pdf/renderer
- **Gráficos**: Recharts
- **Hosting**: Vercel

## Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase
- Cuenta de Resend (para emails)
- Cuenta de Google Cloud (para OAuth)

## Instalación

1. **Clonar el repositorio y instalar dependencias:**

```bash
npm install
```

### Inicio Rápido (Solo para ver la UI)

Si quieres ver la aplicación localmente **antes** de configurar Supabase, Google OAuth, etc., puedes iniciarla con valores placeholder:

1. **Crear archivo `.env.local`** (ya está creado con valores placeholder)

2. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

3. **Abrir en el navegador:** `http://localhost:3000`

**Nota:** Con valores placeholder podrás ver:
- ✅ La página de login (diseño y UI)
- ✅ La estructura de la aplicación
- ❌ No funcionará el login real (necesitas Google OAuth configurado)
- ❌ No se guardarán datos (necesitas Supabase configurado)

Para funcionalidad completa, continúa con los pasos de configuración a continuación.

2. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

# Resend
RESEND_API_KEY=tu_resend_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron (para reportes semanales)
CRON_SECRET=tu_secreto_aleatorio

# Push Notifications (opcional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_vapid_public_key
VAPID_PRIVATE_KEY=tu_vapid_private_key
```

3. **Configurar Supabase:**

   a. Crea un proyecto en [Supabase](https://supabase.com)

   b. Ejecuta la migración SQL en el SQL Editor de Supabase:
   - Abre `supabase/migrations/001_initial_schema.sql`
   - Copia y pega el contenido en el SQL Editor
   - Ejecuta la migración

   c. Configura Google OAuth en Supabase:
   - Ve a Authentication > Providers
   - Activa Google
   - Necesitarás Client ID y Client Secret de Google Cloud (ver siguiente sección)

4. **Configurar Google OAuth:**

   a. Ve a [Google Cloud Console](https://console.cloud.google.com/)

   b. Crea un nuevo proyecto o selecciona uno existente

   c. Ve a "APIs y servicios" > "Credenciales"

   d. Crea credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - URI de redirección autorizada: `https://tu-proyecto.supabase.co/auth/v1/callback`
   - También agrega: `http://localhost:3000/auth/callback` para desarrollo

   e. Copia el Client ID y Client Secret

   f. Configúralos en Supabase (Authentication > Providers > Google)

5. **Configurar Resend:**

   a. Crea una cuenta en [Resend](https://resend.com)

   b. Crea un dominio verificado (o usa el dominio de prueba)

   c. Copia tu API Key y agrégalo a `.env.local`

   d. Actualiza el dominio en `lib/alerts/sendEmail.ts` y `app/api/guests/invite/route.ts`:
   - Cambia `noreply@glucamia.app` por tu dominio verificado

6. **Configurar Push Notifications (opcional):**

   a. Genera claves VAPID:
   ```bash
   npx web-push generate-vapid-keys
   ```

   b. Agrega las claves a `.env.local`

7. **Ejecutar en desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Deployment en Vercel

1. **Conecta tu repositorio a Vercel**

2. **Configura las variables de entorno** en el dashboard de Vercel:
   - Todas las variables de `.env.local`

3. **Configura el dominio** en Vercel y actualiza:
   - `NEXT_PUBLIC_APP_URL` con tu dominio de Vercel
   - URI de redirección en Google Cloud Console

4. **El cron job se configurará automáticamente** desde `vercel.json`

## Estructura del Proyecto

```
glucamia/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas protegidas
│   ├── api/               # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                # Componentes reutilizables
│   ├── forms/             # Formularios
│   ├── dashboard/         # Componentes del dashboard
│   └── settings/          # Componentes de configuración
├── lib/
│   ├── supabase/          # Cliente Supabase
│   ├── resend/            # Cliente Resend
│   ├── alerts/            # Sistema de alertas
│   ├── push/              # Notificaciones push
│   └── utils/             # Utilidades
├── types/                 # TypeScript types
├── supabase/
│   └── migrations/        # SQL migrations
└── public/
    └── sw.js             # Service Worker
```

## Guía de Error Lens

Error Lens es una extensión de VS Code/Cursor que muestra errores inline en el editor. Para usarla:

1. **Instalar Error Lens:**
   - Abre Cursor/VS Code
   - Ve a Extensiones (Cmd+Shift+X / Ctrl+Shift+X)
   - Busca "Error Lens"
   - Instala la extensión

2. **Cómo funciona:**
   - Los errores de TypeScript aparecerán como tooltips debajo de las líneas
   - Los warnings aparecerán en amarillo
   - Los errores aparecerán en rojo
   - Pasa el mouse sobre el error para ver detalles

3. **QA durante desarrollo:**
   - Al escribir código, Error Lens detectará automáticamente:
     - Imports rotos
     - Tipos incorrectos
     - Variables no utilizadas
     - Errores de sintaxis
   - Revisa los tooltips mientras desarrollas
   - Corrige los errores antes de hacer commit

4. **Ejemplo de uso:**
   - Si escribes `const x: string = 123`, Error Lens mostrará un error rojo indicando que `123` no es de tipo `string`
   - Si importas un módulo que no existe, Error Lens lo resaltará inmediatamente

## Uso de la Aplicación

### Para el Usuario Principal

1. **Login:** Inicia sesión con Google
2. **Onboarding:** Selecciona qué seguimientos activar
3. **Registrar medición:** Toca el botón "+ Registrar Glucemia"
4. **Ver historial:** Navega por tus registros y gráficos
5. **Exportar PDF:** Descarga un reporte para tu médico
6. **Configuración:** Invita familiares y ajusta preferencias

### Para Invitados

1. Recibe un email de invitación
2. Haz clic en el enlace de activación
3. Ve el dashboard de solo lectura con todos los registros
4. Recibe reportes semanales automáticos

## Troubleshooting

### Error: "The query requires an index"
- Es normal al crear el primer usuario
- Haz clic en el enlace del error o ejecuta: `firebase deploy --only firestore:indexes`
- Los índices están en `firestore.indexes.json` y tardan 1-2 minutos

### Error de autenticación con Google
- Verifica que las URIs de redirección estén correctas
- Asegúrate de que el Client ID y Secret sean correctos
- Revisa la configuración en Supabase

### Emails no se envían
- Verifica que el dominio esté verificado en Resend
- Revisa los logs de Resend en su dashboard
- Asegúrate de que `RESEND_API_KEY` esté configurado

### Push notifications no funcionan
- Verifica que las claves VAPID estén configuradas
- Asegúrate de que el Service Worker esté registrado
- Revisa la consola del navegador para errores

## Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Ejecutar ESLint
```

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y de uso personal.

## Soporte

Para problemas o preguntas, revisa los logs en `dev.log` o contacta al desarrollador.
