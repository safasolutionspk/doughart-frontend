import type { Metadata } from "next";
import { ShopNotFound } from "@/components/catalog/ShopNotFound";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Category not found",
  description: "This cake category could not be found.",
  path: "/cakes",
  noIndex: true,
});

export default function CategoryNotFound() {
  return (
    <ShopNotFound
      title="Category not found"
      description="This cake category doesn't exist or is no longer available. Browse our full catalog or pick another category."
      primaryHref="/cakes/all"
      primaryLabel="Browse all menu"
    />
  );
}
