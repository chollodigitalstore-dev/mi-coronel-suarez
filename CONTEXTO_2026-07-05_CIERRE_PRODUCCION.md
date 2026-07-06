# Contexto de cierre — Guía Suárez / Mi Coronel Suárez

Fecha de cierre: 2026-07-05  
Proyecto: `guiasuarez.ar`  
Workspace local: `C:\Users\Ari\Documents\Codex\2026-06-21\vamos-a-trabajar-en-un-nuevo\outputs\mi-coronel-suarez`  
Repositorio GitHub: `https://github.com/chollodigitalstore-dev/mi-coronel-suarez.git`  
Hosting: Cloudflare Workers + Assets  
Dominio productivo: `https://guiasuarez.ar`

## Estado general

El sitio está en producción y funcionando en `guiasuarez.ar`.

La guía permite:

- Buscar comercios, profesionales y servicios locales.
- Publicar actividades gratis para siempre.
- Ingresar con Google para publicar, modificar o eliminar avisos propios.
- Calificar servicios con usuario autenticado.
- Ver farmacia de turno y clima en el header.
- Compartir fichas individuales con URL limpia.
- Recibir notificaciones por correo cuando se publica un aviso o se genera un evento configurado vía webhook.

## Últimos cambios importantes

### Fichas compartibles

Se agregó soporte para links individuales tipo:

`https://guiasuarez.ar/hogar-y-oficios/albanil-juan-rollheiser`

Primero la ruta mostraba la home filtrada, pero se corrigió para que funcione como página de ficha real.

Estado final:

- La URL profunda carga correctamente los assets con rutas absolutas.
- Cloudflare Worker sirve el SPA index para rutas limpias.
- En modo ficha se ocultan hero, rubros, publicidad, “cómo funciona” y banner de crecimiento.
- La ficha aparece arriba a la izquierda.
- A la derecha aparece un bloque invitando a visitar Guía Suárez.
- En mobile se apila correctamente.

Commits relacionados:

- `850b790` — Add shareable listing profile routes
- `b810823` — Serve SPA index for listing routes
- `e32be9d` — Use clean asset request for SPA routes
- `07290a5` — Use absolute asset paths for listing routes
- `b928936` — Render share links as dedicated listing pages
- `19bb778` — Place shared listing card beside guide CTA

## Diseño / UX actual

Home:

- Header con marca “Mi Coronel Suárez”, fecha, clima y farmacia de turno.
- Botón principal: “Sumá tu actividad”.
- Hero más compacto para priorizar el buscador.
- Buscador visible de entrada.
- Rubros debajo del buscador.
- Publicidad local con banner de “Feria Americana el Garage”.
- Chatbot flotante “Preguntale a Isidoro”.
- Footer con contacto a `guiasuarezweb@gmail.com` y “Powered by Blu Software”.

Fichas:

- Layout de dos columnas en escritorio:
  - Izquierda: ficha del aviso.
  - Derecha: bloque “Ficha de Guía Suárez” con CTA.
- En mobile: primero el bloque de invitación y luego la ficha.

## Autenticación

Proveedor: Supabase Auth + Google OAuth.

Se resolvió el problema donde el login volvía a la home sin sesión.

Puntos importantes:

- Google OAuth está configurado desde Google Cloud.
- Supabase Auth usa Google como provider.
- Se ajustaron URLs/redirects hasta que la sesión quedó funcionando.
- El usuario debe autenticarse para:
  - Publicar una actividad.
  - Modificar o eliminar sus avisos.
  - Calificar servicios.

Pendiente recomendado:

- Mejorar el nombre visible en la pantalla de consentimiento de Google si vuelve a aparecer el dominio técnico de Supabase. Se analizó usar dominio custom de Supabase Auth, pero requería plan Pro. Por ahora se convive con la configuración disponible.

## Supabase

Proyecto Supabase:

`https://sblrytmfvqhjqclaozvr.supabase.co`

Tablas principales observadas:

- `profiles`
- `listings`
- `reviews`
- `review_responses`
- `review_reports`

Campos relevantes en `listings`:

- `id`
- `slug`
- `name`
- `category`
- `tags`
- `location`
- `place`
- `icon`
- `phone`
- `verified`
- `active`
- `owner_id`
- `created_at`
- `updated_at`
- `address`
- `description`

Se agregó `description` para una descripción corta del servicio, con límite previsto de 150 caracteres desde la UI.

Rubros actuales:

- Automotor
- Belleza y bienestar
- Comercios
- Educación
- Eventos
- Gastronomía
- Hogar y oficios
- Mascotas
- Profesionales
- Salud
- Servicios
- Tecnología
- Turismo y ocio

Los rubros se ordenaron alfabéticamente.

## Notificaciones por correo

Se configuró Resend / Cloudflare Worker / Supabase Webhook para recibir correos.

Variables configuradas en Cloudflare Worker:

- `NOTIFY_FROM`
- `NOTIFY_TO`
- `NOTIFY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`

No guardar valores secretos en este archivo.

La prueba de correo llegó correctamente.

Archivo relacionado:

- `NOTIFICACIONES_EMAIL.md`

## Farmacia de turno y clima

Farmacia:

- Se muestra arriba, al lado del clima.
- Muestra nombre y dirección.
- Se buscó evitar presentarlo como banner grande.
- Se conversó que el dato puede venir de fuente automática + fallback manual.
- Por ahora quedó visible como chip del header.

Clima:

- El botón no debe decir “Clima hoy en Coronel Suárez” porque se vuelve demasiado ancho.
- Esa frase puede quedar como tooltip/title.
- En el chip se mantiene un texto corto tipo “Hoy X° · Mañana Y°/Z°”.

## Publicidad / monetización

Modelo inicial:

- Publicidad local con banners.
- Primer anunciante de prueba: “Feria Americana el Garage”.
- El banner lleva a una landing propia.
- WhatsApp completo para link: `542926509949`.
- Número visible en banner: `2926-509949`.

Landing:

- Página propia para la feria americana.
- Incluye botón flotante redondo de WhatsApp.

## Marketing orgánico

Se conversó una estrategia para promocionar la guía, no cada aviso individual.

Idea central:

- Promocionar Guía Suárez como herramienta comunitaria:
  - “Buscá comercios y servicios de Coronel Suárez”.
  - “Publicá gratis para siempre”.
  - “Compartí fichas cuando alguien pide recomendaciones”.

Archivo relacionado:

- `MARKETING_ORGANICO_GUIA_SUAREZ.md`
- `AGENTE_CONTENIDO.md`

Pendiente posible:

- Automatizar piezas orgánicas para redes, pero con foco en posicionar la guía y no “vender” avisos individuales.

## Últimos commits en `main`

Últimos commits al cierre:

- `19bb778` — Place shared listing card beside guide CTA
- `b928936` — Render share links as dedicated listing pages
- `07290a5` — Use absolute asset paths for listing routes
- `e32be9d` — Use clean asset request for SPA routes
- `b810823` — Serve SPA index for listing routes
- `850b790` — Add shareable listing profile routes
- `79b45c7` — Remove redundant publish banner
- `5012eda` — Sort categories alphabetically
- `3ba6cb2` — Add services category
- `74b1fb2` — Return notification webhook errors as JSON
- `0f28a9c` — Add Supabase email notification webhook
- `e168782` — Show pharmacy address in header chip

## Estado Git al cierre

Al momento de crear este contexto, el repo estaba limpio después del último push.

Último commit publicado:

`19bb778 Place shared listing card beside guide CTA`

## Pendientes sugeridos para próxima sesión

1. Revisar visualmente la ficha compartible en producción:
   - Desktop.
   - Mobile.
   - Link desde WhatsApp/Facebook.

2. Mejorar SEO de ficha individual:
   - Título dinámico.
   - Meta description dinámica.
   - Open Graph dinámico si se decide pasar a render server-side/worker HTML transform.

3. Revisar si cada ficha debe mostrar:
   - Botón copiar link.
   - Mensaje tipo “Compartilo cuando alguien pida este servicio”.
   - Más datos de reputación cuando haya reviews.

4. Mejorar el alta de avisos:
   - Validaciones de teléfono.
   - Dirección opcional pero recomendada.
   - Descripción de 150 caracteres.
   - Preview antes de publicar.

5. Revisar estrategia de farmacia de turno:
   - Fuente automática.
   - Fallback manual.
   - Fecha de actualización visible o interna.

6. Continuar con marketing orgánico:
   - Calendario de contenidos.
   - Copys para Facebook/Instagram.
   - Posts tipo “¿Buscás electricista en Suárez?” apuntando a la guía.

## Nota para retomar

Si se retoma el proyecto, abrir este path:

`C:\Users\Ari\Documents\Codex\2026-06-21\vamos-a-trabajar-en-un-nuevo\outputs\mi-coronel-suarez`

Comandos útiles:

```powershell
git status
git log --oneline -10
node --check public\app.js
```

Para publicar, el flujo real usado fue:

```powershell
git add .
git commit -m "mensaje"
git push origin main
```

Cloudflare despliega desde GitHub. `wrangler deploy` desde esta terminal no quedó disponible porque falta `CLOUDFLARE_API_TOKEN`.
