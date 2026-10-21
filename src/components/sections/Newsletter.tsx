"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBusinessName } from "@/components/providers/BusinessNameProvider";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { subscribeNewsletter } from "@/lib/api";
import { cn } from "@/lib/cn";
import { contactInfo } from "@/lib/contact";
import { externalLinkProps } from "@/lib/links";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Newsletter() {
  const businessName = useBusinessName();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const newsletterCopy = useMemo(
    () => ({
      heading: "Subscribe to Our Newsletter",
      description: "Get updates on offers, new cakes & more!",
      placeholder: "Enter your email address",
      buttonLabel: "Subscribe",
      consentLabel: `I agree to receive marketing emails from ${businessName}`,
      followLabel: "Follow Us",
    }),
    [businessName],
  );

  const newsletterSocialLinks = useMemo(
    () => [
      {
        label: "Instagram",
        href: contactInfo.social.instagram,
        icon: "instagram" as const,
      },
      {
        label: "Facebook",
        href: contactInfo.social.facebook,
        icon: "facebook" as const,
      },
      {
        label: "WhatsApp",
        href: buildWhatsAppUrl(
          `Hello! I would like to know more about ${businessName} cakes.`,
        ),
        icon: "whatsapp" as const,
      },
    ],
    [businessName],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !consent) {
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      await subscribeNewsletter(trimmed, "homepage", consent);
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not subscribe. Please try again.",
      );
    }
  }

  return (
    <section
      id="blog"
      className="section-anchor border-y border-brand-primary/10 bg-[#FFF1F4]"
      aria-labelledby="newsletter-heading"
    >
      <div className="section-container py-5 sm:py-6 lg:py-7">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] lg:items-center lg:gap-8">
          <div className="min-w-0 text-center lg:text-left">
            <h2
              id="newsletter-heading"
              className="font-display text-lg font-bold tracking-tight text-brand-brown sm:text-xl"
            >
              {newsletterCopy.heading}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted sm:text-sm">
              {newsletterCopy.description}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full min-w-0 flex-col gap-2.5"
            aria-label="Newsletter signup"
          >
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                disabled={status === "loading"}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === "success" || status === "error") {
                    setStatus("idle");
                    setErrorMessage(null);
                  }
                }}
                placeholder={newsletterCopy.placeholder}
                className={cn(
                  "h-10 w-full flex-1 rounded-full border border-brand-border/80 bg-white px-4 text-sm text-brand-brown placeholder:text-brand-muted/60",
                  "outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              />
              <button
                type="submit"
                disabled={status === "loading" || !consent}
                className={cn(
                  "inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold text-white",
                  "bg-brand-primary transition-colors hover:bg-brand-button-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[7.5rem]",
                )}
              >
                {status === "loading"
                  ? "Subscribing…"
                  : newsletterCopy.buttonLabel}
              </button>
            </div>

            <label className="flex items-start gap-2 text-left text-[0.6875rem] leading-snug text-brand-muted sm:text-xs">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                disabled={status === "loading"}
                required
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-brand-border text-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary"
              />
              <span>{newsletterCopy.consentLabel}</span>
            </label>

            {status === "success" ? (
              <p className="text-xs font-medium text-brand-primary" role="status">
                Thank you for subscribing! We will be in touch soon.
              </p>
            ) : null}

            {status === "error" && errorMessage ? (
              <p className="text-xs font-medium text-red-600" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </form>

          <div className="flex flex-col items-center gap-2 lg:items-end">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-brown">
              {newsletterCopy.followLabel}
            </p>
            <ul className="flex items-center gap-2" aria-label="Social media">
              {newsletterSocialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    aria-label={`${social.label} (opens in new tab)`}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/70 bg-white text-brand-primary",
                      "transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                    )}
                    {...externalLinkProps}
                  >
                    <SocialIcon name={social.icon} className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
