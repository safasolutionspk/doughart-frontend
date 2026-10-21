"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useBusinessName } from "@/components/providers/BusinessNameProvider";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { contactInfo } from "@/lib/contact";
import { footerCopy } from "@/lib/footer";
import { siteConfig } from "@/lib/site";
import { submitContactMessage } from "@/lib/contactApi";
import { cn } from "@/lib/cn";

const inputClassName = cn(
  "w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-brown",
  "placeholder:text-brand-muted/60 outline-none transition-shadow",
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
);

const labelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-brown";

function enquiryMessage(businessName: string) {
  return `Hello! I would like to enquire about a custom cake from ${businessName}.`;
}

export function ContactPageContent() {
  const businessName = useBusinessName();
  const whatsappHref = buildWhatsAppUrl(enquiryMessage(businessName));

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-brown sm:text-2xl">
          Get in touch
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
          We would love to hear about your celebration. Reach out by phone,
          WhatsApp, email, or the form — we typically respond within one business
          day.
        </p>

        <ul className="mt-6 space-y-4">
          <li className="flex items-start gap-3 rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-3 shadow-sm">
            <ContactIcon label="Phone">📞</ContactIcon>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Phone
              </p>
              <a
                href={siteConfig.phoneHref}
                className="mt-0.5 text-sm font-medium text-brand-primary hover:underline"
              >
                {siteConfig.phone}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-3 shadow-sm">
            <ContactIcon label="WhatsApp">💬</ContactIcon>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                WhatsApp
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 text-sm font-medium text-brand-primary hover:underline"
              >
                {siteConfig.whatsapp}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-3 shadow-sm">
            <ContactIcon label="Email">✉️</ContactIcon>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Email
              </p>
              <a
                href={footerCopy.emailHref}
                className="mt-0.5 break-all text-sm font-medium text-brand-primary hover:underline"
              >
                {footerCopy.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-3 shadow-sm">
            <ContactIcon label="Address">📍</ContactIcon>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Bakery
              </p>
              <p className="mt-0.5 text-sm text-brand-muted">{siteConfig.address}</p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-3 shadow-sm">
            <ContactIcon label="Hours">🕒</ContactIcon>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Hours
              </p>
              <p className="mt-0.5 text-sm text-brand-muted">
                {contactInfo.businessHours.weekdays}
              </p>
              <p className="text-sm text-brand-muted">
                {contactInfo.businessHours.sunday}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-brand-border/60 bg-gradient-to-b from-white to-brand-pink-lighter/40 p-5 shadow-md sm:p-6">
        <h2 className="font-display text-lg font-semibold text-brand-brown">
          Send a message
        </h2>
        <p className="mt-2 text-sm text-brand-muted">
          Share your event date, cake ideas, and guest count. We will reply by
          phone, WhatsApp, or email.
        </p>
        <ContactForm whatsappHref={whatsappHref} businessName={businessName} />
      </div>
    </div>
  );
}

function ContactIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink-lighter text-lg"
      aria-hidden
    >
      <span className="sr-only">{label}</span>
      {children}
    </span>
  );
}

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

function ContactForm({
  whatsappHref,
  businessName,
}: {
  whatsappHref: string;
  businessName: string;
}) {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: enquiryMessage(businessName),
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormState, string>>
  >({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    setFieldErrors({});

    try {
      await submitContactMessage({
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      if (
        error &&
        typeof error === "object" &&
        "fieldErrors" in error &&
        error.fieldErrors &&
        typeof error.fieldErrors === "object"
      ) {
        setFieldErrors(
          error.fieldErrors as Partial<Record<keyof ContactFormState, string>>,
        );
      }
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mt-5 space-y-4" role="status">
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Thank you — your message was sent. We will get back to you soon.
        </p>
        <Button type="button" size="md" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="contact-name" className={labelClassName}>
          Name <span className="text-brand-primary">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          required
          value={form.name}
          disabled={status === "loading"}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.name)}
        />
        {fieldErrors.name ? (
          <p className="mt-1 text-xs text-brand-primary">{fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClassName}>
          Phone <span className="text-brand-primary">*</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          disabled={status === "loading"}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.phone)}
        />
        {fieldErrors.phone ? (
          <p className="mt-1 text-xs text-brand-primary">{fieldErrors.phone}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          Email{" "}
          <span className="font-normal normal-case text-brand-muted">
            (optional)
          </span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          disabled={status === "loading"}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClassName}
          aria-invalid={Boolean(fieldErrors.email)}
        />
        {fieldErrors.email ? (
          <p className="mt-1 text-xs text-brand-primary">{fieldErrors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClassName}>
          Subject{" "}
          <span className="font-normal normal-case text-brand-muted">
            (optional)
          </span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          value={form.subject}
          disabled={status === "loading"}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message <span className="text-brand-primary">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          value={form.message}
          disabled={status === "loading"}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className={cn(inputClassName, "resize-y")}
          aria-invalid={Boolean(fieldErrors.message)}
        />
        {fieldErrors.message ? (
          <p className="mt-1 text-xs text-brand-primary">{fieldErrors.message}</p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="md" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send message"}
        </Button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-full border-2 border-brand-primary px-5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-pink-lighter"
        >
          WhatsApp instead
        </a>
        <Link
          href={`${footerCopy.emailHref}?subject=${encodeURIComponent(`${businessName} enquiry`)}`}
          className="inline-flex h-10 items-center justify-center rounded-full border-2 border-brand-border px-5 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-pink-lighter"
        >
          Email us
        </Link>
      </div>
    </form>
  );
}
