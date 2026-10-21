import { NextResponse } from "next/server";
import {
  API_BASE_URL,
  type BackendFailure,
  type BackendSuccess,
} from "@/lib/auth/customer/api";

type ResetPasswordResponse = {
  passwordReset: boolean;
};

export async function POST(request: Request) {
  let body: { token?: string; newPassword?: string };

  try {
    body = (await request.json()) as { token?: string; newPassword?: string };
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const token = body.token?.trim();
  const newPassword = body.newPassword;

  if (!token || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Token and new password are required" },
      { status: 400 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_BASE_URL}/api/customers/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
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

  let payload: BackendSuccess<ResetPasswordResponse> | BackendFailure;
  try {
    payload = (await backendResponse.json()) as
      | BackendSuccess<ResetPasswordResponse>
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
            : "Could not reset password. Please try again.",
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
