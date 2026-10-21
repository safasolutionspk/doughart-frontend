import { ReviewAvatar } from "@/components/sections/ReviewAvatar";
import { AnimatedListItem } from "@/components/animation/AnimatedListItem";
import type { DisplayReview } from "@/lib/reviews";

type ReviewsGridProps = {
  reviews: DisplayReview[];
};

export function ReviewsGrid({ reviews }: ReviewsGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {reviews.map((review, index) => (
        <AnimatedListItem key={review.id} index={index}>
          <ReviewCard review={review} />
        </AnimatedListItem>
      ))}
    </ul>
  );
}

function ReviewCard({ review }: { review: DisplayReview }) {
  return (
    <article className="card-premium flex h-full flex-col rounded-2xl border border-brand-border/60 bg-gradient-to-b from-white via-white to-brand-pink-lighter/40 px-4 py-4 shadow-md shadow-brand-primary/8 sm:px-5 sm:py-5">
      <div className="flex items-center gap-3">
        <ReviewAvatar avatar={review.avatar} initials={review.initials} />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-brand-brown sm:text-base">
            {review.name}
          </p>
          {review.role ? (
            <p className="truncate text-xs text-brand-muted">{review.role}</p>
          ) : null}
          <StarRating rating={review.rating} label={`${review.rating} out of 5 stars`} />
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">
        &ldquo;{review.text}&rdquo;
      </p>
    </article>
  );
}

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="mt-1 flex gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-brand-primary" : "text-brand-border"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}
