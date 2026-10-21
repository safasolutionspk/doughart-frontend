import { CakeCard } from "@/components/catalog/CakeCard";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { Reveal } from "@/components/animation/Reveal";
import { PopularItemsCarousel } from "@/components/sections/PopularItemsCarousel";
import { Button } from "@/components/ui/Button";
import { capStaggerDelay } from "@/lib/animation/constants";
import { fetchComboOffers } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export async function ComboOffersSection() {
  const cakes = await fetchComboOffers(12);

  if (!cakes || cakes.length === 0) {
    return null;
  }

  return (
    <section
      id="combo-offers"
      className="section-anchor scroll-mt-20 bg-white py-8 sm:py-10 lg:scroll-mt-24 lg:py-12"
      aria-labelledby="combo-offers-heading"
    >
      <div className="section-container">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionAnimatedHeader
            eyebrow="Special packages"
            title="Combo Offers"
            description="Curated sets and offer packages — ready to order for your celebration."
            titleAs="h2"
            titleId="combo-offers-heading"
            align="start"
            className="max-w-xl sm:text-left"
          />
          <Button
            href="/cakes/combo-offers"
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            View All
          </Button>
        </div>

        <div className="mt-7">
          <PopularItemsCarousel>
            {cakes.map((cake, index) => (
              <Reveal
                key={cake._id}
                as="div"
                delay={capStaggerDelay(index, 0.08)}
                direction="up"
                variant="card"
                className={cn(
                  "w-[11.5rem] min-w-[11.5rem] shrink-0 snap-start",
                  "sm:w-[13rem] sm:min-w-[13rem]",
                  "lg:w-[14.5rem] lg:min-w-[14.5rem]",
                )}
              >
                <CakeCard cake={cake} showDescription={false} />
              </Reveal>
            ))}
          </PopularItemsCarousel>
        </div>
      </div>
    </section>
  );
}
