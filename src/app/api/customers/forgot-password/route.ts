import { NextResponse } from "next/server";
import {
  API_BASE_URL,
  type BackendFailure,
  type BackendSuccess,
} from "@/lib/auth/customer/api";

type ForgotPasswordResponse = {
  requested: boolean;
};

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_BASE_URL}/api/customers/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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

  let payload: BackendSuccess<ForgotPasswordResponse> | BackendFailure;
  try {
    payload = (await backendResponse.json()) as
      | BackendSuccess<ForgotPasswordResponse>
      | BackendFailure;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid response from server" },
      { status: 502 },
    );
  }

  if (!backendResponse.ok || !payload.success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "message" in payload
            ? payload.message
            : "Could not process password reset request.",
        errors: "errors" in payload ? payload.errors : undefined,
      },
      { status: backendResponse.status || 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
}
