"use client";

import { useState } from "react";
import { ReviewAvatar } from "@/components/sections/ReviewAvatar";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import { cn } from "@/lib/cn";
import type { DisplayReview } from "@/lib/reviews";

type ReviewsCarouselProps = {
  reviews: DisplayReview[];
};

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={cn(
        "relative -mx-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        !reducedMotion && "lg:overflow-hidden",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 1400);
      }}
    >
      <div
        className={cn(
          "flex w-max gap-3 sm:gap-4",
          !reducedMotion && "animate-reviews-marquee",
        )}
        style={
          !reducedMotion
            ? { animationPlayState: paused ? "paused" : "running" }
            : undefined
        }
      >
        <ReviewTrack reviews={reviews} />
        {!reducedMotion ? (
          <div className="flex gap-3 sm:gap-4" aria-hidden>
            <ReviewTrack reviews={reviews} duplicate />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ReviewTrack({
  reviews,
  duplicate = false,
}: {
  reviews: DisplayReview[];
  duplicate?: boolean;
}) {
  return (
    <ul
      className="flex gap-3 sm:gap-4"
      aria-label={duplicate ? undefined : "Customer reviews"}
      aria-hidden={duplicate || undefined}
    >
      {reviews.map((review) => (
        <li
          key={`${duplicate ? "dup-" : ""}${review.id}`}
          className="w-[min(18.5rem,82vw)] shrink-0 sm:w-[20rem] lg:w-[22rem]"
        >
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}

function ReviewCard({ review }: { review: DisplayReview }) {
  return (
    <article className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-brand-border/70 bg-[#FFF8FA] px-4 py-4 text-left sm:min-h-[11.5rem] sm:px-5 sm:py-5">
      <div className="flex items-center gap-3">
        <ReviewAvatar initials={review.initials} />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-brand-brown sm:text-base">
            {review.name}
          </p>
          <StarRating
            rating={review.rating}
            label={`${review.rating} out of 5 stars`}
          />
        </div>
      </div>

      <blockquote className="mt-3 flex-1 border-t border-brand-border/40 pt-3">
        <p className="text-xs leading-relaxed text-brand-muted sm:text-sm">
          &ldquo;{review.text}&rdquo;
        </p>
      </blockquote>
    </article>
  );
}

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="mt-0.5 flex gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;
        return (
          <span
            key={index}
            className={filled ? "text-amber-400" : "text-brand-border"}
            aria-hidden
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
