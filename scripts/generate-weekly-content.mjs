import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "marketing");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "CONTENIDO_SEMANAL.md");
const SITE_URL = "https://guiasuarez.ar";

const categories = {
  hogar: "Hogar y oficios",
  belleza: "Belleza y bienestar",
  salud: "Salud",
  gastronomia: "Gastronomía",
  comercios: "Comercios",
  automotor: "Automotor",
  profesionales: "Profesionales",
  mascotas: "Mascotas",
  eventos: "Eventos",
  educacion: "Educación",
  tecnologia: "Tecnología",
  turismo: "Turismo y ocio"
};

function todayLabel() {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires"
  }).format(new Date());
}

async function loadSupabaseConfig() {
  const config = await readFile(path.join(ROOT, "public", "supabase-config.js"), "utf8");
  const url = config.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)?.[1];
  const key = config.match(/SUPABASE_PUBLISHABLE_KEY\s*=\s*"([^"]+)"/)?.[1];
  if (!url || !key) throw new Error("No pude leer public/supabase-config.js");
  return { url, key };
}

async function fetchListings() {
  const { url, key } = await loadSupabaseConfig();
  const endpoint = new URL(`${url}/rest/v1/listings`);
  endpoint.searchParams.set("select", "slug,name,category,location,place,address,description,phone,active,created_at");
  endpoint.searchParams.set("active", "eq.true");
  endpoint.searchParams.set("order", "created_at.desc");
  endpoint.searchParams.set("limit", "100");

  let response = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });

  if (!response.ok && response.status === 400) {
    endpoint.searchParams.set("select", "slug,name,category,location,place,address,phone,active,created_at");
    response = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
  }

  if (!response.ok) {
    throw new Error(`Supabase devolvió ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function countByCategory(listings) {
  return listings.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
}

function pickEmptyOrLowCategories(listings) {
  const counts = countByCategory(listings);
  return Object.keys(categories)
    .map(id => ({ id, name: categories[id], count: counts[id] || 0 }))
    .sort((a, b) => a.count - b.count)
    .slice(0, 4);
}

function firstNameList(listings, limit = 5) {
  return listings.slice(0, limit).map(item => `- ${item.name} (${categories[item.category] || item.category})`).join("\n") || "- Todavía estamos esperando los primeros avisos reales.";
}

function postBlock(title, body) {
  return `## ${title}\n\n${body.trim()}\n`;
}

function generateContent(listings) {
  const lowCategories = pickEmptyOrLowCategories(listings);
  const latest = listings.slice(0, 5);
  const topCategory = Object.entries(countByCategory(listings)).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategory ? categories[topCategory[0]] || topCategory[0] : "comercios y servicios";
  const lowCategoryNames = lowCategories.map(item => item.name.toLowerCase()).join(", ");
  const shareText = "Conocé Guía Suárez: una guía local para buscar comercios, profesionales y servicios de Coronel Suárez. Publicar es gratis para siempre: https://guiasuarez.ar";

  return `# Contenido semanal automático — Guía Suárez

Generado: ${todayLabel()}

Avisos activos detectados: ${listings.length}

## Resumen para publicar esta semana

- Meta de campaña: primeros 100 avisos.
- Rubros a empujar: ${lowCategoryNames || "oficios, belleza, gastronomía y profesionales"}.
- Rubro con más presencia actual: ${topCategoryName}.
- CTA principal: publicar gratis para siempre en ${SITE_URL}.

${postBlock("Post 1 — Lanzamiento / recordatorio general", `
Nació Guía Suárez: una guía local para encontrar comercios, profesionales y servicios de Coronel Suárez.

Podés buscar por rubro, contactar por WhatsApp y ayudar a otros vecinos con calificaciones.

Si tenés una actividad, publicarla es gratis para siempre.

Entrá a ${SITE_URL}

#CoronelSuarez #GuiaSuarez #ComerciosLocales #Emprendedores
`)}

${postBlock("Post 2 — Primeros 100 avisos", `
Estamos armando los primeros 100 avisos de Guía Suárez.

Si tenés un comercio, profesión, emprendimiento o servicio en Coronel Suárez, sumá tu actividad gratis.

Y si conocés a alguien que debería aparecer, compartile la guía.

${SITE_URL}

#CoronelSuarez #ComerciosEnCoronelSuarez #ServiciosLocales
`)}

${postBlock("Post 3 — Rubros que necesitamos sumar", `
Queremos completar más rubros en Guía Suárez.

Esta semana buscamos especialmente:
${lowCategories.map(item => `- ${item.name}`).join("\n")}

Publicar es gratis para siempre y ayuda a que más vecinos encuentren servicios locales sin tener que preguntar de cero.

${SITE_URL}
`)}

${postBlock("Post 4 — Nuevos avisos / actividad reciente", `
Algunas actividades que ya forman parte de Guía Suárez:

${firstNameList(latest)}

Si querés que tu actividad también aparezca, podés publicarla gratis en ${SITE_URL}
`)}

${postBlock("Historia Instagram / Facebook", `
Texto corto:

¿Tenés un comercio o servicio en Coronel Suárez?

Publicalo gratis en Guía Suárez.

Sticker sugerido:
👉 guiasuarez.ar
`)}

${postBlock("Mensaje para WhatsApp", `
${shareText}
`)}

${postBlock("Mensaje para grupos de Facebook", `
Permiso, comparto algo útil para la ciudad.

Estamos armando Guía Suárez, una guía local para encontrar comercios, profesionales y servicios de Coronel Suárez.

Buscar es libre y publicar una actividad es gratis para siempre.

Si tenés un comercio, emprendimiento, profesión u oficio, podés sumarte acá:

${SITE_URL}
`)}

## Próximas acciones sugeridas

1. Publicar el Post 1 en Facebook e Instagram.
2. Mandar el mensaje de WhatsApp a conocidos/comercios.
3. Publicar el Post 3 en grupos locales, cuidando no repetirlo demasiado.
4. Repetir este script cada semana y ajustar según rubros que falten.

## Comando para regenerar

\`\`\`bash
node scripts/generate-weekly-content.mjs
\`\`\`
`;
}

async function main() {
  const listings = await fetchListings();
  const content = generateContent(listings);
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, content, "utf8");
  console.log(`Contenido generado en ${OUTPUT_FILE}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
