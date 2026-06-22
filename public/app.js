import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

// Datos ficticios para demostrar el funcionamiento del prototipo.
const listings = [
  { slug: "carpinteria-el-roble", name: "Carpintería El Roble", category: "hogar", tags: "carpintero muebles madera arreglos", location: "coronel-suarez", place: "Coronel Suárez", icon: "🪵", phone: "2926 000001", verified: true },
  { slug: "estudio-norte", name: "Estudio Norte", category: "profesionales", tags: "arquitectura planos construcción profesional", location: "coronel-suarez", place: "Coronel Suárez", icon: "📐", phone: "2926 000002", verified: true },
  { slug: "manos-bonitas", name: "Manos Bonitas", category: "belleza", tags: "manicura uñas belleza pedicura", location: "pueblo-san-jose", place: "Pueblo San José", icon: "💅", phone: "2926 000003", verified: true },
  { slug: "sabores-de-casa", name: "Sabores de Casa", category: "gastronomia", tags: "comida viandas pastas caseras", location: "huanguelen", place: "Huanguelén", icon: "🥟", phone: "2926 000004", verified: false },
  { slug: "electro-suarez", name: "Electro Suárez", category: "hogar", tags: "electricista electricidad instalaciones urgencias", location: "pueblo-santa-trinidad", place: "Pueblo Santa Trinidad", icon: "⚡", phone: "2926 000005", verified: true },
  { slug: "veterinaria-la-comarca", name: "Veterinaria La Comarca", category: "mascotas", tags: "veterinaria mascotas alimento perros gatos", location: "coronel-suarez", place: "Coronel Suárez", icon: "🐕", phone: "2926 000006", verified: true }
];

const categoryGrid = document.querySelector("#categoryGrid");
const listingGrid = document.querySelector("#listingGrid");
const searchInput = document.querySelector("#searchInput");
const locationSelect = document.querySelector("#locationSelect");
const resultsTitle = document.querySelector("#resultsTitle");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
let activeCategory = null;
let expandedCategories = false;
let currentUser = null;
let ratingStats = {};

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderCategories() {
  const visible = expandedCategories ? categories : categories.slice(0, 6);
  categoryGrid.innerHTML = visible.map(category => {
    const count = listings.filter(item => item.category === category.id).length;
    return `<button class="category-card ${activeCategory === category.id ? "active" : ""}" data-category="${category.id}">
      <span class="category-icon">${category.icon}</span><strong>${category.name}</strong><small>${count || "Próximamente"}</small>
    </button>`;
  }).join("");
}

function renderListings() {
  const query = normalize(searchInput.value.trim());
  const location = locationSelect.value;
  const filtered = listings.filter(item => {
    const haystack = normalize(`${item.name} ${item.tags} ${categories.find(c => c.id === item.category)?.name}`);
    return (!query || haystack.includes(query)) && (!activeCategory || item.category === activeCategory) && (location === "todas" || item.location === location);
  });

  listingGrid.innerHTML = filtered.map(item => {
    const category = categories.find(c => c.id === item.category)?.name;
    const stats = ratingStats[item.slug];
    const rating = stats ? `<span class="rating-summary">★ ${Number(stats.average_rating).toFixed(1)} · ${stats.review_count} opiniones</span>` : '<span class="rating-summary">Sin opiniones todavía</span>';
    return `<article class="listing-card">
      <div class="listing-cover"><span>${item.icon}</span>${item.verified ? '<span class="verified">✓ Verificado</span>' : ""}</div>
      <div class="listing-body"><span class="listing-category">${category}</span><h3>${item.name}</h3>${rating}
      <div class="listing-meta"><span>⌖ ${item.place}</span><span>● Abierto hoy</span></div>
      <div class="listing-actions"><a href="tel:${item.phone.replaceAll(" ", "")}">Llamar</a><button data-review="${item.slug}" data-name="${item.name}">Calificar</button></div></div>
    </article>`;
  }).join("");

  const hasFilter = query || activeCategory || location !== "todas";
  resultsTitle.textContent = hasFilter ? "Resultados de tu búsqueda" : "Conocé nuestra guía local";
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}`;
  emptyState.hidden = filtered.length > 0;
  listingGrid.hidden = filtered.length === 0;
}

categoryGrid.addEventListener("click", event => {
  const card = event.target.closest("[data-category]");
  if (!card) return;
  activeCategory = activeCategory === card.dataset.category ? null : card.dataset.category;
  renderCategories(); renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#showAllCategories").addEventListener("click", event => {
  expandedCategories = !expandedCategories;
  event.currentTarget.textContent = expandedCategories ? "Ver menos ↑" : "Ver todos los rubros →";
  renderCategories();
});

document.querySelector("#searchForm").addEventListener("submit", event => {
  event.preventDefault(); activeCategory = null; renderCategories(); renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => {
  searchInput.value = button.dataset.query; activeCategory = null; renderCategories(); renderListings();
  document.querySelector("#resultados").scrollIntoView({ behavior: "smooth" });
}));

locationSelect.addEventListener("change", renderListings);
document.querySelector("#clearFilters").addEventListener("click", () => {
  searchInput.value = ""; locationSelect.value = "todas"; activeCategory = null; renderCategories(); renderListings();
});

const dialog = document.querySelector("#joinDialog");
document.querySelectorAll("[data-open-form]").forEach(button => button.addEventListener("click", () => dialog.showModal()));
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
document.querySelector("#joinForm").addEventListener("submit", event => {
  event.preventDefault(); event.currentTarget.reset(); document.querySelector("#formSuccess").hidden = false;
});

const reviewDialog = document.querySelector("#reviewDialog");
const reviewForm = document.querySelector("#reviewForm");
const authButton = document.querySelector("#authButton");
const userMenu = document.querySelector("#userMenu");

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message; toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function renderUser(user) {
  currentUser = user;
  authButton.hidden = Boolean(user);
  userMenu.hidden = !user;
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

authButton.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  if (error) showToast("No pudimos iniciar sesión. Probá nuevamente.");
});

document.querySelector("#logoutButton").addEventListener("click", async () => {
  await supabase.auth.signOut(); renderUser(null);
});

listingGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-review]");
  if (!button) return;
  if (!currentUser) { showToast("Ingresá con Google para dejar una calificación."); authButton.focus(); return; }
  reviewForm.reset(); document.querySelector("#reviewSuccess").hidden = true; reviewForm.hidden = false;
  document.querySelector("#reviewListingSlug").value = button.dataset.review;
  document.querySelector("#reviewBusinessName").textContent = `Calificá ${button.dataset.name}`;
  reviewDialog.showModal();
});

document.querySelector(".review-close").addEventListener("click", () => reviewDialog.close());
reviewForm.addEventListener("submit", async event => {
  event.preventDefault();
  const slug = document.querySelector("#reviewListingSlug").value;
  const { data: listing, error: listingError } = await supabase.from("listings").select("id").eq("slug", slug).single();
  if (listingError) { showToast("No pudimos encontrar esta actividad."); return; }
  const rating = Number(new FormData(reviewForm).get("rating"));
  const comment = document.querySelector("#reviewComment").value.trim() || null;
  const { error } = await supabase.from("reviews").upsert({ listing_id: listing.id, user_id: currentUser.id, rating, comment }, { onConflict: "listing_id,user_id" });
  if (error) { showToast("No pudimos guardar la opinión."); return; }
  reviewForm.hidden = true; document.querySelector("#reviewSuccess").hidden = false; await loadRatings();
});

const { data: { session } } = await supabase.auth.getSession();
renderUser(session?.user || null);
supabase.auth.onAuthStateChange((_event, nextSession) => renderUser(nextSession?.user || null));

renderCategories();
renderListings();
loadRatings();
