import type { Metadata } from "next";
import { ShopNotFound } from "@/components/catalog/ShopNotFound";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Order not found",
  description: "This order confirmation could not be found.",
  path: "/order-success",
  noIndex: true,
});

export default function OrderNotFound() {
  return (
    <ShopNotFound
      title="Order not found"
      description="We couldn't find an order with this number. Check the link from your confirmation email or contact us for help."
      primaryHref="/checkout"
      primaryLabel="Place a new order"
      secondaryHref="/cakes/all"
      secondaryLabel="Browse cakes"
    />
  );
}
