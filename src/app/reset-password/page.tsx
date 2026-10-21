import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerResetPasswordForm } from "@/components/auth/CustomerResetPasswordForm";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Reset password",
    description: `Set a new password for your ${businessName} account.`,
    path: "/reset-password",
    noIndex: true,
    brandName: businessName,
  });
}

export default function ResetPasswordPage() {
  return (
    <PublicPageLayout mainId="reset-password-page" ariaLabel="Reset password">
      <section className="section-padding bg-linear-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-md">
          <header className="mb-8 text-center">
            <p className="section-eyebrow">Account recovery</p>
            <h1 className="section-title mt-2 text-2xl sm:text-3xl">Reset password</h1>
            <p className="mt-2 text-sm text-brand-muted">
              Enter a new password for your account.
            </p>
          </header>

          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <Suspense fallback={<p className="text-sm text-brand-muted">Loading…</p>}>
              <CustomerResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
