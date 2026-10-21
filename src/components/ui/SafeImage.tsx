"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc: string;
  /** Tried after fallbackSrc if that also fails */
  fallbackSrcSecondary?: string;
};

export function SafeImage({
  src,
  fallbackSrc,
  fallbackSrcSecondary,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const resetKey = `${src}|${fallbackSrc}|${fallbackSrcSecondary ?? ""}`;

  return (
    <SafeImageInner
      key={resetKey}
      src={src}
      fallbackSrc={fallbackSrc}
      fallbackSrcSecondary={fallbackSrcSecondary}
      alt={alt}
      className={className}
      {...props}
    />
  );
}

function SafeImageInner({
  src,
  fallbackSrc,
  fallbackSrcSecondary,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const [fallbackStep, setFallbackStep] = useState<0 | 1 | 2>(0);

  const currentSrc =
    fallbackStep === 0
      ? src
      : fallbackStep === 1
        ? fallbackSrc
        : (fallbackSrcSecondary ?? fallbackSrc);

  function handleError() {
    if (fallbackStep === 0) {
      setFallbackStep(1);
      return;
    }
    if (fallbackStep === 1 && fallbackSrcSecondary) {
      setFallbackStep(2);
      return;
    }
  }

  return (
    <Image
      {...props}
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={cn("image-zoom-target", className)}
      onError={handleError}
    />
  );
}
