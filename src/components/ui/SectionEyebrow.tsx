import { cn } from "@/lib/cn";

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 14s-5.5-3.6-5.5-7.2C2.5 4.6 4.2 3 6.1 3c1.1 0 2.1.5 2.9 1.3C9.8 3.5 10.8 3 11.9 3 13.8 3 15.5 4.6 15.5 6.8 15.5 10.4 8 14 8 14z" />
    </svg>
  );
}

type SectionEyebrowProps = {
  children: React.ReactNode;
  align?: "center" | "start";
  className?: string;
};

export function SectionEyebrow({
  children,
  align = "center",
  className,
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2.5 sm:gap-3",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <span
        className="h-px w-8 shrink-0 bg-brand-primary/50 sm:w-12"
        aria-hidden
      />
      <p className="eyebrow-script flex shrink-0 items-center gap-1.5 whitespace-nowrap">
        {children}
        <HeartIcon className="h-3.5 w-3.5 text-brand-primary" />
      </p>
      <span
        className={cn(
          "h-px shrink-0 bg-brand-primary/50",
          align === "center" ? "w-8 sm:w-12" : "w-6 sm:w-10",
        )}
        aria-hidden
      />
    </div>
  );
}
