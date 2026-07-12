import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const SITE_URL = "https://guiasuarez.ar";

const categories = [
  { id: "automotor", name: "Automotor", icon: "🚙", path: "automotor" },
  { id: "belleza", name: "Belleza y bienestar", icon: "✦", path: "belleza-y-bienestar" },
  { id: "comercios", name: "Comercios", icon: "🛍️", path: "comercios" },
  { id: "educacion", name: "Educación", icon: "📚", path: "educacion" },
  { id: "eventos", name: "Eventos", icon: "🎈", path: "eventos" },
  { id: "gastronomia", name: "Gastronomía", icon: "🍴", path: "gastronomia" },
  { id: "hogar", name: "Hogar y oficios", icon: "🛠️", path: "hogar-y-oficios" },
  { id: "mascotas", name: "Mascotas", icon: "🐾", path: "mascotas" },
  { id: "profesionales", name: "Profesionales", icon: "💼", path: "profesionales" },
  { id: "salud", name: "Salud", icon: "✚", path: "salud" },
  { id: "servicios", name: "Servicios", icon: "🤝", path: "servicios" },
  { id: "tecnologia", name: "Tecnología", icon: "💻", path: "tecnologia" },
  { id: "turismo", name: "Turismo y ocio", icon: "☀️", path: "turismo-y-ocio" }
];

const locationLabels = {
  "coronel-suarez": "Coronel Suárez",
  "huanguelen": "Huanguelén",
  "pueblo-san-jose": "Pueblo San José",
  "pueblo-santa-maria": "Pueblo Santa María",
  "pueblo-santa-trinidad": "Pueblo Santa Trinidad"
};

let listings = [];

const categoryGrid = document.querySelector("#categoryGrid");
const listingGrid = document.querySelector("#listingGrid");
const searchInput = document.querySelector("#searchInput");
const locationSelect = document.querySelector("#locationSelect");
const resultsTitle = document.querySelector("#resultsTitle");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const listingRouteHero = document.querySelector("#listingRouteHero");
const listingRouteTitle = document.querySelector("#listingRouteTitle");
const listingRouteIntro = document.querySelector("#listingRouteIntro");
const dialog = document.querySelector("#joinDialog");
const joinForm = document.querySelector("#joinForm");
const joinAuthGate = document.querySelector("#joinAuthGate");
const joinDialogIntro = document.querySelector("#joinDialogIntro");
const joinDialogTitle = document.querySelector("#joinDialogTitle");
const formSuccess = document.querySelector("#formSuccess");
const viewPublishedListing = document.querySelector("#viewPublishedListing");
const closeJoinDialog = document.querySelector("#closeJoinDialog");
const manageDialog = document.querySelector("#manageDialog");
const manageListingsButton = document.querySelector("#manageListingsButton");
const manageListingsList = document.querySelector("#manageListingsList");
const emptyManageListings = document.querySelector("#emptyManageListings");
const reviewDialog = document.querySelector("#reviewDialog");
const reviewForm = document.querySelector("#reviewForm");
const userMenu = document.querySelector("#userMenu");
const medicalCount = document.querySelector("#medicalCount");
const medicalSpecialtySelect = document.querySelector("#medicalSpecialtySelect");
const medicalListHeading = document.querySelector("#medicalListHeading");
const medicalGrid = document.querySelector("#medicalGrid");
const visitCounter = document.querySelector("#visitCounter");

let activeCategory = null;
let expandedCategories = false;
let currentUser = null;
let ratingStats = {};
let lastPublishedSlug = null;
let editingListingSlug = null;
let listingDescriptionAvailable = true;
let routeListingSlug = null;
let medicalProfessionals = [];
let selectedMedicalSpecialty = "";

const LISTING_SELECT_FIELDS = "slug,name,category,tags,location,place,address,description,icon,phone,verified,active,owner_id";
const LISTING_SELECT_FIELDS_LEGACY = "slug,name,category,tags,location,place,address,icon,phone,verified,active,owner_id";
const OWNER_LISTING_SELECT_FIELDS = "slug,name,category,location,place,address,description,phone,icon,active";
const OWNER_LISTING_SELECT_FIELDS_LEGACY = "slug,name,category,location,place,address,phone,icon,active";
const EDIT_LISTING_SELECT_FIELDS = "slug,name,category,location,place,address,description,phone,icon,active,verified,owner_id,tags";
const EDIT_LISTING_SELECT_FIELDS_LEGACY = "slug,name,category,location,place,address,phone,icon,active,verified,owner_id,tags";

function normalize(text = "") {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function slugify(text) {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || `aviso-${Date.now()}`;
}

function escapeHtml(text = "") {
  return text.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);
}

function categoryById(id) {
  return categories.find(category => category.id === id);
}

function categoryByPath(path) {
  return categories.find(category => category.path === path);
}

function listingUrl(item) {
  const categoryPath = categoryById(item.category)?.path || slugify(item.category || "rubro");
  return `${SITE_URL}/${categoryPath}/${slugify(item.name || item.slug)}`;
}

function readListingRoute() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const category = categoryByPath(parts[0]);
  if (!category) return null;
  return { categoryId: category.id, slug: parts[1] };
}

function phoneHref(phone = "") {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function whatsappHref(item) {
  const phone = item.whatsapp || `54${(item.phone || "").replace(/[^\d]/g, "")}`;
  const text = encodeURIComponent(`Hola, te encontré en Guía Suárez y quería consultar por ${item.name}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

function whatsappIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" class="action-icon action-icon-whatsapp">
    <path d="M20.52 3.48A11.83 11.83 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.14 1.6 5.94L.14 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.45-8.42ZM12.1 21.76h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.22-3.77.99 1.01-3.67-.24-.38a9.84 9.84 0 0 1-1.51-5.25C2.2 6.42 6.65 1.97 12.1 1.97a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 7c0 5.44-4.44 9.89-9.89 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
  </svg>`;
}

function mapsHref(item) {
  const query = encodeURIComponent(`${item.address} ${item.place} Buenos Aires Argentina`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) {
    console.error(message);
    return;
  }
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function exitListingRoute(target = "/#resultados") {
  routeListingSlug = null;
  document.body.classList.remove("listing-route-page");
  if (listingRouteHero) listingRouteHero.hidden = true;
  if (window.location.pathname !== "/") window.history.pushState({}, "", target);
  document.title = "Guía Suárez — Comercios en Coronel Suárez, profesionales y servicios";
}

function isMissingDescriptionColumn(error) {
  return error?.code === "42703" && /description/i.test(error.message || "");
}

window.addEventListener("error", event => {
  console.error("Unhandled browser error", event.error || event.message);
  showToast(`Error de la pagina: ${event.message}`);
});

window.addEventListener("unhandledrejection", event => {
  const reason = event.reason;
  console.error("Unhandled promise rejection", reason);
  showToast(`Error inesperado: ${reason?.message || reason || "revisar consola"}`);
});

function hydrateListing(item) {
  return {
    ...item,
    tags: Array.isArray(item.tags) ? item.tags.join(" ") : (item.tags || ""),
    place: item.place || locationLabels[item.location] || "Coronel Suárez",
    address: item.address || "",
    description: item.description || "",
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
    const haystack = normalize(`${item.name} ${item.tags} ${categoryName} ${item.description}`);
    return item.active !== false
      && (!routeListingSlug || item.slug === routeListingSlug)
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
    const description = item.description ? `<p class="listing-description">${escapeHtml(item.description)}</p>` : "";
    const shareUrl = listingUrl(item);

    const mapAction = item.address
      ? `<a href="${mapsHref(item)}" target="_blank" rel="noopener" aria-label="Ver ${item.name} en Google Maps"><span>⌖</span>Mapa</a>`
      : "";
    const actionCount = item.address ? 3 : 2;
    return `<article class="listing-card" aria-label="${item.name} en ${item.place}">
      <div class="listing-cover" role="img" aria-label="${category}: ${item.name}"><span>${item.icon}</span>${item.verified ? '<span class="verified">✓ Verificado</span>' : ""}</div>
      <div class="listing-body"><span class="listing-category">${category}</span><h3>${item.name}</h3>${rating}
      ${description}
      <div class="listing-meta"><span>⌖ ${item.address || item.place}</span></div>
      <div class="listing-actions actions-${actionCount}" aria-label="Acciones rápidas">
        <a href="${phoneHref(item.phone)}" aria-label="Llamar a ${item.name}"><span>☎</span>Llamar</a>
        <a href="${whatsappHref(item)}" target="_blank" rel="noopener" aria-label="Enviar WhatsApp a ${item.name}"><span>${whatsappIcon()}</span>WhatsApp</a>
        ${mapAction}
      </div>
      <div class="listing-secondary-actions">
        <a href="${shareUrl}" aria-label="Abrir ficha de ${item.name}">Ver ficha</a>
        <button type="button" data-share-listing="${item.slug}">Compartir ficha</button>
      </div>
      <button class="review-action" data-review="${item.slug}" data-name="${item.name}">★ Calificar servicio</button></div>
    </article>`;
  }).join("");

  const hasFilter = query || activeCategory || location !== "todas" || routeListingSlug;
  resultsTitle.textContent = routeListingSlug ? "Ficha compartida" : (hasFilter ? "Resultados de tu búsqueda" : "Comercios y servicios destacados en Coronel Suárez");
  resultCount.textContent = routeListingSlug ? "" : `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}`;
  emptyState.hidden = filtered.length > 0;
  listingGrid.hidden = filtered.length === 0;
}

async function loadListings() {
  let { data, error } = await supabase
    .from("listings")
    .select(listingDescriptionAvailable ? LISTING_SELECT_FIELDS : LISTING_SELECT_FIELDS_LEGACY)
    .order("created_at", { ascending: false });

  if (isMissingDescriptionColumn(error)) {
    listingDescriptionAvailable = false;
    ({ data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT_FIELDS_LEGACY)
      .order("created_at", { ascending: false }));
  }

  if (error) console.error("Supabase listings load error", error);
  if (!error && data?.length) listings = data.map(hydrateListing);
  applyListingRoute();
  renderCategories();
  renderListings();
}

function applyListingRoute() {
  const route = readListingRoute();
  if (!route) return;
  const item = listings.find(listing =>
    listing.category === route.categoryId
    && (listing.slug === route.slug || slugify(listing.name) === route.slug)
  );
  if (!item) return;
  routeListingSlug = item.slug;
  activeCategory = item.category;
  searchInput.value = "";
  locationSelect.value = "todas";
  document.title = `${item.name} — Guía Suárez`;
  document.body.classList.add("listing-route-page");
  if (listingRouteHero) {
    listingRouteHero.hidden = false;
    listingRouteTitle.textContent = item.name;
    listingRouteIntro.textContent = `${item.name} está en Guía Suárez. También podés visitar la guía completa para encontrar otros comercios, profesionales y servicios de Coronel Suárez.`;
  }
}

function renderManageListings(items = []) {
  if (!manageListingsList || !emptyManageListings) return;
  emptyManageListings.hidden = items.length > 0;
  manageListingsList.innerHTML = items.map(item => {
    const category = categoryById(item.category)?.name || item.category;
    const status = item.active ? "Activo" : "Pausado";
    return `<article class="manage-item" data-owner-listing="${item.slug}">
      <header>
        <div>
          <h3>${item.name}</h3>
          <small>${category} · ${item.place || locationLabels[item.location] || "Coronel Suárez"}</small>
        </div>
        <span class="manage-status ${item.active ? "" : "paused"}">${status}</span>
      </header>
      <div class="manage-actions">
        <button type="button" data-owner-edit="${item.slug}">Editar</button>
        <button type="button" data-owner-toggle="${item.slug}">${item.active ? "Pausar" : "Activar"}</button>
        <button type="button" class="danger" data-owner-delete="${item.slug}">Eliminar</button>
      </div>
    </article>`;
  }).join("");
}

async function loadOwnerListings() {
  if (!currentUser) return [];
  let { data, error } = await supabase
    .from("listings")
    .select(listingDescriptionAvailable ? OWNER_LISTING_SELECT_FIELDS : OWNER_LISTING_SELECT_FIELDS_LEGACY)
    .eq("owner_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (isMissingDescriptionColumn(error)) {
    listingDescriptionAvailable = false;
    ({ data, error } = await supabase
      .from("listings")
      .select(OWNER_LISTING_SELECT_FIELDS_LEGACY)
      .eq("owner_id", currentUser.id)
      .order("created_at", { ascending: false }));
  }

  if (error) {
    showToast(`No pudimos cargar tus avisos: ${error.message}`);
    return [];
  }
  renderManageListings(data || []);
  return data || [];
}

function updateLocalListing(slug, patch) {
  listings = listings.map(item => item.slug === slug ? { ...item, ...patch } : item);
  renderCategories();
  renderListings();
}

async function editOwnerListing(slug) {
  let item = listings.find(listing => listing.slug === slug);
  if (!item) {
    let { data, error } = await supabase
      .from("listings")
      .select(listingDescriptionAvailable ? EDIT_LISTING_SELECT_FIELDS : EDIT_LISTING_SELECT_FIELDS_LEGACY)
      .eq("slug", slug)
      .single();
    if (isMissingDescriptionColumn(error)) {
      listingDescriptionAvailable = false;
      ({ data, error } = await supabase
        .from("listings")
        .select(EDIT_LISTING_SELECT_FIELDS_LEGACY)
        .eq("slug", slug)
        .single());
    }
    if (error) {
      showToast(`No pudimos abrir el aviso: ${error.message}`);
      return;
    }
    item = hydrateListing(data);
  }

  editingListingSlug = slug;
  formSuccess.hidden = true;
  joinAuthGate.hidden = true;
  joinForm.hidden = false;
  joinDialogTitle.textContent = "Editar aviso";
  joinDialogIntro.textContent = "Actualizá los datos de tu publicación. Los cambios se guardan en tu aviso.";
  joinForm.elements.name.value = item.name || "";
  joinForm.elements.category.value = item.category || "";
  joinForm.elements.location.value = item.location || "coronel-suarez";
  joinForm.elements.phone.value = item.phone || "";
  joinForm.elements.address.value = item.address || "";
  joinForm.elements.description.value = item.description || "";
  joinForm.querySelector("button[type='submit']").textContent = "Guardar cambios";
  manageDialog.close();
  dialog.showModal();
}

async function toggleOwnerListing(slug) {
  const item = listings.find(listing => listing.slug === slug);
  const nextActive = !item?.active;
  const { error } = await supabase.from("listings").update({ active: nextActive }).eq("slug", slug);
  if (error) {
    showToast(`No pudimos actualizar el aviso: ${error.message}`);
    return;
  }
  updateLocalListing(slug, { active: nextActive });
  await loadOwnerListings();
}

async function deleteOwnerListing(slug) {
  const item = listings.find(listing => listing.slug === slug);
  if (!window.confirm(`¿Eliminar "${item?.name || "este aviso"}"? Esta acción no se puede deshacer.`)) return;

  const { error } = await supabase.from("listings").delete().eq("slug", slug);
  if (error) {
    showToast(`No pudimos eliminar el aviso: ${error.message}`);
    return;
  }
  listings = listings.filter(listing => listing.slug !== slug);
  renderCategories();
  renderListings();
  await loadOwnerListings();
  showToast("Aviso eliminado.");
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
  const pendingIntent = urlIntent ? (readRememberedIntent() || urlIntent) : null;
  if (!pendingIntent) return;

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

async function loadMedicalProfessionals() {
  if (!medicalCount || !medicalGrid || !medicalSpecialtySelect || !medicalListHeading) return;

  try {
    const response = await fetch("/api/medical-professionals");
    if (!response.ok) throw new Error("No pudimos cargar el padrón médico");
    const data = await response.json();

    medicalProfessionals = data.professionals || [];
    medicalCount.textContent = `${data.count || 0} profesionales en el padrón`;
    medicalSpecialtySelect.innerHTML = `<option value="">Seleccioná una especialidad</option>${(data.specialties || [])
      .map(item => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)} (${item.count})</option>`)
      .join("")}`;
    renderMedicalProfessionalsDetailed("");
  } catch (error) {
    medicalCount.textContent = "Padrón médico no disponible";
    medicalSpecialtySelect.innerHTML = `<option value="">Padrón no disponible</option>`;
    medicalListHeading.textContent = "No pudimos cargar la información médica.";
    medicalGrid.innerHTML = `<article class="medical-card"><strong>No pudimos cargar la información médica</strong><small>Probá nuevamente más tarde o consultá el padrón completo.</small></article>`;
  }
}

async function loadVisitCounter() {
  if (!visitCounter) return;
  const alreadyCounted = sessionStorage.getItem("guiaSuarezVisitCounted") === "true";

  try {
    const response = await fetch("/api/visit-count", {
      method: alreadyCounted ? "GET" : "POST"
    });
    if (!response.ok) throw new Error("Visit counter unavailable");
    const data = await response.json();
    if (!alreadyCounted) sessionStorage.setItem("guiaSuarezVisitCounted", "true");
    if (typeof data.count === "number") {
      visitCounter.textContent = `Visitas: ${data.count.toLocaleString("es-AR")}`;
    }
  } catch (_error) {
    visitCounter.textContent = "Visitas: —";
  }
}

function renderMedicalProfessionals(specialty) {
  if (!medicalGrid || !medicalListHeading) return;
  if (!specialty) {
    medicalListHeading.textContent = "Seleccioná una especialidad para ver profesionales.";
    medicalGrid.innerHTML = "";
    return;
  }

  const filtered = medicalProfessionals
    .filter(item => (item.specialties || []).includes(specialty))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  medicalListHeading.textContent = `${filtered.length} ${filtered.length === 1 ? "profesional" : "profesionales"} en ${specialty}`;
  medicalGrid.innerHTML = filtered
    .map(item => `<article class="medical-card">
      <strong>${escapeHtml(item.name)}</strong>
      <small>Matrícula ${escapeHtml(item.license)}</small>
      <span>${escapeHtml((item.specialties || []).join(" · "))}</span>
    </article>`)
    .join("");
}

async function renderMedicalProfessionalsDetailed(specialty) {
  if (!medicalGrid || !medicalListHeading) return;
  selectedMedicalSpecialty = specialty;
  if (!specialty) {
    medicalListHeading.textContent = "Seleccioná una especialidad para ver profesionales.";
    medicalGrid.innerHTML = "";
    return;
  }

  medicalListHeading.textContent = `Cargando profesionales en ${specialty}...`;
  medicalGrid.innerHTML = "";

  let filtered = medicalProfessionals.filter(item => (item.specialties || []).includes(specialty));
  try {
    const response = await fetch(`/api/medical-professionals?specialty=${encodeURIComponent(specialty)}`);
    if (response.ok) {
      const data = await response.json();
      filtered = data.professionals || filtered;
    }
  } catch (_error) {
    // Si falla el enriquecimiento, mostramos el listado básico ya cargado.
  }

  if (selectedMedicalSpecialty !== specialty) return;
  filtered = filtered.sort((a, b) => a.name.localeCompare(b.name, "es"));

  medicalListHeading.textContent = `${filtered.length} ${filtered.length === 1 ? "profesional" : "profesionales"} en ${specialty}`;
  medicalGrid.innerHTML = filtered
    .map(item => `<article class="medical-card">
      <div class="medical-photo">${item.photoUrl ? `<img src="${escapeHtml(item.photoUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async">` : `<span>${escapeHtml(item.name.split(" ").map(part => part[0]).slice(0, 2).join(""))}</span>`}</div>
      <div class="medical-card-body">
        <strong>${escapeHtml(item.name)}</strong>
        <small>Matrícula ${escapeHtml(item.license)}</small>
        <span>${escapeHtml((item.specialties || []).join(" · "))}</span>
        ${item.phone ? `<a class="medical-phone" href="${phoneHref(item.phone)}">☎ ${escapeHtml(item.phone)}</a>` : ""}
        ${item.address ? `<small>${escapeHtml(item.address)}</small>` : ""}
      </div>
    </article>`)
    .join("");
}

medicalSpecialtySelect?.addEventListener("change", event => {
  renderMedicalProfessionalsDetailed(event.target.value);
});

categoryGrid.addEventListener("click", event => {
  const card = event.target.closest("[data-category]");
  if (!card) return;
  exitListingRoute("/#rubros");
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
  exitListingRoute("/#resultados");
  activeCategory = null;
  renderCategories();
  renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => {
  searchInput.value = button.dataset.query;
  exitListingRoute("/#resultados");
  activeCategory = null;
  renderCategories();
  renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
}));

locationSelect.addEventListener("change", () => {
  if (routeListingSlug) exitListingRoute("/#resultados");
  renderListings();
});
document.querySelector("#clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  locationSelect.value = "todas";
  activeCategory = null;
  exitListingRoute("/#resultados");
  renderCategories();
  renderListings();
});

document.querySelectorAll("[data-open-form]").forEach(button => button.addEventListener("click", () => {
  editingListingSlug = null;
  joinForm.reset();
  joinForm.querySelector("button[type='submit']").textContent = "Publicar aviso";
  rememberIntent("publish");
  renderJoinDialogState();
  dialog.showModal();
}));

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
closeJoinDialog?.addEventListener("click", () => dialog.close());
viewPublishedListing?.addEventListener("click", () => {
  dialog.close();
  const item = listings.find(listing => listing.slug === lastPublishedSlug);
  if (item) {
    window.location.href = listingUrl(item);
    return;
  }
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});
manageListingsButton?.addEventListener("click", async () => {
  await loadOwnerListings();
  manageDialog.showModal();
});
document.querySelector(".manage-close")?.addEventListener("click", () => manageDialog.close());
manageListingsList?.addEventListener("click", async event => {
  const editButton = event.target.closest("[data-owner-edit]");
  const toggleButton = event.target.closest("[data-owner-toggle]");
  const deleteButton = event.target.closest("[data-owner-delete]");
  if (editButton) await editOwnerListing(editButton.dataset.ownerEdit);
  if (toggleButton) await toggleOwnerListing(toggleButton.dataset.ownerToggle);
  if (deleteButton) await deleteOwnerListing(deleteButton.dataset.ownerDelete);
});
document.querySelector("#joinLoginButton").addEventListener("click", signInWithGoogle);
document.querySelector("#logoutButton").addEventListener("click", async () => {
  await supabase.auth.signOut();
  renderUser(null);
});

joinForm.addEventListener("submit", async event => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const form = event.currentTarget;

  if (!currentUser) {
    showToast("Ingresá con Google para publicar tu actividad.");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  if (!submitButton) {
    showToast("No encontramos el boton de publicacion. Recarga la pagina e intenta de nuevo.");
    return;
  }
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "");
  const location = String(formData.get("location") || "");
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim() || null;
  const description = String(formData.get("description") || "").trim() || null;
  if (!name || !category || !location || !phone) {
    showToast("Completá nombre, rubro, localidad y teléfono para publicar.");
    return;
  }
  if (description && description.length > 150) {
    showToast("La descripción no puede superar los 150 caracteres.");
    return;
  }
  const categoryInfo = categoryById(category);
  const newListing = {
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    name,
    category,
    tags: [name, categoryInfo?.name || category],
    location,
    place: locationLabels[location] || "Coronel Suárez",
    address,
    description,
    icon: categoryInfo?.icon || "•",
    phone,
    verified: false,
    active: true,
    owner_id: currentUser.id
  };

  submitButton.disabled = true;
  submitButton.textContent = editingListingSlug ? "Guardando..." : "Publicando...";

  try {
    const listingPayload = listingDescriptionAvailable
      ? newListing
      : Object.fromEntries(Object.entries(newListing).filter(([key]) => key !== "description"));
    const listingUpdatePayload = {
      name,
      category,
      tags: [name, categoryInfo?.name || category],
      location,
      place: newListing.place,
      address,
      icon: newListing.icon,
      phone
    };
    if (listingDescriptionAvailable) listingUpdatePayload.description = description;

    const savePromise = editingListingSlug
      ? supabase
        .from("listings")
        .update(listingUpdatePayload)
        .eq("slug", editingListingSlug)
      : supabase.from("listings").insert(listingPayload);
    const timeoutPromise = new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("La operación tardó demasiado. Probá nuevamente.")), 12000);
    });
    const { error } = await Promise.race([savePromise, timeoutPromise]);

    if (error) {
      console.error("Supabase listing save error", error);
      showToast(`No pudimos guardar el aviso: ${error.message || "revisá Supabase"}`);
      return;
    }

    if (editingListingSlug) {
      const previous = listings.find(item => item.slug === editingListingSlug);
      updateLocalListing(editingListingSlug, hydrateListing({
        ...newListing,
        slug: editingListingSlug,
        active: previous?.active ?? true,
        verified: previous?.verified ?? false
      }));
      lastPublishedSlug = editingListingSlug;
      editingListingSlug = null;
    } else {
      listings.unshift(hydrateListing(newListing));
      lastPublishedSlug = newListing.slug;
    }
    form.reset();
    joinForm.hidden = true;
    formSuccess.hidden = false;
    viewPublishedListing.textContent = "Ver aviso en la guía";
    renderCategories();
    renderListings();
    if (manageDialog?.open) await loadOwnerListings();
    showToast("Tu aviso quedó guardado.");
  } catch (error) {
    console.error("Supabase listing save timeout/error", error);
    showToast(error.message || "No pudimos guardar el aviso. Probá nuevamente.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Publicar aviso";
  }
}, { capture: true });

listingGrid.addEventListener("click", event => {
  const shareButton = event.target.closest("[data-share-listing]");
  if (shareButton) {
    const item = listings.find(listing => listing.slug === shareButton.dataset.shareListing);
    if (!item) return;
    const url = listingUrl(item);
    const text = `${item.name} en Guía Suárez`;
    if (navigator.share) {
      navigator.share({ title: text, text, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      showToast("Link de la ficha copiado.");
    }
    return;
  }

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
  if (!rating || rating < 1 || rating > 5) {
    showToast("Elegí una calificación de 1 a 5 estrellas.");
    return;
  }
  const comment = document.querySelector("#reviewComment").value.trim() || null;
  const { error } = await supabase.from("reviews").upsert(
    { listing_id: listing.id, user_id: currentUser.id, rating, comment, status: "published" },
    { onConflict: "listing_id,user_id" }
  );
  if (error) {
    console.error("Supabase review save error", error);
    showToast(`No pudimos guardar la opinión: ${error.message || "revisá Supabase"}`);
    return;
  }
  reviewForm.hidden = true;
  const reviewBusinessName = document.querySelector("#reviewBusinessName");
  reviewBusinessName.textContent = reviewBusinessName.textContent.replace(/^Calificá\s+/, "Calificaste ");
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
    weatherText.textContent = `Hoy ${currentTemp}° · Mañana ${tomorrowMin}°/${tomorrowMax}°`;
    weatherWidget.title = `Clima hoy en Coronel Suárez: ${currentTemp}° · Mañana ${tomorrowMin}°/${tomorrowMax}°`;
  } catch (_error) {
    weatherIconElement.textContent = "🌡️";
    weatherText.textContent = "Clima no disponible";
    weatherWidget.title = "Clima hoy en Coronel Suárez no disponible";
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
    const details = [
      data.address ? `Dirección: ${data.address}` : "",
      data.phone ? `Teléfono: ${data.phone}` : "",
      "Confirmá telefónicamente antes de acercarte."
    ].filter(Boolean).join(" · ");
    pharmacyHeaderText.textContent = data.name;
    pharmacyWidget.title = details;
    pharmacyWidget.dataset.tooltip = details;
    pharmacyWidget.setAttribute("aria-label", `Farmacia de turno: ${data.name}. ${details}`);
    pharmacyWidget.tabIndex = 0;
  } catch (_error) {
    pharmacyHeaderText.textContent = "Farmacia de turno no disponible";
    pharmacyWidget.title = "No pudimos consultar la farmacia de turno en este momento.";
    pharmacyWidget.dataset.tooltip = "No pudimos consultar la farmacia de turno en este momento.";
    pharmacyWidget.setAttribute("aria-label", "Farmacia de turno no disponible");
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
  },
  contact: {
    title: "Contactar al equipo",
    body: "Podés escribirnos a <a href=\"mailto:guiasuarezweb@gmail.com\">guiasuarezweb@gmail.com</a> para consultas, sugerencias o correcciones sobre la guía."
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
  if (event === "SIGNED_IN" && new URLSearchParams(window.location.search).has("intent")) continuePendingIntent();
});

const initialQuery = new URLSearchParams(window.location.search).get("q");
if (initialQuery) searchInput.value = initialQuery;

await loadListings();
await loadRatings();
renderCurrentDate();
loadWeather();
loadPharmacyShift();
loadMedicalProfessionals();
loadVisitCounter();
