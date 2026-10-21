"use client";

import { Children, isValidElement, type ElementType, type ReactNode } from "react";
import { MOTION_STAGGER_DEFAULT } from "@/lib/animation/constants";
import { Reveal, type RevealDirection } from "@/components/animation/Reveal";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  direction?: RevealDirection;
  as?: ElementType;
};

export function Stagger({
  children,
  className,
  stagger = MOTION_STAGGER_DEFAULT,
  direction = "up",
  as: Component = "div",
}: StaggerProps) {
  const items = Children.toArray(children);

  return (
    <Component className={className}>
      {items.map((child, index) => {
        const key =
          isValidElement(child) && child.key != null ? child.key : `stagger-${index}`;

        return (
          <Reveal key={key} delay={index * stagger} direction={direction}>
            {child}
          </Reveal>
        );
      })}
    </Component>
  );
}
