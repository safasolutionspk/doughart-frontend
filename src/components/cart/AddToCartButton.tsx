"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { AddToCartInput } from "@/lib/cart/types";

type AddToCartButtonProps = {
  item: AddToCartInput;
  size?: "sm" | "md" | "lg";
  className?: string;
  showAddedFeedback?: boolean;
};

export function AddToCartButton({
  item,
  size = "sm",
  className,
  showAddedFeedback = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(item);
    if (showAddedFeedback) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2500);
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        size={size}
        className="w-full"
        onClick={handleClick}
        aria-label={`Add ${item.name} to cart`}
      >
        {added ? "Added ✓" : "Add to Cart"}
      </Button>
      {showAddedFeedback && added ? (
        <p
          className="text-center text-xs font-medium text-brand-primary"
          role="status"
          aria-live="polite"
        >
          Added to your cart
        </p>
      ) : null}
    </div>
  );
}
