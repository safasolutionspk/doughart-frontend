"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { REVEAL_OBSERVER_OPTIONS } from "@/lib/animation/constants";
import { useMotionReady } from "@/lib/animation/useMotionReady";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import { cn } from "@/lib/cn";

export type RevealDirection = "up" | "down" | "left" | "right" | "fade" | "scale";
export type RevealVariant = "default" | "text" | "card" | "hero-image" | "hero-text";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
  variant?: RevealVariant;
  className?: string;
  id?: string;
  once?: boolean;
  mount?: boolean;
  as?: ElementType;
};

const animationByKey: Record<string, string> = {
  "default-up": "animate-reveal-up",
  "default-down": "animate-reveal-down",
  "default-left": "animate-reveal-left",
  "default-right": "animate-reveal-right",
  "default-fade": "animate-reveal-fade",
  "default-scale": "animate-reveal-scale",
  "text-up": "animate-reveal-text",
  "text-down": "animate-reveal-text",
  "text-left": "animate-reveal-left",
  "text-right": "animate-reveal-right",
  "text-fade": "animate-reveal-fade",
  "text-scale": "animate-reveal-scale",
  "card-up": "animate-reveal-card",
  "card-down": "animate-reveal-card",
  "card-left": "animate-reveal-left",
  "card-right": "animate-reveal-right",
  "card-fade": "animate-reveal-fade",
  "card-scale": "animate-reveal-scale",
  "hero-image-up": "animate-reveal-hero-image",
  "hero-image-down": "animate-reveal-hero-image",
  "hero-image-left": "animate-reveal-hero-image",
  "hero-image-right": "animate-reveal-hero-image",
  "hero-image-fade": "animate-reveal-hero-image",
  "hero-image-scale": "animate-reveal-hero-image",
  "hero-text-up": "animate-hero-text-reveal",
  "hero-text-down": "animate-hero-text-reveal",
  "hero-text-left": "animate-hero-text-reveal",
  "hero-text-right": "animate-hero-text-reveal",
  "hero-text-fade": "animate-hero-text-reveal",
  "hero-text-scale": "animate-hero-text-reveal",
};

function getAnimationClass(
  direction: RevealDirection,
  variant: RevealVariant,
): string {
  return animationByKey[`${variant}-${direction}`] ?? "animate-reveal-up";
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  variant = "default",
  className,
  id,
  once = true,
  mount = false,
  as: Component = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const motionReady = useMotionReady();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);

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
        if (once) {
          observer.disconnect();
        }
      }
    }, REVEAL_OBSERVER_OPTIONS);

    observer.observe(el);

    return () => observer.disconnect();
  }, [motionReady, reducedMotion, mount, delay, once, active]);

  const shouldAnimate = motionReady && !reducedMotion;
  const animationClass = getAnimationClass(direction, variant);
  const style: CSSProperties | undefined =
    shouldAnimate && active ? { animationDelay: `${delay}s` } : undefined;

  return (
    <Component
      ref={ref}
      id={id}
      className={cn(
        shouldAnimate && !active && "opacity-0",
        shouldAnimate && active && animationClass,
        reducedMotion && motionReady && "opacity-100",
        className,
      )}
      style={style}
      data-motion-active={active ? "true" : undefined}
    >
      {children}
    </Component>
  );
}
