[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![main](https://make.fun/badge/black-friday-deal-finder-01/huahhhas/black-friday-deal-finder-20261127/main.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/huahhhas/black-friday-deal-finder-20261127/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/huahhhas/black-friday-deal-finder-20261127/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# DealBeacon — Black Friday 2026 deals, checked

A deal finder for shoppers hunting a real Black Friday bargain: 26 deals from
Amazon, Best Buy, Target, Walmart and Apple, each with its product, store,
sale price, usual price, discount, a link to the product at that store, and
when its price was checked.

## What makes it a finder, not a list

- **Search and filters that work** — search by product or store, filter by
  category, store and minimum discount, sort by best deal, biggest % off,
  most dollars off, or price. Filters can be shared as a URL
  (`?category=Audio&minDiscount=40`).
- **An honest "is it really a deal?" signal on every card** — NEW LOW (the
  lowest price ever tracked for that item), STRONG PRICE (a deep cut near its
  best), or ROUTINE SALE (a small cut, or a gift-card offer with no price cut
  at all — Apple's MacBook Air is flagged as such, not dressed up as a deal).
  Every signal carries its one-line evidence, and the discount is always
  computed from the two prices, never typed in.
- **Same product, compared across stores** — each deal's detail page shows
  every store in this list that carries the exact product, cheapest first.
  AirPods Pro 3 at $149 at both Amazon and Walmart; the MacBook Air M5 at
  $989 at Amazon against $1,049 at Best Buy and full price at Apple.
- **Checked, and it says so** — every card shows the time its price was
  checked (27 Nov 2026, UTC) and the source it was read in: the store's own
  Black Friday release, or a deals source that names the store (9to5Mac,
  9to5Toys, The Verge, Clark Deals, RetailShout, That Shopping Chick).

## How it is built

Static files under `app/`, no build step, no network request: open
`app/index.html` in a browser, or serve it with `node serve.ts`
(http://localhost:8080).

- `app/deals.js` — the 26 deals and the store/category lists.
- `app/verdict.js` — discount math, the deal signal, and the deal score.
- `app/filters.js` — search, filter and sort, plus cross-store matching.
- `app/render.js` — the deal cards, the list page and the detail page.
- `app/main.js` — routing (`#/` list, `#/deal/<id>` detail) and controls.
- `app/style.css` — the dark storefront design, with a phone layout.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.

## Screenshots

Real renders of this site in a browser (see `screenshots/`): the full deal
grid, a filtered view (Audio, 40% off or more), a deal detail page with its
cross-store comparison, and the phone layout.
