import { Button } from "@/components/ui/Button";

type ShopEmptyStateProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ShopEmptyState({
  title,
  description,
  primaryHref = "/custom-cake",
  primaryLabel = "Request a custom cake",
  secondaryHref = "/cakes/all",
  secondaryLabel = "Browse all menu",
}: ShopEmptyStateProps) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-brand-border/80 bg-white px-6 py-10 text-center shadow-sm sm:mt-12 sm:px-8 sm:py-12">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink-lighter text-2xl"
        aria-hidden
      >
        🎂
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-brand-brown sm:text-xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-muted sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={primaryHref} className="w-full sm:w-auto">
          {primaryLabel}
        </Button>
        {secondaryHref ? (
          <Button
            href={secondaryHref}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
