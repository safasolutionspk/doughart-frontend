"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import {
  REVEAL_OBSERVER_OPTIONS,
  WORD_STAGGER_DEFAULT,
} from "@/lib/animation/constants";
import { useMotionReady } from "@/lib/animation/useMotionReady";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import { cn } from "@/lib/cn";

type WordRevealProps = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  mount?: boolean;
  align?: "start" | "center";
};

export function WordReveal({
  text,
  as: Component = "span",
  id,
  className,
  wordClassName,
  delay = 0,
  stagger = WORD_STAGGER_DEFAULT,
  mount = false,
  align = "start",
}: WordRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const motionReady = useMotionReady();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const words = text.split(/\s+/).filter(Boolean);

  useLayoutEffect(() => {
    const trigger = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setActive(true));
      });
    };

    if (!motionReady) {
      return;
    }

    if (reducedMotion) {
      if (active) {
        return;
      }
      const timer = window.setTimeout(() => setActive(true), 0);
      return () => window.clearTimeout(timer);
    }

    if (active) {
      return;
    }

    const el = ref.current;
    if (!el) {
      trigger();
      return;
    }

    if (mount) {
      trigger();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trigger();
        observer.disconnect();
      }
    }, REVEAL_OBSERVER_OPTIONS);

    observer.observe(el);
    return () => observer.disconnect();
  }, [motionReady, reducedMotion, mount, delay, active]);

  const shouldAnimate = motionReady && !reducedMotion;

  return (
    <Component
      ref={ref}
      id={id}
      className={cn(
        "inline-flex max-w-full flex-wrap gap-x-[0.28em] gap-y-1",
        align === "center" && "justify-center",
        className,
      )}
      data-motion-active={active ? "true" : undefined}
    >
      {words.map((word, index) => {
        const wordDelay = delay + index * stagger;
        const style: CSSProperties | undefined =
          shouldAnimate && active
            ? { animationDelay: `${wordDelay}s` }
            : undefined;

        return (
          <span
            key={`${word}-${index}`}
            className={cn(
              "inline-block will-change-[opacity,transform]",
              shouldAnimate && !active && "opacity-0",
              shouldAnimate && active && "animate-word-reveal",
              reducedMotion && motionReady && "opacity-100",
              wordClassName,
            )}
            style={style}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
