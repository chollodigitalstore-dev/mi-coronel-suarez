# Contexto para retomar - Google OAuth / Supabase Auth

Fecha: 2026-07-02

## Estado del proyecto

- Sitio principal: https://guiasuarez.ar
- Dominio activo en Cloudflare.
- Hosting: Cloudflare Workers con assets estaticos.
- Supabase:
  - Proyecto: Mi Coronel Suarez
  - URL actual: `https://sblrytmfvqhjqclaozvr.supabase.co`
- Repo: https://github.com/chollodigitalstore-dev/mi-coronel-suarez
- Workspace local:
  - `C:\Users\Ari\Documents\Codex\2026-06-21\vamos-a-trabajar-en-un-nuevo\outputs\mi-coronel-suarez`

## Avance reciente

Se agregaron y publicaron paginas legales para Google OAuth:

- `public/privacidad.html`
- `public/terminos.html`

URLs publicas ya verificadas con 200 OK:

- https://guiasuarez.ar/privacidad.html
- https://guiasuarez.ar/terminos.html

Commit publicado:

- `16c5c6a Add privacy and terms pages`

Tambien se agregaron links a Privacidad y Terminos en el footer de la home.

## Problema detectado

Al intentar iniciar sesion con Google, la pantalla de Google muestra:

- `Ir a sblrytmfvqhjqclaozvr.supabase.co`

Esto ocurre porque el flujo OAuth esta siendo gestionado por el dominio por defecto de Supabase.

Aunque en Google Cloud se agrego `guiasuarez.ar` como dominio autorizado, Google sigue mostrando el dominio que participa en el flujo OAuth, que actualmente es el subdominio tecnico de Supabase.

## Decision recomendada

Configurar un dominio personalizado para Supabase Auth:

- `auth.guiasuarez.ar`

Objetivo: que la pantalla de Google muestre algo confiable como:

- `Ir a auth.guiasuarez.ar`

En vez del dominio tecnico:

- `sblrytmfvqhjqclaozvr.supabase.co`

## Pasos para retomar mañana

1. Entrar a Supabase.
2. Buscar la configuracion de dominio personalizado para Auth.
   - Puede estar en Authentication / URL Configuration / Custom Domains, segun la interfaz disponible del plan.
3. Intentar crear/configurar:
   - `auth.guiasuarez.ar`
4. Supabase deberia indicar registros DNS necesarios.
5. En Cloudflare, agregar el registro DNS que Supabase pida.
   - Probablemente un CNAME para `auth`.
6. Cuando Supabase valide el dominio:
   - En Google Cloud agregar `auth.guiasuarez.ar` como dominio autorizado.
   - En el OAuth Client revisar:
     - Authorized JavaScript origins:
       - `https://guiasuarez.ar`
       - `https://www.guiasuarez.ar`
       - si corresponde: `https://auth.guiasuarez.ar`
     - Authorized redirect URI:
       - probablemente `https://auth.guiasuarez.ar/auth/v1/callback`
       - mantener o reemplazar segun indique Supabase.
7. En Supabase Auth URL Configuration revisar:
   - Site URL: `https://guiasuarez.ar`
   - Redirect URLs:
     - `https://guiasuarez.ar/**`
     - `https://www.guiasuarez.ar/**`
8. En el codigo, actualizar `public/supabase-config.js` si Supabase indica usar el dominio personalizado como URL publica:
   - de `https://sblrytmfvqhjqclaozvr.supabase.co`
   - a `https://auth.guiasuarez.ar`

## Nota importante

No poner `https://guiasuarez.ar` como OAuth redirect URI si el callback real lo maneja Supabase.
El callback debe apuntar al dominio Auth de Supabase:

- actual: `https://sblrytmfvqhjqclaozvr.supabase.co/auth/v1/callback`
- esperado con dominio custom: `https://auth.guiasuarez.ar/auth/v1/callback`

## Pendiente tecnico

Si se requiere deploy manual con Wrangler desde esta maquina, falta configurar:

- `CLOUDFLARE_API_TOKEN`

El intento con `npx.cmd wrangler deploy` fallo por no tener ese token en entorno no interactivo.

