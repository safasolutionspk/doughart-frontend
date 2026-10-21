import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CustomerLoginForm } from "@/components/auth/CustomerLoginForm";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Sign in",
    description: `Sign in to your ${businessName} account.`,
    path: "/login",
    noIndex: true,
    brandName: businessName,
  });
}

export default function LoginPage() {
  return (
    <PublicPageLayout mainId="login-page" ariaLabel="Customer sign in">
      <section className="section-padding bg-linear-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-md">
          <header className="mb-8 text-center">
            <p className="section-eyebrow">Welcome back</p>
            <h1 className="section-title mt-2 text-2xl sm:text-3xl">Sign in</h1>
            <p className="mt-2 text-sm text-brand-muted">
              Sign in to place orders and view orders linked to your account.
            </p>
          </header>
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <Suspense fallback={<p className="text-sm text-brand-muted">Loading…</p>}>
              <CustomerLoginForm />
            </Suspense>
            <p className="mt-4 text-center text-sm text-brand-muted">
              <Link href="/forgot-password" className="font-semibold text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
