// filters.js — search, filter and sort state for the deal list.
// One job: turn the full deal list plus the current controls into the
// deals the page shows, in the order the shopper asked for.

import { deals } from "./deals.js";
import { dealScore, discountPct } from "./verdict.js";

export const SORTS = {
  best: "Best first",
  discount: "Biggest % off",
  savings: "Most dollars off",
  priceAsc: "Price: low to high",
  priceDesc: "Price: high to low",
};

export function defaultFilters() {
  return { query: "", category: "All", store: "All", minDiscount: 0, sort: "best" };
}

// Read the starting filters from the URL (?q=, ?category=, ?store=,
// ?minDiscount=, ?sort=) so a filtered view is a real, shareable state.
export function filtersFromUrl() {
  const f = defaultFilters();
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) f.query = q;
  const cat = params.get("category");
  if (cat) f.category = cat;
  const store = params.get("store");
  if (store) f.store = store;
  const min = Number.parseInt(params.get("minDiscount") || "", 10);
  if (Number.isFinite(min) && min > 0) f.minDiscount = min;
  const sort = params.get("sort");
  if (sort && sort in SORTS) f.sort = sort;
  return f;
}

export function applyFilters(list, f) {
  const query = f.query.trim().toLowerCase();
  let out = list.filter((d) => {
    if (f.category !== "All" && d.category !== f.category) return false;
    if (f.store !== "All" && d.store !== f.store) return false;
    if (discountPct(d) < f.minDiscount) return false;
    if (query) {
      const hay = (d.title + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
  const by = {
    best: (a, b) => dealScore(b) - dealScore(a),
    discount: (a, b) => discountPct(b) - discountPct(a),
    savings: (a, b) => (b.was - b.price) - (a.was - a.price),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
  };
  out = out.slice().sort(by[f.sort] || by.best);
  return out;
}

// Other stores selling the same product, for the cross-store comparison
// on a deal's detail page. Products match on their normalised title.
export function sameProductAcrossStores(deal) {
  const key = deal.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return deals.filter(
    (d) => d.id !== deal.id && d.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === key,
  );
}

export function countByCategory(list) {
  const counts = {};
  for (const d of list) counts[d.category] = (counts[d.category] || 0) + 1;
  return counts;
}
