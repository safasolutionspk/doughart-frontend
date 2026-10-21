import { CakeCard } from "@/components/catalog/CakeCard";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { Reveal } from "@/components/animation/Reveal";
import { PopularItemsCarousel } from "@/components/sections/PopularItemsCarousel";
import { Button } from "@/components/ui/Button";
import { capStaggerDelay } from "@/lib/animation/constants";
import { fetchPopularCakes } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export async function MostPopularItems() {
  const cakes = await fetchPopularCakes(12);

  if (!cakes || cakes.length === 0) {
    return null;
  }

  return (
    <section
      id="most-popular"
      className="section-anchor scroll-mt-20 bg-[#FFF8FA] py-8 sm:py-10 lg:scroll-mt-24 lg:py-12"
      aria-labelledby="most-popular-heading"
    >
      <div className="section-container">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionAnimatedHeader
            eyebrow="Customer favourites"
            title="Most Popular Items"
            description="Ranked by ordered quantity — our most-loved cakes, ready for your celebration."
            titleAs="h2"
            titleId="most-popular-heading"
            align="start"
            className="max-w-xl sm:text-left"
          />
          <Button
            href="/cakes/all"
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            View All
          </Button>
        </div>

        <div className="mt-7 min-w-0">
          <PopularItemsCarousel>
            {cakes.map((cake, index) => (
              <Reveal
                key={cake._id}
                as="div"
                delay={capStaggerDelay(index, 0.08)}
                direction="up"
                variant="card"
                className={cn(
                  "w-[10rem] shrink-0 snap-start",
                  "sm:w-[13rem]",
                  "lg:w-[14.5rem]",
                )}
              >
                <CakeCard
                  cake={cake}
                  showDescription={false}
                  compactPopular
                />
              </Reveal>
            ))}
          </PopularItemsCarousel>
        </div>
      </div>
    </section>
  );
}
