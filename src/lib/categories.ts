import {
  fetchPublicCategoriesOrFail,
  type PublicCategory,
} from "@/lib/catalog";
import { siteImages } from "@/lib/images";
import { getCatalogImageDisplay } from "@/lib/media";

export type HomepageCategory = {
  id: string;
  title: string;
  description?: string;
  /** Resolved API image when category.image is set; undefined uses fallback only */
  apiImage?: string;
  /** Per-slug fallback when API image is missing or fails to load */
  imageFallback: string;
  imageDisplay?: {
    zoom: number;
    x: number;
    y: number;
  };
  href: string;
  sortOrder: number;
};

export const cakeCategories: HomepageCategory[] = [
  {
    id: "birthday",
    title: "Birthday Cakes",
    description: undefined,
    imageFallback: siteImages.categories.birthday,
    href: "/cakes/birthday",
    sortOrder: 0,
  },
  {
    id: "wedding",
    title: "Wedding Cakes",
    imageFallback: siteImages.categories.wedding,
    href: "/cakes/wedding",
    sortOrder: 1,
  },
  {
    id: "kids",
    title: "Kids Cakes",
    imageFallback: siteImages.categories.kids,
    href: "/cakes/kids",
    sortOrder: 2,
  },
  {
    id: "anniversary",
    title: "Anniversary Cakes",
    imageFallback: siteImages.categories.anniversary,
    href: "/cakes/anniversary",
    sortOrder: 3,
  },
  {
    id: "all",
    title: "All Menu",
    imageFallback: siteImages.categories.all,
    href: "/cakes/all",
    sortOrder: 4,
  },
];

function mapApiCategory(category: PublicCategory): HomepageCategory {
  const { fallback, apiImage } = getCatalogImageDisplay(
    category.image,
    category.slug,
  );

  return {
    id: category.slug,
    title: category.name,
    description: category.description?.trim() || undefined,
    apiImage,
    imageFallback: fallback,
    imageDisplay: category.imageDisplay,
    href: `/cakes/${category.slug}`,
    sortOrder: category.sortOrder ?? 0,
  };
}

function sortCategories(categories: PublicCategory[]): PublicCategory[] {
  return [...categories].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
      a.name.localeCompare(b.name),
  );
}

/** Public categories from API; static fallback only when the request fails. */
export async function getHomepageCategories(): Promise<HomepageCategory[]> {
  const apiCategories = await fetchPublicCategoriesOrFail();

  if (apiCategories === null) {
    return cakeCategories;
  }

  if (apiCategories.length === 0) {
    return [];
  }

  return sortCategories(apiCategories).map(mapApiCategory);
}
