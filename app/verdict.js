// verdict.js — the "is it really a deal?" signal for each deal.
// The discount is always computed from the two prices, never typed in.
// A signal is only as good as its evidence, so every verdict carries the
// one-line evidence note stored with the deal in deals.js.

export function discountPct(deal) {
  if (!deal.was || deal.was <= 0) return 0;
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function dollarsSaved(deal) {
  return Math.max(0, deal.was - deal.price);
}

export function signalLabel(signal) {
  if (signal === "new-low") return "NEW LOW";
  if (signal === "strong") return "STRONG PRICE";
  return "ROUTINE SALE";
}

export function signalClass(signal) {
  if (signal === "new-low") return "signal-new-low";
  if (signal === "strong") return "signal-strong";
  return "signal-routine";
}

// A deal score out of 100, used for the default "Best first" sort: the
// discount matters most, then the dollars saved, with a bonus for a tracked
// all-time low and a penalty for a no-cut offer.
export function dealScore(deal) {
  const pct = discountPct(deal);
  const saved = dollarsSaved(deal);
  let score = pct * 1.2 + Math.min(30, saved / 10);
  if (deal.signal === "new-low") score += 15;
  if (deal.signal === "routine") score -= 10;
  return Math.round(score);
}

export function formatPrice(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

export function formatChecked(iso) {
  const d = new Date(iso);
  return d.toUTCString().slice(0, 22) + " UTC";
}
