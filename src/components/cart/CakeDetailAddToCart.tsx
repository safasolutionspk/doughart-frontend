"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { OrderNowButton } from "@/components/cart/OrderNowButton";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/catalog";
import {
  estimateCatalogLinePrice,
  formatCatalogListPrice,
  isPerPoundCatalogSlug,
} from "@/lib/catalogPricing";
import { cn } from "@/lib/cn";
import type { AddToCartInput } from "@/lib/cart/types";

type CakeDetailAddToCartProps = {
  item: Omit<AddToCartInput, "quantity">;
  className?: string;
  whatsappHref?: string;
};

export function CakeDetailAddToCart({
  item,
  className,
  whatsappHref,
}: CakeDetailAddToCartProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const perPound =
    isPerPoundCatalogSlug(item.cakeSlug) && (item.unitPrice ?? 0) > 0;
  const liveEstimate = useMemo(
    () =>
      estimateCatalogLinePrice({
        slug: item.cakeSlug,
        basePrice: item.unitPrice,
        quantity,
        // Pounds are collected on checkout with the existing Pounds field.
        poundsRaw: perPound ? "1" : undefined,
      }),
    [item.cakeSlug, item.unitPrice, quantity, perPound],
  );

  function handleAdd() {
    addItem({ ...item, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="cake-detail-qty"
          className="text-xs font-semibold uppercase tracking-wide text-brand-brown"
        >
          Quantity
        </label>
        <div className="inline-flex items-center rounded-full border border-brand-border bg-white">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-l-full text-brand-brown hover:bg-brand-pink-lighter disabled:opacity-40"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            id="cake-detail-qty"
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => {
              const next = Number.parseInt(e.target.value, 10);
              if (!Number.isNaN(next)) {
                setQuantity(Math.min(99, Math.max(1, next)));
              }
            }}
            className="h-9 w-12 border-x border-brand-border bg-transparent text-center text-sm font-semibold text-brand-brown outline-none"
            aria-label="Quantity"
          />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-r-full text-brand-brown hover:bg-brand-pink-lighter disabled:opacity-40"
            aria-label="Increase quantity"
            disabled={quantity >= 99}
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            +
          </button>
        </div>
      </div>

      {item.unitPrice != null && item.unitPrice > 0 ? (
        <p className="text-sm text-brand-brown">
          {perPound ? (
            <>
              <span className="font-semibold text-brand-primary">
                {formatCatalogListPrice(
                  item.cakeSlug,
                  item.unitPrice,
                  formatPrice,
                )}
              </span>
              <span className="text-brand-muted">
                {" "}
                · {quantity} cake{quantity === 1 ? "" : "s"} · total set when
                you enter Pounds at checkout
                {liveEstimate.lineTotal != null
                  ? ` (e.g. 1 pound = ${formatPrice(liveEstimate.lineTotal)})`
                  : null}
              </span>
            </>
          ) : liveEstimate.lineTotal != null ? (
            <>
              <span className="text-brand-muted">Line total </span>
              <span className="font-semibold text-brand-primary">
                {formatPrice(liveEstimate.lineTotal)}
              </span>
            </>
          ) : null}
        </p>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full sm:w-auto sm:min-w-[12rem]"
        onClick={handleAdd}
      >
        {added ? "Added to Cart ✓" : "Add to Cart"}
      </Button>

      {added ? (
        <p
          className="text-sm font-medium text-brand-primary"
          role="status"
          aria-live="polite"
        >
          {item.name} was added to your cart.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <OrderNowButton
          item={{ ...item, quantity }}
          size="lg"
          className="w-full sm:w-auto sm:flex-1 sm:max-w-xs"
        />
        {whatsappHref ? (
          <Button
            href={whatsappHref}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto sm:flex-1 sm:max-w-xs"
          >
            WhatsApp Order
          </Button>
        ) : null}
      </div>
    </div>
  );
}
