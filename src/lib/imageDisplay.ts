import type { CSSProperties } from "react";

export type ImageDisplay = {
  zoom: number;
  x: number;
  y: number;
};

export const DEFAULT_IMAGE_DISPLAY: ImageDisplay = {
  zoom: 1,
  x: 0,
  y: 0,
};

export function normalizeImageDisplay(raw: unknown): ImageDisplay | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  const value = raw as Partial<ImageDisplay>;
  if (
    typeof value.zoom !== "number" &&
    typeof value.x !== "number" &&
    typeof value.y !== "number"
  ) {
    return undefined;
  }
  return {
    zoom: Math.min(3, Math.max(1, Number(value.zoom) || 1)),
    x: Math.min(50, Math.max(-50, Number(value.x) || 0)),
    y: Math.min(50, Math.max(-50, Number(value.y) || 0)),
  };
}

export function isDefaultImageDisplay(
  display: ImageDisplay | undefined | null,
): boolean {
  if (!display) {
    return true;
  }
  return display.zoom === 1 && display.x === 0 && display.y === 0;
}

/**
 * Framed pan/zoom style shared with admin Set Image editor.
 * Only apply when imageDisplay metadata exists (legacy images stay default).
 */
export function getFramedImageStyle(display: ImageDisplay): CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${display.zoom * 100}%`,
    height: `${display.zoom * 100}%`,
    maxWidth: "none",
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(calc(-50% + ${display.x}%), calc(-50% + ${display.y}%))`,
  };
}
