# QA responsive

Fecha: 2026-07-22

## Resultado automatizado disponible

| Prueba | Resultado |
|---|---|
| Servidor local | Verificado con Chrome contra `http://localhost:5500`. |
| Recursos locales referenciados | Rutas visibles en `index.html` apuntan a `assets/landing/` y `src/css/styles.css`. |
| Placeholders externos en produccion | Eliminados de `href`; quedan como `data-pending` y documentacion. |
| JS | Script inline de FAQ, enlaces pendientes e IntersectionObserver de footer. |
| Lighthouse | No ejecutado; no hay tooling instalado y no se agregaron dependencias. |
| Playwright | No ejecutado; se uso Chrome + DevTools/QA script local. |

## Matriz responsive

| Resolucion | Resultado | Scroll horizontal | Footer visible | Elementos superpuestos | CTA funcional | Observaciones | Estado final |
|---|---|---|---|---|---|---|---|
| 320 x 568 | No ejecutado en esta pasada | Pendiente | Pendiente | Pendiente | Interno a `#checkout`; checkout real pendiente | Falta prueba especifica. | Pendiente |
| 360 x 640 | Probado al final absoluto | No | Si, `footerEndsDocument=true` | No, acciones ocultas | Interno a `#checkout`; checkout real pendiente | `scrollY=5717`, `maxScrollY=5717`. | OK tecnico |
| 375 x 667 | Probado al final absoluto | No | Si, `footerEndsDocument=true` | No, acciones ocultas | Interno a `#checkout`; checkout real pendiente | `scrollY=5739`, `maxScrollY=5739`. | OK tecnico |
| 390 x 844 | Probado al final absoluto | No | Si, `footerEndsDocument=true` | No, acciones ocultas | Interno a `#checkout`; checkout real pendiente | `scrollY=5565`, `maxScrollY=5565`. | OK tecnico |
| 393 x 873 | No ejecutado en esta pasada | Pendiente | Pendiente | Pendiente | Interno a `#checkout`; checkout real pendiente | Falta prueba especifica. | Pendiente |
| 412 x 915 | Probado y capturado | No | Si, `footerEndsDocument=true` | No, acciones ocultas | Interno a `#checkout`; checkout real pendiente | Captura: `docs/qa-footer-412x915.png`. | OK visual |
| 430 x 932 | Probado y capturado | No | Si, `footerEndsDocument=true` | No, acciones ocultas | Interno a `#checkout`; checkout real pendiente | Captura: `docs/qa-footer-430x932.png`. | OK visual |
| 768 x 1024 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Tablet vertical. | Pendiente visual |
| 810 x 1080 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Tablet vertical. | Pendiente visual |
| 820 x 1180 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Tablet vertical. | Pendiente visual |
| 1024 x 1366 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Tablet grande. | Pendiente visual |
| 1024 x 768 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Laptop pequena. | Pendiente visual |
| 1280 x 720 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Desktop corto. | Pendiente visual |
| 1366 x 768 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Desktop comun. | Pendiente visual |
| 1440 x 900 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Desktop. | Pendiente visual |
| 1536 x 864 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Desktop. | Pendiente visual |
| 1920 x 1080 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Desktop grande. | Pendiente visual |
| 2560 x 1440 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | Desktop grande. | Pendiente visual |
| 3840 x 2160 | Pendiente captura manual | Pendiente | Sin bug especifico detectado | Pendiente | Interno a `#checkout`; checkout real pendiente | 4K. | Pendiente visual |

## Cambios relevantes para mobile

- Se elimino la reserva de espacio causada por `.floating-actions` en mobile.
- `.floating-actions` vuelve a estar fuera del flujo con `position: fixed`.
- IntersectionObserver agrega `.floating-actions--footer-visible` cuando el footer intersecta y oculta las acciones para que no cubran logo, redes, CTA ni aviso legal.
- El footer mantiene `margin-bottom: 0` y safe area dentro del padding.

## Checklist final de publicacion

- [ ] Footer visible completo en mobile.
- [ ] Ningun boton fijo cubre contenido.
- [ ] Sin scroll horizontal.
- [ ] Sin errores de consola.
- [ ] Sin recursos 404.
- [ ] Todos los CTA tienen destino real.
- [ ] WhatsApp funciona.
- [ ] Redes sociales funcionan.
- [ ] Precio y moneda son claros.
- [ ] Entrega digital explicada.
- [ ] FAQ accesible.
- [ ] Imagenes optimizadas.
- [ ] HTML valido.
- [ ] SEO basico configurado.
- [ ] Metadatos sociales configurados.
- [ ] Textos legales enlazados.
- [ ] Archivos muertos eliminados.
- [ ] README actualizado.
- [ ] Diseno probado entre 320 px y 3840 px.
- [ ] Diseno probado con zoom.
- [ ] La estetica original se conserva.
