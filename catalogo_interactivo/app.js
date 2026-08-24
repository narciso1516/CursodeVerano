const RESOURCES = window.CATALOG_RESOURCES || [];
const PAGE_SIZE = 16;
const FAVORITES_KEY = "catalogo-interactivo-favoritos";
const THEME_KEY = "catalogo-interactivo-tema";

const AREA_META = {
  "Ciencias y ambiente": { icon: "🧪", color: "#8b3db1", soft: "#f2e4f7" },
  "Desarrollo socioemocional": { icon: "♥", color: "#ef607c", soft: "#ffe7eb" },
  "Emprendimiento": { icon: "💡", color: "#ec8d26", soft: "#fff0d9" },
  "Formación docente": { icon: "🎓", color: "#7054b7", soft: "#ece7fa" },
  "Humanidades": { icon: "💭", color: "#9a4b9f", soft: "#f3e7f3" },
  "Inglés": { icon: "🇬🇧", color: "#ff6637", soft: "#ffebe4" },
  "Lengua y comunicación": { icon: "ABC", color: "#f16483", soft: "#ffe9ee" },
  "Lenguajes y artes": { icon: "🎨", color: "#d34f91", soft: "#f9e5f0" },
  "Matemáticas": { icon: "＋", color: "#14aaa8", soft: "#ddf5f3" },
  "Multidisciplinar": { icon: "🧩", color: "#527bbd", soft: "#e6eef9" }
};
const DEFAULT_META = { icon: "✦", color: "#70309c", soft: "#f0e4f7" };
const AREA_ORDER = [
  "Matemáticas",
  "Lengua y comunicación",
  "Ciencias y ambiente",
  "Inglés",
  "Desarrollo socioemocional",
  "Multidisciplinar",
  "Lenguajes y artes",
  "Humanidades",
  "Formación docente",
  "Emprendimiento"
];

const $ = selector => document.querySelector(selector);
const search = $("#search");
const area = $("#area");
const level = $("#level");
const grid = $("#grid");
const empty = $("#empty");
const loadZone = $("#loadZone");
const activeFilters = $("#activeFilters");
let selectedKind = "";
let showFavorites = false;
let visibleLimit = PAGE_SIZE;
let toastTimer;
let favorites = readFavorites();

const norm = value => (value || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const uniqueSorted = values => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
const metaFor = name => AREA_META[name] || DEFAULT_META;
const create = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch (error) {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  } catch (error) {
    // El catálogo sigue funcionando aunque el navegador bloquee el almacenamiento local.
  }
}

function fillSelect(select, values) {
  uniqueSorted(values).forEach(value => {
    const option = create("option", "", value);
    option.value = value;
    select.appendChild(option);
  });
}

function filteredResources() {
  const query = norm(search.value);
  const filtered = RESOURCES.filter(resource =>
    (!showFavorites || favorites.has(resource.url)) &&
    (!selectedKind || resource.kind === selectedKind) &&
    (!area.value || resource.area === area.value) &&
    (!level.value || resource.level === level.value) &&
    (!query || norm([resource.title, resource.area, resource.level, resource.objective, resource.type].join(" ")).includes(query))
  );
  const defaultView = !showFavorites && !selectedKind && !area.value && !level.value && !query;
  return defaultView ? balanceAreas(filtered) : filtered;
}

function balanceAreas(resources) {
  const groups = new Map(AREA_ORDER.map(name => [name, []]));
  resources.forEach(resource => {
    if (!groups.has(resource.area)) groups.set(resource.area, []);
    groups.get(resource.area).push(resource);
  });
  const result = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    groups.forEach(group => {
      if (group.length) {
        result.push(group.shift());
        remaining = true;
      }
    });
  }
  return result;
}

function iconFor(resource) {
  const text = norm(`${resource.title} ${resource.objective}`);
  if (resource.kind === "Portal") return "🌐";
  if (text.includes("abeja")) return "🐝";
  if (text.includes("jardin") || text.includes("planta") || text.includes("botan")) return "🌿";
  if (text.includes("planeta")) return "🪐";
  if (text.includes("fraccion") || text.includes("comida y partes")) return "🍎";
  if (text.includes("acentu") || text.includes("ortograf") || text.includes("redaccion")) return "ABC";
  if (text.includes("ingles") || text.includes("english") || text.includes("questions")) return "🇬🇧";
  if (text.includes("cerebro")) return "🧠";
  if (text.includes("matemat") || text.includes("suma") || text.includes("tiend")) return "🔢";
  if (text.includes("lectura") || text.includes("leer")) return "📖";
  return metaFor(resource.area).icon;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1600);
}

function toggleFavorite(resource, button) {
  if (favorites.has(resource.url)) {
    favorites.delete(resource.url);
    showToast("Eliminado de favoritos");
  } else {
    favorites.add(resource.url);
    showToast("Guardado en favoritos");
  }
  saveFavorites();
  syncFavoriteButton(button, resource.url);
  $("#favoriteCount").textContent = favorites.size;
  if (showFavorites) render();
}

function syncFavoriteButton(button, url) {
  const active = favorites.has(url);
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", active ? "Quitar de favoritos" : "Guardar en favoritos");
  button.textContent = active ? "♥" : "♡";
}

function makeCard(resource) {
  const meta = metaFor(resource.area);
  const card = create("article", "resource-card");
  card.style.setProperty("--area-color", meta.color);
  card.style.setProperty("--area-soft", meta.soft);

  const main = create("div", "card-main");
  const top = create("div", "card-top");
  const icon = create("span", "card-icon", iconFor(resource));
  icon.setAttribute("aria-hidden", "true");
  const title = create("h3", "card-title", resource.title);
  const favorite = create("button", "favorite-button");
  favorite.type = "button";
  favorite.setAttribute("aria-label", `Marcar ${resource.title} como favorito`);
  syncFavoriteButton(favorite, resource.url);
  favorite.addEventListener("click", () => toggleFavorite(resource, favorite));
  top.append(icon, title, favorite);

  const areaLabel = create("p", "card-area", resource.area);
  const levelLabel = create("p", "card-level", resource.level);
  const objective = create("p", "card-objective", resource.objective);
  main.append(top, areaLabel, levelLabel, objective);
  if (norm(resource.use).includes("personalizado")) {
    main.appendChild(create("p", "personalized-note", "Revisar nombres antes de reutilizar"));
  }

  const footer = create("div", "card-footer");
  footer.appendChild(create("span", "", resource.kind));
  const actions = create("div", "card-actions");
  const copy = create("button", "card-copy", "⧉");
  copy.type = "button";
  copy.title = "Copiar enlace";
  copy.setAttribute("aria-label", `Copiar enlace de ${resource.title}`);
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(resource.url);
      showToast("Enlace copiado");
    } catch (error) {
      window.prompt("Copia este enlace:", resource.url);
    }
  });
  const open = create("a", "card-open", "↗");
  open.href = resource.url;
  open.target = "_blank";
  open.rel = "noopener";
  open.title = resource.status || "Abrir recurso";
  open.setAttribute("aria-label", `Abrir ${resource.title} en una pestaña nueva`);
  actions.append(copy, open);
  footer.appendChild(actions);
  card.append(main, footer);
  return card;
}

function renderActiveFilters() {
  const items = [];
  if (search.value.trim()) items.push({ label: `“${search.value.trim()}”`, clear: () => { search.value = ""; } });
  if (area.value) items.push({ label: area.value, clear: () => { area.value = ""; } });
  if (level.value) items.push({ label: level.value, clear: () => { level.value = ""; } });
  if (selectedKind) items.push({ label: selectedKind === "Portal" ? "Portales y rutas" : "Interactivos", clear: () => { selectedKind = ""; } });
  if (showFavorites) items.push({ label: "Favoritos", clear: () => { showFavorites = false; } });
  activeFilters.innerHTML = "";
  items.forEach(item => {
    const chip = create("button", "filter-chip", `${item.label} ×`);
    chip.type = "button";
    chip.setAttribute("aria-label", `Quitar filtro ${item.label}`);
    chip.addEventListener("click", () => {
      item.clear();
      visibleLimit = PAGE_SIZE;
      render();
    });
    activeFilters.appendChild(chip);
  });
  $("#reset").disabled = items.length === 0;
  $("#clearSearch").classList.toggle("visible", Boolean(search.value));
}

function syncNavigation() {
  document.querySelectorAll(".topnav-item[data-view], .side-link[data-view]").forEach(button => {
    const target = button.dataset.view;
    const active = !showFavorites && ((target === "all" && !selectedKind) || target === selectedKind);
    button.classList.toggle("active", active);
    if (button.tagName === "BUTTON") button.setAttribute("aria-pressed", String(active));
  });
  $("#favoritesView").classList.toggle("active", showFavorites);
  $("#favoritesView").setAttribute("aria-pressed", String(showFavorites));
  document.querySelectorAll("[data-kind]").forEach(button => {
    const active = !showFavorites && button.dataset.kind === selectedKind;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function render() {
  const filtered = filteredResources();
  const shown = filtered.slice(0, visibleLimit);
  grid.innerHTML = "";
  shown.forEach(resource => grid.appendChild(makeCard(resource)));
  grid.hidden = filtered.length === 0;
  empty.classList.toggle("visible", filtered.length === 0);
  $("#showingBadge").textContent = `Mostrando ${filtered.length} ${filtered.length === 1 ? "recurso" : "recursos"}`;
  $("#loadMore").textContent = `Mostrar ${Math.min(PAGE_SIZE, filtered.length - shown.length)} más`;
  $("#loadMore").hidden = shown.length >= filtered.length;
  loadZone.classList.toggle("visible", shown.length < filtered.length);
  $("#favoriteCount").textContent = favorites.size;
  renderActiveFilters();
  syncNavigation();
}

function resetFilters() {
  search.value = "";
  area.value = "";
  level.value = "";
  selectedKind = "";
  showFavorites = false;
  visibleLimit = PAGE_SIZE;
  render();
}

function chooseView(view) {
  if (view === "all") {
    resetFilters();
  } else {
    selectedKind = view;
    showFavorites = false;
    visibleLimit = PAGE_SIZE;
    render();
  }
  $("#recursos").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function chooseTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#lightTheme").classList.toggle("active", theme === "light");
  $("#darkTheme").classList.toggle("active", theme === "dark");
  $("#lightTheme").setAttribute("aria-pressed", String(theme === "light"));
  $("#darkTheme").setAttribute("aria-pressed", String(theme === "dark"));
  document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#fffaf0" : "#1c1526";
  try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* Sin persistencia */ }
}

fillSelect(area, RESOURCES.map(resource => resource.area));
fillSelect(level, RESOURCES.map(resource => resource.level));
const interactiveCount = RESOURCES.filter(resource => resource.kind === "Interactivo").length;
const portalCount = RESOURCES.filter(resource => resource.kind === "Portal").length;
$("#totalSummary").textContent = RESOURCES.length;
$("#interactiveSummary").textContent = interactiveCount;
$("#portalSummary").textContent = portalCount;
$("#interactiveTotal").textContent = interactiveCount;
$("#portalTotal").textContent = portalCount;

search.addEventListener("input", () => { visibleLimit = PAGE_SIZE; showFavorites = false; render(); });
[area, level].forEach(control => control.addEventListener("change", () => { visibleLimit = PAGE_SIZE; showFavorites = false; render(); }));
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => chooseView(button.dataset.view)));
document.querySelectorAll("[data-kind]").forEach(button => button.addEventListener("click", () => {
  selectedKind = selectedKind === button.dataset.kind ? "" : button.dataset.kind;
  showFavorites = false;
  visibleLimit = PAGE_SIZE;
  render();
}));
$("#favoritesView").addEventListener("click", () => {
  search.value = "";
  area.value = "";
  level.value = "";
  selectedKind = "";
  showFavorites = true;
  visibleLimit = PAGE_SIZE;
  render();
  $("#recursos").scrollIntoView({ behavior: "smooth" });
});
$("#clearSearch").addEventListener("click", () => { search.value = ""; search.focus(); visibleLimit = PAGE_SIZE; render(); });
$("#reset").addEventListener("click", resetFilters);
$("#loadMore").addEventListener("click", () => { visibleLimit += PAGE_SIZE; render(); });
$("#lightTheme").addEventListener("click", () => chooseTheme("light"));
$("#darkTheme").addEventListener("click", () => chooseTheme("dark"));

let initialTheme = "light";
try { initialTheme = localStorage.getItem(THEME_KEY) || "light"; } catch (error) { /* Tema claro */ }
chooseTheme(initialTheme === "dark" ? "dark" : "light");
render();
