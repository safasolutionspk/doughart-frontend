"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addToCart,
  clearCart,
  getCartCount,
  getCartSubtotal,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart/cart";
import { loadCartFromStorage, saveCartToStorage } from "@/lib/cart/storage";
import type { AddToCartInput, CartItem, CartState } from "@/lib/cart/types";

type CartContextValue = {
  items: CartState;
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (input: AddToCartInput) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartStoreState = {
  items: CartState;
  hydrated: boolean;
};

const SERVER_CART_SNAPSHOT: CartStoreState = {
  items: [],
  hydrated: false,
};

let cartState: CartStoreState = {
  items: [],
  hydrated: false,
};

const cartListeners = new Set<() => void>();
let cartInitialized = false;

function notifyCartStore() {
  for (const listener of cartListeners) {
    listener();
  }
}

function setCartState(next: CartStoreState, persist = true) {
  cartState = next;
  if (persist && next.hydrated) {
    saveCartToStorage(next.items);
  }
  notifyCartStore();
}

function initializeCartStore() {
  if (cartInitialized) {
    return;
  }
  cartInitialized = true;
  setCartState({ items: loadCartFromStorage(), hydrated: true }, false);
}

function subscribeCartStore(listener: () => void) {
  cartListeners.add(listener);
  initializeCartStore();
  return () => {
    cartListeners.delete(listener);
  };
}

function getCartSnapshot() {
  return cartState;
}

function getCartServerSnapshot(): CartStoreState {
  return SERVER_CART_SNAPSHOT;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, hydrated } = useSyncExternalStore(
    subscribeCartStore,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const addItem = useCallback((input: AddToCartInput) => {
    initializeCartStore();
    setCartState({
      items: addToCart(cartState.items, input),
      hydrated: true,
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    initializeCartStore();
    setCartState({
      items: removeFromCart(cartState.items, id),
      hydrated: true,
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    initializeCartStore();
    setCartState({
      items: updateCartQuantity(cartState.items, id, quantity),
      hydrated: true,
    });
  }, []);

  const clear = useCallback(() => {
    initializeCartStore();
    setCartState({
      items: clearCart(),
      hydrated: true,
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      itemCount: hydrated ? getCartCount(items) : 0,
      subtotal: hydrated ? getCartSubtotal(items) : 0,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [items, hydrated, addItem, removeItem, setQuantity, clear],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export type { CartItem };
