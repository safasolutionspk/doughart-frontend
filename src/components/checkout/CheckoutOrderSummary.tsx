"use client";

import { formatPrice } from "@/lib/catalog";
import {
  estimateCatalogLinePrice,
  isPerPoundCatalogSlug,
} from "@/lib/catalogPricing";
import { hasPricedItems } from "@/lib/cart/cart";
import type { CartItem } from "@/lib/cart/types";
import type { CheckoutLineDetails } from "@/lib/itemTypes";
import { cn } from "@/lib/cn";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  lineDetails?: Record<string, CheckoutLineDetails>;
  className?: string;
};

export function CheckoutOrderSummary({
  items,
  lineDetails = {},
  className,
}: CheckoutOrderSummaryProps) {
  if (items.length === 0) {
    return null;
  }

  const priced = hasPricedItems(items);

  const rows = items.map((item) => {
    const poundsRaw = lineDetails[item.id]?.cake?.size;
    const estimate = estimateCatalogLinePrice({
      slug: item.cakeSlug,
      basePrice: item.unitPrice,
      quantity: item.quantity,
      poundsRaw,
    });

    const perPound = isPerPoundCatalogSlug(item.cakeSlug) && (item.unitPrice ?? 0) > 0;

    return {
      item,
      estimate,
      perPound,
      unitLabel: perPound
        ? `${formatPrice(item.unitPrice ?? 0)} / pound`
        : item.unitPrice != null
          ? `${formatPrice(item.unitPrice)} each`
          : null,
    };
  });

  const subtotal = rows.reduce(
    (sum, row) => sum + (row.estimate.lineTotal ?? 0),
    0,
  );
  const subtotalComplete =
    priced &&
    !rows.some((row) => row.estimate.pricingMode === "per_pound_pending");

  return (
    <section
      className={cn(
        "rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
        Order summary
      </h2>
      <ul className="mt-4 divide-y divide-brand-border/60">
        {rows.map(({ item, estimate, unitLabel, perPound }) => (
          <li
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-brand-brown">{item.name}</p>
              <p className="mt-0.5 text-sm text-brand-muted">
                Qty {item.quantity}
                {unitLabel ? ` · ${unitLabel}` : null}
                {estimate.pounds != null ? ` · ${estimate.pounds} pound${estimate.pounds === 1 ? "" : "s"}` : null}
              </p>
              {perPound && estimate.pricingMode === "per_pound_pending" ? (
                <p className="mt-1 text-xs text-brand-muted">
                  Enter Pounds below to calculate the line total.
                </p>
              ) : null}
              {item.notes?.trim() ? (
                <p className="mt-1 text-xs text-brand-muted">{item.notes}</p>
              ) : null}
            </div>
            {estimate.lineTotal != null ? (
              <p className="shrink-0 font-semibold text-brand-primary">
                {formatPrice(estimate.lineTotal)}
              </p>
            ) : perPound ? (
              <p className="shrink-0 text-sm text-brand-muted">Pending</p>
            ) : null}
          </li>
        ))}
      </ul>
      {priced && subtotalComplete ? (
        <div className="mt-4 flex items-center justify-between border-t border-brand-border/60 pt-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
            Subtotal
          </span>
          <span className="font-display text-xl font-semibold text-brand-primary">
            {formatPrice(subtotal)}
          </span>
        </div>
      ) : (
        <p className="mt-4 border-t border-brand-border/60 pt-4 text-sm text-brand-muted">
          {priced
            ? "Enter Pounds for per-pound cakes to see the full total."
            : "Final pricing will be confirmed after you place your order."}
        </p>
      )}
    </section>
  );
}
