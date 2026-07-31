# QA final footer responsive - TipsFitExpress

Fecha: 2026-07-22

## Diagnostico

El problema observado en DevTools era principalmente una posicion de scroll/captura incorrecta, no un recorte real del footer.

Antes de forzar el final absoluto, cada prueba quedaba en `scrollY = 0` y `atAbsoluteBottom = false`. Al cambiar de dispositivo en DevTools, Chrome puede conservar o recalcular una posicion de scroll que visualmente parece el final, pero no lo es. En las capturas reportadas todavia aparecia parte de la seccion anterior arriba del bloque FAQ/footer, lo que confirmaba que habia que medir el final real antes de cambiar CSS.

Despues de ejecutar doble scroll al final absoluto y esperar render/transicion:

- `.footer-legal` queda completo.
- `footer.scrollHeight === footer.clientHeight`.
- No hay franja blanca inferior.
- No hay scroll horizontal.
- `.floating-actions` queda oculto en mobile cuando el footer esta visible.

## Contenedor de scroll real

El scroll lo controla el documento (`html` / `documentElement`).

No se encontro un contenedor interno con `overflow-y: auto` o `overflow-y: scroll` que controle el desplazamiento:

- `html`: `overflow-y: visible`, `scrollTop` cambia hasta `maxScrollY`.
- `body`: `overflow-y: visible`, no controla scroll interno.
- `.landing-container`: `overflow: clip visible`, no controla scroll vertical.
- `main`: `overflow-y: visible`, no controla scroll interno.

## CSS auditado

No se encontro una propiedad activa que cortara el texto legal:

- `.footer`: `height: auto`, `max-height: none`, `overflow: visible`, `position: relative`.
- `.footer-legal`: `overflow: visible`, `max-height: none`, `white-space: normal`, `position: static`, `transform: none`.

Se mantuvo el blindaje ya aplicado:

```css
.footer {
  box-sizing: border-box;
  height: auto;
  min-height: 62px;
  max-height: none;
  overflow: visible;
  padding: 8px 58px calc(8px + env(safe-area-inset-bottom)) 56px;
}

.footer-legal {
  width: 100%;
  max-height: none;
  padding: 0;
  white-space: normal;
  overflow: visible;
  overflow-wrap: anywhere;
}
```

Regla mobile activa:

```css
@media (max-width: 767px) {
  .footer {
    padding: 22px 18px calc(28px + env(safe-area-inset-bottom));
  }
}
```

Padding inferior final en mobile: `28px + env(safe-area-inset-bottom)` dentro del footer verde.

## Script QA corregido

Archivo actualizado:

- `scripts/qa-footer.mjs`

Cambios:

- Espera `document.readyState`.
- Espera fuentes con timeout seguro.
- Espera imagenes completas con timeout seguro.
- Espera dos `requestAnimationFrame`.
- Hace doble scroll al final absoluto.
- Espera la transicion del `IntersectionObserver`.
- Bloquea la captura si `scrollY` no coincide con `maxScrollY`.
- Genera capturas obligatorias de 390, 412 y 430.

## Valores antes/despues

Antes del scroll forzado:

| Viewport | scrollY antes | maxScrollY | atAbsoluteBottom |
|---|---:|---:|---|
| 360 x 640 | 0 | 5720 | false |
| 375 x 667 | 0 | 5742 | false |
| 390 x 844 | 0 | 5568 | false |
| 412 x 915 | 0 | 5609 | false |
| 430 x 932 | 0 | 5650 | false |
| 768 x 1024 | 0 | 2940 | false |
| 1366 x 768 | 0 | 3154 | false |
| 1920 x 1080 | 0 | 3471 | false |

Despues del scroll real:

| Viewport | scrollY | maxScrollY | legal visible | footer scroll/client | overflow X | floating actions | regla activa |
|---|---:|---:|---|---:|---|---|---|
| 360 x 640 | 5720 | 5720 | true | 266 / 266 | false | hidden, opacity 0 | max-width: 767px |
| 375 x 667 | 5742 | 5742 | true | 266 / 266 | false | hidden, opacity 0 | max-width: 767px |
| 390 x 844 | 5568 | 5568 | true | 266 / 266 | false | hidden, opacity 0 | max-width: 767px |
| 412 x 915 | 5609 | 5609 | true | 266 / 266 | false | hidden, opacity 0 | max-width: 767px |
| 430 x 932 | 5650 | 5650 | true | 266 / 266 | false | hidden, opacity 0 | max-width: 767px |
| 768 x 1024 | 2940 | 2940 | true | 115 / 115 | false | desktop/tablet static | base/tablet |
| 1366 x 768 | 3154 | 3154 | true | 206 / 206 | false | desktop static | min-width: 1024px |
| 1920 x 1080 | 3471 | 3471 | true | 218 / 218 | false | desktop static | min-width: 1024px |

## Capturas finales

- `docs/qa-footer-mobile-390x844-390x844.png`
- `docs/qa-footer-mobile-412x915-412x915.png`
- `docs/qa-footer-mobile-430x932-430x932.png`

## Confirmaciones finales

- El problema era de posicion de scroll/captura prematura, no un recorte CSS activo.
- El footer sigue en flujo normal y es el ultimo bloque.
- No reaparecio la franja blanca.
- El texto legal completo se ve en 390, 412 y 430.
- Los botones flotantes siguen usando `position: fixed`.
- Los botones flotantes se ocultan con `.floating-actions--footer-visible`.
- No se modifico el texto legal, logo, iconos, CTA, FAQ, checks, colores ni desktop.
