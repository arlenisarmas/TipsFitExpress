# Arquitectura y reutilizacion

## Arquitectura final

El proyecto se mantiene como landing estatica con HTML y CSS nativo. No se agregaron frameworks porque el alcance actual no justifica React, Vue, Tailwind, Bootstrap ni Vite.

```text
index.html
src/css/styles.css
assets/landing/
scripts/dev-server.mjs
docs/
```

## Capas CSS

`styles.css` conserva un solo archivo de produccion para evitar sobreingenieria. La organizacion conceptual es:

1. Tokens: `:root`.
2. Reset/base: `*`, `html`, `body`, `a`, `img`, headings.
3. Layout: contenedores, secciones y grids.
4. Componentes: botones, listas, tarjetas, FAQ, footer, acciones flotantes.
5. Responsive: breakpoints mobile, tablet, desktop y pantallas grandes.

## Tokens disponibles

Tokens semanticos agregados:

- `--color-brand-green-dark`
- `--color-brand-green`
- `--color-accent-orange`
- `--color-accent-orange-dark`
- `--color-text`
- `--color-muted`
- `--color-surface`
- `--color-surface-soft`
- `--color-border`
- `--space-1` a `--space-6`
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--shadow-sm`, `--shadow-md`
- `--container-max`
- `--z-floating`
- `--transition-fast`

Se conservaron aliases historicos como `--green`, `--orange` y `--section-soft` para no reescribir mecanicamente todo el CSS ni arriesgar regresiones visuales.

## Componentes reutilizables

### Botones

Base:

```html
<a class="button" href="#checkout">Quiero mi menu ahora</a>
```

Variantes actuales:

- `.button`
- `.final-button`
- `.footer-button`

Pendiente recomendado: consolidar variantes futuras como `.button--primary`, `.button--full` y `.button--footer`.

### Listas de beneficios

```html
<ul class="check-list">
  <li>Beneficio</li>
</ul>
```

### Tarjetas de bonos

Estructura actual:

```html
<article>
  <b>Bono 01</b>
  <div class="bonus-card__media"><img ...></div>
  <p class="bonus-hook">Hook</p>
  <h3>Titulo</h3>
  <p>Descripcion</p>
  <ul>...</ul>
  <p class="bonus-price"><s>$7.990</s> <strong>Hoy GRATIS</strong></p>
</article>
```

Pendiente recomendado: agregar clase explicita `.bonus-card` para desacoplar estilos de `.bonus-grid article`.

### Testimonios

Actualmente se estilizan por `.testimonial-grid article`. Para reutilizar, conviene agregar `.testimonial-card` si se crean mas landings.

### FAQ

Usa `details` y `summary`, que son navegables con teclado de forma nativa. Si el sitio necesitara mayor control de estados, puede migrarse a botones con `aria-expanded` y `aria-controls`.

## Como cambiar colores

Cambiar primero tokens en `:root`. Evitar reemplazar colores dentro de componentes hasta consolidar todo el CSS contra tokens semanticos.

## Como crear una tarjeta nueva

1. Copiar una estructura `article` existente.
2. Mantener imagen con `width`, `height`, `loading="lazy"` y `decoding="async"`.
3. Mantener textos cortos para mobile.
4. Verificar en 320, 390, 412, 768, 1366 y 1920 px.

## Partes exclusivas de TipsFitExpress

- Copy comercial.
- Imagenes de `assets/landing/`.
- Bonos y testimonios.
- Disclaimer de nutricion.
- CTA y nombres de producto.

## Partes reutilizables

- Tokens base.
- Botones.
- Listas con checks.
- Grids responsive.
- Tarjetas de bono/testimonio.
- FAQ.
- Footer social.
