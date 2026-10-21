import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  API_BASE_URL,
  type BackendFailure,
  type BackendSuccess,
} from "@/lib/auth/customer/api";
import { clearCustomerAuthCookies } from "@/lib/auth/customer/cookies";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/customer/constants";
import type { CustomerProfile } from "@/lib/auth/customer/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_BASE_URL}/api/customers/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the server. Please try again later.",
      },
      { status: 503 },
    );
  }

  const payload = (await backendResponse.json()) as
    | BackendSuccess<CustomerProfile>
    | BackendFailure;

  if (!backendResponse.ok || !payload.success) {
    const response = NextResponse.json(
      {
        success: false,
        message:
          "message" in payload ? payload.message : "Not authenticated",
      },
      { status: 401 },
    );

    if (backendResponse.status === 401) {
      clearCustomerAuthCookies(response);
    }

    return response;
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    customer: payload.data,
  });
}
