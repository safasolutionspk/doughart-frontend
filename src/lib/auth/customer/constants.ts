export const CUSTOMER_TOKEN_COOKIE = "sb_customer_token";
export const CUSTOMER_PROFILE_COOKIE = "sb_customer_profile";

/**
 * 7 days in seconds.
 * Keep aligned with backend JWT_EXPIRES_IN (for example: 7d in production).
 */
export const CUSTOMER_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const customerCookieBaseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
