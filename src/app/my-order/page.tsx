import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { MyOrderLookup } from "@/components/sections/MyOrderLookup";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Track my order",
    description: `Look up your ${businessName} cake order by order number and phone — see status, payment, and quoted price.`,
    path: "/my-order",
    noIndex: true,
    brandName: businessName,
  });
}

export default function MyOrderPage() {
  return (
    <PublicPageLayout mainId="my-order-page" ariaLabel="Track my order">
        <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
          <div className="section-container max-w-2xl">
            <p className="section-eyebrow reveal-up">Order tracking</p>
            <h1 className="section-title reveal-up mt-2 text-2xl sm:text-3xl">
              Find your order
            </h1>
            <p className="reveal-up mt-2 text-sm leading-relaxed text-brand-muted sm:text-base">
              Enter the order number from your confirmation and the phone number
              you used when ordering.
            </p>
            <div className="reveal-up mt-8">
              <Suspense
                fallback={
                  <div className="h-32 animate-pulse rounded-2xl bg-brand-pink-lighter/60" />
                }
              >
                <MyOrderLookup />
              </Suspense>
            </div>
          </div>
        </section>
    </PublicPageLayout>
  );
}
