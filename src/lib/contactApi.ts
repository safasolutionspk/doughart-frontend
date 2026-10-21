import { getApiFetchUrl } from "@/lib/config/apiUrl";

const API_BASE_URL = getApiFetchUrl();

type ApiSuccess<T> = {
  success: true;
  message?: string;
  data?: T;
};

type ApiFailure = {
  success: false;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export class ContactApiError extends Error {
  fieldErrors?: Partial<
    Record<"name" | "phone" | "email" | "subject" | "message", string>
  >;

  constructor(
    message: string,
    fieldErrors?: ContactApiError["fieldErrors"],
  ) {
    super(message);
    this.name = "ContactApiError";
    this.fieldErrors = fieldErrors;
  }
}

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
};

export async function submitContactMessage(
  payload: ContactPayload,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim() ?? "",
      subject: payload.subject?.trim() ?? "",
      message: payload.message.trim(),
    }),
  });

  let body: ApiSuccess<unknown> | ApiFailure;
  try {
    body = (await response.json()) as ApiSuccess<unknown> | ApiFailure;
  } catch {
    throw new ContactApiError(
      "Unable to reach the server. Please check your connection and try again.",
    );
  }

  if (!response.ok || !body.success) {
    const failure = body as ApiFailure;
    const fieldErrors: ContactApiError["fieldErrors"] = {};
    if (failure.errors) {
      for (const key of ["name", "phone", "email", "subject", "message"] as const) {
        const message = failure.errors[key]?.[0];
        if (message) {
          fieldErrors[key] = message;
        }
      }
    }
    throw new ContactApiError(
      failure.message || "Could not send your message. Please try again.",
      Object.keys(fieldErrors).length ? fieldErrors : undefined,
    );
  }
}
