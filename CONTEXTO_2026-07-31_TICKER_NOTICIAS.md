# Contexto Guía Suárez — Ticker de noticias locales

Fecha de guardado: 2026-07-31 00:18 ART

## Proyecto

- Sitio: https://guiasuarez.ar
- Workspace: `C:\Users\Ari\Documents\Codex\2026-06-21\vamos-a-trabajar-en-un-nuevo\outputs\mi-coronel-suarez`
- Repo: `chollodigitalstore-dev/mi-coronel-suarez`
- Deploy: Cloudflare Worker / Workers & Pages `mi-coronel-suarez`, conectado a GitHub `main`.

## Objetivo trabajado

Se incorporó en la versión desktop de Guía Suárez un renglón/ticker de noticias que se desplaza de derecha a izquierda. La idea es darle vida local al sitio sin que parezca asociado a un único medio.

## Decisiones de producto

- El ticker se muestra solo en PC / desktop.
- En mobile se oculta para no ensuciar la experiencia.
- El ticker no muestra logos de medios ni una fuente dominante.
- Cada titular enlaza a la nota original.
- Al pasar el mouse sobre el ticker, la animación se pausa.
- Si las fuentes fallan, el ticker no se muestra y la página no se rompe.
- Cache del endpoint: 30 minutos.

## Fuentes configuradas

Fuentes principales, mezcladas de forma balanceada:

1. La Nueva Radio Suárez
   - URL base: `https://www.lanuevaradiosuarez.com.ar/`
   - Método: parseo HTML de portada, solo titulares y links a notas.

2. Suárez al Día
   - URL base: `https://www.suarezaldia.com.ar/`
   - Método: parseo HTML de portada, solo titulares y links a notas.

3. La Brújula 24
   - Feed específico: `https://www.labrujula24.com/notas/tag/coronel-suarez-2/feed/`
   - Método: RSS por etiqueta Coronel Suárez.

Fuentes de respaldo:

4. Google Noticias local
   - `https://news.google.com/rss/search?q=Coronel%20Su%C3%A1rez&hl=es-419&gl=AR&ceid=AR:es-419`

5. Municipalidad de Coronel Suárez
   - `https://www.coronelsuarez.gob.ar/feed/`

## Implementación técnica

Archivos modificados:

- `worker.js`
  - Agrega fuentes de noticias.
  - Agrega parser RSS.
  - Agrega parser HTML para portadas locales.
  - Agrega mezcla balanceada de titulares entre fuentes.
  - Agrega endpoint:
    - `GET /api/news-ticker`

- `public/index.html`
  - Agrega bloque:
    - `#newsTicker`
    - `#newsTickerTrack`

- `public/styles.css`
  - Estilos del ticker.
  - Animación horizontal.
  - Pausa en hover.
  - Oculto bajo `900px`.

- `public/app.js`
  - Agrega `loadNewsTicker()`.
  - Consume:
    - `/api/news-ticker?v=multi-source-1`

## Commits relevantes

- `608ce8d Add desktop local news ticker`
  - Primera versión con ticker y fuente municipal.

- `e6ad24d Use local media for news ticker`
  - Cambia prioridad hacia medios locales.

- `960545f Prefer local news sources in ticker`
  - Ajusta fuente local y cache busting.

- `7702a7c Mix multiple news sources in ticker`
  - Versión actual: mezcla varias fuentes locales para evitar dependencia percibida de un solo medio.

## Verificación realizada

Se validó:

- `node --check public\app.js`
- `node --check worker.js`
- `git diff --check`

Se probó producción:

```js
fetch("https://guiasuarez.ar/api/news-ticker?v=multi-source-1")
```

Respuesta confirmada:

- `source`: `Medios locales`
- `sources`:
  - `La Nueva Radio Suárez`
  - `Suárez al Día`
  - `La Brújula 24`

Ejemplo de titulares confirmados en producción:

- La Nueva Radio Suárez: “Preocupación por daños en el frente de la Escuela Especial 501 y un llamado a valorar lo público”
- Suárez al Día: “Cuidar a los vecinos es una decisión: más operativos, más tecnología y más presencia”
- La Brújula 24: “Coronel Suárez: fue a colocar cámaras de seguridad en un predio y cayó muerto”

## Estado Git al guardar

Último commit:

```txt
7702a7c Mix multiple news sources in ticker
```

Archivos sin versionar que ya existían y no se tocaron:

- `marketing/calendario-posts-facebook.md`
- `marketing/imagenes-facebook/`
- `marketing/posts-listos-facebook-whatsapp.md`
- `supabase/delete-productor-seguros-reviews.sql`
- `supabase/review-audit.sql`

## Pendientes posibles

- Evaluar visualmente en PC si la velocidad del ticker es cómoda.
- Posible cambio de etiqueta de “Noticias locales” a “Noticias de Suárez”.
- Posible filtro por secciones locales si algún medio devuelve demasiadas notas regionales/nacionales.
- Posible agregado de más fuentes si aparecen medios locales con RSS o páginas parseables estables.

