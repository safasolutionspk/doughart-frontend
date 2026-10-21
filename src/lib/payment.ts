/**
 * Public checkout is Cash on Delivery only. Customers never choose a payment
 * method — every new order is created with the canonical COD value below.
 */
export const COD_PAYMENT_METHOD = "cash_on_delivery" as const;

export const COD_PAYMENT_LABEL = "Cash on Delivery";

/** All methods that may exist on stored orders (includes legacy records). */
export const PAYMENT_METHODS = [
  "cash_on_delivery",
  "bank_transfer",
  "online_payment",
  "online_payment_full",
  "online_payment_advance",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Labels for stored orders — legacy values only appear on historical records. */
const paymentMethodLabels: Record<string, string> = {
  cash_on_delivery: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
  online_payment: "Online Payment",
  online_payment_full: "Full Online Payment",
  online_payment_advance: "50% Advance Payment",
};

export function formatPaymentMethod(method: PaymentMethod | string): string {
  return paymentMethodLabels[method] ?? method;
}
