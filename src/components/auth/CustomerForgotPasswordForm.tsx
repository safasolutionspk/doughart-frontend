"use client";

import Link from "next/link";
import { useState } from "react";
import {
  authInputClassName,
  authInputErrorClassName,
  authLabelClassName,
} from "@/components/auth/customerAuthStyles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const GENERIC_SUCCESS_MESSAGE =
  "If an account exists with this email, we'll send password reset instructions.";

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

export function CustomerForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/customers/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const body = (await response.json()) as {
        success: boolean;
        message?: string;
        errors?: Record<string, string[] | undefined>;
      };

      if (!response.ok || !body.success) {
        setStatus("error");
        setErrorMessage(
          formatFieldErrors(body.errors) ??
            body.message ??
            "Could not process your request. Please try again.",
        );
        return;
      }

      setStatus("success");
      setErrorMessage(null);
    } catch {
      setStatus("error");
      setErrorMessage("Unable to submit request. Please try again.");
    }
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="customer-forgot-password-email" className={authLabelClassName}>
          Email <span className="text-brand-primary">*</span>
        </label>
        <input
          id="customer-forgot-password-email"
          type="email"
          autoComplete="email"
          required
          disabled={isLoading || status === "success"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            authInputClassName,
            errorMessage && authInputErrorClassName,
          )}
        />
      </div>

      {status === "success" ? (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {GENERIC_SUCCESS_MESSAGE}
        </p>
      ) : null}

      {errorMessage ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading || status === "success"}>
        {isLoading ? "Sending…" : "Send reset instructions"}
      </Button>

      <p className="text-center text-sm text-brand-muted">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-brand-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
