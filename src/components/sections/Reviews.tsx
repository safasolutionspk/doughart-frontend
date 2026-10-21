import { ReviewsCarousel } from "@/components/sections/ReviewsCarousel";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { Reveal } from "@/components/animation/Reveal";
import { getHomepageDisplayReviews, getReviewsCopy } from "@/lib/reviews";
import { getBusinessName } from "@/lib/settings";

export async function Reviews() {
  const businessName = await getBusinessName();
  const reviewsCopy = getReviewsCopy(businessName);
  const reviews = getHomepageDisplayReviews(businessName);

  return (
    <section
      id="reviews"
      className="section-anchor section-padding bg-white"
      aria-labelledby="reviews-heading"
    >
      <div className="section-container">
        <SectionAnimatedHeader
          eyebrow={reviewsCopy.subtitle}
          title={reviewsCopy.heading}
          titleAs="h2"
          titleId="reviews-heading"
          align="center"
          className="max-w-xl"
        />

        <Reveal delay={0.2} direction="up" className="mt-8 lg:mt-10">
          <ReviewsCarousel reviews={reviews} />
        </Reveal>
      </div>
    </section>
  );
}
