// main.js — boots DealBeacon: routes (#/ list, #/deal/<id> detail),
// wires the search and filter controls, and re-renders on every change.

import { deals } from "./deals.js";
import { filtersFromUrl, defaultFilters } from "./filters.js";
import { renderList, renderDetail } from "./render.js";

const root = document.getElementById("app");

let filters = filtersFromUrl();

function render() {
  const hash = window.location.hash || "#/";
  const match = hash.match(/^#\/deal\/([\w-]+)$/);
  if (match) {
    renderDetail(root, match[1]);
    window.scrollTo(0, 0);
    return;
  }
  renderList(root, filters);
  wireControls();
}

function wireControls() {
  const q = document.getElementById("q");
  const category = document.getElementById("category");
  const store = document.getElementById("store");
  const minDiscount = document.getElementById("minDiscount");
  const sort = document.getElementById("sort");
  if (!q) return;
  q.addEventListener("input", () => {
    filters.query = q.value;
    refreshGrid();
  });
  category.addEventListener("change", () => {
    filters.category = category.value;
    refreshGrid();
  });
  store.addEventListener("change", () => {
    filters.store = store.value;
    refreshGrid();
  });
  minDiscount.addEventListener("change", () => {
    filters.minDiscount = Number(minDiscount.value);
    refreshGrid();
  });
  sort.addEventListener("change", () => {
    filters.sort = sort.value;
    refreshGrid();
  });
}

function refreshGrid() {
  // Re-render the list in place, keeping the search box focused.
  const active = document.activeElement && document.activeElement.id;
  const selectionStart = active === "q" ? document.getElementById("q").selectionStart : null;
  renderList(root, filters);
  wireControls();
  if (active === "q") {
    const q = document.getElementById("q");
    q.focus();
    if (selectionStart !== null) q.setSelectionRange(selectionStart, selectionStart);
  }
}

window.addEventListener("hashchange", render);
render();
