"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  getFramedImageStyle,
  normalizeImageDisplay,
  type ImageDisplay,
} from "@/lib/imageDisplay";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

type CatalogCardImageProps = {
  apiImage?: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Defaults to contain so Admin-uploaded product images are not cropped. */
  objectFit?: "cover" | "contain";
  /** Optional pan/zoom metadata from admin Set Image. */
  imageDisplay?: ImageDisplay | null;
};

function isRemoteApiUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function CatalogCardImage({
  apiImage,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority,
  objectFit = "contain",
  imageDisplay,
}: CatalogCardImageProps) {
  const trimmedApiImage = apiImage?.trim() ?? "";
  const display = normalizeImageDisplay(imageDisplay);
  const resetKey = `${trimmedApiImage}|${fallbackSrc}|${objectFit}|${display?.zoom ?? ""}|${display?.x ?? ""}|${display?.y ?? ""}`;

  return (
    <CatalogCardImageInner
      key={resetKey}
      apiImage={trimmedApiImage || undefined}
      fallbackSrc={fallbackSrc}
      alt={alt}
      sizes={sizes}
      className={className}
      priority={priority}
      objectFit={objectFit}
      imageDisplay={display}
    />
  );
}

function CatalogCardImageInner({
  apiImage,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority,
  objectFit = "contain",
  imageDisplay,
}: CatalogCardImageProps & { imageDisplay?: ImageDisplay }) {
  const trimmedApiImage = apiImage?.trim() ?? "";
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const currentSrc =
    primaryFailed || !trimmedApiImage ? fallbackSrc : trimmedApiImage;
  const useFallbackOnly = primaryFailed || !trimmedApiImage;

  const handleError = () => {
    if (!useFallbackOnly) {
      setPrimaryFailed(true);
    }
  };

  const displaySrc = currentSrc || fallbackSrc;
  const showRemote = isRemoteApiUrl(displaySrc) && !useFallbackOnly;
  const useFramed = Boolean(imageDisplay);

  const imageClassName = cn(
    useFramed
      ? undefined
      : objectFit === "contain"
        ? "object-contain object-center"
        : "object-cover object-center",
    className,
  );

  const framedStyle = useFramed && imageDisplay
    ? getFramedImageStyle(imageDisplay)
    : undefined;

  if (showRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        className={cn(
          useFramed ? undefined : "absolute inset-0 h-full w-full",
          imageClassName,
        )}
        style={framedStyle}
        onError={handleError}
      />
    );
  }

  if (useFramed && framedStyle) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        className={imageClassName}
        style={framedStyle}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={imageClassName}
      onError={handleError}
      unoptimized={displaySrc.startsWith(`${API_BASE_URL}/uploads/`)}
    />
  );
}
