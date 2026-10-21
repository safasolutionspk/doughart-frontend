"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/catalog";
import { hasPricedItems } from "@/lib/cart/cart";
import { cn } from "@/lib/cn";
import { siteImages } from "@/lib/images";
import { isBackendUploadImageUrl } from "@/lib/media";

export function CartPageContent() {
  const { items, hydrated, subtotal, removeItem, setQuantity } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-4">
        <div className="h-24 rounded-2xl bg-brand-pink-lighter/60" />
        <div className="h-24 rounded-2xl bg-brand-pink-lighter/60" />
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  const showSubtotal = hasPricedItems(items);

  return (
    <div className="mx-auto max-w-3xl">
      <ul className="space-y-4">
        {items.map((item) => {
          const detailHref = item.categorySlug
            ? `/cakes/${item.categorySlug}/${item.cakeSlug}`
            : `/cakes/all`;
          const imageSrc = item.image || siteImages.categories.all;
          const isRemote = isBackendUploadImageUrl(imageSrc);

          return (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-brand-border/70 bg-white p-4 shadow-sm sm:gap-5 sm:p-5"
            >
              <Link
                href={detailHref}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-border/60 bg-brand-pink-lighter sm:h-24 sm:w-24"
              >
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized={isRemote}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={detailHref}
                      className="font-display text-base font-semibold text-brand-brown hover:text-brand-primary sm:text-lg"
                    >
                      {item.name}
                    </Link>
                    {item.unitPrice != null ? (
                      <p className="mt-0.5 text-sm font-semibold text-brand-primary">
                        {formatPrice(item.unitPrice)}
                        <span className="font-normal text-brand-muted">
                          {" "}
                          each
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-brand-muted transition-colors hover:bg-brand-pink-lighter hover:text-brand-primary"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full border border-brand-border bg-white">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-l-full text-brand-brown hover:bg-brand-pink-lighter disabled:opacity-40"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        setQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span
                      className="min-w-[2rem] border-x border-brand-border px-2 text-center text-sm font-semibold text-brand-brown"
                      aria-label={`Quantity ${item.quantity}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-r-full text-brand-brown hover:bg-brand-pink-lighter disabled:opacity-40"
                      aria-label={`Increase quantity of ${item.name}`}
                      disabled={item.quantity >= 99}
                      onClick={() =>
                        setQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {item.unitPrice != null ? (
                    <p className="text-sm font-semibold text-brand-brown">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className={cn(
          "mt-8 rounded-2xl border border-brand-border/70 bg-gradient-to-b from-white to-brand-pink-lighter/30 p-5 shadow-sm sm:p-6",
        )}
      >
        {showSubtotal ? (
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
              Subtotal
            </span>
            <span className="font-display text-xl font-semibold text-brand-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
        ) : (
          <p className="border-b border-brand-border/60 pb-4 text-sm text-brand-muted">
            Prices will be confirmed when you complete checkout.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button href="/cakes" variant="outline" className="w-full sm:flex-1">
            Continue Shopping
          </Button>
          <Button href="/checkout" className="w-full sm:flex-1">
            Checkout
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-brand-muted">
          Guest cart — saved on this device. Login not required.
        </p>
      </div>
    </div>
  );
}
