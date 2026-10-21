"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/components/auth/CustomerAuthProvider";
import { cn } from "@/lib/cn";

type CustomerHeaderAuthProps = {
  className?: string;
  onNavigate?: () => void;
  compact?: boolean;
};

export function CustomerHeaderAuth({
  className,
  onNavigate,
  compact = false,
}: CustomerHeaderAuthProps) {
  const router = useRouter();
  const { customer, hydrated, logout } = useCustomerAuth();

  async function handleLogout() {
    await logout();
    onNavigate?.();
    router.refresh();
  }

  if (!hydrated) {
    return (
      <span
        className={cn("inline-block h-9 w-20 rounded-full bg-brand-pink-lighter/80", className)}
        aria-hidden
      />
    );
  }

  if (customer) {
    const displayName = customer.name.split(" ")[0] ?? customer.name;

    return (
      <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
        <Link
          href="/account"
          onClick={onNavigate}
          className={cn(
            "max-w-[7rem] truncate text-sm font-medium text-brand-brown transition-colors hover:text-brand-primary sm:max-w-[9rem]",
            compact && "text-xs",
          )}
          title={customer.name}
        >
          Hi, {displayName}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "rounded-full border border-brand-border px-2.5 py-1.5 text-xs font-semibold text-brand-brown transition-colors hover:border-brand-primary hover:bg-brand-pink-lighter hover:text-brand-primary sm:px-3 sm:text-sm",
          )}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 sm:gap-1.5", className)}>
      <Link
        href="/login"
        onClick={onNavigate}
        className={cn(
          "rounded-full px-2.5 py-1.5 text-xs font-semibold text-brand-brown transition-colors hover:bg-brand-pink-lighter hover:text-brand-primary sm:px-3 sm:text-sm",
        )}
      >
        Login
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className={cn(
          "rounded-full border border-brand-primary px-2.5 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-pink-lighter sm:px-3 sm:text-sm",
        )}
      >
        Signup
      </Link>
    </div>
  );
}
