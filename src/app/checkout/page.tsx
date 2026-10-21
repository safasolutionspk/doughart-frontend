import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { CheckoutForm } from "@/components/sections/CheckoutForm";
import { fetchPublicCakeBySlug } from "@/lib/catalog";
import { checkoutCopy } from "@/lib/checkout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description:
    "Complete your cake order with delivery details. Payment is cash on delivery — pay when your order is delivered.",
  path: "/checkout",
  noIndex: true,
});

type PageProps = {
  searchParams: Promise<{ cake?: string }>;
};

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { cake: cakeSlug } = await searchParams;
  const selectedCake = cakeSlug
    ? await fetchPublicCakeBySlug(cakeSlug)
    : null;

  return (
    <PublicPageLayout mainId="checkout-page" ariaLabel="Checkout">
        <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
          <div className="section-container max-w-2xl">
            <nav
              className="mb-6 text-sm text-brand-muted"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="font-medium text-brand-primary hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-brand-border">
                  /
                </li>
                <li className="font-medium text-brand-brown">Checkout</li>
              </ol>
            </nav>

            <p className="section-eyebrow">{checkoutCopy.title}</p>
            <h1 className="section-title mt-2 text-2xl sm:text-3xl">
              {selectedCake
                ? `Order ${selectedCake.name}`
                : "Complete your order"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
              {checkoutCopy.description}
            </p>

            {cakeSlug && !selectedCake ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                The selected cake could not be loaded. You can still place an
                order — our team will follow up for details.
              </p>
            ) : null}

            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="animate-pulse space-y-4">
                    <div className="h-32 rounded-2xl bg-brand-pink-lighter/60" />
                  </div>
                }
              >
                <CheckoutForm
                  selectedCake={selectedCake}
                  selectedCakeSlug={cakeSlug}
                />
              </Suspense>
            </div>
          </div>
        </section>
    </PublicPageLayout>
  );
}
