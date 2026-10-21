import Link from "next/link";
import { cn } from "@/lib/cn";
import { externalLinkProps, isExternalHref } from "@/lib/links";

const variantStyles = {
  primary:
    "bg-brand-primary !text-white shadow-sm shadow-brand-primary/30 hover:bg-brand-button-hover hover:shadow-md hover:shadow-brand-primary/40 focus-visible:ring-brand-primary",
  secondary:
    "bg-brand-pink-light text-brand-brown hover:bg-brand-pink-lighter focus-visible:ring-brand-primary",
  outline:
    "border-2 border-brand-primary text-brand-primary bg-transparent hover:bg-brand-pink-lighter focus-visible:ring-brand-primary",
  ghost:
    "text-brand-brown bg-transparent hover:bg-brand-pink-light focus-visible:ring-brand-primary",
  "soft-pill":
    "border border-brand-border bg-brand-pink-lighter text-brand-primary hover:bg-brand-pink-light hover:shadow-md hover:shadow-brand-primary/15 focus-visible:ring-brand-primary",
} as const;

const sizeStyles = {
  sm: "h-9 min-w-[7rem] px-4 text-xs",
  md: "h-10 min-w-[8rem] px-5 text-sm",
  lg: "h-11 min-w-[9rem] px-7 text-sm",
} as const;

type ButtonVariant = keyof typeof variantStyles;
type ButtonSize = keyof typeof sizeStyles;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "btn-hover-lift inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternalHref(href) ? externalLinkProps : {})}
        {...linkProps}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
