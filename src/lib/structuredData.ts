import { contactInfo } from "@/lib/contact";
import type { PublicSettings } from "@/lib/settings";
import { siteImages } from "@/lib/images";
import { siteUrl } from "@/lib/seo";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

/**
 * Parse a settings address into PostalAddress fields when possible.
 * Expected verified shape: "Thokkar Niaz Baig, Lahore, Punjab, Pakistan"
 */
export function postalAddressFromSettingsAddress(address: string): {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
} {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 4) {
    return {
      "@type": "PostalAddress",
      streetAddress: parts[0],
      addressLocality: parts[1],
      addressRegion: parts[2],
      addressCountry: parts[3] === "Pakistan" ? "PK" : parts[3],
    };
  }

  return {
    "@type": "PostalAddress",
    streetAddress: address.trim() || contactInfo.address,
  };
}

/** Prefer settings phone; fall back to known contact digits for tel: schema. */
export function telephoneForSchema(phone?: string): string {
  const raw = (phone ?? contactInfo.phoneDisplay).trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) {
    return contactInfo.phoneInternational;
  }
  if (digits.startsWith("92")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length >= 10) {
    return `+92${digits.slice(1)}`;
  }
  return raw.startsWith("+") ? raw : `+${digits}`;
}

type BakerySettings = Pick<
  PublicSettings,
  "businessName" | "email" | "phone" | "address" | "tagline" | "deliveryInfo"
> & {
  facebook?: string;
  instagram?: string;
};

/**
 * Bakery / LocalBusiness JSON-LD from public settings (authoritative).
 * Does not invent ratings, awards, opening hours, or delivery cities.
 */
export function buildBakeryStructuredData(
  settings: BakerySettings | null,
  businessName: string,
): Record<string, unknown> {
  const name = businessName.trim() || contactInfo.businessName;
  const email = settings?.email?.trim() || contactInfo.email;
  const phone = telephoneForSchema(settings?.phone);
  const addressRaw = settings?.address?.trim() || contactInfo.address;
  const sameAs = [
    settings?.facebook?.trim(),
    settings?.instagram?.trim(),
    contactInfo.social.facebook,
    contactInfo.social.instagram,
  ].filter((url, index, arr): url is string => {
    if (!url) return false;
    return arr.indexOf(url) === index;
  });

  const descriptionParts = [
    settings?.tagline?.trim(),
    settings?.deliveryInfo?.trim(),
  ].filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "LocalBusiness"],
    name,
    url: siteUrl,
    image: new URL(siteImages.hero, siteUrl).toString(),
    logo: new URL(siteImages.logo, siteUrl).toString(),
    telephone: phone,
    email,
    address: postalAddressFromSettingsAddress(addressRaw),
    areaServed: {
      "@type": "City",
      name: "Lahore",
    },
  };

  if (descriptionParts.length > 0) {
    data.description = descriptionParts.join(" ");
  }

  if (sameAs.length > 0) {
    data.sameAs = sameAs;
  }

  return data;
}

export function buildBreadcrumbStructuredData(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}
