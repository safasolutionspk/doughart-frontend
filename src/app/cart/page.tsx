import type { Metadata } from "next";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Your Cart",
    description: `Review cakes in your ${businessName} cart before checkout.`,
    path: "/cart",
    noIndex: true,
    brandName: businessName,
  });
}

export default function CartPage() {
  return (
    <PublicPageLayout mainId="cart-page" ariaLabel="Shopping cart">
      <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container">
          <header className="mb-8 text-center sm:mb-10">
            <p className="section-eyebrow">Your order</p>
            <h1 className="section-title mt-2 text-3xl sm:text-4xl">
              Shopping cart
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted sm:text-base">
              Adjust quantities or remove items, then continue to checkout when
              you are ready.
            </p>
          </header>
          <CartPageContent />
        </div>
      </section>
    </PublicPageLayout>
  );
}
