"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/cn";

type CartIconLinkProps = {
  className?: string;
  onNavigate?: () => void;
};

export function CartIconLink({ className, onNavigate }: CartIconLinkProps) {
  const { itemCount, hydrated } = useCart();
  const showBadge = hydrated && itemCount > 0;

  return (
    <Link
      href="/cart"
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border text-brand-brown transition-colors hover:border-brand-primary hover:bg-brand-pink-lighter hover:text-brand-primary sm:h-10 sm:w-10",
        className,
      )}
      aria-label={
        showBadge ? `Cart, ${itemCount} items` : "Cart, empty"
      }
      onClick={onNavigate}
    >
      <CartBagIcon className="h-5 w-5" />
      {showBadge ? (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold leading-none text-white"
          aria-hidden
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}

function CartBagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h15l-1.5 9h-12L6 6z"
      />
      <path strokeLinecap="round" d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
