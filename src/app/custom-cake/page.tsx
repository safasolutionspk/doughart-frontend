import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { CustomCakeOrderForm } from "@/components/sections/CustomCakeOrderForm";
import { fetchPublicCakeBySlug } from "@/lib/catalog";
import { buildPageMetadata, shopKeywords } from "@/lib/seo";
import { fetchPublicSettings, getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [businessName, settings] = await Promise.all([
    getBusinessName(),
    fetchPublicSettings(),
  ]);
  const leadTimeNote = settings?.deliveryInfo?.trim()
    ? ` ${settings.deliveryInfo.trim()}`
    : " Order at least 48 hours ahead for custom cakes.";
  return buildPageMetadata({
    title: "Custom Cakes Lahore",
    description: `Request a custom cake from ${businessName} in Lahore — choose flavours, size, design, and local delivery details.${leadTimeNote}`,
    path: "/custom-cake",
    keywords: [
      "custom cakes Lahore",
      "DoughArt Bakers",
      "DoughArt cakes",
      ...shopKeywords,
    ],
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
