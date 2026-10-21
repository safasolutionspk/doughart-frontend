import { contactInfo } from "@/lib/contact";
import { getApiFetchUrl } from "@/lib/config/apiUrl";

const API_BASE_URL = getApiFetchUrl();

/** Technical fallback when settings cannot be loaded. */
export const DEFAULT_BUSINESS_NAME = contactInfo.businessName;

export type PublicSettings = {
  businessName: string;
  tagline?: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  deliveryInfo?: string;
};

/**
 * Fetch public business settings.
 * Uses Next.js revalidate so Admin name changes appear without redeploy
 * (refresh / revalidation window — not build-time freeze).
 */
export async function fetchPublicSettings(): Promise<PublicSettings | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      next: { revalidate: 60 },
    });
    const body = (await response.json()) as {
      success: boolean;
      data?: PublicSettings;
    };
    if (response.ok && body.success && body.data) {
      return body.data;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Single source for customer-facing business name text.
 * Prefer BusinessSettings.businessName; fall back to DEFAULT_BUSINESS_NAME.
 */
export async function getBusinessName(): Promise<string> {
  const settings = await fetchPublicSettings();
  const name = settings?.businessName?.trim();
  return name && name.length > 0 ? name : DEFAULT_BUSINESS_NAME;
}

export function getWhatsAppDigitsFromSettings(
  settings: PublicSettings | null,
): string | null {
  const raw = settings?.whatsapp?.trim();
  if (!raw) {
    return null;
  }
  const digits = raw.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}
