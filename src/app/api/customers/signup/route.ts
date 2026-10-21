import { NextResponse } from "next/server";
import {
  API_BASE_URL,
  type BackendAuthData,
  type BackendFailure,
  type BackendSuccess,
} from "@/lib/auth/customer/api";
import { setCustomerAuthCookies } from "@/lib/auth/customer/cookies";

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const password = body.password;

  if (!name || !email || !phone || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Name, email, phone, and password are required",
      },
      { status: 400 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_BASE_URL}/api/customers/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
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
    | BackendSuccess<BackendAuthData>
    | BackendFailure;

  if (!backendResponse.ok || !payload.success) {
    const message =
      "message" in payload
        ? payload.message
        : "Could not create account. Please try again.";
    const status =
      backendResponse.status === 409
        ? 409
        : backendResponse.status === 429
          ? 429
          : 400;
    return NextResponse.json(
      {
        success: false,
        message,
        errors: "errors" in payload ? payload.errors : undefined,
      },
      { status },
    );
  }

  const { token, customer } = payload.data;
  const response = NextResponse.json({
    success: true,
    message: payload.message,
    customer,
  });

  setCustomerAuthCookies(response, token, customer);
  return response;
}
