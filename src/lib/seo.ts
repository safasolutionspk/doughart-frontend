import type { Metadata } from "next";
import { siteImages } from "@/lib/images";
import { DEFAULT_BUSINESS_NAME } from "@/lib/settings";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const defaultOgImage = siteImages.hero;

const baseKeywords = [
  "custom cakes",
  "bakery",
  "wedding cakes",
  "birthday cakes",
  "cake delivery",
  "celebration cakes",
  "handcrafted cakes",
  "Lahore cakes",
] as const;

export const shopKeywords = [
  "order cakes online",
  "cake shop",
  "celebration cakes",
  "cake delivery",
] as const;

function buildDefaultTitle(brandName: string): string {
  return `${brandName} | Custom Cakes & Cake Delivery in Lahore`;
}

function buildDefaultDescription(brandName: string): string {
  return `Order handcrafted custom cakes for weddings, birthdays, and celebrations. ${brandName} crafts premium cakes with fresh ingredients and designs made just for you.`;
}

function buildKeywords(brandName: string): string[] {
  return [...baseKeywords, brandName];
}

/** Build root site metadata from the configured business name. */
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
      locale: "en_US",
      url: siteUrl,
      siteName: name,
      title: defaultTitle,
      description: defaultDescription,
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [defaultOgImage],
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
