import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const SITE_URL = "https://guiasuarez.ar";

const categories = [
  { id: "hogar", name: "Hogar y oficios", icon: "🛠️" },
  { id: "belleza", name: "Belleza y bienestar", icon: "✦" },
  { id: "salud", name: "Salud", icon: "✚" },
  { id: "gastronomia", name: "Gastronomía", icon: "🍴" },
  { id: "comercios", name: "Comercios", icon: "🛍️" },
  { id: "automotor", name: "Automotor", icon: "🚙" },
  { id: "profesionales", name: "Profesionales", icon: "💼" },
  { id: "mascotas", name: "Mascotas", icon: "🐾" },
  { id: "eventos", name: "Eventos", icon: "🎈" },
  { id: "educacion", name: "Educación", icon: "📚" },
  { id: "tecnologia", name: "Tecnología", icon: "💻" },
  { id: "turismo", name: "Turismo y ocio", icon: "☀️" }
];

const locationLabels = {
  "coronel-suarez": "Coronel Suárez",
  "huanguelen": "Huanguelén",
  "pueblo-san-jose": "Pueblo San José",
  "pueblo-santa-maria": "Pueblo Santa María",
  "pueblo-santa-trinidad": "Pueblo Santa Trinidad"
};

let listings = [
  { slug: "carpinteria-el-roble", name: "Carpintería El Roble", category: "hogar", tags: "carpintero muebles madera arreglos", location: "coronel-suarez", place: "Coronel Suárez", icon: "🪵", phone: "2926 000001", whatsapp: "542926000001", verified: true },
  { slug: "estudio-norte", name: "Estudio Norte", category: "profesionales", tags: "arquitectura planos construcción profesional", location: "coronel-suarez", place: "Coronel Suárez", icon: "📐", phone: "2926 000002", whatsapp: "542926000002", verified: true },
  { slug: "manos-bonitas", name: "Manos Bonitas", category: "belleza", tags: "manicura uñas belleza pedicura", location: "pueblo-san-jose", place: "Pueblo San José", icon: "💅", phone: "2926 000003", whatsapp: "542926000003", verified: true },
  { slug: "sabores-de-casa", name: "Sabores de Casa", category: "gastronomia", tags: "comida viandas pastas caseras", location: "huanguelen", place: "Huanguelén", icon: "🥟", phone: "2926 000004", whatsapp: "542926000004", verified: false },
  { slug: "electro-suarez", name: "Electro Suárez", category: "hogar", tags: "electricista electricidad instalaciones urgencias", location: "pueblo-santa-trinidad", place: "Pueblo Santa Trinidad", icon: "⚡", phone: "2926 000005", whatsapp: "542926000005", verified: true },
  { slug: "veterinaria-la-comarca", name: "Veterinaria La Comarca", category: "mascotas", tags: "veterinaria mascotas alimento perros gatos", location: "coronel-suarez", place: "Coronel Suárez", icon: "🐕", phone: "2926 000006", whatsapp: "542926000006", verified: true }
];

const categoryGrid = document.querySelector("#categoryGrid");
const listingGrid = document.querySelector("#listingGrid");
const searchInput = document.querySelector("#searchInput");
const locationSelect = document.querySelector("#locationSelect");
const resultsTitle = document.querySelector("#resultsTitle");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const dialog = document.querySelector("#joinDialog");
const joinForm = document.querySelector("#joinForm");
const joinAuthGate = document.querySelector("#joinAuthGate");
const joinDialogIntro = document.querySelector("#joinDialogIntro");
const joinDialogTitle = document.querySelector("#joinDialogTitle");
const formSuccess = document.querySelector("#formSuccess");
const viewPublishedListing = document.querySelector("#viewPublishedListing");
const closeJoinDialog = document.querySelector("#closeJoinDialog");
const reviewDialog = document.querySelector("#reviewDialog");
const reviewForm = document.querySelector("#reviewForm");
const userMenu = document.querySelector("#userMenu");
const publishResume = document.querySelector("#publishResume");
const authWarning = document.querySelector("#authWarning");

let activeCategory = null;
let expandedCategories = false;
let currentUser = null;
let ratingStats = {};
let lastPublishedSlug = null;

function normalize(text = "") {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function slugify(text) {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || `aviso-${Date.now()}`;
}

function categoryById(id) {
  return categories.find(category => category.id === id);
}

function phoneHref(phone = "") {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function whatsappHref(item) {
  const phone = item.whatsapp || `54${(item.phone || "").replace(/[^\d]/g, "")}`;
  const text = encodeURIComponent(`Hola, te encontré en Guía Suárez y quería consultar por ${item.name}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

function mapsHref(item) {
  const query = encodeURIComponent(`${item.name} ${item.place} Buenos Aires Argentina`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function hydrateListing(item) {
  return {
    ...item,
    tags: Array.isArray(item.tags) ? item.tags.join(" ") : (item.tags || ""),
    place: item.place || locationLabels[item.location] || "Coronel Suárez",
    icon: item.icon || categoryById(item.category)?.icon || "•",
    whatsapp: item.phone ? `54${item.phone.replace(/[^\d]/g, "")}` : ""
  };
}

function renderCategories() {
  const visible = expandedCategories ? categories : categories.slice(0, 6);
  categoryGrid.innerHTML = visible.map(category => {
    const count = listings.filter(item => item.category === category.id && item.active !== false).length;
    return `<button class="category-card ${activeCategory === category.id ? "active" : ""}" data-category="${category.id}">
      <span class="category-icon">${category.icon}</span><strong>${category.name}</strong><small>${count || "Próximamente"}</small>
    </button>`;
  }).join("");
}

function renderListings() {
  const query = normalize(searchInput.value.trim());
  const location = locationSelect.value;
  const filtered = listings.filter(item => {
    const categoryName = categoryById(item.category)?.name || item.category;
    const haystack = normalize(`${item.name} ${item.tags} ${categoryName}`);
    return item.active !== false
      && (!query || haystack.includes(query))
      && (!activeCategory || item.category === activeCategory)
      && (location === "todas" || item.location === location);
  });

  listingGrid.innerHTML = filtered.map(item => {
    const category = categoryById(item.category)?.name || item.category;
    const stats = ratingStats[item.slug];
    const rating = stats
      ? `<span class="rating-summary">★ ${Number(stats.average_rating).toFixed(1)} · ${stats.review_count} opiniones</span>`
      : '<span class="rating-summary">Sin opiniones todavía</span>';

    return `<article class="listing-card" aria-label="${item.name} en ${item.place}">
      <div class="listing-cover" role="img" aria-label="${category}: ${item.name}"><span>${item.icon}</span>${item.verified ? '<span class="verified">✓ Verificado</span>' : ""}</div>
      <div class="listing-body"><span class="listing-category">${category}</span><h3>${item.name}</h3>${rating}
      <div class="listing-meta"><span>⌖ ${item.place}</span><span>● Abierto hoy</span></div>
      <div class="listing-actions" aria-label="Acciones rápidas">
        <a href="${phoneHref(item.phone)}" aria-label="Llamar a ${item.name}"><span>☎</span>Llamar</a>
        <a href="${whatsappHref(item)}" target="_blank" rel="noopener" aria-label="Enviar WhatsApp a ${item.name}"><span>☘</span>WhatsApp</a>
        <a href="${mapsHref(item)}" target="_blank" rel="noopener" aria-label="Ver ${item.name} en Google Maps"><span>⌖</span>Mapa</a>
      </div>
      <button class="review-action" data-review="${item.slug}" data-name="${item.name}">★ Calificar servicio</button></div>
    </article>`;
  }).join("");

  const hasFilter = query || activeCategory || location !== "todas";
  resultsTitle.textContent = hasFilter ? "Resultados de tu búsqueda" : "Comercios y servicios destacados en Coronel Suárez";
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}`;
  emptyState.hidden = filtered.length > 0;
  listingGrid.hidden = filtered.length === 0;
}

async function loadListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("slug,name,category,tags,location,place,icon,phone,verified,active,owner_id")
    .order("created_at", { ascending: false });

  if (!error && data?.length) listings = data.map(hydrateListing);
  renderCategories();
  renderListings();
}

function renderJoinDialogState() {
  const isLoggedIn = Boolean(currentUser);
  const rememberedIntent = readRememberedIntent();
  joinAuthGate.hidden = isLoggedIn;
  joinForm.hidden = !isLoggedIn;
  formSuccess.hidden = true;
  if (!isLoggedIn && rememberedIntent === "review") {
    joinDialogTitle.textContent = "Ingresá para calificar";
    joinDialogIntro.textContent = "Para dejar una reseña necesitás ingresar con Google. Así las opiniones quedan asociadas a vecinos identificados.";
    return;
  }
  joinDialogTitle.textContent = isLoggedIn ? "Panel de publicación" : "Publicá tu actividad con Google";
  joinDialogIntro.textContent = isLoggedIn
    ? "Ya estás identificado. Cargá tu comercio, profesión o servicio; quedará asociado a tu cuenta para poder administrarlo."
    : "Para publicar en Guía Suárez necesitás ingresar con Google. Así cuidamos la calidad de los datos y evitamos publicaciones anónimas.";
}

function rememberIntent(intent) {
  localStorage.setItem("pendingIntent", JSON.stringify({
    intent,
    createdAt: Date.now()
  }));
  document.cookie = `pendingIntent=${encodeURIComponent(intent)}; max-age=600; path=/; SameSite=Lax; Secure`;
}

function readCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function readRememberedIntent() {
  const cookieIntent = decodeURIComponent(readCookie("pendingIntent") || "") || null;
  try {
    const stored = JSON.parse(localStorage.getItem("pendingIntent") || "null");
    if (!stored?.intent || Date.now() - stored.createdAt > 10 * 60 * 1000) {
      localStorage.removeItem("pendingIntent");
      return cookieIntent;
    }
    return stored.intent;
  } catch (_error) {
    localStorage.removeItem("pendingIntent");
    return cookieIntent;
  }
}

function clearRememberedIntent() {
  localStorage.removeItem("pendingIntent");
  document.cookie = "pendingIntent=; max-age=0; path=/; SameSite=Lax; Secure";
}

function rememberReviewIntent(slug, name) {
  rememberIntent("review");
  localStorage.setItem("pendingReview", JSON.stringify({ slug, name }));
}

function readRememberedReview() {
  try {
    return JSON.parse(localStorage.getItem("pendingReview") || "null");
  } catch (_error) {
    localStorage.removeItem("pendingReview");
    return null;
  }
}

function openReviewDialog(slug, name) {
  reviewForm.reset();
  document.querySelector("#reviewSuccess").hidden = true;
  reviewForm.hidden = false;
  document.querySelector("#reviewListingSlug").value = slug;
  document.querySelector("#reviewBusinessName").textContent = `Calificá ${name}`;
  reviewDialog.showModal();
}

function continuePendingIntent() {
  const params = new URLSearchParams(window.location.search);
  const urlIntent = params.get("intent") || params.get("publish");
  const pendingIntent = readRememberedIntent() || urlIntent;

  if (pendingIntent === "review" && currentUser) {
    const pendingReview = readRememberedReview();
    clearRememberedIntent();
    localStorage.removeItem("pendingReview");
    if (urlIntent) window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    if (pendingReview?.slug && pendingReview?.name) openReviewDialog(pendingReview.slug, pendingReview.name);
    return;
  }

  if (pendingIntent === "publish" && currentUser) {
    clearRememberedIntent();
    if (urlIntent) window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    renderJoinDialogState();
    if (!dialog.open) dialog.showModal();
  }
}

function openPublishDialogAfterLogin() {
  if (!currentUser || dialog.open || reviewDialog.open) return;
  renderJoinDialogState();
  dialog.showModal();
}

async function completeOAuthRedirectIfNeeded() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const error = params.get("error") || params.get("error_code");
  const errorDescription = params.get("error_description");

  if (error) {
    showToast(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, " ")) : "No pudimos completar el ingreso con Google.");
    return;
  }

  if (!code) return;

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    showToast("Google volvió correctamente, pero no pudimos crear la sesión. Revisemos Supabase Auth.");
    return;
  }

  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("code");
  window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
}

async function signInWithGoogle() {
  const intent = readRememberedIntent() || "publish";
  rememberIntent(intent);
  const params = new URLSearchParams({ intent });
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${SITE_URL}/?${params}` }
  });
  if (error) showToast("No pudimos iniciar sesión. Probá nuevamente.");
}

function renderUser(user) {
  currentUser = user;
  userMenu.hidden = !user;
  if (publishResume) publishResume.hidden = !user;
  if (authWarning && user) authWarning.hidden = true;
  renderJoinDialogState();
  if (!user) return;
  document.querySelector("#userName").textContent = user.user_metadata?.full_name?.split(" ")[0] || "Usuario";
  document.querySelector("#userAvatar").src = user.user_metadata?.avatar_url || "";
}

async function loadRatings() {
  const { data, error } = await supabase.from("listing_ratings").select("slug,average_rating,review_count");
  if (error) return;
  ratingStats = Object.fromEntries(data.map(row => [row.slug, row]));
  renderListings();
}

categoryGrid.addEventListener("click", event => {
  const card = event.target.closest("[data-category]");
  if (!card) return;
  activeCategory = activeCategory === card.dataset.category ? null : card.dataset.category;
  renderCategories();
  renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#showAllCategories").addEventListener("click", event => {
  expandedCategories = !expandedCategories;
  event.currentTarget.textContent = expandedCategories ? "Ver menos ↑" : "Ver todos los rubros →";
  renderCategories();
});

document.querySelector("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  activeCategory = null;
  renderCategories();
  renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => {
  searchInput.value = button.dataset.query;
  activeCategory = null;
  renderCategories();
  renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
}));

locationSelect.addEventListener("change", renderListings);
document.querySelector("#clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  locationSelect.value = "todas";
  activeCategory = null;
  renderCategories();
  renderListings();
});

document.querySelectorAll("[data-open-form]").forEach(button => button.addEventListener("click", () => {
  rememberIntent("publish");
  renderJoinDialogState();
  dialog.showModal();
}));

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
closeJoinDialog?.addEventListener("click", () => dialog.close());
viewPublishedListing?.addEventListener("click", () => {
  dialog.close();
  if (lastPublishedSlug) {
    searchInput.value = listings.find(item => item.slug === lastPublishedSlug)?.name || "";
    activeCategory = null;
    locationSelect.value = "todas";
    renderCategories();
    renderListings();
  }
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#joinLoginButton").addEventListener("click", signInWithGoogle);
document.querySelector("#logoutButton").addEventListener("click", async () => {
  await supabase.auth.signOut();
  renderUser(null);
});

joinForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!currentUser) {
    showToast("Ingresá con Google para publicar tu actividad.");
    return;
  }

  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  const formData = new FormData(event.currentTarget);
  const name = String(formData.get("name")).trim();
  const category = String(formData.get("category"));
  const location = String(formData.get("location"));
  const phone = String(formData.get("phone")).trim();
  const categoryInfo = categoryById(category);

  submitButton.disabled = true;
  submitButton.textContent = "Publicando...";

  const { data, error } = await supabase
    .from("listings")
    .insert({
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      name,
      category,
      tags: [name, categoryInfo?.name || category],
      location,
      place: locationLabels[location] || "Coronel Suárez",
      icon: categoryInfo?.icon || "•",
      phone,
      verified: false,
      active: true,
      owner_id: currentUser.id
    })
    .select("slug,name,category,tags,location,place,icon,phone,verified,active,owner_id")
    .single();

  submitButton.disabled = false;
  submitButton.textContent = "Publicar aviso";

  if (error) {
    console.error("Supabase listing insert error", error);
    showToast(`No pudimos publicar el aviso: ${error.message || "revisá Supabase"}`);
    return;
  }

  listings.unshift(hydrateListing(data));
  lastPublishedSlug = data.slug;
  event.currentTarget.reset();
  joinForm.hidden = true;
  formSuccess.hidden = false;
  renderCategories();
  renderListings();
  showToast("Tu aviso ya está publicado en la guía.");
});

listingGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-review]");
  if (!button) return;
  if (!currentUser) {
    showToast("Ingresá con Google para dejar una calificación.");
    rememberReviewIntent(button.dataset.review, button.dataset.name);
    renderJoinDialogState();
    dialog.showModal();
    return;
  }
  openReviewDialog(button.dataset.review, button.dataset.name);
});

document.querySelector(".review-close").addEventListener("click", () => reviewDialog.close());
reviewForm.addEventListener("submit", async event => {
  event.preventDefault();
  const slug = document.querySelector("#reviewListingSlug").value;
  const { data: listing, error: listingError } = await supabase.from("listings").select("id").eq("slug", slug).single();
  if (listingError) {
    showToast("No pudimos encontrar esta actividad.");
    return;
  }
  const rating = Number(new FormData(reviewForm).get("rating"));
  const comment = document.querySelector("#reviewComment").value.trim() || null;
  const { error } = await supabase.from("reviews").upsert(
    { listing_id: listing.id, user_id: currentUser.id, rating, comment },
    { onConflict: "listing_id,user_id" }
  );
  if (error) {
    showToast("No pudimos guardar la opinión.");
    return;
  }
  reviewForm.hidden = true;
  document.querySelector("#reviewSuccess").hidden = false;
  await loadRatings();
});

function renderCurrentDate() {
  const currentDate = document.querySelector("#currentDate");
  if (!currentDate) return;
  const formatted = new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(new Date());
  currentDate.textContent = formatted.replace(".", "");
}

function weatherIcon(code = 0) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

async function loadWeather() {
  const weatherWidget = document.querySelector("#weatherWidget");
  const weatherText = document.querySelector("#weatherText");
  const weatherIconElement = document.querySelector("#weatherIcon");
  if (!weatherWidget || !weatherText || !weatherIconElement) return;

  try {
    const params = new URLSearchParams({
      latitude: "-37.4547",
      longitude: "-61.9334",
      current: "temperature_2m,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,weather_code",
      forecast_days: "2",
      timezone: "America/Argentina/Buenos_Aires"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error("Weather request failed");
    const weather = await response.json();
    const currentTemp = Math.round(weather.current?.temperature_2m);
    const tomorrowMax = Math.round(weather.daily?.temperature_2m_max?.[1]);
    const tomorrowMin = Math.round(weather.daily?.temperature_2m_min?.[1]);
    const icon = weatherIcon(weather.current?.weather_code);
    if ([currentTemp, tomorrowMax, tomorrowMin].some(Number.isNaN)) throw new Error("Weather data incomplete");
    weatherIconElement.textContent = icon;
    weatherText.textContent = `Ahora ${currentTemp}° · Mañana ${tomorrowMin}°/${tomorrowMax}°`;
    weatherWidget.title = "Clima de Coronel Suárez · Fuente: Open-Meteo";
  } catch (_error) {
    weatherIconElement.textContent = "🌡️";
    weatherText.textContent = "Clima no disponible";
  }
}

async function loadPharmacyShift() {
  const pharmacyWidget = document.querySelector("#pharmacyWidget");
  const pharmacyHeaderText = document.querySelector("#pharmacyHeaderText");
  if (!pharmacyWidget || !pharmacyHeaderText) return;

  try {
    const response = await fetch("/api/pharmacy-turn");
    if (!response.ok) throw new Error("No current pharmacy shift");
    const data = await response.json();
    if (!data?.name) throw new Error("No current pharmacy shift");
    const addressText = data.address ? ` · ${data.address}` : "";
    pharmacyHeaderText.textContent = `${data.name}${addressText}`;
    pharmacyWidget.title = "Farmacia de turno. Confirmá telefónicamente antes de acercarte.";
  } catch (_error) {
    pharmacyHeaderText.textContent = "Farmacia de turno no disponible";
    pharmacyWidget.title = "No pudimos consultar la farmacia de turno en este momento.";
  }
}

const supportFab = document.querySelector("#supportFab");
const supportPanel = document.querySelector("#supportPanel");
const supportClose = document.querySelector("#supportClose");
const supportAnswer = document.querySelector("#supportAnswer");
const helpTopics = {
  auth: {
    title: "Cómo ingresar con Google",
    body: "Tocá “Ingresar con Google”, elegí tu cuenta y aceptá el acceso. Usamos tu identidad para publicar, editar avisos y dejar reseñas; tu correo no se muestra públicamente."
  },
  publish: {
    title: "Cómo publicar una actividad",
    body: "Ingresá con Google y tocá “Sumá tu actividad”. Completá nombre, rubro y teléfono. La publicación básica será gratis para siempre y quedará asociada a tu cuenta para que puedas administrarla."
  },
  review: {
    title: "Cómo calificar un servicio",
    body: "Buscá la actividad, tocá “Calificar”, ingresá con Google si todavía no lo hiciste y dejá de 1 a 5 estrellas. Podés sumar un comentario respetuoso para ayudar a otros vecinos."
  },
  manage: {
    title: "Cómo modificar o pausar mi aviso",
    body: "La idea es que cada aviso quede vinculado a quien lo publicó. Desde tu cuenta vas a poder editar datos, pausar la publicación o pedir la baja. Esta sección de administración será el próximo paso."
  },
  reputation: {
    title: "Cómo funciona la reputación",
    body: "La reputación se construye con calificaciones de usuarios identificados. La publicidad puede dar visibilidad, pero no mejora el puntaje: las opiniones y la confianza de la ficha son independientes."
  }
};

function toggleSupportPanel(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : supportPanel.hidden;
  supportPanel.hidden = !shouldOpen;
  supportFab.setAttribute("aria-expanded", String(shouldOpen));
}

supportFab.addEventListener("click", () => toggleSupportPanel());
supportClose.addEventListener("click", () => toggleSupportPanel(false));
supportPanel.addEventListener("click", event => {
  const button = event.target.closest("[data-help-topic]");
  if (!button) return;
  const topic = helpTopics[button.dataset.helpTopic];
  if (!topic) return;
  supportPanel.querySelectorAll("[data-help-topic]").forEach(item => item.classList.toggle("active", item === button));
  supportAnswer.innerHTML = `<h3>${topic.title}</h3><p>${topic.body}</p>`;
});

await completeOAuthRedirectIfNeeded();

const { data: { session } } = await supabase.auth.getSession();
renderUser(session?.user || null);
continuePendingIntent();
supabase.auth.onAuthStateChange((event, nextSession) => {
  renderUser(nextSession?.user || null);
  continuePendingIntent();
  if (event === "SIGNED_IN" && !readRememberedIntent()) {
    openPublishDialogAfterLogin();
  }
});

const initialQuery = new URLSearchParams(window.location.search).get("q");
if (initialQuery) searchInput.value = initialQuery;

window.setTimeout(async () => {
  const { data: { session: delayedSession } } = await supabase.auth.getSession();
  if (!delayedSession?.user && readRememberedIntent() && authWarning) {
    authWarning.hidden = false;
  }
}, 1800);

await loadListings();
await loadRatings();
renderCurrentDate();
loadWeather();
loadPharmacyShift();
