import { SafeImage } from "@/components/ui/SafeImage";
import { HeroContent } from "@/components/animation/HeroContent";
import { Reveal } from "@/components/animation/Reveal";
import { siteImages } from "@/lib/images";
import { cn } from "@/lib/cn";

const heroCopy = {
  eyebrow: "Made With Love",
  headlineLine1: "Celebrate Life's",
  headlineLine2: "Sweetest Moments",
  description:
    "Custom cakes made with premium ingredients and thoughtful design — crafted for birthdays, weddings, and every celebration in between.",
} as const;

export function Hero() {
  return (
    <section
      id="hero"
      className="section-anchor relative min-h-[19.5rem] overflow-hidden sm:min-h-[36.5rem] lg:min-h-[min(88vh,52rem)]"
      aria-labelledby="hero-heading"
    >
      <Reveal
        mount
        delay={0.35}
        variant="hero-image"
        className="absolute inset-0"
        as="div"
      >
        <div className="absolute inset-0" aria-hidden>
          <SafeImage
            src={siteImages.heroMobile}
            fallbackSrc={siteImages.heroMobileFallback}
            fallbackSrcSecondary={siteImages.heroFallback}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[48%_45%] lg:hidden"
          />
          <SafeImage
            src={siteImages.hero}
            fallbackSrc={siteImages.heroFallback}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-[68%_center] lg:block"
          />
          {/* Subtle left wash only — keeps cake visible; no solid/dark text panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/12 to-transparent lg:from-white/30 lg:via-white/8 lg:to-transparent" />
        </div>
      </Reveal>

      <div
        className={cn(
          "section-container relative z-10 flex min-h-[19.5rem] flex-col justify-center",
          "py-10 sm:min-h-[36.5rem] sm:py-12",
          "lg:min-h-[min(88vh,52rem)] lg:py-16",
        )}
      >
        <HeroContent
          eyebrow={heroCopy.eyebrow}
          headlineLine1={heroCopy.headlineLine1}
          headlineLine2={heroCopy.headlineLine2}
          description={heroCopy.description}
        />
      </div>
    </section>
  );
}
