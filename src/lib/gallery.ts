import { contactInfo } from "@/lib/contact";
import { siteImages } from "@/lib/images";
import { resolveImageSrc } from "@/lib/media";
import { getBusinessName } from "@/lib/settings";
import { getApiFetchUrl, getPublicApiUrl } from "@/lib/config/apiUrl";

const API_FETCH_URL = getApiFetchUrl();
const API_PUBLIC_URL = getPublicApiUrl();

export const galleryCopy = {
  subtitle: "Follow Us On Instagram",
  heading: "A Little Happiness In Every Slice",
  instagramLabel: "Follow on Instagram",
  instagramHref: contactInfo.social.instagram,
} as const;

export type GalleryDisplayImage = {
  id: string;
  alt: string;
  src: string;
  createdAt?: string;
};

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

type PublicGalleryApiItem = {
  id: string;
  filename: string;
  url: string;
  size?: number;
  mimeType?: string;
  altText?: string;
  createdAt: string;
};

/**
 * Client-only broken-image fallback asset.
 * Never returned by the Gallery API and never treated as a Gallery record.
 */
export const galleryBrokenImageFallback = siteImages.gallery[0];

/** @deprecated Prefer galleryBrokenImageFallback — not a Gallery data source. */
export const staticGalleryFallback: GalleryDisplayImage[] = [
  {
    id: "fallback-1",
    alt: "Gallery image unavailable",
    src: galleryBrokenImageFallback,
  },
];

/** @deprecated Prefer fetchPublicGalleryImages — kept for any legacy imports. */
export const galleryImages = staticGalleryFallback;

function toDisplayImage(
  item: PublicGalleryApiItem,
  businessName: string,
): GalleryDisplayImage | null {
  const resolved =
    resolveImageSrc(item.url) ??
    (item.url.startsWith("http://") || item.url.startsWith("https://")
      ? item.url
      : item.url.startsWith("/")
        ? `${API_PUBLIC_URL}${item.url}`
        : undefined);

  if (!resolved) {
    return null;
  }

  return {
    id: item.id || item.filename,
    alt:
      item.altText?.trim() || `${businessName} custom cake gallery photo`,
    src: resolved,
    createdAt: item.createdAt,
  };
}

/**
 * Fetches dedicated GalleryImage records for the public `/gallery` page.
 * Newest-first. Empty when Admin has not uploaded Gallery images yet.
 * Never lists product, category, logo, or shared storage files.
 * Uses no-store so Admin upload/delete is visible on the next page load
 * without waiting for ISR revalidation or a redeploy.
 */
export async function fetchPublicGalleryImages(
  businessName?: string,
): Promise<GalleryDisplayImage[]> {
  const name = businessName?.trim() || (await getBusinessName());

  try {
    const response = await fetch(`${API_FETCH_URL}/api/gallery/public`, {
      cache: "no-store",
    });

    let body: ApiSuccess<PublicGalleryApiItem[]> | ApiFailure;
    try {
      body = (await response.json()) as
        | ApiSuccess<PublicGalleryApiItem[]>
        | ApiFailure;
    } catch {
      return [];
    }

    if (!response.ok || !body.success || !Array.isArray(body.data)) {
      return [];
    }

    const seen = new Set<string>();
    const images: GalleryDisplayImage[] = [];

    for (const item of body.data) {
      const display = toDisplayImage(item, name);
      if (!display || seen.has(display.id)) {
        continue;
      }
      seen.add(display.id);
      images.push(display);
    }

    return images;
  } catch {
    return [];
  }
}
