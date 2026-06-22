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

## Trabajo preparado localmente, todavía no publicado

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

No subir este commit a GitHub hasta completar el esquema SQL y habilitar Google, para evitar publicar una experiencia incompleta.

## Próximo paso exacto

1. Abrir Supabase.
2. Entrar en **SQL Editor**.
3. Crear una consulta con **New query**.
4. Copiar todo el contenido de `supabase/schema.sql`.
5. Ejecutarlo con **Run**.
6. Confirmar si aparece éxito o copiar el error completo.

Después:

1. Configurar Google OAuth en Google Cloud y Supabase Authentication.
2. Agregar como URL autorizada el callback que muestra Supabase.
3. Agregar la URL pública de Cloudflare a las Redirect URLs de Supabase.
4. Probar ingreso, cierre de sesión, publicación y edición de una reseña.
5. Ejecutar `git push` para publicar el commit local cuando todo esté configurado.

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
