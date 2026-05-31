# TipsFitExpress

Landing page para vender el bundle digital TipFit Express: menu mensual fit, lista de compras, tabla de calorias y bonos de recetas.

## Estructura

```text
.
├── assets/
│   └── images/          # Imagenes usadas por la landing
├── src/
│   ├── css/
│   │   └── styles.css   # Estilos globales y responsive
│   └── js/
│       ├── app.js       # Logica de idioma, pais y checkout
│       ├── config.js    # Paises, metodos y links de pago
│       └── i18n.js      # Textos ES/EN/PT
├── index.html           # Estructura principal de la landing
└── README.md
```

## Como editar sin pisarnos

- Cambios de texto: editar `src/js/i18n.js`.
- Cambios de links de pago: editar `paymentLinks` en `src/js/config.js`.
- Cambios de paises o disponibilidad de pagos: editar `countries` y `paymentAvailability` en `src/js/config.js`.
- Cambios visuales: editar `src/css/styles.css`.
- Cambios de secciones o contenido HTML: editar `index.html`.

## Vista local

Este proyecto no necesita build. Para verlo, abre `index.html` en el navegador o usa la extension Live Server de Cursor/VS Code.

## Pendientes antes de vender

- Reemplazar los links placeholder de pago en `src/js/config.js`.
- Pegar Meta Pixel y TikTok Pixel en el `<head>` de `index.html` cuando esten listos.
- Cambiar testimonios y metricas estimadas por datos reales.
