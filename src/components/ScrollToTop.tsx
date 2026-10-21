"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useBusinessName } from "@/components/providers/BusinessNameProvider";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { cn } from "@/lib/cn";
import { externalLinkProps } from "@/lib/links";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const SHOW_AFTER_PX = 400;
const FALLBACK_DURATION_MS = 650;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function smoothScrollFallback() {
  const startY = window.scrollY;
  if (startY <= 0) return;

  const startTime = performance.now();

  const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / FALLBACK_DURATION_MS, 1);
    window.scrollTo(0, Math.round(startY * (1 - easeOutCubic(progress))));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function scrollToTopSmooth() {
  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  const supportsSmoothScroll =
    typeof document !== "undefined" &&
    "scrollBehavior" in document.documentElement.style;

  if (supportsSmoothScroll) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    return;
  }

  smoothScrollFallback();
}

const fabBaseClassName = cn(
  "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
);

/**
 * Persistent floating actions for the public storefront.
 * WhatsApp stays visible at all times; scroll-to-top appears below it when scrolled.
 */
export function ScrollToTop() {
  const businessName = useBusinessName();
  const [visible, setVisible] = useState(false);
  const whatsappHref = buildWhatsAppUrl(
    `Hello ${businessName}! I would like to ask about your cakes.`,
  );

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    scrollToTopSmooth();
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a
        href={whatsappHref}
        className={cn(
          fabBaseClassName,
          "bg-[#25D366] shadow-[#25D366]/40 hover:bg-[#1ebe57] hover:shadow-xl hover:shadow-[#25D366]/45",
          "focus-visible:ring-[#25D366]",
        )}
        aria-label={`Chat with ${businessName} on WhatsApp`}
        title={`Chat with ${businessName} on WhatsApp`}
        {...externalLinkProps}
      >
        <SocialIcon name="whatsapp" className="h-6 w-6" />
      </a>

      {visible ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Scroll to top"
          className={cn(
            fabBaseClassName,
            "bg-brand-primary shadow-brand-primary/35 hover:bg-brand-button-hover hover:shadow-xl hover:shadow-brand-primary/45",
            "focus-visible:ring-brand-primary",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5M5 12l7-7 7 7"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
