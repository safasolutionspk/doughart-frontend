/**
 * Browser-visible API origin (images, client fetches). Baked in at build via NEXT_PUBLIC_*.
 */
export function getPublicApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:5000"
  );
}

/**
 * Server-side fetch origin. Prefer Docker-internal URL when set.
 */
export function getApiFetchUrl(): string {
  if (typeof window === "undefined") {
    const internal = process.env.API_INTERNAL_URL?.replace(/\/$/, "");
    if (internal) return internal;
  }
  return getPublicApiUrl();
}
