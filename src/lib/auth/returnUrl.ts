export function sanitizeReturnUrl(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (!value?.trim()) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  const pathOnly = trimmed.split("?")[0]?.split("#")[0] ?? "";

  if (pathOnly === "/checkout" || pathOnly === "/custom-cake") {
    return pathOnly;
  }

  if (
    pathOnly === "/" ||
    pathOnly === "/account" ||
    pathOnly === "/cart" ||
    pathOnly === "/cakes" ||
    pathOnly === "/my-order" ||
    pathOnly.startsWith("/cakes/")
  ) {
    return pathOnly;
  }

  return fallback;
}

export function buildLoginRedirectUrl(
  returnUrl: string,
  options?: { authRequired?: boolean },
): string {
  const safe = sanitizeReturnUrl(returnUrl);
  const params = new URLSearchParams({ returnUrl: safe });
  if (options?.authRequired !== false) {
    params.set("authRequired", "1");
  }
  return `/login?${params.toString()}`;
}

export function getReturnUrlFromSearchParams(
  searchParams: URLSearchParams,
): string {
  return sanitizeReturnUrl(
    searchParams.get("returnUrl") ?? searchParams.get("from"),
  );
}
