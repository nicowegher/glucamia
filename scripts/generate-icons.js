const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const iconOnlySvg = path.join(__dirname, "../public/glucamia-logo.svg");
const logoFullSvg = path.join(__dirname, "../public/glucamia-logo-full.svg");
const outputDir = path.join(__dirname, "../public");

// Color de fondo del logo (amarillo #FFCD3C = rgb(255, 205, 60))
const backgroundColor = { r: 255, g: 205, b: 60, alpha: 1 };

// Tamaños de iconos necesarios
// Para tamaños pequeños (< 128px) usamos solo el icono
// Para tamaños grandes (>= 128px) usamos el logo completo
const iconSizes = [
  { name: "icon-16x16.png", size: 16, useFullLogo: false },
  { name: "icon-32x32.png", size: 32, useFullLogo: false },
  { name: "icon-72x72.png", size: 72, useFullLogo: false },
  { name: "icon-96x96.png", size: 96, useFullLogo: false },
  { name: "icon-128x128.png", size: 128, useFullLogo: true },
  { name: "icon-144x144.png", size: 144, useFullLogo: true },
  { name: "icon-152x152.png", size: 152, useFullLogo: true },
  { name: "apple-touch-icon.png", size: 180, useFullLogo: true },
  { name: "icon-192x192.png", size: 192, useFullLogo: true },
  { name: "icon-384x384.png", size: 384, useFullLogo: true },
  { name: "icon-512x512.png", size: 512, useFullLogo: true },
  { name: "badge-72x72.png", size: 72, useFullLogo: false },
];

async function generateIcons() {
  if (!fs.existsSync(iconOnlySvg)) {
    console.error(`Error: No se encontró el archivo SVG del icono en ${iconOnlySvg}`);
    process.exit(1);
  }

  if (!fs.existsSync(logoFullSvg)) {
    console.error(`Error: No se encontró el archivo SVG del logo completo en ${logoFullSvg}`);
    process.exit(1);
  }

  console.log("Generando iconos desde los SVGs...\n");

  for (const icon of iconSizes) {
    try {
      const outputPath = path.join(outputDir, icon.name);
      const sourceSvg = icon.useFullLogo ? logoFullSvg : iconOnlySvg;
      
      await sharp(sourceSvg)
        .resize(icon.size, icon.size, {
          fit: "contain",
          background: backgroundColor,
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generado: ${icon.name} (${icon.size}x${icon.size}) - ${icon.useFullLogo ? 'Logo completo' : 'Solo icono'}`);
    } catch (error) {
      console.error(`✗ Error generando ${icon.name}:`, error.message);
    }
  }

  // Generar favicon.ico (usamos solo el icono, tamaño más grande para mejor visibilidad)
  try {
    const faviconPath = path.join(__dirname, "../app/favicon.ico");
    // Usamos 128x128 para que el icono se vea más grande y claro
    // 'contain' asegura que todo el icono sea visible sin recortes
    await sharp(iconOnlySvg)
      .resize(128, 128, {
        fit: "contain",
        background: backgroundColor,
      })
      .png()
      .toFile(faviconPath);
    
    console.log(`✓ Generado: favicon.ico (128x128, solo icono)`);
  } catch (error) {
    console.error(`✗ Error generando favicon.ico:`, error.message);
  }

  console.log("\n¡Todos los iconos han sido generados exitosamente!");
  console.log("\nNota: El favicon.ico es un PNG. Para un .ico real con múltiples tamaños,");
  console.log("puedes usar una herramienta online como https://realfavicongenerator.net/");
}

generateIcons().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});

