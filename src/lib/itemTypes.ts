export const ITEM_TYPES = ["cake", "gift", "other"] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export const DEFAULT_ITEM_TYPES: ItemType[] = ["cake"];

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  cake: "Cake",
  gift: "Gift",
  other: "Other",
};

export function isItemType(value: unknown): value is ItemType {
  return typeof value === "string" && (ITEM_TYPES as readonly string[]).includes(value);
}

export function normalizeItemTypes(raw?: unknown): ItemType[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [...DEFAULT_ITEM_TYPES];
  }

  const unique: ItemType[] = [];
  for (const value of raw) {
    if (isItemType(value) && !unique.includes(value)) {
      unique.push(value);
    }
  }

  return unique.length > 0 ? unique : [...DEFAULT_ITEM_TYPES];
}

export function hasItemType(
  types: readonly ItemType[] | undefined,
  type: ItemType,
): boolean {
  return normalizeItemTypes(types).includes(type);
}

export type CakeDetailsForm = {
  size: string;
  flavor: string;
  message: string;
  notes: string;
};

export type GiftDetailsForm = {
  notes: string;
};

export type ProductDetailsForm = {
  notes: string;
};

export type CheckoutLineDetails = {
  cake?: CakeDetailsForm;
  gift?: GiftDetailsForm;
  other?: ProductDetailsForm;
};

export const emptyCakeDetails = (): CakeDetailsForm => ({
  size: "",
  flavor: "",
  message: "",
  notes: "",
});

export const emptyGiftDetails = (): GiftDetailsForm => ({
  notes: "",
});

export const emptyProductDetails = (): ProductDetailsForm => ({
  notes: "",
});

export function emptyLineDetailsForTypes(
  types: readonly ItemType[],
): CheckoutLineDetails {
  const normalized = normalizeItemTypes(types);
  const details: CheckoutLineDetails = {};
  if (normalized.includes("cake")) {
    details.cake = emptyCakeDetails();
  }
  if (normalized.includes("gift")) {
    details.gift = emptyGiftDetails();
  }
  if (normalized.includes("other")) {
    details.other = emptyProductDetails();
  }
  return details;
}
