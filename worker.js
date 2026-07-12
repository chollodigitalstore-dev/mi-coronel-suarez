const SOURCES = {
  radioSuarez: "https://www.lanuevaradiosuarez.com.ar/farmacias-de-turno.html",
  turnoAhora: "https://www.farmaciadeturnoahora.com.ar/de-turno/buenos-aires/coronel-suarez",
  medicalProfessionals: "https://www.circulomedicocoronelsuarez.com.ar/padron/"
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

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);
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
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ available: false, step: "missing_supabase_env" }, { status: 503 });
  }

  if (request.method === "POST") {
    const endpoint = new URL(`${env.SUPABASE_URL}/rest/v1/rpc/increment_site_visit`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
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

  const endpoint = new URL(`${env.SUPABASE_URL}/rest/v1/site_stats`);
  endpoint.searchParams.set("select", "count");
  endpoint.searchParams.set("key", "eq.visits");
  endpoint.searchParams.set("limit", "1");
  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
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
    if (url.pathname === "/api/pharmacy-turn") {
      return handlePharmacyTurn();
    }
    if (url.pathname === "/api/medical-professionals") {
      return handleMedicalProfessionals(request);
    }
    if (url.pathname === "/api/supabase-notify") {
      return handleSupabaseNotify(request, env);
    }
    if (url.pathname === "/api/visit-count") {
      return handleVisitCount(request, env);
    }
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
