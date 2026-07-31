# TipsFitExpress

Landing page estatica para vender el producto digital **Menu Mensual para bajar de peso** con tres bonos gratuitos:

1. Tabla de calorias y porciones.
2. Calculadora de calorias personalizada.
3. Postres saludables.

La version actual esta en espanol y no usa geolocalizacion, selector de idioma ni checkout inteligente.

## Estructura

```text
.
|-- assets/
|   `-- landing/              # Imagenes de produccion de la landing
|-- docs/                     # Auditoria, QA y arquitectura
|-- scripts/
|   `-- dev-server.mjs        # Servidor local sin dependencias
|-- src/
|   `-- css/
|       `-- styles.css        # Tokens, base, componentes, layout y responsive
|-- index.html                # Entrada principal
|-- start-local-server.ps1    # Arranque local para Windows
`-- README.md
```

## Ver localmente

Opcion directa, sin servidor:

```text
C:\Users\arlen\Documents\Codex\2026-05-30\TipsFitExpress\index.html
```

Opcion con servidor local:

```powershell
cd C:\Users\arlen\Documents\Codex\2026-05-30\TipsFitExpress
node scripts\dev-server.mjs
```

Luego abrir:

```text
http://localhost:5500
```

La terminal debe quedar abierta mientras se revisa la pagina.

## Como editar

- Textos y estructura: `index.html`.
- Estilos, responsive y componentes visuales: `src/css/styles.css`.
- Imagenes de la landing: `assets/landing/`.
- Documentacion de decisiones: `docs/`.

## Pendientes antes de publicar

- Reemplazar el checkout pendiente por el link real de pago.
- Reemplazar WhatsApp pendiente por el numero real.
- Reemplazar redes sociales pendientes por URLs reales.
- Definir precio, moneda y politica de devolucion visibles.
- Agregar URL canonical cuando exista dominio final.
- Agregar Meta Pixel y TikTok Pixel solo cuando esten configurados.
- Crear o enlazar politicas legales: privacidad, terminos y reembolsos.
- Optimizar imagenes grandes a WebP/AVIF manteniendo calidad visual.

## Archivos eliminados

Se eliminaron archivos no usados por la version actual:

- `src/js/app.js`
- `src/js/config.js`
- `src/js/i18n.js`
- imagenes antiguas en `assets/images/`
- capturas `capture-*.png`
- perfiles temporales `tmp-chrome-profile*/`

Git conserva el historial de esos archivos.

## Checklist rapido

- Abrir `index.html`.
- Revisar mobile en 390, 412 y 430 px.
- Revisar desktop en 1366, 1920 y 2560 px.
- Confirmar que el footer verde se ve completo.
- Confirmar que no hay scroll horizontal.
- Confirmar que el FAQ abre/cierra.
- Confirmar que todos los placeholders comerciales fueron reemplazados antes de vender.
