"use client";

import { Reveal } from "@/components/animation/Reveal";
import { WordReveal } from "@/components/animation/WordReveal";
import { cn } from "@/lib/cn";

type SectionAnimatedHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  titleAs?: "h1" | "h2" | "h3";
  titleId?: string;
  align?: "center" | "start";
  className?: string;
  titleClassName?: string;
  eyebrowClassName?: string;
  mount?: boolean;
};

export function SectionAnimatedHeader({
  eyebrow,
  title,
  description,
  titleAs = "h2",
  titleId,
  align = "center",
  className,
  titleClassName,
  eyebrowClassName,
  mount = false,
}: SectionAnimatedHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <header className={cn("max-w-xl", alignClass, className)}>
      {eyebrow ? (
        <WordReveal
          text={eyebrow}
          as="p"
          mount={mount}
          align={align}
          className={cn(
            "section-eyebrow w-full uppercase tracking-[0.2em]",
            eyebrowClassName,
          )}
          wordClassName="font-semibold text-brand-primary"
        />
      ) : null}
      <WordReveal
        text={title}
        as={titleAs}
        id={titleId}
        delay={eyebrow ? 0.12 : 0}
        mount={mount}
        align={align}
        className={cn("section-title mt-2 w-full text-2xl sm:text-3xl", titleClassName)}
      />
      {description ? (
        <Reveal direction="up" delay={0.35} variant="text" mount={mount} className="mt-2 w-full">
          <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
