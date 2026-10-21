import type { ItemType } from "@/lib/itemTypes";
import { normalizeItemTypes } from "@/lib/itemTypes";

export const CART_STORAGE_KEY = "sweetbite_cart_v1";

export type CartItem = {
  id: string;
  cakeSlug: string;
  categorySlug?: string;
  name: string;
  image?: string;
  unitPrice?: number;
  quantity: number;
  notes?: string;
  /** Snapshot from catalog; missing → treated as cake for legacy carts. */
  itemTypes?: ItemType[];
};

export type CartState = CartItem[];

export type AddToCartInput = {
  cakeSlug: string;
  categorySlug?: string;
  name: string;
  image?: string;
  unitPrice?: number;
  quantity?: number;
  notes?: string;
  itemTypes?: ItemType[];
};

export function getCartItemTypes(item: Pick<CartItem, "itemTypes">): ItemType[] {
  return normalizeItemTypes(item.itemTypes);
}
