"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PasswordVisibilityToggle } from "@/components/auth/PasswordVisibilityToggle";
import { useCustomerAuth } from "@/components/auth/CustomerAuthProvider";
import {
  authInputClassName,
  authInputErrorClassName,
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

export function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useCustomerAuth();
  const redirectTo = getReturnUrlFromSearchParams(searchParams);
  const authRequired = searchParams.get("authRequired") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
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
            "Invalid email or password",
        );
        return;
      }

      await refresh();
      router.replace(redirectTo.startsWith("/") ? redirectTo : "/");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Unable to sign in. Please try again.");
    }
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {authRequired ? (
        <p
          className="rounded-xl border border-brand-primary/30 bg-brand-pink-lighter/60 px-4 py-3 text-sm text-brand-brown"
          role="status"
        >
          Please sign in to continue. Login is optional for placing orders —
          guests can checkout without an account.
        </p>
      ) : null}
      <div>
        <label htmlFor="customer-login-email" className={authLabelClassName}>
          Email <span className="text-brand-primary">*</span>
        </label>
        <input
          id="customer-login-email"
          type="email"
          autoComplete="email"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            authInputClassName,
            errorMessage && authInputErrorClassName,
          )}
        />
      </div>

      <div>
        <label htmlFor="customer-login-password" className={authLabelClassName}>
          Password <span className="text-brand-primary">*</span>
        </label>
        <div className="relative">
          <input
            id="customer-login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              authPasswordInputClassName,
              errorMessage && authInputErrorClassName,
            )}
          />
          <PasswordVisibilityToggle
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
            disabled={isLoading}
            className={authPasswordToggleButtonClassName}
          />
        </div>
      </div>

      {errorMessage ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-brand-muted">
        New here?{" "}
        <Link
          href={`/signup?returnUrl=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-brand-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
