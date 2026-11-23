/**
 * Frontend mirror of backend catalog pricing rules.
 * Keep slug allowlist and math in sync with backend/src/utils/catalogPricing.ts.
 */

export const PER_POUND_CAKE_SLUGS = [
  "bento-cake",
  "fondant-cake",
  "buttercream-cake",
] as const;

const PER_POUND_SLUG_SET = new Set<string>(PER_POUND_CAKE_SLUGS);

export const MAX_CATALOG_POUNDS = 50;

export function isPerPoundCatalogSlug(slug: string | undefined | null): boolean {
  if (!slug) {
    return false;
  }
  return PER_POUND_SLUG_SET.has(slug.trim().toLowerCase());
}

export function parseCatalogPounds(raw: string | undefined | null): number | null {
  if (raw == null) {
    return null;
  }
  const trimmed = String(raw).trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value) || value <= 0 || value > MAX_CATALOG_POUNDS) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

export function roundPkr(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }
  return Math.round(amount);
}

export type CatalogLinePriceInput = {
  slug: string;
  basePrice: number | null | undefined;
  quantity: number;
  poundsRaw?: string | null;
};

/**
 * Display / checkout estimate for a catalog line.
 * Returns null unit/total when per-pound pounds are not yet entered.
 */
export function estimateCatalogLinePrice(input: CatalogLinePriceInput): {
  unitPrice: number | null;
  lineTotal: number | null;
  pricingMode: "fixed" | "per_pound" | "zero" | "per_pound_pending";
  pounds: number | null;
} {
  const base =
    typeof input.basePrice === "number" && Number.isFinite(input.basePrice)
      ? input.basePrice
      : null;
  const qty =
    typeof input.quantity === "number" && input.quantity > 0
      ? Math.min(99, Math.floor(input.quantity))
      : 1;

  if (base == null || base < 0) {
    return {
      unitPrice: null,
      lineTotal: null,
      pricingMode: "fixed",
      pounds: null,
    };
  }

  if (base <= 0) {
    return {
      unitPrice: 0,
      lineTotal: 0,
      pricingMode: "zero",
      pounds: null,
    };
  }

  if (!isPerPoundCatalogSlug(input.slug)) {
    const unitPrice = roundPkr(base);
    return {
      unitPrice,
      lineTotal: roundPkr(unitPrice * qty),
      pricingMode: "fixed",
      pounds: null,
    };
  }

  const pounds = parseCatalogPounds(input.poundsRaw);
  if (pounds == null) {
    return {
      unitPrice: null,
      lineTotal: null,
      pricingMode: "per_pound_pending",
      pounds: null,
    };
  }

  const unitPrice = roundPkr(base * pounds);
  return {
    unitPrice,
    lineTotal: roundPkr(unitPrice * qty),
    pricingMode: "per_pound",
    pounds,
  };
}

/** Storefront list/detail price label. Keeps "Pounds" wording elsewhere. */
export function formatCatalogListPrice(
  slug: string,
  price: number,
  formatPrice: (n: number) => string,
): string {
  if (!Number.isFinite(price) || price < 0) {
    return formatPrice(0);
  }
  if (price <= 0) {
    return formatPrice(0);
  }
  if (isPerPoundCatalogSlug(slug)) {
    return `${formatPrice(price)} / pound`;
  }
  return formatPrice(price);
}
