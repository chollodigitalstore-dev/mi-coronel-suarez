# Agente de contenido orgánico — Guía Suárez

Este agente genera contenido semanal listo para redes a partir de los avisos publicados en Supabase.

## Qué hace

- Lee avisos activos de Guía Suárez.
- Detecta rubros con pocos avisos.
- Genera posts para Facebook, Instagram, WhatsApp y grupos locales.
- Promociona la guía como herramienta local; no promociona avisos individuales.
- Crea un archivo de salida en `marketing/CONTENIDO_SEMANAL.md`.

## Criterio editorial

La marca a instalar es Guía Suárez.

Los avisos publicados se usan como señal interna para entender rubros disponibles o rubros faltantes, pero el contenido orgánico debe empujar el hábito:

> “Cuando necesitás algo en Coronel Suárez, buscalo en Guía Suárez.”

Evitar que el contenido semanal parezca publicidad puntual de un comercio, salvo que más adelante se defina una acción editorial específica.

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
