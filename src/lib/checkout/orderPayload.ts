import { formatPrice } from "@/lib/catalog";
import { getCartSubtotal } from "@/lib/cart/cart";
import type { CartItem } from "@/lib/cart/types";
import { getCartItemTypes } from "@/lib/cart/types";
import type { PublicOrderPayload } from "@/lib/api";
import { COD_PAYMENT_METHOD } from "@/lib/payment";
import type { CheckoutDraftForm } from "./draft";
import {
  hasItemType,
  type CheckoutLineDetails,
  type ItemType,
} from "@/lib/itemTypes";

export type CheckoutOrderItem = NonNullable<PublicOrderPayload["items"]>[number];

function detailsToPayloadFields(details: CheckoutLineDetails, itemTypes: ItemType[]) {
  const cakeDetails = hasItemType(itemTypes, "cake")
    ? {
        pounds: details.cake?.size.trim() || undefined,
        flavor: details.cake?.flavor.trim() || undefined,
        messageOnCake: details.cake?.message.trim() || undefined,
        notes: details.cake?.notes.trim() || undefined,
      }
    : undefined;

  const giftDetails = hasItemType(itemTypes, "gift")
    ? {
        notes: details.gift?.notes.trim() || undefined,
      }
    : undefined;

  const productDetails = hasItemType(itemTypes, "other")
    ? {
        notes: details.other?.notes.trim() || undefined,
      }
    : undefined;

  return {
    ...(cakeDetails &&
    (cakeDetails.pounds ||
      cakeDetails.flavor ||
      cakeDetails.messageOnCake ||
      cakeDetails.notes)
      ? { cakeDetails }
      : {}),
    ...(giftDetails?.notes ? { giftDetails } : {}),
    ...(productDetails?.notes ? { productDetails } : {}),
  };
}

function formatCartLines(cartItems: CartItem[]): string {
  return cartItems
    .map((item) => {
      const pricePart =
        item.unitPrice != null
          ? ` @ ${formatPrice(item.unitPrice)}`
          : "";
      const lineTotal =
        item.unitPrice != null
          ? ` = ${formatPrice(item.unitPrice * item.quantity)}`
          : "";
      const notesPart = item.notes?.trim() ? ` — ${item.notes.trim()}` : "";
      return `• ${item.name} × ${item.quantity}${pricePart}${lineTotal}${notesPart}`;
    })
    .join("\n");
}

function buildCartNotesBlock(cartItems: CartItem[]): string {
  const lines = formatCartLines(cartItems);
  const subtotal = getCartSubtotal(cartItems);
  const parts = [`[Cart order]`, lines];
  if (subtotal > 0) {
    parts.push(`Estimated subtotal: ${formatPrice(subtotal)}`);
  }
  return parts.join("\n");
}

function combineNotes(
  formNotes: string | undefined,
  extraBlocks: string[],
): string | undefined {
  const combined = [formNotes?.trim() ?? "", ...extraBlocks.filter(Boolean)]
    .filter(Boolean)
    .join("\n\n");
  return combined || undefined;
}

function firstCakeTopLevel(details: CheckoutLineDetails, itemTypes: ItemType[]) {
  if (!hasItemType(itemTypes, "cake")) {
    return {};
  }
  return {
    flavor: details.cake?.flavor.trim() || undefined,
    size: details.cake?.size.trim() || undefined,
    message: details.cake?.message.trim() || undefined,
  };
}

export function buildOrderPayloadFromCart(
  form: CheckoutDraftForm,
  cartItems: CartItem[],
  lineDetailsById: Record<string, CheckoutLineDetails>,
): PublicOrderPayload {
  const cartBlock = buildCartNotesBlock(cartItems);
  const items: CheckoutOrderItem[] = cartItems.map((item) => {
    const itemTypes = getCartItemTypes(item);
    const details = lineDetailsById[item.id] ?? {};
    return {
      cakeSlug: item.cakeSlug,
      quantity: item.quantity,
      notes: item.notes,
      ...detailsToPayloadFields(details, itemTypes),
    };
  });

  if (cartItems.length === 1) {
    const item = cartItems[0];
    const itemTypes = getCartItemTypes(item);
    const details = lineDetailsById[item.id] ?? {};
    const quantityNote =
      item.quantity > 1 ? `Requested quantity: ${item.quantity}` : "";
    const topLevel = firstCakeTopLevel(details, itemTypes);

    return {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      cakeType: item.name,
      ...topLevel,
      deliveryDate: form.deliveryDate || undefined,
      address: form.address.trim() || undefined,
      notes: combineNotes(undefined, [
        quantityNote,
        item.notes?.trim() ?? "",
        cartBlock,
      ]),
      paymentMethod: COD_PAYMENT_METHOD,
      cakeSlug: item.cakeSlug,
      items,
    };
  }

  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim() || undefined,
    cakeType: `Cart order (${cartItems.length} items)`,
    deliveryDate: form.deliveryDate || undefined,
    address: form.address.trim() || undefined,
    notes: combineNotes(undefined, [cartBlock]),
    paymentMethod: COD_PAYMENT_METHOD,
    items,
  };
}

export function buildOrderPayloadFromCake(
  form: CheckoutDraftForm,
  cakeName: string,
  cakeSlug: string | undefined,
  itemTypes: ItemType[],
  details: CheckoutLineDetails,
): PublicOrderPayload {
  const topLevel = firstCakeTopLevel(details, itemTypes);
  const line =
    cakeSlug
      ? [
          {
            cakeSlug,
            quantity: 1,
            ...detailsToPayloadFields(details, itemTypes),
          },
        ]
      : undefined;

  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim() || undefined,
    cakeType: cakeName,
    ...topLevel,
    deliveryDate: form.deliveryDate || undefined,
    address: form.address.trim() || undefined,
    notes: undefined,
    paymentMethod: COD_PAYMENT_METHOD,
    cakeSlug,
    items: line,
  };
}
