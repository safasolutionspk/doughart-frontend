import { Button } from "@/components/ui/Button";

export function CheckoutEmptyState() {
  return (
    <div className="rounded-2xl border border-brand-border/80 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-14">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink-lighter text-2xl"
        aria-hidden
      >
        🛒
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold text-brand-brown">
        Nothing to checkout yet
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
        Add cakes from our shop to your cart, or order a custom cake from the
        builder.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href="/cakes" size="lg" className="w-full sm:w-auto">
          Browse Cakes
        </Button>
        <Button
          href="/custom-cake"
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          Custom Cake
        </Button>
      </div>
    </div>
  );
}
