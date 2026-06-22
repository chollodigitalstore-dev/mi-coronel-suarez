# Contexto de continuidad — Mi Coronel Suárez

Última actualización: 21 de junio de 2026.

## Objetivo

Construir una guía local de profesionales, comercios y servicios del Partido de Coronel Suárez, organizada por rubro y localidad. Los usuarios podrán identificarse con Google y publicar una calificación por actividad para construir reputación comunitaria.

## Infraestructura

- Repositorio: https://github.com/chollodigitalstore-dev/mi-coronel-suarez
- Rama principal: `main`
- Hosting: Cloudflare Workers con recursos estáticos.
- Despliegue: automático desde GitHub mediante `npx wrangler deploy`.
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

Último commit publicado antes del trabajo de Supabase: `f4fce4a`.

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

## Próximo paso exacto

1. Publicar los commits pendientes en GitHub/Cloudflare.
2. Confirmar que el usuario de prueba esté permitido en Google Auth Platform mientras la aplicación esté en modo de prueba.
3. Probar ingreso, cierre de sesión, publicación y edición de una reseña.
4. Corregir cualquier hallazgo antes de abrir la beta.

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

- El correo del usuario nunca se muestra públicamente.
- Se podrá mostrar nombre de pila y avatar de Google.
- Cada usuario puede dejar una sola reseña por actividad y editarla.
- Los negocios no deben poder borrar críticas legítimas.
- Habrá denuncias y moderación.
- Las opiniones se describen como “usuarios identificados con Google”, no como compras o contrataciones verificadas.
- Conviene no destacar una reputación como representativa hasta alcanzar al menos tres opiniones.

## Datos de demostración

Los seis comercios y teléfonos actuales son ficticios. El script SQL los replica para que el prototipo pueda probar calificaciones. Antes del lanzamiento público deben reemplazarse por datos reales y autorizados.
