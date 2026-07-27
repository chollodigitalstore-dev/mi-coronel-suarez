# Contexto Guía Suárez — cierre 2026-07-26

Proyecto: `guiasuarez.ar` / “Guía Suárez”  
Workspace local: `C:\Users\Ari\Documents\Codex\2026-06-21\vamos-a-trabajar-en-un-nuevo\outputs\mi-coronel-suarez`  
Repositorio: `chollodigitalstore-dev/mi-coronel-suarez`  
Deploy: Cloudflare Worker `mi-coronel-suarez` conectado a GitHub/main  
Último commit confirmado: `ae8d963`

## Estado general

La guía está en producción y funcionando en:

- `https://guiasuarez.ar`
- Panel admin privado: `https://guiasuarez.ar/admin`

La app principal usa:

- Supabase para auth, avisos, reseñas, perfiles y estadísticas.
- Cloudflare Worker para rutas SEO, APIs, notificaciones, contador de visitas, farmacia/clima/profesionales y panel admin.
- Resend/Cloudflare para notificaciones por email.

## PWA / instalación como app

Se agregó soporte PWA:

- `public/manifest.webmanifest`
- `public/sw.js`
- íconos:
  - `public/assets/icons/icon-192.png`
  - `public/assets/icons/icon-512.png`
  - `public/assets/icons/icon-maskable-512.png`

Comportamiento:

- Android/Chrome: botón “Instalar app” con estilo tipo Play Store. Dispara instalación nativa si está disponible.
- iPhone: abre modal visual con instrucciones:
  1. Abrir en Safari.
  2. Tocar Compartir.
  3. Elegir “Agregar a pantalla de inicio”.
- Windows: el botón de instalación se oculta siempre.

Commits relevantes:

- `9809e4d` — Add PWA install support
- `33d387c` — Add visible app install button
- `9227226` — Style install button like app store
- `0303e38` — Add iPhone install guide
- `dfc41f5` — Hide install prompt on Windows

## Reputación y calificaciones

Se implementaron reglas comunitarias:

- Un usuario no puede calificar su propia actividad.
- Un usuario no puede calificar la misma actividad más de una vez.
- La app ya no usa `upsert` para reseñas; usa `insert`.
- Si intenta duplicar, muestra: “Ya calificaste esta actividad. Cada usuario puede calificar una sola vez.”
- Si intenta autocalificarse, muestra: “No podés calificar tu propia actividad. Así cuidamos la confianza de la guía.”

Isidoro ahora explica estas reglas en:

- “Cómo calificar un servicio”
- “Cómo funciona la reputación”

SQL ejecutado en Supabase:

- `supabase/review-community-rules.sql`

Ese SQL:

- asegura índice único `(listing_id, user_id)`;
- evita autocalificación desde RLS;
- elimina policies públicas de update/delete de reviews para usuarios finales.

Commit relevante:

- `340353e` — Prevent self and duplicate reviews

## Auditoría de reseñas

Se creó SQL auxiliar local para auditar reseñas existentes:

- `supabase/review-audit.sql`

Consultas incluidas:

1. Autocalificaciones confirmadas.
2. Resumen de autocalificaciones por actividad.
3. Usuarios que calificaron muchas actividades.
4. Ráfagas de calificaciones.
5. Comentarios repetidos.
6. Listado completo exportable.

También se creó SQL auxiliar para borrar reseñas de “Productor de Seguros”:

- `supabase/delete-productor-seguros-reviews.sql`

Estos dos archivos están sin versionar al momento del cierre; conservarlos localmente salvo indicación contraria.

## Panel admin privado

Se creó panel en:

- `https://guiasuarez.ar/admin`

Archivos:

- `public/admin.html`
- `public/admin.css`
- `public/admin.js`
- lógica backend en `worker.js`

Funcionalidades V1:

- Login con Google.
- Acceso solo para emails autorizados.
- Métricas:
  - actividades activas;
  - calificaciones;
  - promedio general;
  - avisos nuevos últimos 7 días;
  - opiniones nuevas últimos 7 días.
- Alertas:
  - autocalificaciones;
  - calificaciones rápidas;
  - usuarios muy activos;
  - 5 estrellas sin comentario.
- Tabla de últimos avisos:
  - actividad;
  - dueño;
  - contacto;
  - estado;
  - fecha;
  - link a ficha.
- Tabla de últimas calificaciones:
  - aviso;
  - rating;
  - comentario;
  - quién calificó;
  - alertas;
  - botón para borrar calificación.

Endpoints privados:

- `GET /api/admin/dashboard`
- `DELETE /api/admin/reviews/:id`

Seguridad:

- El navegador envía el access token de Supabase Auth.
- El Worker valida el token contra Supabase.
- El Worker compara el email con admins permitidos.
- Solo el Worker usa `SUPABASE_SERVICE_ROLE_KEY`.
- La `service_role_key` nunca se expone al frontend.

Admins por defecto hardcodeados:

- `guiasuarezweb@gmail.com`
- `chollodigital.store@gmail.com`

Variable opcional en Cloudflare:

- `ADMIN_EMAILS`

Formato:

```txt
guiasuarezweb@gmail.com,otro@email.com
```

Variable obligatoria ya cargada en Cloudflare:

- `SUPABASE_SERVICE_ROLE_KEY`

Verificación realizada:

- Antes de cargar secret, endpoint devolvía 503.
- Después de cargar secret, endpoint devuelve 401 sin login:

```json
{"error":"Tenés que ingresar con Google."}
```

Eso confirmó que el backend admin ya lee el secreto.

Commits relevantes:

- `acf1935` — Add private admin dashboard
- `ae8d963` — Use public Supabase URL for admin backend

## Configuración pendiente/recordatorio

Para login de `/admin`, Supabase Auth debe permitir redirect:

```txt
https://guiasuarez.ar/admin
```

Si un admin autorizado no puede entrar y vuelve a home/error, revisar:

- Supabase Auth → URL Configuration / Redirect URLs.
- Google OAuth Authorized redirect URIs si hiciera falta.

## WhatsApp Business

Se instaló WhatsApp Business para la guía.

Número:

- `+54 2926 418969`

Se propusieron mensajes rápidos:

- `/hola`
- `/publicar`
- `/buscar`
- `/corregir`
- `/publicidad`
- `/reputacion`

Nota: el usuario reportó que en su app solo veía “mensajes rápidos”, no bienvenida/ausencia. Se recomendó arrancar con respuestas rápidas y etiquetas.

## Archivos no versionados al cierre

No tocar salvo pedido:

- `marketing/calendario-posts-facebook.md`
- `marketing/imagenes-facebook/`
- `marketing/posts-listos-facebook-whatsapp.md`
- `supabase/delete-productor-seguros-reviews.sql`
- `supabase/review-audit.sql`

## Próximos pasos posibles

1. Probar `/admin` logueado con Google desde una cuenta autorizada.
2. Agregar acciones admin:
   - pausar aviso;
   - eliminar aviso;
   - exportar CSV;
   - ver detalle completo de usuario;
   - filtros por fecha/rubro/alerta.
3. Hacer moderación más fina:
   - ocultar reseña sin borrarla (`status = hidden`);
   - agregar motivo de moderación;
   - enviar email automático al admin al detectar reseña sospechosa.
4. Mejorar WhatsApp Business:
   - etiquetas;
   - respuestas rápidas;
   - link/QR en redes.
