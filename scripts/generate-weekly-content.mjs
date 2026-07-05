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
  servicios: "Servicios",
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

const needExamples = [
  "¿Dónde encuentro una manicura?",
  "¿Quién hace arreglos eléctricos?",
  "¿Dónde busco un carpintero?",
  "¿A quién llamo para limpieza?",
  "¿Qué comercio local tiene lo que necesito?",
  "¿Dónde encuentro un profesional en Coronel Suárez?"
];

function weeklyNeedExamples() {
  return needExamples.slice(0, 4).map(item => `- ${item}`).join("\n");
}

function postBlock(title, body) {
  return `## ${title}\n\n${body.trim()}\n`;
}

function generateContent(listings) {
  const lowCategories = pickEmptyOrLowCategories(listings);
  const topCategory = Object.entries(countByCategory(listings)).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategory ? categories[topCategory[0]] || topCategory[0] : "comercios y servicios";
  const lowCategoryNames = lowCategories.map(item => item.name.toLowerCase()).join(", ");
  const shareText = "Conocé Guía Suárez: una guía local para buscar comercios, profesionales y servicios de Coronel Suárez. Entrá, buscá por rubro y compartila con quien la necesite: https://guiasuarez.ar";

  return `# Contenido semanal automático — Guía Suárez

Generado: ${todayLabel()}

Avisos activos detectados: ${listings.length}

## Resumen para publicar esta semana

- Objetivo principal: instalar el hábito de buscar en Guía Suárez.
- Enfoque de marca: “menos preguntar, más encontrar”.
- Rubros a mencionar: ${lowCategoryNames || "oficios, belleza, gastronomía y profesionales"}.
- Rubro con más presencia actual, sólo como dato interno: ${topCategoryName}.
- CTA principal: entrar a ${SITE_URL} y buscar por rubro.

${postBlock("Post 1 — Marca / hábito de uso", `
Cuando necesitás algo en Coronel Suárez, no siempre sabés por dónde empezar.

¿Una manicura? ¿Un electricista? ¿Un comercio? ¿Un profesional?

Guía Suárez reúne comercios, profesionales y servicios locales para que puedas buscar más rápido y elegir mejor.

Entrá, buscá por rubro y guardala para cuando la necesites:
${SITE_URL}

#CoronelSuarez #GuiaSuarez #ComerciosLocales #ServiciosLocales
`)}

${postBlock("Post 2 — Problema cotidiano", `
“¿Alguien conoce a alguien que haga...?”

Esa pregunta aparece todos los días.

La idea de Guía Suárez es simple: que puedas encontrar comercios, profesionales y servicios de Coronel Suárez en un solo lugar.

Buscá por rubro, compará opciones y contactá directo.
${SITE_URL}

#GuiaSuarez #CoronelSuarez #DondeEncuentro
`)}

${postBlock("Post 3 — Búsquedas posibles", `
Algunas búsquedas que Guía Suárez quiere resolver:

${weeklyNeedExamples()}

Si buscás algo local, probá primero en Guía Suárez.

${SITE_URL}
`)}

${postBlock("Post 4 — Comunidad / primeros 100 avisos", `
Estamos completando Guía Suárez entre todos.

Cuantos más comercios, profesionales y servicios se sumen, más útil va a ser para cada vecino.

Si conocés a alguien que debería aparecer en la guía, compartile este link.

Y si tenés una actividad, podés publicarla gratis para siempre.

${SITE_URL}
`)}

${postBlock("Historia Instagram / Facebook", `
Texto corto:

¿Dónde encuentro eso en Coronel Suárez?

Probá buscarlo en Guía Suárez.

Sticker sugerido:
👉 guiasuarez.ar
`)}

${postBlock("Mensaje para WhatsApp", `
${shareText}
`)}

${postBlock("Mensaje para grupos de Facebook", `
Permiso, comparto algo útil para la ciudad.

Estamos armando Guía Suárez, una guía local para encontrar comercios, profesionales y servicios de Coronel Suárez.

La idea es que cuando alguien necesite una manicura, un electricista, un comercio o un profesional, pueda buscar por rubro en un solo lugar.

Si les sirve, pueden entrar y guardarla:

${SITE_URL}

Y si conocen a alguien que debería aparecer, se la pueden compartir. Publicar es gratis para siempre.
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
