export function getReviewsCopy(businessName: string) {
  return {
    subtitle: `Sweet words from customers who celebrated with ${businessName}.`,
    heading: "Loved by Our Customers",
  };
}

export type StaticReview = {
  id: string;
  name: string;
  role?: string;
  initials: string;
  avatar?: string;
  text: string;
  rating: number;
};

export type DisplayReview = {
  id: string;
  name: string;
  role?: string;
  initials: string;
  avatar?: string;
  text: string;
  rating: number;
};

export const customerReviews: StaticReview[] = [
  {
    id: "review-1",
    name: "Ayesha K.",
    initials: "AK",
    text: "The cake looked beautiful and tasted fresh. The design matched what I requested perfectly.",
    rating: 5,
  },
  {
    id: "review-2",
    name: "Hira M.",
    initials: "HM",
    text: "Ordering was simple, and the cake arrived on time for our family celebration.",
    rating: 5,
  },
  {
    id: "review-3",
    name: "Sana A.",
    initials: "SA",
    text: "The finishing was neat, the flavour was balanced, and everyone enjoyed it.",
    rating: 5,
  },
  {
    id: "review-4",
    name: "Maryam R.",
    initials: "MR",
    text: "turned our idea into a lovely custom cake that felt made for our moment.",
    rating: 5,
  },
  {
    id: "review-5",
    name: "Zainab F.",
    initials: "ZF",
    text: "Every detail was handled carefully, and the final cake looked elegant and well presented.",
    rating: 5,
  },
  {
    id: "review-6",
    name: "Mahnoor S.",
    initials: "MS",
    text: "Fresh, beautifully decorated, and packed with care. The whole experience felt smooth.",
    rating: 5,
  },
];

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export function staticToDisplayReview(review: StaticReview): DisplayReview {
  return {
    id: review.id,
    name: review.name,
    role: review.role,
    initials: review.initials,
    avatar: review.avatar,
    text: review.text,
    rating: review.rating,
  };
}

/**
 * Single authoritative source for every public review surface (homepage
 * carousel and the /reviews page). No public surface fetches a separate list,
 * so the same six reviews always appear everywhere.
 */
export function getHomepageDisplayReviews(
  businessName: string,
): DisplayReview[] {
  return customerReviews.map((review) => {
    const display = staticToDisplayReview(review);
    if (review.id === "review-4") {
      return {
        ...display,
        text: `${businessName} turned our idea into a lovely custom cake that felt made for our moment.`,
      };
    }
    return display;
  });
}
