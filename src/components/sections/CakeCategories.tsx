import Link from "next/link";
import { CategoryCardImage } from "@/components/sections/CategoryCardImage";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { Reveal } from "@/components/animation/Reveal";
import { capStaggerDelay } from "@/lib/animation/constants";
import { getHomepageCategories, type HomepageCategory } from "@/lib/categories";
import { cn } from "@/lib/cn";

const categoryCircleClassName = cn(
  "image-zoom-wrap relative aspect-square overflow-hidden rounded-full",
  "h-[7.5rem] w-[7.5rem] sm:h-[8.5rem] sm:w-[8.5rem] lg:h-[11rem] lg:w-[11rem]",
  "bg-brand-pink-lighter",
  "ring-1 ring-brand-border/60",
  "shadow-sm shadow-brand-primary/10",
  "transition-all duration-300 ease-out",
  "group-hover:scale-[1.04] group-hover:shadow-md group-hover:shadow-brand-primary/20 group-hover:ring-brand-primary/35",
);

export async function CakeCategories() {
  const categories = await getHomepageCategories();

  return (
    <section
      id="cakes"
      className="section-anchor scroll-mt-20 bg-white py-8 sm:py-10 lg:scroll-mt-24 lg:py-11"
      aria-labelledby="cakes-heading"
    >
      <div className="section-container">
        <SectionAnimatedHeader
          eyebrow="Our Cakes"
          title="Explore Our Delicious Creations"
          description="Cakes crafted for life's sweetest moments — each category made to order with premium ingredients."
          titleAs="h2"
          titleId="cakes-heading"
          align="center"
          className="max-w-xl"
        />

        <div
          className={cn(
            "mt-8 -mx-4 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x px-4 pb-2",
            "snap-x snap-mandatory scroll-smooth",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "lg:mx-0 lg:px-0",
          )}
        >
          <ul
            className={cn(
              "flex w-max min-w-max flex-nowrap items-center gap-5",
              "sm:gap-6 lg:gap-8",
            )}
          >
            {categories.map((category, index) => (
              <li
                key={category.id}
                className="w-fit min-w-max shrink-0 snap-center"
              >
                <Reveal
                  delay={capStaggerDelay(index, 0.1)}
                  direction="up"
                  variant="card"
                  className="w-fit min-w-max shrink-0"
                >
                  <CategoryCard category={category} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type CategoryCardProps = {
  category: HomepageCategory;
};

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="group w-fit min-w-max">
      <Link
        href={category.href}
        className="inline-flex w-fit min-w-max flex-col items-center gap-3 text-center outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-brand-primary/50"
      >
        <div className={categoryCircleClassName}>
          <CategoryCardImage
            apiImage={category.apiImage}
            fallbackSrc={category.imageFallback}
            alt={category.title}
            sizes="(max-width: 1024px) 8.5rem, 11rem"
            objectFit="cover"
            imageDisplay={category.imageDisplay}
            className="rounded-full"
          />
        </div>

        <h3
          className={cn(
            "inline-flex h-7 w-max min-w-max shrink-0 items-center justify-center",
            "whitespace-nowrap leading-none",
            "rounded-full bg-brand-pink-lighter/80 px-3",
            "font-display text-sm font-semibold text-brand-brown",
            "transition-colors duration-300 group-hover:bg-brand-pink-light/90 group-hover:text-brand-primary",
            "sm:h-8 sm:px-3.5 sm:text-[0.9375rem]",
          )}
        >
          {category.title}
        </h3>
      </Link>
    </article>
  );
}
