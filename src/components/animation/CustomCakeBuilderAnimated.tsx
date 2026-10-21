"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animation/Reveal";
import { WordReveal } from "@/components/animation/WordReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { customCakeCopy } from "@/lib/customCake";
import { cn } from "@/lib/cn";

export function CustomCakeBuilderAnimated() {
  return (
    <div
      className={cn(
        "section-container relative z-10 flex h-full items-center",
        "px-3 py-4 sm:min-h-[34rem] sm:px-6 sm:py-14",
        "lg:min-h-[40rem] lg:px-8 lg:py-16 xl:min-h-[44rem] xl:py-20",
      )}
    >
      {/* Text directly over the image — left side; no steps, panel, or overlay wash */}
      <div
        className={cn(
          "relative min-w-0 w-[48%] max-w-[11.25rem]",
          "sm:w-auto sm:max-w-sm md:max-w-md",
          "lg:max-w-lg",
        )}
      >
        <Reveal direction="left" delay={0}>
          <SectionEyebrow
            align="start"
            className={cn(
              "gap-1.5 sm:gap-3",
              "[&_.eyebrow-script]:text-[0.52rem] [&_.eyebrow-script]:leading-none",
              "sm:[&_.eyebrow-script]:text-xl",
              "[&_svg]:h-2.5 [&_svg]:w-2.5 sm:[&_svg]:h-3.5 sm:[&_svg]:w-3.5",
              "[&>span:first-of-type]:w-4 sm:[&>span:first-of-type]:w-12",
              "[&>span:last-of-type]:w-3 sm:[&>span:last-of-type]:w-10",
            )}
          >
            {customCakeCopy.subtitle}
          </SectionEyebrow>
        </Reveal>

        <h2
          id="custom-cakes-heading"
          className="mt-1.5 font-display text-[1.05rem] font-bold leading-[1.05] tracking-tight text-brand-brown sm:mt-3.5 sm:text-3xl sm:leading-tight lg:mt-4 lg:text-[2.125rem]"
        >
          <WordReveal
            text={customCakeCopy.heading}
            as="span"
            delay={0.1}
            className="block w-full"
          />
        </h2>

        <Reveal direction="up" delay={0.3}>
          <p className="mt-2 max-w-[10.5rem] text-[0.54rem] font-medium leading-[1.3] text-brand-brown sm:mt-5 sm:max-w-md sm:text-[0.9375rem] sm:leading-relaxed lg:mt-6 lg:text-base">
            {customCakeCopy.description}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.45}>
          <Button
            href={customCakeCopy.ctaHref}
            size="sm"
            className="mt-3 h-7 w-fit px-3 text-[0.625rem] sm:mt-8 sm:h-10 sm:px-5 sm:text-sm lg:mt-10"
          >
            {customCakeCopy.ctaLabel}
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
