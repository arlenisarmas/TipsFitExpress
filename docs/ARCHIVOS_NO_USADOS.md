# Archivos no usados

## Eliminados

Estos archivos se eliminaron despues de buscar referencias reales en `index.html`, `src`, `scripts`, `assets` y `README.md`.

| Archivo o patron | Motivo | Evidencia | Estado |
|---|---|---|---|
| `src/js/app.js` | JS de idioma, pais y checkout de version anterior. | `index.html` actual no lo carga. | Eliminado. |
| `src/js/config.js` | Configuracion de paises/pagos de version anterior. | Solo estaba mencionado en README viejo. | Eliminado. |
| `src/js/i18n.js` | Traducciones ES/EN/PT de version anterior. | Landing actual es fija en espanol. | Eliminado. |
| `assets/images/tipfit-bundle.png` | Asset antiguo no usado por landing actual. | Sin referencias en HTML/CSS. | Eliminado. |
| `assets/images/tipfit-hero-woman-mint.png` | Asset antiguo no usado por landing actual. | Sin referencias en HTML/CSS. | Eliminado. |
| `assets/images/tipsfit-logo.png` | Asset antiguo no usado por landing actual. | Sin referencias en HTML/CSS. | Eliminado. |
| `capture-*.png` | Capturas locales de QA. | No son assets de produccion. | Eliminado e ignorado. |
| `tmp-chrome-profile*/` | Perfiles temporales de Chrome. | No son assets de produccion. | Eliminado e ignorado. |

## Assets no usados que se conservaron

| Archivo | Motivo |
|---|---|
| `assets/landing/00_referencia_landing_completa.png` | Referencia visual aprobada. |
| `assets/landing/01_hero_composicion_completa.png` | Variante visual de respaldo. |
| `assets/landing/06_tablet_ebook_mobile_clean.png` | Variante mobile de respaldo. |
| `assets/landing/07_bono_tabla_calorias.png` | Variante liviana de respaldo. |
| `assets/landing/08_bono_calculadora.png` | Variante liviana de respaldo. |
| `assets/landing/09_bono_postres.png` | Variante liviana de respaldo. |
| `assets/landing/13_plato_cta_final.png` | Variante liviana de respaldo. |

Recomendacion: cuando se generen WebP/AVIF finales y se apruebe calidad visual, borrar variantes PNG redundantes.
