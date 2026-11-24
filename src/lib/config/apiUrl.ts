/**
 * Browser-visible API origin (images, client fetches). Baked in at build via NEXT_PUBLIC_*.
 *
 * Production shop/admin must build with:
 *   NEXT_PUBLIC_API_URL=https://api.doughartbakers.com
 *
 * A previous deploy baked https://api.doughart.com, which does not resolve /
 * times out. Rewrite that dead host so relative `/uploads/...` images and SSR
 * fetches still reach the live API without changing localhost defaults.
 */
const FALLBACK_DEV_API_URL = "http://localhost:5000";
const PRODUCTION_API_ORIGIN = "https://api.doughartbakers.com";

/** Hostnames that must never be used for API/image traffic. */
const DEAD_API_HOSTNAMES = new Set(["api.doughart.com", "doughart.com"]);

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isDeadApiHostname(hostname: string): boolean {
  return DEAD_API_HOSTNAMES.has(hostname.toLowerCase());
}

/**
 * If `url` points at a known-dead DoughArt API host, return the same path on
 * the live production API. Otherwise return the input unchanged (localhost,
 * api.doughartbakers.com, CDNs, etc.).
 */
export function rewriteDeadApiOrigin(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (isDeadApiHostname(parsed.hostname)) {
      return `${PRODUCTION_API_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function getPublicApiUrl(): string {
  const configured = stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL?.trim() || FALLBACK_DEV_API_URL,
  );

  try {
    const hostname = new URL(configured).hostname;
    if (isDeadApiHostname(hostname)) {
      return PRODUCTION_API_ORIGIN;
    }
  } catch {
    return configured;
  }

  return configured;
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
