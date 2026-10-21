import type { Metadata } from "next";
import { ShopNotFound } from "@/components/catalog/ShopNotFound";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cake not found",
  description: "This cake could not be found in our shop.",
  path: "/cakes",
  noIndex: true,
});

export default function CakeNotFound() {
  return (
    <ShopNotFound
      title="Cake not found"
      description="We couldn't find this cake. It may have been removed or the link is incorrect."
      primaryHref="/cakes/all"
      primaryLabel="Browse all menu"
    />
  );
}
