import type { MetadataRoute } from "next";
import { fetchPublicCakes, fetchPublicCategories } from "@/lib/catalog";
import { siteUrl } from "@/lib/seo";

const staticPaths = [
  "/",
  "/cakes",
  "/cakes/all",
  "/custom-cake",
  "/about",
  "/contact",
  "/gallery",
  "/reviews",
  "/privacy-policy",
  "/login",
  "/signup",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const categories = await fetchPublicCategories();
    for (const category of categories) {
      entries.push({
        url: new URL(`/cakes/${category.slug}`, base).toString(),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    const cakes = await fetchPublicCakes();
    if (cakes) {
      for (const cake of cakes) {
        const categorySlug = cake.categoryId?.slug;
        if (!categorySlug) {
          continue;
        }
        entries.push({
          url: new URL(`/cakes/${categorySlug}/${cake.slug}`, base).toString(),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // Keep sitemap generation resilient by returning static URLs if API data is unavailable.
  }

  return entries;
}
