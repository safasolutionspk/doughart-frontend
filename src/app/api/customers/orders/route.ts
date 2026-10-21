import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  API_BASE_URL,
  type BackendFailure,
  type BackendSuccess,
} from "@/lib/auth/customer/api";
import { clearCustomerAuthCookies } from "@/lib/auth/customer/cookies";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/customer/constants";
import type { CustomerOrderSummary } from "@/lib/customer/orders";

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
    backendResponse = await fetch(`${API_BASE_URL}/api/customers/orders`, {
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
    | BackendSuccess<CustomerOrderSummary[]>
    | BackendFailure;

  if (!backendResponse.ok || !payload.success) {
    const status = backendResponse.status === 401 ? 401 : 500;
    const response = NextResponse.json(
      {
        success: false,
        message:
          "message" in payload ? payload.message : "Failed to load orders",
      },
      { status },
    );

    if (status === 401) {
      clearCustomerAuthCookies(response);
    }

    return response;
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}
