"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animation/Reveal";
import { cn } from "@/lib/cn";

const heroBtnClass =
  "shadow-[0_3px_12px_rgba(231,84,128,0.18)] hover:shadow-[0_6px_18px_rgba(231,84,128,0.28)]";

/** Staggered mount delays for the hero text sequence */
const HERO_TEXT_DELAYS = {
  eyebrow: 0,
  heading: 0.8,
  description: 1.6,
  buttons: 2.4,
} as const;

type HeroContentProps = {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
};

export function HeroContent({
  eyebrow,
  headlineLine1,
  headlineLine2,
  description,
}: HeroContentProps) {
  return (
    <div
      className={cn(
        "max-w-[14.25rem] sm:max-w-[20rem]",
        "lg:max-w-xl xl:max-w-2xl",
        /* Soft shadow only — readability over photo, no solid panel */
        "[text-shadow:0_1px_10px_rgba(255,255,255,0.55)]",
      )}
    >
      <Reveal
        mount
        delay={HERO_TEXT_DELAYS.eyebrow}
        variant="hero-text"
        as="p"
        className={cn(
          "w-full whitespace-nowrap font-sans text-[0.55rem] font-semibold uppercase tracking-[0.16em]",
          "text-brand-primary",
          "sm:text-[0.8125rem] sm:tracking-[0.18em]",
          "lg:text-sm lg:tracking-[0.2em]",
        )}
      >
        {eyebrow}
      </Reveal>

      <Reveal
        mount
        delay={HERO_TEXT_DELAYS.heading}
        variant="hero-text"
        as="h1"
        id="hero-heading"
        className={cn(
          "mt-2.5 block w-full font-display font-bold leading-[0.98] tracking-tight",
          "text-[1.7rem] sm:mt-3 sm:text-4xl sm:leading-[1.12]",
          "md:text-5xl",
          "lg:mt-4 lg:text-5xl lg:leading-[1.1]",
          "xl:text-[3.25rem]",
        )}
      >
        <span className="block text-brand-brown">{headlineLine1}</span>
        <span className="block text-brand-primary">{headlineLine2}</span>
      </Reveal>

      <Reveal
        mount
        delay={HERO_TEXT_DELAYS.description}
        variant="hero-text"
        className="mt-3 max-w-[13.25rem] sm:mt-3.5 sm:max-w-sm lg:mt-5 lg:max-w-md"
      >
        <p
          className={cn(
            "text-[0.68rem] leading-[1.35] text-brand-brown/80",
            "sm:text-sm sm:leading-relaxed",
            "lg:text-base xl:text-lg",
          )}
        >
          {description}
        </p>
      </Reveal>

      <Reveal
        mount
        delay={HERO_TEXT_DELAYS.buttons}
        variant="hero-text"
        className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 lg:mt-7 lg:gap-3"
      >
        <Button
          href="/custom-cake"
          size="sm"
          className={cn(
            "h-8 min-w-0 px-3.5 text-[0.6875rem] font-semibold sm:h-9 sm:px-4 sm:text-xs",
            "lg:h-10 lg:min-w-[9rem] lg:px-5 lg:text-sm",
            heroBtnClass,
          )}
        >
          Order Custom Cake
        </Button>
        <Button
          href="/cakes/all"
          variant="outline"
          size="sm"
          className={cn(
            "h-8 min-w-0 border-brand-primary/70 bg-white/80 px-3.5 text-[0.6875rem] text-brand-primary backdrop-blur-[1px]",
            "hover:bg-brand-pink-lighter/80",
            "sm:h-9 sm:px-4 sm:text-xs",
            "lg:h-10 lg:min-w-[9rem] lg:px-5 lg:text-sm lg:bg-white/60",
            heroBtnClass,
          )}
        >
          Browse Menu
        </Button>
      </Reveal>
    </div>
  );
}
