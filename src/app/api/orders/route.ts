import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  API_BASE_URL,
  type BackendFailure,
  type BackendSuccess,
} from "@/lib/auth/customer/api";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/customer/constants";
import type { PublicOrderPayload, PublicOrderResponse } from "@/lib/api";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;

  let body: PublicOrderPayload;
  try {
    body = (await request.json()) as PublicOrderPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
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
    | BackendSuccess<PublicOrderResponse>
    | BackendFailure;

  if (!backendResponse.ok || !payload.success) {
    const status = backendResponse.status === 401 ? 401 : backendResponse.status;
    return NextResponse.json(
      {
        success: false,
        message:
          "message" in payload
            ? payload.message
            : "Failed to place order. Please try again.",
        errors: "errors" in payload ? payload.errors : undefined,
      },
      { status },
    );
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}
