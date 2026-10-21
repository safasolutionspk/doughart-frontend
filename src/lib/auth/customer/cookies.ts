import { NextResponse } from "next/server";
import type { CustomerProfile } from "@/lib/auth/customer/types";
import {
  CUSTOMER_COOKIE_MAX_AGE,
  CUSTOMER_PROFILE_COOKIE,
  CUSTOMER_TOKEN_COOKIE,
  customerCookieBaseOptions,
} from "./constants";

export function setCustomerAuthCookies(
  response: NextResponse,
  token: string,
  customer: CustomerProfile,
): void {
  response.cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
    ...customerCookieBaseOptions,
    maxAge: CUSTOMER_COOKIE_MAX_AGE,
  });

  response.cookies.set(
    CUSTOMER_PROFILE_COOKIE,
    JSON.stringify(customer),
    {
      ...customerCookieBaseOptions,
      maxAge: CUSTOMER_COOKIE_MAX_AGE,
    },
  );
}

export function clearCustomerAuthCookies(response: NextResponse): void {
  const expired = {
    ...customerCookieBaseOptions,
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set(CUSTOMER_TOKEN_COOKIE, "", expired);
  response.cookies.set(CUSTOMER_PROFILE_COOKIE, "", expired);
}
