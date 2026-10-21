import type { Metadata } from "next";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { AccountPageContent } from "@/components/account/AccountPageContent";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "My account",
    description: `View your ${businessName} account and order history.`,
    path: "/account",
    noIndex: true,
    brandName: businessName,
  });
}

export default async function AccountPage() {
  const businessName = await getBusinessName();

  return (
    <PublicPageLayout mainId="account-page" ariaLabel="My account">
      <section className="section-padding bg-linear-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-3xl">
          <header className="mb-8">
            <p className="section-eyebrow">My account</p>
            <h1 className="section-title mt-2 text-3xl sm:text-4xl">
              Your {businessName} account
            </h1>
            <p className="mt-2 text-sm text-brand-muted sm:text-base">
              Manage your profile and track orders linked to this account.
            </p>
          </header>
          <AccountPageContent />
        </div>
      </section>
    </PublicPageLayout>
  );
}
