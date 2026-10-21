import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/auth/customer/api";
import { clearCustomerAuthCookies } from "@/lib/auth/customer/cookies";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/customer/constants";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;

  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/customers/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    } catch {
      // Still clear cookies locally
    }
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  clearCustomerAuthCookies(response);
  return response;
}
