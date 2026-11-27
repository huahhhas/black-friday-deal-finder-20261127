// render.js — turns deals into HTML: the deal cards, the list page and
// the detail page. No data lives here; it only reads deals.js through
// filters.js and verdict.js.

import { deals, CATEGORIES, STORES, CHECKED_AT } from "./deals.js";
import { discountPct, dollarsSaved, formatPrice, formatChecked, signalLabel, signalClass } from "./verdict.js";
import { applyFilters, sameProductAcrossStores, SORTS } from "./filters.js";

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function dealCard(d) {
  const pct = discountPct(d);
  const saved = dollarsSaved(d);
  return `
  <article class="card" data-id="${esc(d.id)}">
    <div class="card-top">
      <span class="badge ${signalClass(d.signal)}">${signalLabel(d.signal)}</span>
      <span class="pct">-${pct}%</span>
    </div>
    <h3 class="card-title"><a href="#/deal/${esc(d.id)}">${esc(d.title)}</a></h3>
    <p class="card-meta">${esc(d.store)} &middot; ${esc(d.category)}</p>
    <p class="card-prices">
      <span class="price">${formatPrice(d.price)}</span>
      <span class="was">${formatPrice(d.was)}</span>
      <span class="saved">save ${formatPrice(saved)}</span>
    </p>
    <p class="card-note">${esc(d.note)}</p>
    <p class="card-checked">Checked ${formatChecked(d.checked)} &middot; ${esc(d.source)}</p>
    <p class="card-actions">
      <a class="btn" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a>
      <a class="btn btn-ghost" href="#/deal/${esc(d.id)}">Details</a>
    </p>
  </article>`;
}

function option(value, current, label) {
  return `<option value="${esc(value)}"${value === current ? " selected" : ""}>${esc(label || value)}</option>`;
}

export function renderList(root, f) {
  const shown = applyFilters(deals, f);
  const total = deals.length;
  const newLows = deals.filter((d) => d.signal === "new-low").length;
  const best = shown[0];
  const bestPct = best ? discountPct(best) : 0;

  const catOptions = ["All", ...CATEGORIES].map((c) => option(c, f.category, c === "All" ? "All categories" : c)).join("");
  const storeOptions = ["All", ...STORES].map((s) => option(s, f.store, s === "All" ? "All stores" : s)).join("");
  const discountOptions = [0, 25, 40, 50]
    .map((n) => option(String(n), String(f.minDiscount), n === 0 ? "Any discount" : n + "% off or more"))
    .join("");
  const sortOptions = Object.entries(SORTS)
    .map(([v, label]) => option(v, f.sort, label))
    .join("");

  root.innerHTML = `
  <section class="hero">
    <h1>Black Friday 2026: every real deal, checked today.</h1>
    <p class="hero-sub">${total} deals from ${STORES.length} stores, each price read at the store or in a source
    that names it. No inflated "was" prices, no guesses — every card shows when its price was checked and
    whether it is really a deal.</p>
    <p class="hero-stats">
      <strong>${newLows} new lows</strong> &middot; best cut <strong>-${bestPct}%</strong> &middot;
      prices checked ${formatChecked(CHECKED_AT)}
    </p>
  </section>
  <section class="controls" aria-label="Search and filters">
    <label class="control search-control">Search
      <input id="q" type="search" placeholder="Search products, stores…" value="${esc(f.query)}" autocomplete="off">
    </label>
    <label class="control">Category
      <select id="category">${catOptions}</select>
    </label>
    <label class="control">Store
      <select id="store">${storeOptions}</select>
    </label>
    <label class="control">Discount
      <select id="minDiscount">${discountOptions}</select>
    </label>
    <label class="control">Sort by
      <select id="sort">${sortOptions}</select>
    </label>
    <p class="result-count" id="result-count" aria-live="polite">
      Showing <strong>${shown.length}</strong> of ${total} deals
      ${f.query || f.category !== "All" || f.store !== "All" || f.minDiscount > 0 ? " — filters on" : ""}
    </p>
  </section>
  <section class="grid" id="deal-grid" aria-label="Deals">
    ${shown.length ? shown.map(dealCard).join("") : `<p class="empty">No deals match those filters. Try clearing the search or lowering the discount.</p>`}
  </section>
  <section class="method">
    <h2>How a deal gets on this page</h2>
    <ol>
      <li><strong>Found:</strong> the price was read at the store's own page or in a deals source that names the store — never invented, never copied from another finder.</li>
      <li><strong>Checked:</strong> every card carries the time its price was checked and the source it was read in.</li>
      <li><strong>Scored:</strong> NEW LOW means the lowest price ever tracked for that item; STRONG PRICE is a deep cut near its best; ROUTINE SALE is a small cut or a gift-card offer with no price cut.</li>
      <li><strong>Compared:</strong> the same product at more than one store is shown side by side on its detail page, so the cheapest store wins.</li>
    </ol>
    <p class="method-note">Prices change fast on Black Friday — always confirm the price at the store before you buy. Sale windows: Amazon Nov 19–30, Best Buy Nov 19–28, Target Nov 22–29, Walmart Nov 23–29, Apple Nov 27–30.</p>
  </section>`;
}

export function renderDetail(root, id) {
  const d = deals.find((x) => x.id === id);
  if (!d) {
    root.innerHTML = `<p class="empty">That deal is not on this page. <a href="#/">Back to all deals</a></p>`;
    return;
  }
  const pct = discountPct(d);
  const saved = dollarsSaved(d);
  const others = sameProductAcrossStores(d);
  const compareRows = [d, ...others]
    .slice()
    .sort((a, b) => a.price - b.price)
    .map((x) => {
      const cheapest = x.price === Math.min(...[d, ...others].map((y) => y.price));
      return `<tr${cheapest ? ' class="cheapest"' : ""}>
        <td>${esc(x.store)}${cheapest ? " ★ cheapest" : ""}</td>
        <td>${formatPrice(x.price)}</td>
        <td>${formatPrice(x.was)}</td>
        <td>-${discountPct(x)}%</td>
        <td><a href="${esc(x.url)}" target="_blank" rel="noopener">View at ${esc(x.store)} &rarr;</a></td>
      </tr>`;
    })
    .join("");

  root.innerHTML = `
  <p class="back"><a href="#/">&larr; All deals</a></p>
  <article class="detail">
    <div class="detail-head">
      <span class="badge ${signalClass(d.signal)}">${signalLabel(d.signal)}</span>
      <span class="pct">-${pct}%</span>
    </div>
    <h1>${esc(d.title)}</h1>
    <p class="detail-meta">${esc(d.store)} &middot; ${esc(d.category)}</p>
    <p class="detail-prices">
      <span class="price big">${formatPrice(d.price)}</span>
      <span class="was big">${formatPrice(d.was)}</span>
      <span class="saved big">you save ${formatPrice(saved)} (${pct}% off)</span>
    </p>
    <h2>Is it really a deal?</h2>
    <p>${esc(d.note)}</p>
    ${d.code ? `<p class="deal-code">Code / condition: <strong>${esc(d.code)}</strong></p>` : ""}
    <h2>Price checked</h2>
    <p>Checked <strong>${formatChecked(d.checked)}</strong>. Source: ${esc(d.source)}.
    Prices can change during Black Friday — the store page is the final word.</p>
    <h2>Same product at other stores</h2>
    ${others.length ? `<table class="compare">
      <thead><tr><th>Store</th><th>Sale price</th><th>Usual price</th><th>Off</th><th>Link</th></tr></thead>
      <tbody>${compareRows}</tbody>
    </table>` : `<p>No other store in this list carries this exact product — this is the only price we checked for it.</p>`}
    <p class="card-actions">
      <a class="btn" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a>
    </p>
  </article>`;
}
