"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PasswordVisibilityToggle } from "@/components/auth/PasswordVisibilityToggle";
import {
  authInputErrorClassName,
  authLabelClassName,
  authPasswordInputClassName,
  authPasswordToggleButtonClassName,
} from "@/components/auth/customerAuthStyles";
import { Button } from "@/components/ui/Button";
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

export function CustomerResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("error");
      setErrorMessage("Reset token is missing. Please use the reset link from your email.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/customers/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
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
            "Could not reset password. Please try again.",
        );
        return;
      }

      setStatus("success");
      setErrorMessage(null);
    } catch {
      setStatus("error");
      setErrorMessage("Unable to reset password. Please try again.");
    }
  }

  const isLoading = status === "loading";
  const hasToken = token.length > 0;

  if (!hasToken) {
    return (
      <div className="space-y-4">
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          Reset token is missing. Please open the password reset link from your email.
        </p>
        <p className="text-center text-sm text-brand-muted">
          <Link href="/login" className="font-semibold text-brand-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="customer-reset-password" className={authLabelClassName}>
          New password <span className="text-brand-primary">*</span>
        </label>
        <div className="relative">
          <input
            id="customer-reset-password"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isLoading || status === "success"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={cn(authPasswordInputClassName, errorMessage && authInputErrorClassName)}
          />
          <PasswordVisibilityToggle
            visible={showNewPassword}
            onToggle={() => setShowNewPassword((value) => !value)}
            disabled={isLoading || status === "success"}
            className={authPasswordToggleButtonClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="customer-reset-password-confirm" className={authLabelClassName}>
          Confirm new password <span className="text-brand-primary">*</span>
        </label>
        <div className="relative">
          <input
            id="customer-reset-password-confirm"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isLoading || status === "success"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(authPasswordInputClassName, errorMessage && authInputErrorClassName)}
          />
          <PasswordVisibilityToggle
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
            disabled={isLoading || status === "success"}
            className={authPasswordToggleButtonClassName}
          />
        </div>
      </div>

      <p className="text-xs text-brand-muted">Password must be at least 8 characters.</p>

      {status === "success" ? (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          Your password has been reset successfully. You can now sign in.
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
        {isLoading ? "Resetting…" : "Reset password"}
      </Button>

      <p className="text-center text-sm text-brand-muted">
        <Link href="/login" className="font-semibold text-brand-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
