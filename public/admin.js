import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const loginButton = document.querySelector("#adminLoginButton");
const logoutButton = document.querySelector("#adminLogoutButton");
const refreshButton = document.querySelector("#refreshAdminButton");
const gate = document.querySelector("#adminGate");
const dashboard = document.querySelector("#adminDashboard");
const adminUserLabel = document.querySelector("#adminUserLabel");
const metrics = document.querySelector("#adminMetrics");
const alerts = document.querySelector("#adminAlerts");
const auditSummary = document.querySelector("#auditSummary");
const listingsBody = document.querySelector("#adminListingsBody");
const reviewsBody = document.querySelector("#adminReviewsBody");

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function categoryLabel(value) {
  const labels = {
    automotor: "Automotor",
    belleza: "Belleza y bienestar",
    comercios: "Comercios",
    educacion: "Educación",
    eventos: "Eventos",
    gastronomia: "Gastronomía",
    hogar: "Hogar y oficios",
    mascotas: "Mascotas",
    profesionales: "Profesionales",
    salud: "Salud",
    servicios: "Servicios",
    tecnologia: "Tecnología",
    turismo: "Turismo y ocio"
  };
  return labels[value] || value || "—";
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || "";
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
    showToast("Google volvió correctamente, pero no pudimos crear la sesión del panel.");
    return;
  }

  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("code");
  window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
}

async function adminFetch(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "No pudimos cargar el panel.");
  }
  return payload;
}

function renderMetrics(summary) {
  const items = [
    ["Actividades", summary.activeListings],
    ["Calificaciones", summary.reviews],
    ["Promedio general", summary.averageRating || "—"],
    ["Nuevos 7 días", summary.newListings7d],
    ["Opiniones 7 días", summary.newReviews7d]
  ];
  metrics.innerHTML = items.map(([label, value]) => `
    <article class="admin-metric">
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(label)}</small>
    </article>
  `).join("");
}

function renderAlerts(audit) {
  const items = [
    ["Autocalificaciones", audit.selfReviews, "Usuarios calificando sus propios avisos."],
    ["Calificaciones rápidas", audit.quickReviews, "Opiniones cargadas dentro de la primera hora del aviso."],
    ["Usuarios muy activos", audit.heavyReviewers, "Cuentas con 3 o más calificaciones."],
    ["5★ sin comentario", audit.emptyFiveStars, "Calificaciones máximas sin texto de respaldo."]
  ];

  const total = items.reduce((sum, [, value]) => sum + Number(value || 0), 0);
  auditSummary.textContent = total ? `${total} señales` : "Sin señales críticas";
  alerts.innerHTML = items.map(([title, value, note]) => `
    <article class="admin-alert ${Number(value || 0) ? "" : "ok"}">
      <strong>${escapeHtml(value)} · ${escapeHtml(title)}</strong>
      <small>${escapeHtml(note)}</small>
    </article>
  `).join("");
}

function renderListings(listings) {
  listingsBody.innerHTML = listings.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(categoryLabel(item.category))} · ${escapeHtml(item.place || item.address || "Sin ubicación")}</small></td>
      <td>${escapeHtml(item.owner?.email || "—")}<small>${escapeHtml(item.owner?.name || "")}</small></td>
      <td>${escapeHtml(item.phone || "—")}<small>${escapeHtml(item.address || "")}</small></td>
      <td><span class="admin-pill ${item.active ? "" : "warn"}">${item.active ? "Activo" : "Pausado"}</span></td>
      <td>${formatDate(item.created_at)}<small><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Ver ficha</a></small></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No hay avisos para mostrar.</td></tr>`;
}

function renderReviews(reviews) {
  reviewsBody.innerHTML = reviews.map(review => {
    const warning = review.flags?.length ? review.flags.join(", ") : "OK";
    return `<tr>
      <td><strong>${escapeHtml(review.listing?.name || "—")}</strong><small>${formatDate(review.created_at)}</small></td>
      <td><span class="admin-pill">${"★".repeat(Number(review.rating || 0))} ${review.rating}/5</span><small>${escapeHtml(review.comment || "Sin comentario")}</small></td>
      <td>${escapeHtml(review.reviewer?.email || "—")}<small>${escapeHtml(review.reviewer?.name || "")}</small></td>
      <td><span class="admin-pill ${review.flags?.length ? "warn" : ""}">${escapeHtml(warning)}</span></td>
      <td><button class="admin-danger" type="button" data-delete-review="${review.id}">Borrar</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="5">No hay calificaciones para mostrar.</td></tr>`;
}

async function loadAdminPanel() {
  refreshButton.disabled = true;
  try {
    const data = await adminFetch("/api/admin/dashboard");
    gate.hidden = true;
    dashboard.hidden = false;
    loginButton.hidden = true;
    logoutButton.hidden = false;
    adminUserLabel.textContent = `Ingresaste como ${data.admin.email}`;
    renderMetrics(data.summary);
    renderAlerts(data.audit);
    renderListings(data.listings);
    renderReviews(data.reviews);
  } catch (error) {
    gate.hidden = false;
    dashboard.hidden = true;
    loginButton.hidden = false;
    logoutButton.hidden = true;
    gate.innerHTML = `<h2>No pudimos abrir el panel</h2><p>${escapeHtml(error.message)}</p>`;
  } finally {
    refreshButton.disabled = false;
  }
}

loginButton.addEventListener("click", async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/admin` }
  });
});

logoutButton.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.reload();
});

refreshButton?.addEventListener("click", loadAdminPanel);

reviewsBody.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-review]");
  if (!button) return;
  if (!window.confirm("¿Borrar esta calificación? Esta acción no se puede deshacer.")) return;

  button.disabled = true;
  try {
    await adminFetch(`/api/admin/reviews/${button.dataset.deleteReview}`, { method: "DELETE" });
    showToast("Calificación eliminada.");
    await loadAdminPanel();
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
  }
});

await completeOAuthRedirectIfNeeded();

const { data: { session } } = await supabase.auth.getSession();
if (session) {
  await loadAdminPanel();
} else {
  gate.hidden = false;
  dashboard.hidden = true;
}
