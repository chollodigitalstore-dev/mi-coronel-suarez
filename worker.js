const SOURCES = {
  radioSuarez: "https://www.lanuevaradiosuarez.com.ar/farmacias-de-turno.html",
  turnoAhora: "https://www.farmaciadeturnoahora.com.ar/de-turno/buenos-aires/coronel-suarez"
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/pharmacy-turn") {
      return handlePharmacyTurn();
    }

    const response = await env.ASSETS.fetch(request);
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
