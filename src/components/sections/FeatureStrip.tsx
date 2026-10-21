import { Reveal } from "@/components/animation/Reveal";
import { capStaggerDelay } from "@/lib/animation/constants";
import { features } from "@/lib/features";
import { cn } from "@/lib/cn";
import { getBusinessName } from "@/lib/settings";

export async function FeatureStrip() {
  const businessName = await getBusinessName();
  return (
    <section
      className="section-anchor border-y border-brand-border/30 bg-[#FFF8FA]"
      aria-labelledby="features-heading"
    >
      <h2 id="features-heading" className="sr-only">
        Why choose {businessName}
      </h2>
      <div className="section-container">
        <ul
          className={cn(
            "grid grid-cols-2 gap-px",
            "sm:grid-cols-4 sm:divide-x sm:divide-brand-border/40 sm:gap-0",
          )}
        >
          {features.map((feature, index) => (
            <li
              key={feature.id}
              className={cn(
                "min-w-0 bg-[#FFF8FA]",
                "border-b border-brand-border/30 odd:border-r sm:border-0 sm:odd:border-0",
                index >= 2 && "border-b-0 sm:border-b-0",
              )}
            >
              <Reveal
                delay={capStaggerDelay(index, 0.05)}
                direction="up"
                variant="text"
                className="h-full"
              >
                <div
                  className={cn(
                    "flex h-full flex-col items-start gap-2 px-3 py-3.5",
                    "sm:flex-row sm:items-start sm:gap-2.5 sm:px-3 sm:py-3.5",
                    "lg:gap-3 lg:px-4 lg:py-4",
                  )}
                >
                  <FeatureIcon name={feature.icon} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[0.8125rem] font-semibold leading-snug text-brand-brown sm:text-sm">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-[0.625rem] leading-snug text-brand-muted sm:text-[0.6875rem] lg:text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type FeatureIconName = (typeof features)[number]["icon"];

function FeatureIcon({ name }: { name: FeatureIconName }) {
  const wrapperClass = cn(
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
    "border border-brand-border/50 bg-white text-brand-primary/90",
    "sm:h-8 sm:w-8",
  );
  const iconClass = "h-3.5 w-3.5";

  const strokeProps = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "fresh":
      return (
        <span className={wrapperClass} aria-hidden>
          <svg className={iconClass} viewBox="0 0 24 24" {...strokeProps}>
            <path d="M12 3c-3 4-6 6-6 10a6 6 0 1012 0c0-4-3-6-6-10z" />
            <path d="M12 13v8" />
          </svg>
        </span>
      );
    case "delivery":
      return (
        <span className={wrapperClass} aria-hidden>
          <svg className={iconClass} viewBox="0 0 24 24" {...strokeProps}>
            <path d="M3 7h11v8H3V7z" />
            <path d="M14 9h4l3 3v3h-7V9z" />
            <circle cx="7" cy="17" r="1.25" />
            <circle cx="17" cy="17" r="1.25" />
          </svg>
        </span>
      );
    case "love":
      return (
        <span className={wrapperClass} aria-hidden>
          <svg className={iconClass} viewBox="0 0 24 24" {...strokeProps}>
            <path d="M12 20.5s-6-4.35-6-9.5a4.5 4.5 0 018.5-2.5A4.5 4.5 0 0118 11c0 5.15-6 9.5-6 9.5z" />
          </svg>
        </span>
      );
    case "secure":
      return (
        <span className={wrapperClass} aria-hidden>
          <svg className={iconClass} viewBox="0 0 24 24" {...strokeProps}>
            <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            <path d="M9.5 12.2l1.7 1.7 3.5-3.6" />
          </svg>
        </span>
      );
  }
}
