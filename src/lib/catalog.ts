import type { ItemType } from "@/lib/itemTypes";
import { normalizeItemTypes } from "@/lib/itemTypes";
import { getApiFetchUrl } from "@/lib/config/apiUrl";

const API_BASE_URL = getApiFetchUrl();

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

export type PublicCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageDisplay?: {
    zoom: number;
    x: number;
    y: number;
  };
  sortOrder: number;
};

export type CategoryRef = {
  _id: string;
  name: string;
  slug: string;
};

export type PublicCake = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageDisplay?: {
    zoom: number;
    x: number;
    y: number;
  };
  categoryId: CategoryRef;
  price: number;
  itemTypes?: ItemType[];
  isCustomizable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export function getCakeItemTypes(cake: Pick<PublicCake, "itemTypes">): ItemType[] {
  return normalizeItemTypes(cake.itemTypes);
}

export type PopularitySource = "purchases" | "mixed" | "fallback";

export type PublicPopularCake = PublicCake & {
  rank: number;
  totalQuantitySold: number;
  source: PopularitySource;
};

type ApiGetCache = "default" | "no-store";

async function apiGet<T>(
  path: string,
  cache: ApiGetCache = "default",
  init?: RequestInit,
): Promise<T | null> {
  try {
    const fetchInit: RequestInit = { ...init };
    if (cache === "no-store") {
      fetchInit.cache = "no-store";
    } else {
      fetchInit.next = { revalidate: 60 };
    }

    const response = await fetch(`${API_BASE_URL}${path}`, fetchInit);

    let body: ApiSuccess<T> | ApiFailure;
    try {
      body = (await response.json()) as ApiSuccess<T> | ApiFailure;
    } catch {
      return null;
    }

    if (!response.ok || !body.success) {
      return null;
    }

    return (body as ApiSuccess<T>).data;
  } catch {
    return null;
  }
}

export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  const data = await apiGet<PublicCategory[]>("/api/categories/public");
  if (!data) {
    return [];
  }
  return [...data].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name),
  );
}

/** Returns null when the categories API request fails (for homepage fallback). */
export async function fetchPublicCategoriesOrFail(): Promise<PublicCategory[] | null> {
  return apiGet<PublicCategory[]>("/api/categories/public", "no-store");
}

export async function fetchPublicCakes(options?: {
  categorySlug?: string;
}): Promise<PublicCake[] | null> {
  const params = new URLSearchParams();
  if (options?.categorySlug) {
    params.set("categorySlug", options.categorySlug);
  }
  const query = params.toString();
  return apiGet<PublicCake[]>(
    `/api/cakes/public${query ? `?${query}` : ""}`,
  );
}

export async function fetchPublicCakeBySlug(
  slug: string,
): Promise<PublicCake | null> {
  return apiGet<PublicCake>(`/api/cakes/public/${encodeURIComponent(slug)}`);
}

export async function fetchPopularCakes(
  limit = 12,
): Promise<PublicPopularCake[] | null> {
  const safeLimit = Math.min(24, Math.max(1, limit));
  // Always read current Cake image/name after Admin updates (homepage categories
  // already use no-store; popular must not lag one Data Cache generation behind).
  return apiGet<PublicPopularCake[]>(
    `/api/cakes/public/popular?limit=${safeLimit}`,
    "no-store",
  );
}

export async function fetchComboOffers(
  limit = 12,
): Promise<PublicCake[] | null> {
  const safeLimit = Math.min(24, Math.max(1, limit));
  return apiGet<PublicCake[]>(
    `/api/cakes/public/combo-offers?limit=${safeLimit}`,
    "no-store",
  );
}

export function getCategoryRef(cake: PublicCake): CategoryRef {
  return cake.categoryId;
}

export function formatPrice(price: number): string {
  const formatted = price.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `Rs ${formatted}`;
}
