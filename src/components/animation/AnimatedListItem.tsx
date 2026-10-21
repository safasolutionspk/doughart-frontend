"use client";

import { Reveal } from "@/components/animation/Reveal";
import { capStaggerDelay } from "@/lib/animation/constants";
import type { ReactNode } from "react";

type AnimatedListItemProps = {
  index: number;
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function AnimatedListItem({
  index,
  children,
  className,
  stagger = 0.1,
}: AnimatedListItemProps) {
  return (
    <li className={className}>
      <Reveal
        delay={capStaggerDelay(index, stagger)}
        direction="up"
        variant="card"
        className="h-full w-full"
      >
        {children}
      </Reveal>
    </li>
  );
}
