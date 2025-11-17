# Configuración de Favicon e Iconos PWA

Esta aplicación está configurada para mostrar favicons en Chrome y iconos cuando se instala como PWA en iOS y Android.

## ✅ Iconos Generados

Los iconos ya han sido generados automáticamente desde los SVGs del logo. Si necesitas regenerarlos, ejecuta:

```bash
npm run generate-icons
```

Este script genera todos los iconos necesarios desde:
- `public/glucamia-logo.svg` - Solo el icono (usado para tamaños pequeños)
- `public/glucamia-logo-full.svg` - Logo completo con nombre (usado para tamaños grandes)

## Archivos de Iconos Necesarios

Todos los iconos deben estar en la carpeta `public/`. A continuación se listan los archivos necesarios:

### Favicons Estándar (Chrome/Desktop)
- `favicon.ico` - Favicon principal (16x16, 32x32, 48x48 en un solo archivo .ico)
- `icon-16x16.png` - Icono pequeño para pestañas
- `icon-32x32.png` - Icono mediano para pestañas

### Iconos PWA (Android/Chrome)
- `icon-72x72.png` - Icono pequeño para Android
- `icon-96x96.png` - Icono pequeño para Android
- `icon-128x128.png` - Icono mediano para Android
- `icon-144x144.png` - Icono mediano para Android
- `icon-152x152.png` - Icono mediano para Android
- `icon-192x192.png` - Icono estándar para Android (requerido)
- `icon-384x384.png` - Icono grande para Android
- `icon-512x512.png` - Icono grande para Android (requerido)

### Iconos iOS
- `apple-touch-icon.png` - Icono para iOS (180x180px) - Se muestra cuando se agrega a la pantalla de inicio

### Badge para Notificaciones
- `badge-72x72.png` - Badge pequeño para notificaciones push (ya referenciado en sw.js)

## Estado Actual

✅ **Todos los iconos han sido generados y están listos para usar.**

Los iconos se generan automáticamente desde los SVGs del logo usando el script `scripts/generate-icons.js`. El script:
- Usa solo el icono para tamaños pequeños (< 128px) para mejor legibilidad
- Usa el logo completo con nombre para tamaños grandes (≥ 128px)
- Aplica el fondo amarillo del logo (#FFCD3C) a todos los iconos

## Cómo Regenerar los Iconos

Si necesitas regenerar los iconos (por ejemplo, después de actualizar los SVGs), simplemente ejecuta:

```bash
npm run generate-icons
```

## Cómo Generar los Iconos (Métodos Alternativos)

### Opción 1: Script Automático (Recomendado)
Ya está configurado. Solo ejecuta `npm run generate-icons`.

### Opción 2: Herramientas Online
1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Sube tu imagen (mínimo 512x512px)
   - Genera todos los tamaños necesarios
   - Descarga el paquete y coloca los archivos en `public/`

2. **PWA Asset Generator** (https://github.com/elegantapp/pwa-asset-generator)
   - Instala: `npm install -g pwa-asset-generator`
   - Ejecuta: `pwa-asset-generator tu-imagen.png public/ --icon-only`

### Opción 2: Herramientas de Diseño
1. Crea un diseño cuadrado (recomendado: 1024x1024px o 512x512px)
2. Exporta en los siguientes tamaños:
   - 16x16, 32x32, 180x180, 192x192, 512x512
3. Para los tamaños intermedios, puedes redimensionar desde el de 512x512px

### Opción 3: Script de Generación
Puedes usar ImageMagick o similar para generar todos los tamaños desde una imagen base:

```bash
# Ejemplo con ImageMagick (si está instalado)
convert icon-base.png -resize 16x16 public/icon-16x16.png
convert icon-base.png -resize 32x32 public/icon-32x32.png
convert icon-base.png -resize 72x72 public/icon-72x72.png
convert icon-base.png -resize 96x96 public/icon-96x96.png
convert icon-base.png -resize 128x128 public/icon-128x128.png
convert icon-base.png -resize 144x144 public/icon-144x144.png
convert icon-base.png -resize 152x152 public/icon-152x152.png
convert icon-base.png -resize 180x180 public/apple-touch-icon.png
convert icon-base.png -resize 192x192 public/icon-192x192.png
convert icon-base.png -resize 384x384 public/icon-384x384.png
convert icon-base.png -resize 512x512 public/icon-512x512.png
convert icon-base.png -resize 72x72 public/badge-72x72.png
```

## Verificación

Después de agregar los iconos:

1. **Chrome Desktop**: Abre DevTools > Application > Manifest y verifica que todos los iconos se carguen correctamente
2. **iOS**: Abre la app en Safari iOS y usa "Agregar a pantalla de inicio" - deberías ver el icono
3. **Android**: Abre la app en Chrome Android y usa "Agregar a pantalla de inicio" - deberías ver el icono

## Notas

- El `favicon.ico` puede estar en `app/` o `public/` (Next.js lo detecta automáticamente)
- Todos los demás iconos deben estar en `public/`
- Los iconos deben ser PNG con fondo transparente o sólido según el diseño
- El color del tema está configurado como `#FFCD3C` en `site.webmanifest` y `layout.tsx`

