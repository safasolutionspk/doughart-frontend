import type { Metadata } from "next";
import { siteImages } from "@/lib/images";
import { DEFAULT_BUSINESS_NAME } from "@/lib/settings";

/**
 * Public site origin for canonical URLs, Open Graph, sitemap, and robots.
 *
 * Production: set NEXT_PUBLIC_SITE_URL to the HTTPS shop origin (no trailing slash)
 * at **build time** for Next.js (e.g. https://www.example.com).
 * Do not hardcode a production domain here — unset falls back to local dev only.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

const defaultOgImage = siteImages.hero;

/** Shared Lahore bakery intent terms — natural, non-stuffed. */
const baseKeywords = [
  "DoughArt Bakers",
  "DoughArt cakes",
  "custom cakes Lahore",
  "birthday cakes Lahore",
  "cake delivery Lahore",
  "order cakes online Lahore",
  "chocolate cakes Lahore",
  "anniversary cakes Lahore",
  "cupcakes Lahore",
  "custom cakes",
  "birthday cakes",
  "celebration cakes",
  "cupcakes",
  "bakery Lahore",
] as const;

export const shopKeywords = [
  "order cakes online Lahore",
  "cake delivery Lahore",
  "custom cakes Lahore",
  "birthday cakes Lahore",
  "celebration cakes",
  "cupcakes Lahore",
] as const;

function buildDefaultTitle(brandName: string): string {
  return `${brandName} | Custom Cakes & Cake Delivery in Lahore`;
}

function buildDefaultDescription(brandName: string): string {
  return `${brandName} — custom cakes, birthday cakes, and cupcakes in Lahore. Order cakes online for local delivery, or request a handcrafted celebration cake.`;
}

function buildKeywords(brandName: string): string[] {
  const name = brandName.trim();
  const extras =
    name && !baseKeywords.some((k) => k.toLowerCase() === name.toLowerCase())
      ? [name]
      : [];
  return [...baseKeywords, ...extras];
}

/** Build root site metadata from the configured business name (settings). */
export function buildSiteMetadata(brandName: string): Metadata {
  const name = brandName.trim() || DEFAULT_BUSINESS_NAME;
  const defaultTitle = buildDefaultTitle(name);
  const defaultDescription = buildDefaultDescription(name);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${name}`,
    },
    description: defaultDescription,
    keywords: buildKeywords(name),
    authors: [{ name }],
    creator: name,
    icons: {
      icon: "/images/real/favicon.svg",
      shortcut: "/images/real/favicon.svg",
      apple: "/images/real/favicon-apple.png",
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: siteUrl,
      siteName: name,
      title: defaultTitle,
      description: defaultDescription,
      images: [
        {
          url: defaultOgImage.startsWith("http")
            ? defaultOgImage
            : new URL(defaultOgImage, siteUrl).toString(),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [
        defaultOgImage.startsWith("http")
          ? defaultOgImage
          : new URL(defaultOgImage, siteUrl).toString(),
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** Static fallback metadata (build-time / settings failure). Prefer generateMetadata. */
export const siteMetadata: Metadata = buildSiteMetadata(DEFAULT_BUSINESS_NAME);

/** @deprecated Prefer buildSiteMetadata / getBusinessName — kept for gradual migration. */
export const siteBrandName = DEFAULT_BUSINESS_NAME;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Configured business name; defaults to technical fallback. */
  brandName?: string;
};

/** Build consistent SEO metadata for shop and transactional pages */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  brandName = DEFAULT_BUSINESS_NAME,
}: PageMetadataOptions): Metadata {
  const name = brandName.trim() || DEFAULT_BUSINESS_NAME;
  const defaultTitle = buildDefaultTitle(name);
  const root = buildSiteMetadata(name);
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = new URL(canonicalPath, siteUrl).toString();
  const socialTitle =
    title === name || title === defaultTitle
      ? defaultTitle
      : `${title} | ${name}`;

  return {
    title: title === defaultTitle ? { absolute: defaultTitle } : title,
    description,
    keywords: keywords
      ? [...buildKeywords(name), ...keywords]
      : buildKeywords(name),
    alternates: {
      // Relative to metadataBase (NEXT_PUBLIC_SITE_URL) — never hardcode a live domain.
      canonical: canonicalPath,
    },
    openGraph: {
      ...root.openGraph,
      title: socialTitle,
      description,
      url: pageUrl,
      images: root.openGraph?.images,
    },
    twitter: {
      ...root.twitter,
      title: socialTitle,
      description,
      images: root.twitter?.images,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Category meta description: keep catalog copy, add light Lahore context. */
export function buildCategorySeoDescription(options: {
  categoryName: string;
  categoryDescription?: string;
  businessName: string;
}): string {
  const { categoryName, categoryDescription, businessName } = options;
  const base = categoryDescription?.trim();
  if (base) {
    const suffix = ` Order ${categoryName.toLowerCase()} online from ${businessName} in Lahore.`;
    if (base.toLowerCase().includes("lahore")) {
      return base;
    }
    return `${base}${suffix}`;
  }
  return `Browse ${categoryName.toLowerCase()} at ${businessName} in Lahore — order cakes online or request a custom design for local delivery.`;
}

/** Product meta description when catalog description exists or fallback. */
export function buildProductSeoDescription(options: {
  cakeName: string;
  cakeDescription?: string;
  categoryName: string;
  businessName: string;
  priceLabel: string;
}): string {
  const { cakeName, cakeDescription, categoryName, businessName, priceLabel } =
    options;
  const base = cakeDescription?.trim();
  if (base) {
    if (base.toLowerCase().includes("lahore")) {
      return base;
    }
    return `${base} Available from ${businessName} in Lahore (${categoryName}).`;
  }
  return `Order ${cakeName} from ${businessName} in Lahore — ${priceLabel}. ${categoryName}; place your order online or on WhatsApp.`;
}
