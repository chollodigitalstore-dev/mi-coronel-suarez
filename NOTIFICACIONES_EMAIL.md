# Notificaciones por email — Guía Suárez

Objetivo: recibir un correo en `guiasuarezweb@gmail.com` cada vez que:

- alguien publica un aviso;
- alguien deja una calificación.

## Arquitectura

```text
Supabase Database Webhook
        ↓
https://guiasuarez.ar/api/supabase-notify
        ↓
Cloudflare Worker
        ↓
Resend
        ↓
guiasuarezweb@gmail.com
```

## Variables necesarias en Cloudflare Workers

Configurar como secrets del Worker:

```bash
wrangler secret put NOTIFY_WEBHOOK_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put NOTIFY_FROM
wrangler secret put NOTIFY_TO
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Valores sugeridos:

- `NOTIFY_WEBHOOK_SECRET`: una clave larga inventada, por ejemplo generada con un password manager.
- `RESEND_API_KEY`: API key de Resend.
- `NOTIFY_FROM`: remitente verificado en Resend, por ejemplo `Guía Suárez <notificaciones@guiasuarez.ar>`.
- `NOTIFY_TO`: `guiasuarezweb@gmail.com`.
- `SUPABASE_URL`: `https://sblrytmfvqhjqclaozvr.supabase.co`.
- `SUPABASE_SERVICE_ROLE_KEY`: service role key de Supabase. No usar la publishable key.

Importante: `SUPABASE_SERVICE_ROLE_KEY` nunca debe ir en archivos públicos ni en el frontend.

## Configuración en Resend

1. Crear cuenta en Resend.
2. Verificar el dominio `guiasuarez.ar`.
3. Agregar los DNS que Resend indique en Cloudflare.
4. Crear una API key.
5. Usar esa API key en `RESEND_API_KEY`.

Cloudflare también documenta el envío de emails desde Workers con Resend: https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/

## Configuración en Supabase

Crear dos Database Webhooks:

### Webhook 1 — Nuevo aviso

- Table: `public.listings`
- Event: `INSERT`
- Method: `POST`
- URL: `https://guiasuarez.ar/api/supabase-notify`
- Headers:

```txt
Authorization: Bearer TU_NOTIFY_WEBHOOK_SECRET
Content-Type: application/json
```

### Webhook 2 — Nueva calificación

- Table: `public.reviews`
- Event: `INSERT`
- Method: `POST`
- URL: `https://guiasuarez.ar/api/supabase-notify`
- Headers:

```txt
Authorization: Bearer TU_NOTIFY_WEBHOOK_SECRET
Content-Type: application/json
```

## Prueba manual

Una vez configurados los secrets, probar:

```bash
curl -X POST https://guiasuarez.ar/api/supabase-notify \
  -H "Authorization: Bearer TU_NOTIFY_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"INSERT\",\"table\":\"listings\",\"record\":{\"name\":\"Aviso de prueba\",\"category\":\"hogar\",\"place\":\"Coronel Suárez\",\"phone\":\"2926...\",\"description\":\"Prueba de notificación\"}}"
```

Si todo está correcto, llega un correo a `guiasuarezweb@gmail.com`.
