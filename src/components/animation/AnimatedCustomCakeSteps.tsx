"use client";

import { Reveal } from "@/components/animation/Reveal";
import { capStaggerDelay } from "@/lib/animation/constants";
import { cn } from "@/lib/cn";
import { customCakeSteps } from "@/lib/customCake";

type AnimatedCustomCakeStepsProps = {
  compact?: boolean;
  className?: string;
};

export function AnimatedCustomCakeSteps({
  compact = false,
  className,
}: AnimatedCustomCakeStepsProps) {
  return (
    <ol
      className={cn(
        "relative w-full min-w-0 pl-0.5",
        compact
          ? "space-y-1.5 sm:space-y-2"
          : "mx-auto w-fit space-y-2.5 sm:space-y-3 lg:mx-0 lg:w-auto lg:space-y-4",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-2.5 bottom-2.5 w-px bg-brand-primary/45",
          compact ? "left-[0.5625rem]" : "left-[0.75rem] lg:left-[0.9375rem]",
        )}
        aria-hidden
      />
      {customCakeSteps.map((step, index) => (
        <Reveal
          key={step.title}
          as="li"
          direction="right"
          delay={capStaggerDelay(index, 0.1, 0.5)}
          className={cn("relative flex min-w-0", compact ? "gap-1.5" : "gap-2.5 sm:gap-3")}
        >
          <span
            className={cn(
              "relative z-10 flex shrink-0 items-center justify-center rounded-full bg-brand-primary font-bold text-white",
              compact
                ? "h-6 w-6 text-[0.5625rem] sm:h-[1.375rem] sm:w-[1.375rem] sm:text-[0.625rem]"
                : "h-7 w-7 text-[0.6875rem] lg:h-8 lg:w-8 lg:text-xs",
            )}
          >
            {index + 1}
          </span>
          <div className="min-w-0 pt-0.5 text-left">
            <h3
              className={cn(
                "font-display font-bold leading-tight text-brand-brown",
                compact ? "text-[0.5625rem] sm:text-[0.625rem]" : "text-xs lg:text-sm",
              )}
            >
              {step.title}
            </h3>
            <p
              className={cn(
                "mt-0.5 font-medium leading-snug text-brand-brown/85",
                compact
                  ? "text-[0.625rem] sm:text-[0.6875rem]"
                  : "text-[0.6875rem] sm:text-xs lg:text-xs",
              )}
            >
              {step.description}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
