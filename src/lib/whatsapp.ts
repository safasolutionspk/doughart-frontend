import { contactInfo } from "@/lib/contact";

/**
 * Public WhatsApp number is always sourced from shared contactInfo.
 * Admin settings and NEXT_PUBLIC_WHATSAPP* env values are intentionally ignored
 * so an outdated override cannot replace the authoritative public number.
 */
const DEFAULT_WHATSAPP_NUMBER = contactInfo.whatsappNumber;

export async function getWhatsAppNumber(): Promise<string> {
  return DEFAULT_WHATSAPP_NUMBER;
}

/** Sync fallback for client components that cannot await settings */
export function getWhatsAppNumberSync(): string {
  return DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsAppUrl(text: string, phone?: string): string {
  // phone retained for call-site compatibility; public number is always contactInfo.
  void phone;
  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppOrderUrl(cakeName: string, phone?: string): string {
  return buildWhatsAppUrl(`Hi! I'd like to order: ${cakeName}`, phone);
}

export function buildWhatsAppOrderConfirmationUrl(
  orderNumber: string,
  cakeName: string,
  finalAmount?: number,
  phone?: string,
): string {
  const priceLine =
    finalAmount != null && finalAmount > 0
      ? ` Estimated total: Rs ${finalAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}.`
      : "";
  return buildWhatsAppUrl(
    `Hi! I just placed order ${orderNumber} for "${cakeName}".${priceLine} Could you confirm the details?`,
    phone,
  );
}
