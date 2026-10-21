import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
};

const paddingStyles = {
  none: "",
  sm: "p-3.5",
  md: "p-5",
  lg: "p-6",
} as const;

export function Card({
  children,
  className,
  padding = "md",
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-brand-border/80 bg-white shadow-sm shadow-brand-primary/5 transition-shadow duration-300",
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </Component>
  );
}
