import type { CheckoutLineDetails } from "@/lib/itemTypes";

export const CHECKOUT_DRAFT_STORAGE_KEY = "sweetbite_checkout_draft_v2";

export type CheckoutDraftForm = {
  name: string;
  phone: string;
  email: string;
  deliveryDate: string;
  address: string;
  /** @deprecated kept for draft migration from v1 */
  flavor?: string;
  size?: string;
  message?: string;
  notes?: string;
};

/** Payment method is not stored — public checkout is Cash on Delivery only. */
export type CheckoutDraft = {
  form: Partial<CheckoutDraftForm>;
  lineDetails?: Record<string, CheckoutLineDetails>;
};

export const emptyCheckoutForm: CheckoutDraftForm = {
  name: "",
  phone: "",
  email: "",
  deliveryDate: "",
  address: "",
};

export function loadCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawV2 = window.sessionStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as CheckoutDraft;
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }

    // Migrate legacy v1 draft contact fields if present.
    const rawV1 = window.sessionStorage.getItem("sweetbite_checkout_draft_v1");
    if (!rawV1) {
      return null;
    }
    const legacy = JSON.parse(rawV1) as CheckoutDraft;
    if (!legacy || typeof legacy !== "object") {
      return null;
    }
    return {
      form: {
        name: legacy.form?.name,
        phone: legacy.form?.phone,
        email: legacy.form?.email,
        deliveryDate: legacy.form?.deliveryDate,
        address: legacy.form?.address,
      },
    };
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      CHECKOUT_DRAFT_STORAGE_KEY,
      JSON.stringify(draft),
    );
  } catch {
    // Private mode or quota
  }
}

export function clearCheckoutDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY);
    window.sessionStorage.removeItem("sweetbite_checkout_draft_v1");
  } catch {
    // ignore
  }
}

/** Restore draft values only into empty fields (do not overwrite user input). */
export function mergeFormWithDraft(
  current: CheckoutDraftForm,
  draft: Partial<CheckoutDraftForm> | undefined,
): CheckoutDraftForm {
  if (!draft) {
    return current;
  }

  const next = { ...current };
  (["name", "phone", "email", "deliveryDate", "address"] as const).forEach(
    (key) => {
      const existing = next[key].trim();
      const fromDraft = draft[key]?.trim();
      if (!existing && fromDraft) {
        next[key] = fromDraft;
      }
    },
  );
  return next;
}
