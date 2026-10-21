import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerForgotPasswordForm } from "@/components/auth/CustomerForgotPasswordForm";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Forgot password",
    description: `Request password reset instructions for your ${businessName} account.`,
    path: "/forgot-password",
    noIndex: true,
    brandName: businessName,
  });
}

export default function ForgotPasswordPage() {
  return (
    <PublicPageLayout mainId="forgot-password-page" ariaLabel="Forgot password">
      <section className="section-padding bg-linear-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-md">
          <header className="mb-8 text-center">
            <p className="section-eyebrow">Account recovery</p>
            <h1 className="section-title mt-2 text-2xl sm:text-3xl">Forgot password</h1>
            <p className="mt-2 text-sm text-brand-muted">
              Enter your email and we&apos;ll send password reset instructions.
            </p>
          </header>

          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <Suspense fallback={<p className="text-sm text-brand-muted">Loading…</p>}>
              <CustomerForgotPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
