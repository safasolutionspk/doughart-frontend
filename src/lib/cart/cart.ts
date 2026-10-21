import type { AddToCartInput, CartItem, CartState } from "./types";

export function createCartItemId(cakeSlug: string): string {
  return cakeSlug.trim().toLowerCase();
}

export function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Partial<CartItem>;
  const cakeSlug =
    typeof item.cakeSlug === "string" ? item.cakeSlug.trim() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";

  if (!cakeSlug || !name) {
    return null;
  }

  const quantity =
    typeof item.quantity === "number" && item.quantity > 0
      ? Math.min(99, Math.floor(item.quantity))
      : 1;

  const unitPrice =
    typeof item.unitPrice === "number" && item.unitPrice >= 0
      ? item.unitPrice
      : undefined;

  return {
    id: typeof item.id === "string" ? item.id : createCartItemId(cakeSlug),
    cakeSlug,
    categorySlug:
      typeof item.categorySlug === "string" ? item.categorySlug : undefined,
    name,
    image: typeof item.image === "string" ? item.image : undefined,
    unitPrice,
    quantity,
    notes: typeof item.notes === "string" ? item.notes : undefined,
    itemTypes: Array.isArray(item.itemTypes)
      ? (item.itemTypes.filter(
          (value): value is NonNullable<CartItem["itemTypes"]>[number] =>
            value === "cake" || value === "gift" || value === "other",
        ) as CartItem["itemTypes"])
      : undefined,
  };
}

export function parseCartState(raw: unknown): CartState {
  if (!Array.isArray(raw)) {
    return [];
  }

  const items: CartItem[] = [];
  const seen = new Set<string>();

  for (const entry of raw) {
    const item = normalizeCartItem(entry);
    if (!item || seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    items.push(item);
  }

  return items;
}

export function addToCart(
  cart: CartState,
  input: AddToCartInput,
): CartState {
  const id = createCartItemId(input.cakeSlug);
  const addQty = Math.min(99, Math.max(1, input.quantity ?? 1));
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    return cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.min(99, item.quantity + addQty),
            name: input.name,
            image: input.image ?? item.image,
            unitPrice: input.unitPrice ?? item.unitPrice,
            categorySlug: input.categorySlug ?? item.categorySlug,
            notes: input.notes ?? item.notes,
            itemTypes: input.itemTypes ?? item.itemTypes,
          }
        : item,
    );
  }

  const next: CartItem = {
    id,
    cakeSlug: input.cakeSlug,
    categorySlug: input.categorySlug,
    name: input.name,
    image: input.image,
    unitPrice: input.unitPrice,
    quantity: addQty,
    notes: input.notes,
    itemTypes: input.itemTypes,
  };

  return [...cart, next];
}

export function removeFromCart(cart: CartState, id: string): CartState {
  return cart.filter((item) => item.id !== id);
}

export function updateCartQuantity(
  cart: CartState,
  id: string,
  quantity: number,
): CartState {
  if (quantity <= 0) {
    return removeFromCart(cart, id);
  }

  const qty = Math.min(99, Math.floor(quantity));

  return cart.map((item) =>
    item.id === id ? { ...item, quantity: qty } : item,
  );
}

export function clearCart(): CartState {
  return [];
}

export function getCartCount(cart: CartState): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(cart: CartState): number {
  return cart.reduce((sum, item) => {
    if (item.unitPrice == null) {
      return sum;
    }
    return sum + item.unitPrice * item.quantity;
  }, 0);
}

export function hasPricedItems(cart: CartState): boolean {
  return cart.some((item) => item.unitPrice != null && item.unitPrice > 0);
}
