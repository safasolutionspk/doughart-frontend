import { cn } from "@/lib/cn";

export function OrderNumberBadge({
  orderNumber,
  className,
}: {
  orderNumber: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-md bg-brand-pink-lighter/60 px-2 py-0.5 font-mono text-[10px] font-medium tracking-tight text-brand-muted",
        className,
      )}
      title={orderNumber}
    >
      {orderNumber}
    </span>
  );
}
