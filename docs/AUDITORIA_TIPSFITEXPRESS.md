# Auditoria TipsFitExpress

Fecha: 2026-07-22

## Diagnostico general

La landing actual tiene una identidad visual coherente y una estructura comercial completa. El problema principal era de preparacion para produccion: archivos heredados, placeholders navegables, metadatos incompletos, assets temporales en el repositorio y riesgo de que botones flotantes cubrieran el footer en mobile.

## Inventario resumido

| Area | Estado |
|---|---|
| HTML | Landing estatica en `index.html`, espanol, una pagina. |
| CSS | `src/css/styles.css`, 2613 lineas antes de correcciones, muchos breakpoints acumulados. |
| JavaScript | Solo script inline de FAQ. JS anterior eliminado tras verificar referencias. |
| Assets usados | `assets/landing/01_hero_composicion_premium.png`, `06_tablet_ebook.png`, `06_tablet_ebook_mobile_hires.png`, bonos hires, testimonios, CTA final, logo footer. |
| Assets pesados | Hero 2705 KB, bonos 1757-2240 KB, CTA final 2108 KB. |
| Temporales | `capture-*.png` y `tmp-chrome-profile*/` eliminados. |

## Hallazgos

| Severidad | Archivo | Linea o seccion | Problema | Evidencia | Impacto | Solucion recomendada | Estado |
|---|---|---|---|---|---|---|---|
| CRITICO | `index.html` | Footer/CTA | Checkout apuntaba a URL falsa. | `https://tu-link-mercadopago.com` | Usuario podia salir a destino inexistente. | Reemplazar por link real; mientras tanto dejar marcado como pendiente. | Corregido parcialmente: no navega a URL falsa; pendiente link real. |
| ALTO | `index.html` | Footer/redes/WhatsApp | Redes y WhatsApp tenian placeholders como URL. | `URL_*`, `NUMERO_WHATSAPP_PENDIENTE` | Links rotos y mala confianza. | Reemplazar con URLs reales. | Corregido parcialmente: placeholders ya no son URL externa; pendiente datos reales. |
| ALTO | `src/css/styles.css` | Mobile/footer | Botones flotantes `fixed` podian cubrir footer. | `.floating-action` con `position: fixed` y z-index alto. | Footer verde podia quedar tapado al final del scroll. | En mobile reservar flujo o convertir a sticky. | Corregido: `.floating-actions` mobile usa `position: sticky`. |
| ALTO | Repo | Raiz | Capturas y perfiles Chrome no ignorados. | `capture-*.png`, `tmp-chrome-profile*/`. | Ruido, peso y riesgo de commits accidentales. | Ignorar y eliminar temporales. | Corregido. |
| MEDIO | `index.html` | Head | Faltaban metadatos sociales y favicon. | Sin OG/Twitter/favicon. | Menor calidad SEO/social preview. | Agregar metadatos base sin inventar dominio final. | Corregido parcialmente; canonical queda pendiente por dominio final. |
| MEDIO | `index.html` | Imagenes | Faltaban `width` y `height`. | `img` sin dimensiones. | Riesgo de CLS. | Agregar dimensiones reales. | Corregido. |
| MEDIO | `src/js/*` | JS anterior | Archivos heredados no cargados. | No hay referencias en `index.html`; solo README viejo. | Confusion de mantenimiento. | Eliminar si Git conserva historial. | Corregido. |
| MEDIO | `README.md` | Documentacion | Documentacion apuntaba a checkout/idiomas viejos. | Mencionaba `src/js/i18n.js` y config. | Instrucciones incorrectas. | Reescribir README. | Corregido. |
| MEDIO | `assets/landing` | Performance | Varias imagenes PNG superan 1.5 MB. | Hero 2705 KB; CTA final 2108 KB. | LCP y carga mobile pueden sufrir. | Generar WebP/AVIF y srcset reales. | Pendiente. |
| MEDIO | `index.html` | Comercial/legal | Precio final, garantia y politica de devolucion no estan claros. | No hay bloque de precio definitivo. | Baja confianza y riesgo comercial. | Definir precio/moneda/garantia reales. | Pendiente comercial. |
| BAJO | `src/css/styles.css` | Arquitectura | Tokens iniciales eran pocos y con nombres mixtos. | Variables `--green`, `--orange`, etc. | Menor reutilizacion. | Agregar aliases semanticos y documentar. | Corregido parcialmente. |
| BAJO | `index.html` | SEO | No hay canonical. | Falta dominio final. | SEO incompleto. | Agregar cuando exista URL final. | Pendiente. |

## Riesgos que continuan

- No hay checkout real.
- No hay WhatsApp real.
- No hay redes reales.
- No hay politicas legales enlazadas.
- No hay dominio final para canonical.
- No se ejecutaron Lighthouse ni Playwright porque no hay tooling instalado y no se instalaron dependencias nuevas.
