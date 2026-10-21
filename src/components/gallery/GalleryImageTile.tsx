"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { siteImages } from "@/lib/images";
import type { GalleryDisplayImage } from "@/lib/gallery";

type GalleryImageTileProps = {
  image: GalleryDisplayImage;
  sizes: string;
  className?: string;
  imageClassName?: string;
};

export function GalleryImageTile({
  image,
  sizes,
  className,
  imageClassName,
}: GalleryImageTileProps) {
  const [failed, setFailed] = useState(false);
  const src = failed ? siteImages.gallery[0] : image.src;
  const isRemote = src.startsWith("http://") || src.startsWith("https://");

  if (isRemote && !failed) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={image.alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            imageClassName,
          )}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Image
        src={src}
        alt={image.alt}
        fill
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        onError={() => {
          if (!failed) setFailed(true);
        }}
      />
    </div>
  );
}
