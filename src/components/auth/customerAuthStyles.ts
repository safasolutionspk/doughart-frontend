import { cn } from "@/lib/cn";

export const authInputClassName = cn(
  "w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-brown",
  "placeholder:text-brand-muted/60 outline-none transition-shadow",
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
);

export const authPasswordInputClassName = cn(authInputClassName, "pr-11");

export const authPasswordToggleButtonClassName = cn(
  "absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-lg",
  "text-brand-muted transition-colors hover:text-brand-brown",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1",
);

export const authInputErrorClassName = "border-red-300 focus-visible:ring-red-400";

export const authLabelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-brown";
