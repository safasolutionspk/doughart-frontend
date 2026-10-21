"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

type PopularItemsCarouselProps = {
  children: React.ReactNode;
  className?: string;
};

export function PopularItemsCarousel({
  children,
  className,
}: PopularItemsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "prev" | "next") => {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }
    const amount = Math.max(240, Math.floor(node.clientWidth * 0.8));
    node.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative min-w-0", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center lg:flex">
        <button
          type="button"
          aria-label="Scroll popular items left"
          onClick={() => scrollByCard("prev")}
          className="pointer-events-auto ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/70 bg-white/95 text-brand-brown shadow-sm transition hover:border-brand-primary hover:text-brand-primary"
        >
          ‹
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center lg:flex">
        <button
          type="button"
          aria-label="Scroll popular items right"
          onClick={() => scrollByCard("next")}
          className="pointer-events-auto mr-1 flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/70 bg-white/95 text-brand-brown shadow-sm transition hover:border-brand-primary hover:text-brand-primary"
        >
          ›
        </button>
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          // Cancel section-container gutters, then restore equal start/end insets.
          "-mx-4 flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain touch-pan-x ps-4 pe-0 pb-2",
          "snap-x snap-mandatory scroll-smooth scroll-ps-4 scroll-pe-4",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Trailing inset via ::after (flex overflow ignores end padding in some browsers).
          "after:w-4 after:shrink-0 after:content-['']",
          "sm:-mx-6 sm:gap-4 sm:ps-6 sm:scroll-ps-6 sm:scroll-pe-6 sm:after:w-6",
          "lg:mx-0 lg:gap-5 lg:ps-12 lg:scroll-ps-12 lg:scroll-pe-12 lg:after:w-12",
        )}
      >
        {children}
      </div>
    </div>
  );
}
