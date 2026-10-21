"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PasswordVisibilityToggle } from "@/components/auth/PasswordVisibilityToggle";
import { useCustomerAuth } from "@/components/auth/CustomerAuthProvider";
import {
  authInputClassName,
  authLabelClassName,
  authPasswordInputClassName,
  authPasswordToggleButtonClassName,
} from "@/components/auth/customerAuthStyles";
import { Button } from "@/components/ui/Button";
import { getReturnUrlFromSearchParams } from "@/lib/auth/returnUrl";
import { cn } from "@/lib/cn";

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

export function CustomerSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useCustomerAuth();
  const redirectTo = getReturnUrlFromSearchParams(searchParams);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/customers/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
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
            "Could not create account. Please try again.",
        );
        return;
      }

      await refresh();
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Unable to create account. Please try again.");
    }
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="customer-signup-name" className={authLabelClassName}>
          Full name <span className="text-brand-primary">*</span>
        </label>
        <input
          id="customer-signup-name"
          type="text"
          autoComplete="name"
          required
          disabled={isLoading}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={authInputClassName}
        />
      </div>

      <div>
        <label htmlFor="customer-signup-email" className={authLabelClassName}>
          Email <span className="text-brand-primary">*</span>
        </label>
        <input
          id="customer-signup-email"
          type="email"
          autoComplete="email"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClassName}
        />
      </div>

      <div>
        <label htmlFor="customer-signup-phone" className={authLabelClassName}>
          Phone <span className="text-brand-primary">*</span>
        </label>
        <input
          id="customer-signup-phone"
          type="tel"
          autoComplete="tel"
          required
          disabled={isLoading}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={authInputClassName}
        />
      </div>

      <div>
        <label htmlFor="customer-signup-password" className={authLabelClassName}>
          Password <span className="text-brand-primary">*</span>
        </label>
        <div className="relative">
          <input
            id="customer-signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authPasswordInputClassName}
          />
          <PasswordVisibilityToggle
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
            disabled={isLoading}
            className={authPasswordToggleButtonClassName}
          />
        </div>
        <p className="mt-1.5 text-xs text-brand-muted">
          At least 8 characters
        </p>
      </div>

      {errorMessage ? (
        <p
          className={cn(
            "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800",
          )}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-brand-muted">
        Already have an account?{" "}
        <Link
          href={`/login?returnUrl=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-brand-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
