# Registro de cambios - 2026-07-31

Resumen de lo trabajado hoy en TipsFitExpress para dejar constancia de los cambios visuales, funcionales, de checkout, seguridad y publicacion.

## Estado general

- La landing fue actualizada a la version visual nueva y aprobada.
- La version nueva fue subida a GitHub en `develop`.
- Luego se hizo merge de `develop` hacia `main`.
- Se subio `main` a GitHub para activar el deploy automatico de Vercel.
- Dominio de produccion esperado: `https://www.tipsfitexpress.store/`.

## Checkout Hotmart

Se conectaron los botones naranjas de compra al checkout directo de Hotmart.

URL oficial:

```text
https://pay.hotmart.com/D106960027E?off=g5adq4pe&sck=tipsfit_landing
```

Implementacion:

- La URL quedo centralizada en la constante `HOTMART_CHECKOUT_URL`.
- Los CTA de compra usan el atributo comun `data-hotmart-checkout`.
- La navegacion se realiza en la misma pestana.
- No se usa `target="_blank"`.
- Se elimino el texto provisional `Checkout pendiente de conectar`.
- No se encontro un listener anterior que bloquee los CTA de compra.

CTA revisados:

- `Quiero empezar por US$ 9,99`
- `Si, quiero acceder`
- `Si, quiero acceder ahora`
- `Quiero mi menu ahora`
- Boton flotante de compra, cuando aparece.

## Ajustes visuales aprobados

Se hicieron ajustes finos en desktop sin cambiar la estructura visual general:

- Correccion de textos montados en las tarjetas de bonos.
- El texto destacado superior de los bonos en desktop quedo naranja igual que en mobile.
- El ticker naranja superior quedo de borde a borde y con repeticion continua.
- Se redujeron espacios grandes del ticker en desktop para que corra mas compacto.
- Se elimino el texto: `Resultado orientativo. No reemplaza una evaluacion nutricional profesional.`
- Se agrego espacio antes de los checks en las tarjetas de bonos para que respiren mejor.
- Las preguntas frecuentes quedaron mas angostas y centradas en desktop.
- El footer se ajusto para verse mas cercano a la referencia compartida.

## Seguridad y configuracion Vercel

Se agrego `vercel.json` con configuraciones base para produccion:

- `cleanUrls`.
- `trailingSlash: false`.
- Headers de seguridad:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
  - `Content-Security-Policy`
- Cache immutable para archivos dentro de `/assets`.

Tambien se agrego informacion canonica en `index.html` para el dominio:

```text
https://www.tipsfitexpress.store/
```

## Publicacion

Repositorio:

```text
https://github.com/arlenisarmas/TipsFitExpress.git
```

Ramas:

- `develop`: rama donde quedo primero la version nueva.
- `main`: rama usada para produccion y actualizada con la version nueva.

Commits importantes:

- `cf3745b` - `Launch updated TipsFitExpress landing`
- `54fcd5e` - `Merge branch 'develop'`

Flujo recomendado:

1. Trabajar cambios nuevos en `develop`.
2. Revisar localmente en desktop y mobile.
3. Hacer merge a `main` cuando este aprobado.
4. Hacer push a GitHub.
5. Vercel publica automaticamente desde la rama de produccion configurada.

Nota:

Si se quiere que cada cambio en `develop` se publique automaticamente sin merge manual, configurar en Vercel:

```text
Settings > Git > Production Branch > develop
```

La recomendacion actual es mantener `main` como produccion para evitar publicar cambios incompletos.

## Archivos principales modificados

- `index.html`
- `src/css/styles.css`
- `vercel.json`
- `README.md`
- `assets/landing/*`
- `assets/testimonials/*`
- `scripts/dev-server.mjs`
- `scripts/qa-*.mjs`
- `docs/*.md`

## Verificaciones realizadas

- Servidor local funcionando en `http://localhost:5500`.
- Revision visual en desktop y mobile durante los ajustes.
- Pruebas de responsive y overlap documentadas en `docs`.
- `vercel.json` validado como JSON correcto.
- Push final realizado a `origin/main`.

