const SOURCES = {
  radioSuarez: "https://www.lanuevaradiosuarez.com.ar/farmacias-de-turno.html",
  turnoAhora: "https://www.farmaciadeturnoahora.com.ar/de-turno/buenos-aires/coronel-suarez",
  medicalProfessionals: "https://www.circulomedicocoronelsuarez.com.ar/padron/",
  psychologyProfessionals: "https://www.mundopsicologos.com.ar/centros/coronel-suarez"
};

const CATEGORY_LABELS = {
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

const CATEGORY_PATHS = {
  automotor: "automotor",
  belleza: "belleza-y-bienestar",
  comercios: "comercios",
  educacion: "educacion",
  eventos: "eventos",
  gastronomia: "gastronomia",
  hogar: "hogar-y-oficios",
  mascotas: "mascotas",
  profesionales: "profesionales",
  salud: "salud",
  servicios: "servicios",
  tecnologia: "tecnologia",
  turismo: "turismo-y-ocio"
};

const SITE_URL = "https://guiasuarez.ar";
const SUPABASE_PUBLIC_URL = "https://sblrytmfvqhjqclaozvr.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_4I_BsyxzfQHwjbhhrZBiCg_6k_1YSTi";
const CATEGORY_BY_PATH = Object.fromEntries(Object.entries(CATEGORY_PATHS).map(([id, path]) => [path, id]));
const LOCATION_LABELS = {
  "coronel-suarez": "Coronel Suárez",
  "huanguelen": "Huanguelén",
  "pueblo-san-jose": "Pueblo San José",
  "pueblo-santa-maria": "Pueblo Santa María",
  "pueblo-santa-trinidad": "Pueblo Santa Trinidad"
};

const DENTAL_PROFESSIONALS = [
  { license: "319", name: "Perussi Maria Cecilia", address: "Villegas 632", place: "Coronel Suárez", phone: "422484" },
  { license: "427", name: "Herrero Hugo", address: "Las Heras 767", place: "Coronel Suárez", phone: "02926-15414469" },
  { license: "451", name: "Martelli Gabriel", address: "Belgrano 964", place: "Coronel Suárez", phone: "422108" },
  { license: "482", name: "Leone Guillermo", address: "Av. Alsina 438", place: "Coronel Suárez", phone: "422191" },
  { license: "513", name: "Martelli Oscar", address: "Belgrano 964", place: "Coronel Suárez", phone: "422108" },
  { license: "566", name: "Hipperdinger Maria C.", address: "Las Heras 770", place: "Coronel Suárez", phone: "422673" },
  { license: "649", name: "Beltran Martin", address: "Rivadavia 696", place: "Coronel Suárez", phone: "423026" },
  { license: "699", name: "Bender Karina", address: "Brandsen 628", place: "Coronel Suárez", phone: "432603" },
  { license: "700", name: "Bender Leonardo", address: "Brandsen 628", place: "Coronel Suárez", phone: "432603" },
  { license: "50263", name: "Aguirregabiria Walter", address: "Rivadavia 281", place: "Coronel Suárez", phone: "423185" },
  { license: "701", name: "Santucci Valentina", address: "French 4358", place: "Pueblo San José", phone: "02926-15412678" },
  { license: "544", name: "Garcia Maria Laura", address: "Diag. S. Martín 379", place: "Huanguelén", phone: "02933-432982" },
  { license: "10734", name: "Lampon Ricardo", address: "Calle 10 Nº 637", place: "Huanguelén", phone: "02933-432723" },
  { license: "437", name: "Mangas Sergio", address: "Calle 28 Nº 974", place: "Huanguelén", phone: "02933-432195" },
  { license: "11803", name: "Ruiz Noemi Beatriz", address: "Avellaneda 963", place: "Coronel Suárez", phone: "02926-15451438" },
  { license: "13402", name: "Simon Maria Florencia", address: "H. Yrigoyen 1344", place: "Coronel Suárez", phone: "431292" },
  { license: "44289", name: "Aguirregabiria Luis", address: "Rivadavia 281", place: "Coronel Suárez", phone: "423185" },
  { license: "898", name: "Burgardt Magalí", address: "Avellaneda 898", place: "Coronel Suárez", phone: "02926-458443" },
  { license: "24425", name: "Grunebaum Ricardo", address: "Rivadavia 402", place: "Coronel Suárez", phone: "431622" }
];

const PSYCHOLOGY_PROFESSIONALS = [
  { name: "Daniel Go\u00f1i", place: "Coronel Su\u00e1rez" },
  { name: "Marcos Andr\u00e9s Weiman", place: "Coronel Su\u00e1rez" },
  { name: "Lic. Gerardo Quiess", place: "Coronel Su\u00e1rez" },
  { name: "Oriana Gigena", place: "Coronel Su\u00e1rez" },
  { name: "Lic. Antonela Gros Aldecoa", place: "Coronel Su\u00e1rez" },
  { name: "Josefina Fern\u00e1ndez Allen", place: "Coronel Su\u00e1rez" },
  { name: "Lic. Mar\u00eda Laura Acebal", place: "Coronel Su\u00e1rez" },
  { name: "Lic. M. Sof\u00eda Malgeri", place: "Coronel Su\u00e1rez" }
];

function decodeHtml(text = "") {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&ntilde;/gi, "ñ");
}

function cleanText(text = "") {
  return decodeHtml(text.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function titleCasePharmacy(name = "") {
  return name
    .trim()
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function titleCasePerson(name = "") {
  const lowerWords = new Set(["de", "del", "la", "las", "los", "y"]);
  return name
    .toLocaleLowerCase("es-AR")
    .split(/\s+/)
    .filter(Boolean)
    .map(word => lowerWords.has(word) ? word : word.charAt(0).toLocaleUpperCase("es-AR") + word.slice(1))
    .join(" ");
}

function formatSpecialty(text = "") {
  return text
    .toLocaleLowerCase("es-AR")
    .replace(/\b\p{L}/gu, letter => letter.toLocaleUpperCase("es-AR"))
    .replace(/\bY\b/g, "y")
    .replace(/\bDe\b/g, "de")
    .replace(/\bDel\b/g, "del")
    .replace(/\bPor\b/g, "por");
}

function parseRadioSuarez(html) {
  const current = html.match(/<div class="farm_turno">[\s\S]*?<span>De Turno:\s*([^<]+)<\/span>[\s\S]*?<div class="farm_info">([\s\S]*?)<\/div>/i);
  if (!current) return null;
  const name = titleCasePharmacy(current[1]);
  const info = cleanText(current[2]);
  const withoutName = info.replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "");
  const parts = withoutName.split(/\s+(?=\d{5,}|Ver en el mapa|Ver todas)/i);
  const address = parts[0]?.replace(/\s*Ver en el mapa.*$/i, "").trim();
  const phone = info.match(/\b\d{5,}\b/)?.[0] || "";
  return name ? { name, address, phone, confidence: 0.95 } : null;
}

function parseTurnoAhora(html) {
  const text = cleanText(html);
  const match = text.match(/Coronel Suarez\s+(.+?)\s+(.+?)\s+Tel:\s*([0-9()\-\s]+)/i);
  if (!match) return null;
  const name = titleCasePharmacy(match[1]);
  const address = match[2].trim();
  const phone = match[3].trim();
  return name ? { name, address, phone, confidence: 0.85 } : null;
}

function normalizeForCompare(text = "") {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugify(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function choosePharmacy(results) {
  const valid = results.filter(Boolean);
  if (!valid.length) return null;
  if (valid.length === 1) return valid[0];

  const [first, second] = valid;
  if (normalizeForCompare(first.name) === normalizeForCompare(second.name)) {
    return first.address?.length >= second.address?.length ? first : { ...first, address: second.address || first.address, phone: second.phone || first.phone };
  }

  return valid.sort((a, b) => b.confidence - a.confidence)[0];
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "GuiaSuarezBot/1.0 (+https://guiasuarez.ar)"
    }
  });
  if (!response.ok) throw new Error(`Could not fetch ${url}`);
  return response.text();
}

async function handlePharmacyTurn() {
  const [radioResult, turnoResult] = await Promise.allSettled([
    fetchText(SOURCES.radioSuarez).then(parseRadioSuarez),
    fetchText(SOURCES.turnoAhora).then(parseTurnoAhora)
  ]);
  const selected = choosePharmacy([
    radioResult.status === "fulfilled" ? radioResult.value : null,
    turnoResult.status === "fulfilled" ? turnoResult.value : null
  ]);

  if (!selected) {
    return Response.json({ available: false }, { status: 503, headers: { "Cache-Control": "public, max-age=300" } });
  }

  return Response.json({
    available: true,
    name: selected.name,
    address: selected.address || "",
    phone: selected.phone || ""
  }, {
    headers: {
      "Cache-Control": "public, max-age=600"
    }
  });
}

function parseMedicalProfessionals(html) {
  const records = [];
  const pattern = /<tr class="row medico">([\s\S]*?)<\/tr>/g;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const row = match[1];
    const rawName = cleanText(row.match(/<div class="nombre">\s*<span>([^<]+)<\/span>/i)?.[1] || "")
      .replace(/^[A-ZÁÉÍÓÚÜÑ]\s+(?=[A-ZÁÉÍÓÚÜÑ])/, "");
    const name = titleCasePerson(rawName);
    const license = cleanText(row.match(/<span class="matricula">M\.:\s*([0-9]+)<\/span>/i)?.[1] || "");
    const specialties = [...row.matchAll(/<span class="espec-tag[^"]*">([^<]+)<\/span>/gi)]
      .map(item => formatSpecialty(cleanText(item[1])))
      .filter(Boolean);
    const profilePath = row.match(/href="([^"]+\/ficha)"/i)?.[1] || "";
    const profileUrl = profilePath ? new URL(profilePath, SOURCES.medicalProfessionals).toString() : "";

    if (name && license && specialties.length) {
      records.push({ name, license, specialties, profileUrl });
    }
  }

  return records;
}

function parseMedicalProfile(html, profileUrl = "") {
  const imageSrc = html.match(/<img[^>]+src="([^"]*imagen\.php[^"]+)"[^>]*class="ori-v"/i)?.[1]
    || html.match(/<img[^>]+class="ori-v"[^>]+src="([^"]+)"/i)?.[1]
    || "";
  const photoUrl = imageSrc ? new URL(imageSrc.replace(/&amp;/g, "&"), profileUrl || SOURCES.medicalProfessionals).toString() : "";
  const consultoriosBlock = html.match(/<div id="uConsultorio"[\s\S]*?<\/table>/i)?.[0] || "";
  const offices = [];
  const rowPattern = /<tr id="uConsultorio-[^"]+">([\s\S]*?)<\/tr>/g;
  let rowMatch;

  while ((rowMatch = rowPattern.exec(consultoriosBlock)) !== null) {
    const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => cleanText(cell[1]));
    const address = cells[1] || "";
    const place = cells[2] || "";
    const phone = cells[3] || "";
    if (address || phone) offices.push({ address, place, phone });
  }

  return {
    photoUrl,
    offices,
    phone: offices.find(office => office.phone)?.phone || "",
    address: offices.find(office => office.address)?.address || ""
  };
}

async function enrichMedicalProfessionals(professionals) {
  const enriched = [];
  const batchSize = 8;

  for (let index = 0; index < professionals.length; index += batchSize) {
    const batch = professionals.slice(index, index + batchSize);
    const results = await Promise.allSettled(batch.map(async professional => {
      if (!professional.profileUrl) return professional;
      const html = await fetchText(professional.profileUrl);
      return { ...professional, ...parseMedicalProfile(html, professional.profileUrl) };
    }));

    results.forEach((result, resultIndex) => {
      enriched.push(result.status === "fulfilled" ? result.value : batch[resultIndex]);
    });
  }

  return enriched;
}

async function handleMedicalProfessionals(request) {
  const url = new URL(request.url);
  const selectedSpecialty = url.searchParams.get("specialty") || "";
  const html = await fetchText(SOURCES.medicalProfessionals);
  const allProfessionals = parseMedicalProfessionals(html);
  const specialtyCounts = new Map();

  for (const professional of allProfessionals) {
    for (const specialty of professional.specialties) {
      specialtyCounts.set(specialty, (specialtyCounts.get(specialty) || 0) + 1);
    }
  }

  const specialties = [...specialtyCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([name, count]) => ({ name, count }));
  const professionals = selectedSpecialty
    ? await enrichMedicalProfessionals(allProfessionals.filter(professional => professional.specialties.includes(selectedSpecialty)))
    : allProfessionals;

  return Response.json({
    count: allProfessionals.length,
    professionals: professionals.sort((a, b) => a.name.localeCompare(b.name, "es")),
    specialties,
    sourceName: "Círculo Médico de Coronel Suárez",
    sourceUrl: SOURCES.medicalProfessionals
  }, {
    headers: {
      "Cache-Control": "public, max-age=21600"
    }
  });
}

function handleDentalProfessionals(request) {
  const url = new URL(request.url);
  const selectedPlace = url.searchParams.get("place") || "";
  const placeCounts = new Map();

  for (const professional of DENTAL_PROFESSIONALS) {
    placeCounts.set(professional.place, (placeCounts.get(professional.place) || 0) + 1);
  }

  const places = [...placeCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([name, count]) => ({ name, count }));
  const professionals = DENTAL_PROFESSIONALS
    .filter(professional => !selectedPlace || professional.place === selectedPlace)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return Response.json({
    count: DENTAL_PROFESSIONALS.length,
    professionals,
    places,
    sourceName: "Padrón de odontólogos de Coronel Suárez",
    updatedAt: "2019-09-01"
  }, {
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  });
}

function handlePsychologyProfessionals() {
  const professionals = PSYCHOLOGY_PROFESSIONALS
    .map(professional => ({
      ...professional,
      specialty: "Psicolog\u00eda"
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return Response.json({
    count: professionals.length,
    professionals,
    sourceName: "MundoPsic\u00f3logos",
    sourceUrl: SOURCES.psychologyProfessionals
  }, {
    headers: {
      "Cache-Control": "public, max-age=86400"
    }
  });
}

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);
}

function normalizeListing(row = {}) {
  return {
    ...row,
    categoryLabel: CATEGORY_LABELS[row.category] || row.category || "Actividad local",
    categoryPath: CATEGORY_PATHS[row.category] || slugify(row.category || "rubro"),
    publicSlug: slugify(row.name || row.slug || "aviso"),
    place: row.place || LOCATION_LABELS[row.location] || "Coronel Suárez",
    description: row.description || `Información de contacto de ${row.name || "esta actividad"} en Guía Suárez.`,
    phone: row.phone || "",
    address: row.address || ""
  };
}

function listingUrl(row = {}) {
  const listing = normalizeListing(row);
  return `${SITE_URL}/${listing.categoryPath}/${listing.publicSlug}`;
}

function phoneHref(phone = "") {
  const raw = String(phone).trim();
  if (!raw) return "tel:";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "tel:";
  if (raw.startsWith("+")) return `tel:+${digits}`;
  if (digits.startsWith("54")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:${digits}`;
  if (digits.length === 6) return `tel:02926${digits}`;
  if (digits.length === 10 && /^29(26|33)/.test(digits)) return `tel:0${digits}`;
  return `tel:${digits}`;
}

function categoryUrl(categoryId) {
  const path = CATEGORY_PATHS[categoryId] || slugify(categoryId);
  return `${SITE_URL}/rubro/${path}/`;
}

async function fetchPublicListings(env) {
  const supabaseUrl = env.SUPABASE_URL || SUPABASE_PUBLIC_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_PUBLIC_KEY;
  if (!supabaseUrl || !supabaseKey) return [];
  const endpoint = new URL(`${supabaseUrl}/rest/v1/listings`);
  endpoint.searchParams.set("select", "slug,name,category,tags,location,place,address,description,icon,phone,verified,active,created_at");
  endpoint.searchParams.set("active", "eq.true");
  endpoint.searchParams.set("order", "name.asc");

  let response = await fetch(endpoint, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });

  if (!response.ok && supabaseKey !== SUPABASE_PUBLIC_KEY) {
    response = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_PUBLIC_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`
      }
    });
  }

  if (!response.ok) {
    console.error("SEO listings fetch failed", response.status, await response.text());
    return [];
  }

  const rows = await response.json();
  return rows.map(normalizeListing);
}

function findListingByRoute(listings, categoryPath, publicSlug) {
  const categoryId = CATEGORY_BY_PATH[categoryPath];
  if (!categoryId) return null;
  return listings.find(listing =>
    listing.category === categoryId
    && (listing.publicSlug === publicSlug || listing.slug === publicSlug)
  ) || null;
}

function xmlEscape(text = "") {
  return String(text).replace(/[<>&'"]/g, character => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;"
  })[character]);
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function seoLayout({ title, description, canonical, h1, intro, body, schema = [] }) {
  const schemas = schema.map(jsonLd).join("\n");
  return `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <meta name="google-site-verification" content="ltwi8K7voJKEUJvIW8slyHDwxgYmyhe_NrNjAJIFLBc">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:site_name" content="Guía Suárez">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="/styles.css">
  ${schemas}
  <style>
    .seo-page { max-width: 1120px; margin: 0 auto; padding: 34px max(5vw,24px) 90px; }
    .seo-hero { display: grid; gap: 14px; padding: 36px; border: 1px solid rgba(39,109,85,.16); border-radius: 28px; background: linear-gradient(135deg,#fffdf8,#f1f8f4); }
    .seo-hero h1 { max-width: 900px; font-size: clamp(34px, 6vw, 68px); line-height: .98; letter-spacing: -2px; }
    .seo-hero p { max-width: 760px; color: #63756f; font-size: 18px; line-height: 1.65; }
    .seo-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
    .seo-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 14px; margin-top: 28px; }
    .seo-card { display: grid; gap: 9px; padding: 20px; border: 1px solid #dbe8df; border-radius: 20px; background: white; box-shadow: 0 8px 26px rgba(22,74,57,.055); }
    .seo-card h2, .seo-card h3 { margin: 0; color: #143c31; }
    .seo-card p { margin: 0; color: #63756f; line-height: 1.55; }
    .seo-meta { color: #276d55; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
    .seo-contact { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .seo-contact a { padding: 10px 12px; border: 1px solid #dbe8df; border-radius: 999px; color: #276d55; font-weight: 900; text-decoration: none; }
  </style>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Guía Suárez, inicio"><span class="brand-mark">CS</span><span>Mi <strong>Coronel Suárez</strong></span></a>
    <nav aria-label="Navegación principal"><a class="button button-outline" href="/#resultados">Visitar guía</a></nav>
  </header>
  <main class="seo-page">
    <section class="seo-hero">
      <span class="eyebrow">Guía Suárez</span>
      <h1>${escapeHtml(h1)}</h1>
      <p>${escapeHtml(intro)}</p>
      <div class="seo-actions">
        <a class="button button-primary" href="/">Buscar en la guía</a>
        <a class="button button-outline" href="/#joinDialog">Sumá tu actividad</a>
      </div>
    </section>
    ${body}
  </main>
  <footer>
    <a class="brand" href="/"><span class="brand-mark">CS</span><span>Mi <strong>Coronel Suárez</strong></span></a>
    <p>Una guía hecha por y para nuestra comunidad.</p>
    <small><a href="/privacidad.html">Privacidad</a> · <a href="/terminos.html">Términos</a> · <a href="mailto:contacto@guiasuarez.ar">Contacto</a> · Powered by Blu Software</small>
  </footer>
</body>
</html>`;
}

function localBusinessSchema(listing) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    url: listingUrl(listing),
    telephone: listing.phone || undefined,
    description: listing.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address || undefined,
      addressLocality: listing.place || "Coronel Suárez",
      addressRegion: "Buenos Aires",
      addressCountry: "AR"
    },
    areaServed: "Coronel Suárez",
    category: listing.categoryLabel
  };
  return JSON.parse(JSON.stringify(schema));
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function itemListSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: listingUrl(item)
    }))
  };
}

function renderListingSeoPage(listing) {
  const canonical = listingUrl(listing);
  const title = `${listing.name} en ${listing.place} | Guía Suárez`;
  const description = `${listing.name}: ${listing.categoryLabel} en ${listing.place}. Teléfono, WhatsApp, dirección y ficha en Guía Suárez.`;
  const contact = [
    listing.phone ? `<a href="${escapeHtml(phoneHref(listing.phone))}">Llamar</a>` : "",
    listing.phone ? `<a href="https://wa.me/54${escapeHtml(listing.phone.replace(/[^\d]/g, ""))}" rel="noopener">WhatsApp</a>` : "",
    listing.address ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.address} ${listing.place} Buenos Aires Argentina`)}" rel="noopener">Mapa</a>` : ""
  ].filter(Boolean).join("");
  const body = `<article class="seo-card" style="margin-top:28px">
    <span class="seo-meta">${escapeHtml(listing.categoryLabel)} · ${escapeHtml(listing.place)}</span>
    <h2>${escapeHtml(listing.name)}</h2>
    <p>${escapeHtml(listing.description)}</p>
    ${listing.address ? `<p><strong>Dirección:</strong> ${escapeHtml(listing.address)}</p>` : ""}
    ${listing.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(listing.phone)}</p>` : ""}
    <div class="seo-contact">${contact}</div>
  </article>
  <section class="seo-grid" aria-label="Más opciones">
    <article class="seo-card"><h3>Visitá la guía completa</h3><p>Encontrá otros comercios, profesionales y servicios de Coronel Suárez.</p><a class="text-link" href="/">Ir a Guía Suárez →</a></article>
    <article class="seo-card"><h3>Publicá gratis</h3><p>Sumá tu comercio, profesión o servicio y administralo con tu cuenta de Google.</p><a class="text-link" href="/#inicio">Sumar actividad →</a></article>
  </section>`;
  return seoLayout({
    title,
    description,
    canonical,
    h1: listing.name,
    intro: `${listing.name} está publicado en Guía Suárez, la guía local de comercios, profesionales y servicios de Coronel Suárez.`,
    body,
    schema: [
      localBusinessSchema(listing),
      breadcrumbSchema([
        { name: "Guía Suárez", url: SITE_URL },
        { name: listing.categoryLabel, url: categoryUrl(listing.category) },
        { name: listing.name, url: canonical }
      ])
    ]
  });
}

function renderCategorySeoPage(categoryId, listings) {
  const label = CATEGORY_LABELS[categoryId] || "Comercios";
  const canonical = categoryUrl(categoryId);
  const categoryListings = listings.filter(listing => listing.category === categoryId);
  const body = `<section class="seo-grid" aria-label="${escapeHtml(label)} en Coronel Suárez">
    ${categoryListings.length ? categoryListings.map(listing => `<article class="seo-card">
      <span class="seo-meta">${escapeHtml(listing.place)}</span>
      <h2><a href="${escapeHtml(listingUrl(listing))}">${escapeHtml(listing.name)}</a></h2>
      <p>${escapeHtml(listing.description)}</p>
      ${listing.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(listing.phone)}</p>` : ""}
    </article>`).join("") : `<article class="seo-card"><h2>Próximamente</h2><p>Todavía no hay avisos activos en este rubro. Podés sumar tu actividad gratis.</p></article>`}
  </section>`;
  return seoLayout({
    title: `${label} en Coronel Suárez | Guía Suárez`,
    description: `Listado de ${label.toLowerCase()} en Coronel Suárez. Encontrá teléfonos, direcciones, WhatsApp y servicios locales en Guía Suárez.`,
    canonical,
    h1: `${label} en Coronel Suárez`,
    intro: `Buscá ${label.toLowerCase()} publicados en Guía Suárez, con datos de contacto y fichas para compartir.`,
    body,
    schema: [
      itemListSchema(categoryListings),
      breadcrumbSchema([
        { name: "Guía Suárez", url: SITE_URL },
        { name: label, url: canonical }
      ])
    ]
  });
}

async function handleSitemap(env) {
  const listings = await fetchPublicListings(env);
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
    ...Object.keys(CATEGORY_PATHS).map(categoryId => ({ loc: categoryUrl(categoryId), priority: "0.8", changefreq: "weekly" })),
    ...listings.map(listing => ({ loc: listingUrl(listing), priority: "0.7", changefreq: "weekly", lastmod: listing.created_at }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(item => `  <url>
    <loc>${xmlEscape(item.loc)}</loc>
    ${item.lastmod ? `<lastmod>${xmlEscape(String(item.lastmod).slice(0, 10))}</lastmod>` : ""}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=900" } });
}

function handleRobots() {
  return new Response(`User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}

function handleLlms() {
  return new Response(`# Guía Suárez

Guía Suárez es una guía comercial gratuita y comunitaria de Coronel Suárez, Buenos Aires, Argentina.

Ayuda a vecinos y visitantes a encontrar comercios, profesionales, servicios, farmacias de turno, profesionales médicos y odontólogos locales.

URL principal: ${SITE_URL}

Secciones principales:
- Comercios por rubro
- Profesionales y servicios
- Profesionales médicos por especialidad
- Odontólogos
- Farmacia de turno
- Publicación gratuita de actividades locales

Guía Suárez permite buscar, comparar calificaciones y contactar por teléfono o WhatsApp.
`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}

async function handleSeoRoute(request, env) {
  if (!["GET", "HEAD"].includes(request.method)) return null;
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  if (!parts.length || url.pathname.includes(".")) return null;

  if (parts[0] === "rubro" && parts[1]) {
    const categoryId = CATEGORY_BY_PATH[parts[1]];
    if (!categoryId) return null;
    const listings = await fetchPublicListings(env);
    return new Response(renderCategorySeoPage(categoryId, listings), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" }
    });
  }

  if (parts.length === 2 && CATEGORY_BY_PATH[parts[0]]) {
    const listings = await fetchPublicListings(env);
    const listing = findListingByRoute(listings, parts[0], parts[1]);
    if (!listing) return null;
    return new Response(renderListingSeoPage(listing), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" }
    });
  }

  return null;
}

function formatField(label, value) {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function getWebhookSecret(request) {
  const authorization = request.headers.get("Authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) return authorization.slice(7).trim();
  const url = new URL(request.url);
  return request.headers.get("x-webhook-secret")
    || request.headers.get("x-supabase-webhook-secret")
    || url.searchParams.get("secret")
    || "";
}

function normalizeWebhookTable(table = "") {
  return String(table)
    .split(".")
    .filter(Boolean)
    .pop()
    ?.trim()
    .toLowerCase() || "";
}

async function fetchListingById(env, listingId) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !listingId) return null;
  const endpoint = new URL(`${env.SUPABASE_URL}/rest/v1/listings`);
  endpoint.searchParams.set("select", "slug,name,category,place,address,phone");
  endpoint.searchParams.set("id", `eq.${listingId}`);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  if (!response.ok) return null;
  const rows = await response.json();
  return rows[0] || null;
}

async function sendNotificationEmail(env, { subject, html, text }) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO || !env.NOTIFY_FROM) {
    throw new Error("Email notifications are not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM,
      to: [env.NOTIFY_TO],
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function listingEmail(record = {}) {
  const category = CATEGORY_LABELS[record.category] || record.category || "";
  const title = record.name || "Nuevo aviso";
  const categoryPath = CATEGORY_PATHS[record.category] || record.category || "";
  const publicSlug = slugify(record.name || record.slug || "");
  const url = publicSlug && categoryPath ? `https://guiasuarez.ar/${categoryPath}/${publicSlug}` : "https://guiasuarez.ar";
  const html = `
    <h1>Nuevo aviso publicado en Guía Suárez</h1>
    ${formatField("Actividad", title)}
    ${formatField("Rubro", category)}
    ${formatField("Localidad", record.place || record.location)}
    ${formatField("Dirección", record.address)}
    ${formatField("Teléfono/WhatsApp", record.phone)}
    ${formatField("Descripción", record.description)}
    <p><a href="${url}">Ver en Guía Suárez</a></p>
  `;
  const text = [
    "Nuevo aviso publicado en Guía Suárez",
    `Actividad: ${title}`,
    category ? `Rubro: ${category}` : "",
    record.place ? `Localidad: ${record.place}` : "",
    record.address ? `Dirección: ${record.address}` : "",
    record.phone ? `Teléfono/WhatsApp: ${record.phone}` : "",
    record.description ? `Descripción: ${record.description}` : "",
    `Ver: ${url}`
  ].filter(Boolean).join("\n");

  return {
    subject: `Nuevo aviso en Guía Suárez: ${title}`,
    html,
    text
  };
}

async function reviewEmail(env, record = {}) {
  const listing = await fetchListingById(env, record.listing_id);
  const listingName = listing?.name || "un aviso";
  const categoryPath = CATEGORY_PATHS[listing?.category] || listing?.category || "";
  const publicSlug = slugify(listingName);
  const url = publicSlug && categoryPath ? `https://guiasuarez.ar/${categoryPath}/${publicSlug}` : "https://guiasuarez.ar";
  const html = `
    <h1>Nueva calificación en Guía Suárez</h1>
    ${formatField("Aviso", listingName)}
    ${formatField("Calificación", record.rating ? `${record.rating}/5` : "")}
    ${formatField("Comentario", record.comment)}
    <p><a href="${url}">Ver en Guía Suárez</a></p>
  `;
  const text = [
    "Nueva calificación en Guía Suárez",
    `Aviso: ${listingName}`,
    record.rating ? `Calificación: ${record.rating}/5` : "",
    record.comment ? `Comentario: ${record.comment}` : "",
    `Ver: ${url}`
  ].filter(Boolean).join("\n");

  return {
    subject: `Nueva calificación en Guía Suárez: ${listingName}`,
    html,
    text
  };
}

async function handleSupabaseNotify(request, env) {
  try {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    if (!env.NOTIFY_WEBHOOK_SECRET || getWebhookSecret(request) !== env.NOTIFY_WEBHOOK_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const table = normalizeWebhookTable(payload.table || payload.table_name || payload.relation);
    const type = (payload.type || payload.eventType || payload.event || "").toUpperCase();
    const record = payload.record || payload.new || payload.new_record || payload.data?.record || payload.data?.new || {};

    if (type && type !== "INSERT") {
      return Response.json({ ok: true, skipped: "Only INSERT events are notified." });
    }

    let email;
    if (table === "listings") {
      email = listingEmail(record);
    } else if (table === "reviews") {
      email = await reviewEmail(env, record);
    } else {
      return Response.json({ ok: true, skipped: `No notification configured for ${table || "unknown table"}.` });
    }

    await sendNotificationEmail(env, email);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Notification webhook failed", error);
    return Response.json({
      ok: false,
      error: error?.message || "Notification webhook failed"
    }, { status: 500 });
  }
}

async function handleVisitCount(request, env) {
  if (!["GET", "POST"].includes(request.method)) {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  const supabaseUrl = env.SUPABASE_URL || SUPABASE_PUBLIC_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_PUBLIC_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ available: false, step: "missing_supabase_env" }, { status: 503 });
  }

  if (request.method === "POST") {
    const endpoint = new URL(`${supabaseUrl}/rest/v1/rpc/increment_site_visit`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ stat_key: "visits" })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Visit counter increment failed", response.status, detail);
      return Response.json({ available: false, step: "increment_failed", status: response.status, detail: detail.slice(0, 240) }, { status: 503 });
    }

    const count = await response.json();
    return Response.json({ count: Number(count) || 0 }, { headers: { "Cache-Control": "no-store" } });
  }

  const endpoint = new URL(`${supabaseUrl}/rest/v1/site_stats`);
  endpoint.searchParams.set("select", "count");
  endpoint.searchParams.set("key", "eq.visits");
  endpoint.searchParams.set("limit", "1");
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Visit counter read failed", response.status, detail);
    return Response.json({ available: false, step: "read_failed", status: response.status, detail: detail.slice(0, 240) }, { status: 503 });
  }

  const rows = await response.json();
  return Response.json({ count: Number(rows[0]?.count || 0) }, { headers: { "Cache-Control": "public, max-age=60" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/robots.txt") {
      return handleRobots();
    }
    if (url.pathname === "/llms.txt") {
      return handleLlms();
    }
    if (url.pathname === "/sitemap.xml") {
      return handleSitemap(env);
    }
    if (url.pathname === "/api/pharmacy-turn") {
      return handlePharmacyTurn();
    }
    if (url.pathname === "/api/medical-professionals") {
      return handleMedicalProfessionals(request);
    }
    if (url.pathname === "/api/dental-professionals") {
      return handleDentalProfessionals(request);
    }
    if (url.pathname === "/api/psychology-professionals") {
      return handlePsychologyProfessionals();
    }
    if (url.pathname === "/api/supabase-notify") {
      return handleSupabaseNotify(request, env);
    }
    if (url.pathname === "/api/visit-count") {
      return handleVisitCount(request, env);
    }
    const seoResponse = await handleSeoRoute(request, env);
    if (seoResponse) return seoResponse;
    const assetRequest = ["GET", "HEAD"].includes(request.method)
      && !url.pathname.includes(".")
      && url.pathname !== "/"
        ? new Request(new URL("/", url.origin), {
          method: request.method,
          headers: request.headers
        })
        : request;
    const response = await env.ASSETS.fetch(assetRequest);
    const headers = new Headers(response.headers);

    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
