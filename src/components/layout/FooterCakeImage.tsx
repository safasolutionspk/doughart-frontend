"use client";

import { useState } from "react";
import { siteImages } from "@/lib/images";
import { cn } from "@/lib/cn";

type FooterCakeImageProps = {
  className?: string;
};

export function FooterCakeImage({ className }: FooterCakeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteImages.footerCake}
      alt=""
      width={120}
      height={120}
      onError={() => setFailed(true)}
      className={cn(
        "pointer-events-none border-0 bg-transparent object-contain object-bottom shadow-none",
        "h-16 w-auto max-w-[4.75rem] min-[375px]:h-[4.5rem] min-[375px]:max-w-[5.25rem]",
        "lg:h-[4.5rem] lg:max-w-[6rem]",
        className,
      )}
      aria-hidden
    />
  );
}
