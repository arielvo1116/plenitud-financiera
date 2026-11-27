# Plenitud Financiera — Sitio web

Sitio estático (HTML + CSS + JS), sin dependencias. Solo sube el contenido de esta carpeta a la raíz de tu hosting.

## Estructura
```
index.html          Página principal (una sola página con secciones)
css/styles.css      Estilos
js/main.js          Menú, animaciones, calculadora y formulario → WhatsApp
img/                Logos, favicons e imágenes (WebP optimizado)
site.webmanifest    Íconos para "agregar a pantalla de inicio"
robots.txt          Indicaciones para buscadores
sitemap.xml         Mapa del sitio para Google
.htaccess           Compresión, caché y seguridad (Apache/cPanel)
```

## Antes de publicar — revisar
1. **WhatsApp:** WhatsApp 5828-5623: está en `js/main.js` (constante `WHATSAPP`) y en los enlaces `wa.me/50258285623` de `index.html`.
2. **Dominio:** se usó `https://www.plenitudfinanciera.com/` como ejemplo. Reemplázalo en `index.html` (canonical, og, JSON-LD), `robots.txt` y `sitemap.xml`.
3. **Imágenes:** `img/quienes-somos.webp` y `img/asesora.webp` salieron de capturas de pantalla; reemplázalas por los originales en alta (mismo nombre, formato WebP de ~1200 px de ancho, calidad 80).
   El hero ya no usa foto: fondo blanco con el logo a color.
4. **Calculadora:** es referencial. Ajusta los rangos de monto/plazo/tasa en `index.html` (atributos `min`, `max`, `value`) o elimina la sección `#calculadora` si no la quieren.

## Convertir imágenes a WebP
- Online: https://squoosh.app
- Terminal: `cwebp -q 80 foto.jpg -o foto.webp`
