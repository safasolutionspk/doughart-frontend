import { getApiFetchUrl } from "@/lib/config/apiUrl";

const API_BASE_URL = getApiFetchUrl();

/** Stored order methods — legacy values only appear on historical records. */
export type PaymentMethod =
  | "cash_on_delivery"
  | "bank_transfer"
  | "online_payment"
  | "online_payment_full"
  | "online_payment_advance";

export type PublicOrderLineItem = {
  /** Catalog slug — backend resolves cakeId/name/price from the database */
  cakeSlug: string;
  quantity: number;
  notes?: string;
  cakeDetails?: {
    pounds?: string;
    flavor?: string;
    messageOnCake?: string;
    notes?: string;
  };
  giftDetails?: {
    notes?: string;
  };
  productDetails?: {
    notes?: string;
  };
};

export type PublicOrderPayload = {
  name: string;
  phone: string;
  /** Optional — phone is the primary contact method */
  email?: string;
  cakeType: string;
  flavor?: string;
  size?: string;
  message?: string;
  deliveryDate?: string;
  address?: string;
  notes?: string;
  /** New public orders are always Cash on Delivery. */
  paymentMethod?: "cash_on_delivery";
  cakeSlug?: string;
  /** Custom cake reference/design image path from upload */
  referenceImage?: string;
  /** Included for cart orders; public API may encode lines in notes until backend accepts items. */
  items?: PublicOrderLineItem[];
};

export type PublicOrderResponse = {
  orderNumber: string;
  status: string;
  customerName: string;
  cakeType: string;
  cakeSize?: string;
  flavour?: string;
  eventDate?: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  quotedAmount?: number;
  finalAmount: number;
  quoteNotes?: string;
  awaitingQuote: boolean;
  message: string;
};

export type UploadImageResponse = {
  url: string;
  filename: string;
};

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export class OrderApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.name = "OrderApiError";
    this.fieldErrors = fieldErrors;
  }
}

export class NewsletterApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NewsletterApiError";
  }
}

export async function subscribeNewsletter(
  email: string,
  source: string,
  consent: boolean,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), source, consent }),
  });

  let body: ApiSuccess<unknown> | ApiFailure;
  try {
    body = (await response.json()) as ApiSuccess<unknown> | ApiFailure;
  } catch {
    throw new NewsletterApiError(
      "Unable to reach the server. Please check your connection and try again.",
    );
  }

  if (!response.ok || !body.success) {
    throw new NewsletterApiError(
      body.message || "Could not subscribe. Please try again.",
    );
  }
}

export async function submitOrder(
  payload: PublicOrderPayload,
): Promise<PublicOrderResponse> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let body: ApiSuccess<PublicOrderResponse> | ApiFailure;
  try {
    body = (await response.json()) as ApiSuccess<PublicOrderResponse> | ApiFailure;
  } catch {
    throw new OrderApiError(
      "Unable to reach the server. Please check your connection and try again.",
    );
  }

  if (!response.ok || !body.success) {
    const failure = body as ApiFailure;
    throw new OrderApiError(
      failure.message || "Failed to place order. Please try again.",
      failure.errors,
    );
  }

  return body.data;
}

export async function fetchPublicOrderByNumber(
  orderNumber: string,
  phone: string,
): Promise<PublicOrderResponse | null> {
  try {
    const params = new URLSearchParams({ phone: phone.trim() });
    const response = await fetch(
      `${API_BASE_URL}/api/orders/public/${encodeURIComponent(orderNumber)}?${params}`,
      { next: { revalidate: 0 } },
    );

    let body: ApiSuccess<PublicOrderResponse> | ApiFailure;
    try {
      body = (await response.json()) as ApiSuccess<PublicOrderResponse> | ApiFailure;
    } catch {
      return null;
    }

    if (!response.ok || !body.success) {
      return null;
    }

    return body.data;
  } catch {
    return null;
  }
}

export async function lookupOrder(
  orderNumber: string,
  phone: string,
): Promise<PublicOrderResponse> {
  const params = new URLSearchParams({
    orderNumber: orderNumber.trim(),
    phone: phone.trim(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/orders/public/lookup?${params}`,
    { cache: "no-store" },
  );

  let body: ApiSuccess<PublicOrderResponse> | ApiFailure;
  try {
    body = (await response.json()) as ApiSuccess<PublicOrderResponse> | ApiFailure;
  } catch {
    throw new OrderApiError("Unable to reach the server. Please try again.");
  }

  if (!response.ok || !body.success) {
    const failure = body as ApiFailure;
    throw new OrderApiError(
      failure.message || "Order not found. Check your order number and phone.",
      failure.errors,
    );
  }

  return body.data;
}

export async function uploadReferenceImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/api/uploads/public/reference-image`, {
    method: "POST",
    body: formData,
  });

  let body: ApiSuccess<UploadImageResponse> | ApiFailure;
  try {
    body = (await response.json()) as ApiSuccess<UploadImageResponse> | ApiFailure;
  } catch {
    throw new OrderApiError("Failed to upload image. Please try again.");
  }

  if (!response.ok || !body.success) {
    const failure = body as ApiFailure;
    throw new OrderApiError(failure.message || "Failed to upload reference image.");
  }

  return body.data;
}
