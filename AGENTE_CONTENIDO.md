# Agente de contenido orgánico — Guía Suárez

Este agente genera contenido semanal listo para redes a partir de los avisos publicados en Supabase.

## Qué hace

- Lee avisos activos de Guía Suárez.
- Detecta rubros con pocos avisos.
- Genera posts para Facebook, Instagram, WhatsApp y grupos locales.
- Crea un archivo de salida en `marketing/CONTENIDO_SEMANAL.md`.

## Cómo ejecutarlo

Desde la carpeta del proyecto:

```bash
node scripts/generate-weekly-content.mjs
```

## Resultado

El contenido queda en:

```bash
marketing/CONTENIDO_SEMANAL.md
```

## Flujo recomendado

1. Ejecutar el agente una vez por semana.
2. Revisar el archivo generado.
3. Copiar los posts a Meta Business Suite, Buffer o la herramienta que usemos para programar.
4. Cuando el tono esté probado, conectar este flujo a una automatización con aprobación.

## Próxima evolución

- Generar placas visuales automáticamente.
- Guardar una cola de publicaciones.
- Conectar con Buffer, Make o n8n.
- Crear reportes de rubros buscados y rubros faltantes.
