import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { CustomCakeOrderForm } from "@/components/sections/CustomCakeOrderForm";
import { fetchPublicCakeBySlug } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Custom cake order",
    description: `Request a custom cake from ${businessName} with your preferred design, flavours, size, and delivery details.`,
    path: "/custom-cake",
    brandName: businessName,
  });
}

type PageProps = {
  searchParams: Promise<{ cake?: string }>;
};

export default async function CustomCakePage({ searchParams }: PageProps) {
  const { cake: cakeSlug } = await searchParams;
  let selectedCakeName: string | undefined;

  if (cakeSlug) {
    const cake = await fetchPublicCakeBySlug(cakeSlug);
    selectedCakeName = cake?.name;
  }

  return (
    <PublicPageLayout mainId="custom-cake-page" ariaLabel="Custom cake order">
        <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
          <div className="section-container max-w-3xl">
            <p className="section-eyebrow">Custom order</p>
            {selectedCakeName ? (
              <p className="mt-2 text-sm font-medium text-brand-primary sm:text-base">
                Ordering: {selectedCakeName}
              </p>
            ) : null}
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
              Share every detail below. We will confirm flavours, design, and delivery
              with you shortly after we receive your request.
            </p>
            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="animate-pulse h-48 rounded-2xl bg-brand-pink-lighter/60" />
                }
              >
                <CustomCakeOrderForm
                  selectedCakeSlug={cakeSlug}
                  selectedCakeName={selectedCakeName}
                />
              </Suspense>
            </div>
          </div>
        </section>
    </PublicPageLayout>
  );
}
