"use client";

import { formatPrice } from "@/lib/catalog";
import { getCartSubtotal, hasPricedItems } from "@/lib/cart/cart";
import type { CartItem } from "@/lib/cart/types";
import { cn } from "@/lib/cn";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  className?: string;
};

export function CheckoutOrderSummary({
  items,
  className,
}: CheckoutOrderSummaryProps) {
  if (items.length === 0) {
    return null;
  }

  const subtotal = getCartSubtotal(items);
  const showSubtotal = hasPricedItems(items);

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
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-brand-brown">{item.name}</p>
              <p className="mt-0.5 text-sm text-brand-muted">
                Qty {item.quantity}
                {item.unitPrice != null
                  ? ` · ${formatPrice(item.unitPrice)} each`
                  : null}
              </p>
              {item.notes?.trim() ? (
                <p className="mt-1 text-xs text-brand-muted">{item.notes}</p>
              ) : null}
            </div>
            {item.unitPrice != null ? (
              <p className="shrink-0 font-semibold text-brand-primary">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {showSubtotal ? (
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
          Final pricing will be confirmed after you place your order.
        </p>
      )}
    </section>
  );
}
