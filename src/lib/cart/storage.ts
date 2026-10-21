import { parseCartState } from "./cart";
import { CART_STORAGE_KEY, type CartState } from "./types";

export function loadCartFromStorage(): CartState {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return parseCartState(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveCartToStorage(cart: CartState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Quota or private mode — cart stays in memory for session
  }
}
