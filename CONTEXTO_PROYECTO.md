# Contexto de continuidad — Mi Coronel Suárez

Última actualización: 28 de junio de 2026.

## Objetivo

Construir una guía local de profesionales, comercios y servicios del Partido de Coronel Suárez, organizada por rubro y localidad. Los usuarios podrán identificarse con Google y publicar una calificación por actividad para construir reputación comunitaria.

## Infraestructura

- Repositorio: https://github.com/chollodigitalstore-dev/mi-coronel-suarez
- Rama principal: `main`
- Hosting: Cloudflare Workers con recursos estáticos.
- Despliegue: automático desde GitHub mediante `npx wrangler deploy`.
- URL temporal actual: `https://mi-coronel-suarez.chollodigital-store.workers.dev`
- Dominio definitivo aprobado por NIC.ar: `guiasuarez.ar`
- Dominio definitivo funcionando: `https://guiasuarez.ar`
- Cloudflare incorporó y activó el dominio `guiasuarez.ar`.
- Nameservers asignados por Cloudflare y cargados en NIC.ar:
  - `hasslo.ns.cloudflare.com`
  - `nora.ns.cloudflare.com`
- Se crearon registros DNS proxied para que las rutas de Workers resuelvan:
  - A `@` → `192.0.2.1`, nube naranja activa.
  - A `www` → `192.0.2.1`, nube naranja activa.
- Se configuró ruta de Workers hacia `mi-coronel-suarez`.
- Base de datos y autenticación: Supabase.
- Proyecto Supabase: `Mi Coronel Suarez`.
- URL pública: `https://sblrytmfvqhjqclaozvr.supabase.co`
- La clave `sb_publishable_...` está en `public/supabase-config.js`. Es pública; no hay secretos privados guardados en el repositorio.

## Estado publicado

La versión actualmente publicada contiene:

- Portada responsive.
- Búsqueda por texto.
- Filtros por localidad y rubro.
- Actividades ficticias demostrativas.
- Formulario demostrativo para sumar actividades.
- Logo con la silueta corregida del Partido de Coronel Suárez, ficha de clasificado, lupa y pin.

La versión preparada para publicar incluye además:

- Landing enfocada en “buscar libremente, publicar/calificar con Google”.
- Nueva sección “Cómo funciona”.
- Modal de publicación con bloqueo de autenticación: si el usuario no está logueado, muestra ingreso con Google; si está logueado, muestra el formulario.
- Banner publicitario en la home para “Feria Americana el Garage”, apuntando a una landing propia.
- Landing del anunciante con botón flotante de WhatsApp y footer `Powered by Blu Software`.
- Archivos modificados localmente:
  - `public/index.html`
  - `public/styles.css`
  - `public/app.js`

Estos cambios forman parte del paquete de publicación del 28 de junio de 2026.

## Integración de Supabase preparada

Commit local: `12cf5e3` — `Prepare Supabase authentication and reviews`.

Incluye:

- Conexión pública a Supabase.
- Botón “Ingresar con Google”.
- Visualización básica del usuario autenticado y cierre de sesión.
- Formulario de calificación de 1 a 5 estrellas.
- Una reseña por usuario y actividad mediante `upsert`.
- Promedio y cantidad de opiniones por actividad.
- Esquema SQL con perfiles, actividades, reseñas, respuestas y denuncias.
- Políticas RLS para limitar operaciones según identidad y propiedad.

El esquema SQL fue ejecutado correctamente, se cargaron las seis actividades de prueba y la API pública respondió con estado 200. Google OAuth fue configurado tanto en Google Cloud como en Supabase.

URL pública y de retorno configurada:

`https://mi-coronel-suarez.chollodigital-store.workers.dev`

## Estado del dominio `guiasuarez.ar`

NIC.ar aprobó el nombre definitivo y el dominio ya fue delegado a los nameservers de Cloudflare.

Cloudflare activó el dominio y el sitio ya abre correctamente en:

`https://guiasuarez.ar`

Durante la configuración, al principio el navegador mostró `DNS_PROBE_FINISHED_NXDOMAIN` porque no existía registro DNS para el apex. Se resolvió agregando registros DNS proxied con IP placeholder `192.0.2.1` para `@` y `www`, y rutas de Workers al proyecto `mi-coronel-suarez`.

Pendiente verificar si `https://www.guiasuarez.ar` también abre. Si no abre, revisar que exista la ruta `www.guiasuarez.ar/*` y el registro DNS `www` proxied.

## Próximo paso exacto

1. Verificar `https://www.guiasuarez.ar`.
2. Actualizar Supabase Authentication URL Configuration:
   - Site URL: `https://guiasuarez.ar`
   - Redirect URL adicional: `https://guiasuarez.ar/**`
   - Opcionalmente conservar temporalmente la URL workers.dev durante pruebas.
3. Actualizar Google Cloud OAuth:
   - Authorized JavaScript origins: agregar `https://guiasuarez.ar`
   - Mantener `https://mi-coronel-suarez.chollodigital-store.workers.dev` si se quiere seguir probando la URL temporal.
   - El redirect URI de Supabase sigue siendo `https://sblrytmfvqhjqclaozvr.supabase.co/auth/v1/callback`.
4. Publicar los cambios locales del rediseño si el usuario lo confirma.
5. Probar ingreso, cierre de sesión, publicación y edición de una reseña.
6. Corregir cualquier hallazgo antes de abrir la beta.

## Verificación de producción

- El despliegue automático publicó correctamente la interfaz de autenticación y reseñas.
- La URL pública respondió con HTTP 200.
- Las seis actividades fueron visibles a través de la API pública con RLS activo.
- El botón “Ingresar con Google” redirigió correctamente al selector oficial de cuentas de Google.
- Se corrigió la aparición simultánea de “Ingresar con Google” y “Salir” para usuarios sin sesión.
- Pendiente: realizar una autenticación real con una cuenta permitida y publicar/editar una reseña de prueba.

## Archivos importantes

- `public/index.html`: interfaz y diálogos.
- `public/styles.css`: diseño responsive.
- `public/app.js`: búsqueda, autenticación y reseñas.
- `public/supabase-config.js`: URL y clave pública de Supabase.
- `supabase/schema.sql`: esquema y reglas de seguridad para ejecutar en Supabase.
- `supabase/seed.sql`: seis actividades ficticias para pruebas; ejecución repetible sin duplicados.
- `worker.js`: Worker que entrega los recursos y agrega cabeceras de seguridad.
- `wrangler.toml`: configuración de Cloudflare.
- `public/assets/logo-mapa-clasificados-v2.png`: logo vigente.

## Decisiones de producto

- Buscar y ver fichas será público, sin login.
- La autenticación con Google será obligatoria para crear contenido o modificarlo: publicar actividad, editar/eliminar/pausar actividad, dejar reseñas, reclamar/administrar ficha y acciones sensibles.
- Publicar una actividad debe requerir Google porque la ficha necesita quedar asociada a un `owner_id`; así el dueño puede editarla, pausarla o eliminarla luego.
- Una actividad nueva puede entrar como `pendiente` y pasar por moderación/admin antes de publicarse.
- El correo del usuario nunca se muestra públicamente.
- Se podrá mostrar nombre de pila y avatar de Google en reseñas.
- Cada usuario puede dejar una sola reseña por actividad y editarla.
- Los negocios no deben poder borrar críticas legítimas.
- Habrá denuncias y moderación.
- Las opiniones se describen como “usuarios identificados con Google”, no como compras o contrataciones verificadas.
- Conviene no destacar una reputación como representativa hasta alcanzar al menos tres opiniones.
- La publicidad no debe alterar el scoring ni la reputación. Un comercio puede pagar visibilidad, pero no mejorar artificialmente su puntaje.
- Monetización inicial: banners de publicidad local. Primer anunciante previsto: feria americana “El Garage de Bettina”.
- Footer/branding: incluir “Powered by Blu Software” o “Desarrollado por Blu Software”.

## Scoring propuesto

Separar dos conceptos:

1. Reputación pública: calidad percibida por la comunidad.
   - Promedio de estrellas.
   - Cantidad de reseñas.
   - Penalización suave si hay muy pocas reseñas.
   - Antigüedad/recencia de reseñas.
   - Reportes o moderación.

2. Confianza de ficha: calidad/verificación de la información.
   - Ficha reclamada por dueño.
   - Teléfono/localidad/rubro verificados.
   - Datos completos.
   - Actualización reciente.
   - Respuestas del dueño a reseñas.

No mezclar pauta publicitaria con reputación. Los anuncios deben mostrarse como `Publicidad`.

## Publicidad

Modelo inicial simple:

- Banner fijo para “El Garage de Bettina”.
- Primer asset generado: `public/assets/banner-feria-americana-el-garage.png`.
- Landing del anunciante creada en `public/feria-americana-el-garage.html`.
- Estilos propios de la landing en `public/garage.css`.
- El banner de la home debe apuntar a la landing, no directo a WhatsApp.
- WhatsApp del anuncio: `542926509949`. Dentro de la landing, usar `https://wa.me/542926509949`.
- En el banner, el número visible debe mostrarse como `2926-509949`, sin prefijo internacional.
- La landing incluye botón flotante redondo de WhatsApp.
- Ubicaciones sugeridas:
  - Banner horizontal entre hero y rubros.
  - Tarjeta publicitaria entre resultados en mobile/listado.
- Más adelante convertir banners en administrables desde Supabase con tablas `ads`, `ad_slots`, `ad_impressions` y `ad_clicks`.

## Datos de demostración

Los seis comercios y teléfonos actuales son ficticios. El script SQL los replica para que el prototipo pueda probar calificaciones. Antes del lanzamiento público deben reemplazarse por datos reales y autorizados.
