export const CUSTOM_CAKE_DRAFT_STORAGE_KEY = "sweetbite_custom_cake_draft_v1";

export type CustomCakeDraftForm = {
  name: string;
  phone: string;
  email: string;
  cakeType: string;
  flavor: string;
  size: string;
  message: string;
  giftNote: string;
  deliveryDate: string;
  address: string;
  referenceLink: string;
  notes: string;
};

export type CustomCakeDraft = {
  form: Partial<CustomCakeDraftForm>;
  referenceFileName?: string | null;
};

export const emptyCustomCakeForm: CustomCakeDraftForm = {
  name: "",
  phone: "",
  email: "",
  cakeType: "",
  flavor: "",
  size: "",
  message: "",
  giftNote: "",
  deliveryDate: "",
  address: "",
  referenceLink: "",
  notes: "",
};

export function loadCustomCakeDraft(): CustomCakeDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(CUSTOM_CAKE_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CustomCakeDraft;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCustomCakeDraft(draft: CustomCakeDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      CUSTOM_CAKE_DRAFT_STORAGE_KEY,
      JSON.stringify(draft),
    );
  } catch {
    // ignore
  }
}

export function clearCustomCakeDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(CUSTOM_CAKE_DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function mergeCustomCakeFormWithDraft(
  current: CustomCakeDraftForm,
  draft: Partial<CustomCakeDraftForm> | undefined,
): CustomCakeDraftForm {
  if (!draft) {
    return current;
  }

  const next = { ...current };
  (Object.keys(emptyCustomCakeForm) as (keyof CustomCakeDraftForm)[]).forEach(
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
