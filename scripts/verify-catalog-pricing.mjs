/**
 * Isolated frontend catalog pricing mirror checks.
 * Run: node scripts/verify-catalog-pricing.mjs
 */
import assert from "node:assert/strict";

const PER_POUND = new Set(["bento-cake", "fondant-cake", "buttercream-cake"]);

function isPerPound(slug) {
  return PER_POUND.has(String(slug || "").trim().toLowerCase());
}

function parsePounds(raw) {
  if (raw == null) return null;
  const trimmed = String(raw).trim().toLowerCase();
  if (!trimmed) return null;
  const match = trimmed.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value) || value <= 0 || value > 50) return null;
  return Math.round(value * 100) / 100;
}

function roundPkr(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount);
}

function estimate({ slug, basePrice, quantity, poundsRaw }) {
  const qty =
    typeof quantity === "number" && quantity > 0
      ? Math.min(99, Math.floor(quantity))
      : 1;
  if (basePrice == null || basePrice < 0) {
    return { unitPrice: null, lineTotal: null, mode: "fixed" };
  }
  if (basePrice <= 0) {
    return { unitPrice: 0, lineTotal: 0, mode: "zero" };
  }
  if (!isPerPound(slug)) {
    const unitPrice = roundPkr(basePrice);
    return { unitPrice, lineTotal: roundPkr(unitPrice * qty), mode: "fixed" };
  }
  const pounds = parsePounds(poundsRaw);
  if (pounds == null) {
    return { unitPrice: null, lineTotal: null, mode: "pending" };
  }
  const unitPrice = roundPkr(basePrice * pounds);
  return { unitPrice, lineTotal: roundPkr(unitPrice * qty), mode: "per_pound" };
}

assert.equal(isPerPound("mini-bento-cake"), false);
assert.deepEqual(
  estimate({ slug: "bento-cake", basePrice: 1399, quantity: 1, poundsRaw: "1" }),
  { unitPrice: 1399, lineTotal: 1399, mode: "per_pound" },
);
assert.equal(
  estimate({ slug: "bento-cake", basePrice: 1399, quantity: 2, poundsRaw: "2" })
    .lineTotal,
  5596,
);
assert.equal(
  estimate({ slug: "fondant-cake", basePrice: 1500, quantity: 1, poundsRaw: "3" })
    .lineTotal,
  4500,
);
assert.equal(
  estimate({
    slug: "buttercream-cake",
    basePrice: 1400,
    quantity: 1,
    poundsRaw: "2",
  }).lineTotal,
  2800,
);
assert.equal(
  estimate({ slug: "mini-bento-cake", basePrice: 899, quantity: 2, poundsRaw: "5" })
    .lineTotal,
  1798,
);
assert.equal(
  estimate({
    slug: "classic-birthday-cake",
    basePrice: 0,
    quantity: 1,
    poundsRaw: "3",
  }).lineTotal,
  0,
);
assert.equal(
  estimate({
    slug: "birthday-special-combo",
    basePrice: 3010,
    quantity: 1,
    poundsRaw: "9",
  }).lineTotal,
  3010,
);
assert.equal(
  estimate({ slug: "bento-cake", basePrice: 1399, quantity: 1, poundsRaw: "" })
    .mode,
  "pending",
);

console.log("PASS: frontend catalog pricing mirror checks");
console.log("All frontend catalog pricing checks passed.");
