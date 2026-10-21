import Link from "next/link";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/Button";

type ShopNotFoundProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ShopNotFound({
  title,
  description,
  primaryHref = "/cakes/all",
  primaryLabel = "Browse all menu",
  secondaryHref = "/",
  secondaryLabel = "Back to home",
}: ShopNotFoundProps) {
  return (
    <PublicPageLayout mainId="shop-not-found" ariaLabel="Page not found">
      <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-lg text-center">
          <p className="text-6xl font-display font-semibold text-brand-primary/30 sm:text-7xl">
            404
          </p>
          <h1 className="section-title mt-4 text-2xl sm:text-3xl">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href={primaryHref}>{primaryLabel}</Button>
            <Button href={secondaryHref} variant="outline">
              {secondaryLabel}
            </Button>
          </div>
          <p className="mt-8 text-sm text-brand-muted">
            Need a bespoke design?{" "}
            <Link
              href="/custom-cake"
              className="font-semibold text-brand-primary hover:underline"
            >
              Request a custom cake
            </Link>
          </p>
        </div>
      </section>
    </PublicPageLayout>
  );
}
