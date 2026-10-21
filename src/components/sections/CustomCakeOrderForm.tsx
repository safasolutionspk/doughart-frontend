"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCustomerAuth } from "@/components/auth/CustomerAuthProvider";
import { Button } from "@/components/ui/Button";
import { OrderApiError, submitOrder, uploadReferenceImage } from "@/lib/api";
import {
  clearCustomCakeDraft,
  loadCustomCakeDraft,
  mergeCustomCakeFormWithDraft,
  saveCustomCakeDraft,
  type CustomCakeDraftForm,
} from "@/lib/customCake/draft";
import { cn } from "@/lib/cn";
import {
  cakeTypeOptions,
  orderFormCopy,
} from "@/lib/orderForm";

const NOTES_MAX = 1000;

const inputClassName = cn(
  "w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-brown",
  "placeholder:text-brand-muted/60 outline-none transition-shadow",
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
);

const labelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-brown";

type FormStatus = "idle" | "loading" | "error";

const initialForm: CustomCakeDraftForm = {
  name: "",
  phone: "",
  email: "",
  cakeType: cakeTypeOptions[0],
  flavor: "",
  size: "",
  message: "",
  giftNote: "",
  deliveryDate: "",
  address: "",
  referenceLink: "",
  notes: "",
};

function formatFieldErrors(
  errors?: Record<string, string[] | undefined>,
): string | null {
  if (!errors) {
    return null;
  }
  const messages = Object.values(errors)
    .flat()
    .filter((value): value is string => Boolean(value));
  return messages.length > 0 ? messages.join(" ") : null;
}

function buildNotes(
  form: CustomCakeDraftForm,
  referenceImagePath?: string | null,
  referenceFileName?: string | null,
): string {
  const parts: string[] = [];

  if (form.notes.trim()) {
    parts.push(form.notes.trim());
  }

  if (form.giftNote.trim()) {
    parts.push(`[Gift note / message for recipient]: ${form.giftNote.trim()}`);
  }

  if (form.referenceLink.trim()) {
    parts.push(`[Inspiration / reference link]: ${form.referenceLink.trim()}`);
  }

  if (referenceImagePath?.trim()) {
    parts.push(`[Reference image]: ${referenceImagePath.trim()}`);
  } else if (referenceFileName) {
    parts.push(
      `[Reference image]: Customer attached file "${referenceFileName}" in the order form — please follow up by email if you need the actual image.`,
    );
  }

  const combined = parts.filter(Boolean).join("\n\n");
  if (combined.length <= NOTES_MAX) {
    return combined;
  }

  return `${combined.slice(0, NOTES_MAX - 3)}...`;
}

type CustomCakeOrderFormProps = {
  selectedCakeSlug?: string;
  selectedCakeName?: string;
};

export function CustomCakeOrderForm({
  selectedCakeSlug,
  selectedCakeName,
}: CustomCakeOrderFormProps = {}) {
  const router = useRouter();
  const { customer, hydrated: authHydrated, isAuthenticated } =
    useCustomerAuth();
  const draftRestored = useRef(false);
  const customerPrefillDone = useRef(false);

  const [form, setForm] = useState<CustomCakeDraftForm>({ ...initialForm });
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (draftRestored.current) {
      return;
    }
    draftRestored.current = true;

    const draft = loadCustomCakeDraft();
    if (draft) {
      const timer = window.setTimeout(() => {
        setForm((prev) => mergeCustomCakeFormWithDraft(prev, draft.form));
        if (draft.referenceFileName) {
          setReferenceFileName(draft.referenceFileName);
        }
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!draftRestored.current) {
      return;
    }
    saveCustomCakeDraft({
      form,
      referenceFileName,
    });
  }, [form, referenceFileName]);

  useEffect(() => {
    if (!selectedCakeName) {
      return;
    }
    const timer = window.setTimeout(() => {
      setForm((prev) => {
        if (prev.notes.trim()) {
          return prev;
        }
        const prefix = selectedCakeSlug
          ? `[Cake: ${selectedCakeName} (${selectedCakeSlug})]`
          : `[Cake: ${selectedCakeName}]`;
        return { ...prev, notes: `${prefix}\n\n` };
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedCakeName, selectedCakeSlug]);

  // Optional: pre-fill empty contact fields from the logged-in customer.
  useEffect(() => {
    if (!authHydrated || !isAuthenticated || !customer || customerPrefillDone.current) {
      return;
    }
    customerPrefillDone.current = true;
    setForm((prev) => ({
      ...prev,
      name: prev.name.trim() ? prev.name : customer.name || prev.name,
      phone: prev.phone.trim() ? prev.phone : customer.phone || prev.phone,
      email: prev.email.trim() ? prev.email : customer.email || prev.email,
    }));
  }, [authHydrated, isAuthenticated, customer]);

  function updateField<K extends keyof CustomCakeDraftForm>(
    key: K,
    value: CustomCakeDraftForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage(null);
    }
  }

  function handleReferenceFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!file) {
      setReferenceFile(null);
      setReferenceFileName(null);
      setReferencePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setReferenceFile(null);
      setReferenceFileName(null);
      setReferencePreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setReferencePreview(url);
    setReferenceFile(file);
    setReferenceFileName(file.name);
  }

  function clearReferenceFile() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setReferencePreview(null);
    setReferenceFile(null);
    setReferenceFileName(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage(null);

    if (!form.size.trim()) {
      setStatus("error");
      setErrorMessage("Please enter cake pounds.");
      return;
    }

    if (!form.flavor.trim()) {
      setStatus("error");
      setErrorMessage("Please enter cake flavor.");
      return;
    }

    if (!form.address.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your address.");
      return;
    }

    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address or leave this field blank.");
      return;
    }

    try {
      let referenceImage: string | undefined;
      if (referenceFile) {
        const upload = await uploadReferenceImage(referenceFile);
        referenceImage = upload.url;
      }

      const notesWithImage = buildNotes(form, referenceImage, referenceFileName);

      await submitOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: email || undefined,
        cakeType: form.cakeType,
        flavor: form.flavor.trim(),
        size: form.size.trim(),
        message: form.message.trim() || undefined,
        deliveryDate: form.deliveryDate || undefined,
        address: form.address.trim(),
        notes: notesWithImage || undefined,
        referenceImage,
      });

      clearCustomCakeDraft();
      router.push("/my-order?customCakeSubmitted=1");
    } catch (error) {
      setStatus("error");
      if (error instanceof OrderApiError) {
        const fieldSummary = formatFieldErrors(error.fieldErrors);
        setErrorMessage(fieldSummary ?? error.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  const isLoading = status === "loading";

  return (
    <div
      id="custom-cake-order"
      className="rounded-2xl border border-brand-border/70 bg-white/95 p-5 shadow-md shadow-brand-primary/10 backdrop-blur-sm sm:p-7 lg:p-8"
      aria-labelledby="custom-cake-order-heading"
    >
      <header className="mb-6 max-w-2xl">
        <h1
          id="custom-cake-order-heading"
          className="font-display text-2xl font-bold text-brand-brown sm:text-3xl"
        >
          {orderFormCopy.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted">
          {orderFormCopy.description}
        </p>
      </header>

      {customer && isAuthenticated ? (
        <p className="mb-4 text-sm text-brand-muted">
          Requesting as{" "}
          <span className="font-medium text-brand-brown">{customer.name}</span>
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2"
        aria-busy={isLoading}
      >
        <div className="sm:col-span-1">
          <label htmlFor="cc-name" className={labelClassName}>
            Name <span className="text-brand-primary">*</span>
          </label>
          <input
            id="cc-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={isLoading}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="cc-phone" className={labelClassName}>
            Phone <span className="text-brand-primary">*</span>
          </label>
          <input
            id="cc-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            disabled={isLoading}
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cc-email" className={labelClassName}>
            Email{" "}
            <span className="font-normal normal-case text-brand-muted">
              (Optional)
            </span>
          </label>
          <input
            id="cc-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="Optional — for order updates"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="cc-cake-type" className={labelClassName}>
            Cake type <span className="text-brand-primary">*</span>
          </label>
          <select
            id="cc-cake-type"
            name="cakeType"
            required
            disabled={isLoading}
            value={form.cakeType}
            onChange={(e) => updateField("cakeType", e.target.value)}
            className={inputClassName}
          >
            {cakeTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="cc-flavor" className={labelClassName}>
            Flavor <span className="text-brand-primary">*</span>
          </label>
          <input
            id="cc-flavor"
            name="flavor"
            type="text"
            required
            maxLength={120}
            disabled={isLoading}
            value={form.flavor}
            onChange={(e) => updateField("flavor", e.target.value)}
            placeholder="e.g. Red Velvet, Chocolate, Vanilla"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="cc-size" className={labelClassName}>
            Pounds <span className="text-brand-primary">*</span>
          </label>
          <input
            id="cc-size"
            name="size"
            type="text"
            required
            maxLength={80}
            disabled={isLoading}
            value={form.size}
            onChange={(e) => updateField("size", e.target.value)}
            placeholder="e.g. 2 pounds"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="cc-delivery-date" className={labelClassName}>
            Delivery date
          </label>
          <input
            id="cc-delivery-date"
            name="deliveryDate"
            type="date"
            disabled={isLoading}
            value={form.deliveryDate}
            onChange={(e) => updateField("deliveryDate", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cc-address" className={labelClassName}>
            Delivery address <span className="text-brand-primary">*</span>
          </label>
          <textarea
            id="cc-address"
            name="address"
            rows={2}
            required
            disabled={isLoading}
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Street, city, postcode"
            className={cn(inputClassName, "resize-y min-h-[4.5rem]")}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cc-message" className={labelClassName}>
            Message on cake
          </label>
          <input
            id="cc-message"
            name="message"
            type="text"
            maxLength={200}
            disabled={isLoading}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder='e.g. "Happy Birthday Sarah!"'
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cc-gift-note" className={labelClassName}>
            Gift note / message
          </label>
          <textarea
            id="cc-gift-note"
            name="giftNote"
            rows={2}
            maxLength={500}
            disabled={isLoading}
            value={form.giftNote}
            onChange={(e) => updateField("giftNote", e.target.value)}
            placeholder="Optional message for the recipient or card text"
            className={cn(inputClassName, "resize-y min-h-[4rem]")}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cc-reference-link" className={labelClassName}>
            Inspiration link (optional)
          </label>
          <input
            id="cc-reference-link"
            name="referenceLink"
            type="url"
            disabled={isLoading}
            value={form.referenceLink}
            onChange={(e) => updateField("referenceLink", e.target.value)}
            placeholder="Pinterest, Google Drive, or other shareable link"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <span className={labelClassName}>Reference image (optional)</span>
          <p className="mb-2 text-xs text-brand-muted">
            Upload a photo for style inspiration. We will note the filename on your
            order; you can also email us high-resolution photos after submitting.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={isLoading}
                onChange={handleReferenceFileChange}
              />
              <span className="rounded-full border border-brand-border bg-brand-pink-lighter px-4 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-pink-light">
                Choose image
              </span>
            </label>
            {referenceFileName && (
              <>
                <span className="text-sm text-brand-brown">{referenceFileName}</span>
                <button
                  type="button"
                  onClick={clearReferenceFile}
                  disabled={isLoading}
                  className="text-sm font-medium text-brand-primary underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              </>
            )}
          </div>
          {referencePreview && (
            <div className="mt-3 overflow-hidden rounded-xl border border-brand-border bg-brand-cream max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={referencePreview}
                alt="Your reference preview"
                className="h-40 w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cc-notes" className={labelClassName}>
            Notes / special instructions
          </label>
          <textarea
            id="cc-notes"
            name="notes"
            rows={4}
            maxLength={800}
            disabled={isLoading}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Design ideas, allergies, pickup vs delivery, dietary needs, etc."
            className={cn(inputClassName, "resize-y min-h-[6rem]")}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-3 pt-1">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? orderFormCopy.submittingLabel : orderFormCopy.submitLabel}
          </Button>

          {status === "loading" && (
            <p className="text-sm text-brand-muted" role="status" aria-live="polite">
              Sending your order…
            </p>
          )}

          {status === "error" && errorMessage && (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
