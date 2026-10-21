import Link from "next/link";
import { cn } from "@/lib/cn";
import type { PublicCategory } from "@/lib/catalog";

type CategoryNavProps = {
  categories: PublicCategory[];
  activeSlug: string;
};

const ALL_SLUG = "all";

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  const items = [
    ...categories.map((category) => ({
      slug: category.slug,
      label: category.name,
    })),
    { slug: ALL_SLUG, label: "All Menu" },
  ];

  return (
    <nav
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scroll-smooth sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-2.5"
      aria-label="Cake categories"
    >
      {items.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <Link
            key={item.slug}
            href={`/cakes/${item.slug}`}
            className={cn(
              "inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-xs font-semibold tracking-wide transition-all duration-300 sm:h-10 sm:shrink sm:px-5 sm:text-sm",
              isActive
                ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/30"
                : "border border-brand-border bg-white text-brand-brown hover:border-brand-primary hover:bg-brand-pink-lighter hover:text-brand-primary",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
