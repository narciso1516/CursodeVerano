const RESOURCES = window.CATALOG_RESOURCES || [];
const PAGE_SIZE = 18;
const AREA_META = {
  "Ciencias y ambiente": { icon: "✦", color: "#258c79", soft: "#e3f4ef" },
  "Desarrollo socioemocional": { icon: "♡", color: "#d65d77", soft: "#fbe9ee" },
  "Emprendimiento": { icon: "↗", color: "#b87321", soft: "#faeedb" },
  "Formación docente": { icon: "◎", color: "#5d68b5", soft: "#eaeafb" },
  "Humanidades": { icon: "◇", color: "#8f579f", soft: "#f3e8f5" },
  "Inglés": { icon: "A", color: "#3276b1", soft: "#e5f0f9" },
  "Lengua y comunicación": { icon: "✎", color: "#c75b43", soft: "#f9e9e4" },
  "Lenguajes y artes": { icon: "♪", color: "#a65783", soft: "#f6e8f0" },
  "Matemáticas": { icon: "+", color: "#5a65b6", soft: "#e9eafb" },
  "Multidisciplinar": { icon: "◌", color: "#238c9b", soft: "#e2f2f4" }
};
const ALL_META = { icon: "✦", color: "#7a45c6", soft: "#f1eafb" };
const $ = selector => document.querySelector(selector);
const grid = $("#grid");
const search = $("#search");
const area = $("#area");
const level = $("#level");
const sort = $("#sort");
const empty = $("#empty");
const loadZone = $("#loadZone");
const filterSummary = $("#filterSummary");
let selectedKind = "";
let visibleLimit = PAGE_SIZE;
let compact = false;
let toastTimer;

const norm = value => (value || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const uniqueSorted = values => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
const metaFor = name => AREA_META[name] || ALL_META;
const create = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

function fillSelect(select, values) {
  uniqueSorted(values).forEach(value => {
    const option = create("option", "", value);
    option.value = value;
    select.appendChild(option);
  });
}

function renderAreaNavigation() {
  const areaNav = $("#areaNav");
  const counts = RESOURCES.reduce((acc, resource) => {
    acc[resource.area] = (acc[resource.area] || 0) + 1;
    return acc;
  }, {});
  const entries = [
    { name: "", label: "Todo el catálogo", count: RESOURCES.length },
    ...uniqueSorted(RESOURCES.map(resource => resource.area)).map(name => ({ name, label: name, count: counts[name] }))
  ];
  areaNav.innerHTML = "";
  entries.forEach(entry => {
    const meta = entry.name ? metaFor(entry.name) : ALL_META;
    const button = create("button", "area-button");
    button.type = "button";
    button.dataset.area = entry.name;
    button.style.setProperty("--area-color", meta.color);
    button.style.setProperty("--area-soft", meta.soft);
    button.setAttribute("aria-pressed", String(area.value === entry.name));
    if (area.value === entry.name) button.classList.add("active");
    const icon = create("span", "area-icon", meta.icon);
    icon.setAttribute("aria-hidden", "true");
    button.append(icon, create("strong", "", entry.label), create("span", "", `${entry.count} ${entry.count === 1 ? "recurso" : "recursos"}`));
    button.addEventListener("click", () => {
      area.value = entry.name;
      visibleLimit = PAGE_SIZE;
      render();
      $("#catalogo").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    areaNav.appendChild(button);
  });
}

function filteredResources() {
  const query = norm(search.value);
  const result = RESOURCES.filter(resource =>
    (!selectedKind || resource.kind === selectedKind) &&
    (!area.value || resource.area === area.value) &&
    (!level.value || resource.level === level.value) &&
    (!query || norm([resource.title, resource.area, resource.level, resource.objective, resource.type].join(" ")).includes(query))
  );
  if (sort.value === "az") result.sort((a, b) => a.title.localeCompare(b.title, "es"));
  if (sort.value === "za") result.sort((a, b) => b.title.localeCompare(a.title, "es"));
  return result;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1700);
}

function makeCard(resource) {
  const meta = metaFor(resource.area);
  const card = create("article", "resource-card");
  card.style.setProperty("--area-color", meta.color);
  card.style.setProperty("--area-soft", meta.soft);

  const top = create("div", "card-top");
  const areaLabel = create("span", "area-label");
  const areaIcon = create("span", "", meta.icon);
  areaIcon.setAttribute("aria-hidden", "true");
  areaLabel.append(areaIcon, create("span", "", resource.area));
  const status = create("span", "status", "Verificado");
  status.title = resource.status || "Enlace disponible";
  top.append(areaLabel, status);

  const title = create("h4", "", resource.title);
  const metaRow = create("div", "card-meta");
  [resource.level, resource.type, resource.kind].filter(Boolean).forEach(value => metaRow.appendChild(create("span", "meta-chip", value)));
  const objective = create("p", "objective", resource.objective);
  card.append(top, title, metaRow, objective);

  if (norm(resource.use).includes("personalizado")) {
    card.appendChild(create("p", "use-note", "ⓘ Material personalizado: revisa nombres y contenido antes de reutilizarlo."));
  }

  const actions = create("div", "card-actions");
  const link = create("a", "open-resource", "Abrir recurso ↗");
  link.href = resource.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", `Abrir ${resource.title} en una pestaña nueva`);
  const copy = create("button", "copy-resource", "⧉");
  copy.type = "button";
  copy.title = "Copiar enlace";
  copy.setAttribute("aria-label", `Copiar enlace de ${resource.title}`);
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(resource.url);
      copy.textContent = "✓";
      showToast("Enlace copiado");
      setTimeout(() => { copy.textContent = "⧉"; }, 1200);
    } catch (error) {
      window.prompt("Copia este enlace:", resource.url);
    }
  });
  actions.append(link, copy);
  card.appendChild(actions);
  return card;
}

function renderFilterSummary() {
  const items = [];
  if (search.value.trim()) items.push({ label: `Búsqueda: ${search.value.trim()}`, clear: () => { search.value = ""; } });
  if (area.value) items.push({ label: area.value, clear: () => { area.value = ""; } });
  if (level.value) items.push({ label: level.value, clear: () => { level.value = ""; } });
  if (selectedKind) items.push({ label: selectedKind, clear: () => { selectedKind = ""; syncKindButtons(); } });
  filterSummary.innerHTML = "";
  items.forEach(item => {
    const button = create("button", "filter-chip", `${item.label} ×`);
    button.type = "button";
    button.setAttribute("aria-label", `Quitar filtro ${item.label}`);
    button.addEventListener("click", () => {
      item.clear();
      visibleLimit = PAGE_SIZE;
      render();
    });
    filterSummary.appendChild(button);
  });
  filterSummary.classList.toggle("visible", items.length > 0);
  $("#reset").disabled = items.length === 0 && sort.value === "original";
  $("#clearSearch").classList.toggle("visible", Boolean(search.value));
}

function syncKindButtons() {
  document.querySelectorAll("[data-kind]").forEach(button => {
    const active = button.dataset.kind === selectedKind;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function render() {
  const filtered = filteredResources();
  const shown = filtered.slice(0, visibleLimit);
  grid.innerHTML = "";
  shown.forEach(resource => grid.appendChild(makeCard(resource)));
  grid.classList.toggle("compact", compact);
  $("#resultCount").textContent = filtered.length;
  $("#resultHint").textContent = filtered.length === RESOURCES.length ? "Mostrando todo el catálogo." : "Resultados actualizados con tus filtros.";
  empty.classList.toggle("visible", filtered.length === 0);
  grid.hidden = filtered.length === 0;
  const hasMore = shown.length < filtered.length;
  loadZone.classList.toggle("visible", filtered.length > 0);
  $("#shownCount").textContent = `Mostrando ${shown.length} de ${filtered.length} recursos`;
  $("#progressBar").style.width = `${filtered.length ? Math.round((shown.length / filtered.length) * 100) : 0}%`;
  $("#loadMore").hidden = !hasMore;
  $("#loadMore").textContent = `Mostrar ${Math.min(PAGE_SIZE, filtered.length - shown.length)} más`;
  renderFilterSummary();
  renderAreaNavigation();
}

function resetFilters() {
  search.value = "";
  area.value = "";
  level.value = "";
  sort.value = "original";
  selectedKind = "";
  visibleLimit = PAGE_SIZE;
  syncKindButtons();
  render();
}

fillSelect(area, RESOURCES.map(resource => resource.area));
fillSelect(level, RESOURCES.map(resource => resource.level));
$("#totalHero").textContent = RESOURCES.length;
$("#areaTotal").textContent = uniqueSorted(RESOURCES.map(resource => resource.area)).length;

search.addEventListener("input", () => { visibleLimit = PAGE_SIZE; render(); });
[area, level, sort].forEach(control => control.addEventListener("change", () => { visibleLimit = PAGE_SIZE; render(); }));
document.querySelectorAll("[data-kind]").forEach(button => button.addEventListener("click", () => {
  selectedKind = button.dataset.kind;
  visibleLimit = PAGE_SIZE;
  syncKindButtons();
  render();
}));
$("#clearSearch").addEventListener("click", () => {
  search.value = "";
  search.focus();
  visibleLimit = PAGE_SIZE;
  render();
});
$("#reset").addEventListener("click", resetFilters);
$("#loadMore").addEventListener("click", () => { visibleLimit += PAGE_SIZE; render(); });
$("#comfortableView").addEventListener("click", () => {
  compact = false;
  $("#comfortableView").classList.add("active");
  $("#compactView").classList.remove("active");
  $("#comfortableView").setAttribute("aria-pressed", "true");
  $("#compactView").setAttribute("aria-pressed", "false");
  render();
});
$("#compactView").addEventListener("click", () => {
  compact = true;
  $("#compactView").classList.add("active");
  $("#comfortableView").classList.remove("active");
  $("#compactView").setAttribute("aria-pressed", "true");
  $("#comfortableView").setAttribute("aria-pressed", "false");
  render();
});
window.addEventListener("scroll", () => $("#backTop").classList.toggle("visible", window.scrollY > 700), { passive: true });
$("#backTop").addEventListener("click", () => window.scrollTo({
  top: 0,
  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
}));

render();
