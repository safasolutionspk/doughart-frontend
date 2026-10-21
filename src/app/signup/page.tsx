import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerSignupForm } from "@/components/auth/CustomerSignupForm";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Create account",
    description: `Create your ${businessName} customer account.`,
    path: "/signup",
    noIndex: true,
    brandName: businessName,
  });
}

export default async function SignupPage() {
  const businessName = await getBusinessName();

  return (
    <PublicPageLayout mainId="signup-page" ariaLabel="Customer sign up">
      <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-md">
          <header className="mb-8 text-center">
            <p className="section-eyebrow">Join {businessName}</p>
            <h1 className="section-title mt-2 text-2xl sm:text-3xl">
              Create account
            </h1>
            <p className="mt-2 text-sm text-brand-muted">
              Create an account to place orders and view your order history.
            </p>
          </header>
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <Suspense fallback={<p className="text-sm text-brand-muted">Loading…</p>}>
              <CustomerSignupForm />
            </Suspense>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
