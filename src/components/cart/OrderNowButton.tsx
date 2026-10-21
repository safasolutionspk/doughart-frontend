"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { AddToCartInput } from "@/lib/cart/types";

type OrderNowButtonProps = {
  item: Omit<AddToCartInput, "quantity"> & { quantity?: number };
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
};

/**
 * Adds the product to the persisted cart first, then routes to checkout.
 * Guest checkout is supported — login is not required.
 */
export function OrderNowButton({
  item,
  size = "lg",
  className,
  label = "Order Now",
  variant = "primary",
}: OrderNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [pending, setPending] = useState(false);

  function handleClick() {
    if (pending) {
      return;
    }
    setPending(true);

    addItem({
      ...item,
      quantity: item.quantity ?? 1,
    });

    router.push("/checkout");
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={handleClick}
      disabled={pending}
      aria-label={`${label}: ${item.name}`}
    >
      {pending ? "Continuing…" : label}
    </Button>
  );
}
