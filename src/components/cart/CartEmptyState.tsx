import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CartEmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-brand-border/80 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-14">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink-lighter text-3xl"
        aria-hidden
      >
        🛒
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold text-brand-brown sm:text-2xl">
        Your cart is empty
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
        Browse our cakes and add your favourites — your selections stay saved
        on this device until you check out.
      </p>
      <div className="mt-8">
        <Button href="/cakes" size="lg" className="w-full sm:w-auto">
          Browse Cakes
        </Button>
      </div>
      <p className="mt-6 text-sm text-brand-muted">
        Need something bespoke?{" "}
        <Link
          href="/custom-cake"
          className="font-semibold text-brand-primary hover:underline"
        >
          Request a custom cake
        </Link>
      </p>
    </div>
  );
}
