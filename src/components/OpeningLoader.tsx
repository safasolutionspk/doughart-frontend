"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useBusinessName } from "@/components/providers/BusinessNameProvider";
import { siteImages } from "@/lib/images";

/** Visible hold before fade-out begins (opening experience only). */
const LOADER_HOLD_MS = 1800;
/** Fade / scale exit duration — keep in sync with CSS transition duration-500. */
const LOADER_EXIT_MS = 500;

/**
 * Full-screen branded opening loader for the customer storefront.
 * Mounts once with the root layout (full page load / refresh only).
 * Client-side Next.js navigations keep the layout mounted, so it will not reappear.
 */
export function OpeningLoader() {
  const businessName = useBusinessName();
  const [phase, setPhase] = useState<"visible" | "exiting" | "gone">("visible");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, LOADER_HOLD_MS);

    const removeTimer = window.setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = previousOverflow;
    }, LOADER_HOLD_MS + LOADER_EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "gone") {
    return null;
  }

  const isExiting = phase === "exiting";

  return (
    <div
      className={[
        "opening-loader fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center overflow-hidden",
        "transition-[opacity,transform] duration-500 ease-out",
        isExiting
          ? "pointer-events-none opacity-0 scale-[1.02]"
          : "opacity-100 scale-100",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy={!isExiting}
      aria-label={`Loading ${businessName}`}
    >
      {/* Soft pink gradient + center glow — brand primary #e75480 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, #f48aa8 0%, #e75480 48%, #d64572 100%)",
        }}
        aria-hidden
      />
      <div
        className="opening-loader-glow pointer-events-none absolute left-1/2 top-[38%] h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden
      />
      <div className="opening-loader-grid pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />

      <div className="relative z-10 flex w-full max-w-[min(92vw,22rem)] flex-col items-center px-6">
        <div className="opening-loader-logo-wrap relative flex h-[min(52vw,13.5rem)] w-[min(52vw,13.5rem)] items-center justify-center sm:h-56 sm:w-56">
          <span className="opening-loader-ring opening-loader-ring-1" aria-hidden />
          <span className="opening-loader-ring opening-loader-ring-2" aria-hidden />
          <span className="opening-loader-ring opening-loader-ring-3" aria-hidden />

          <div className="opening-loader-logo relative z-10 flex h-[58%] w-[58%] items-center justify-center rounded-full bg-white/95 p-3 shadow-[0_8px_32px_rgba(201,63,104,0.28)] ring-1 ring-white/80 sm:p-4">
            <Image
              src={siteImages.logo}
              alt={businessName}
              width={167}
              height={89}
              unoptimized
              priority
              className="h-auto w-full max-w-[7.5rem] object-contain sm:max-w-[8.5rem]"
            />
          </div>
        </div>

        <div
          className="opening-loader-track mt-8 h-[3px] w-[min(70%,11rem)] overflow-hidden rounded-full bg-white/25 sm:mt-10 sm:w-48"
          aria-hidden
        >
          <div className="opening-loader-progress h-full rounded-full bg-gradient-to-r from-white/70 via-white to-white/85" />
        </div>

        <p className="opening-loader-text mt-4 text-[0.7rem] font-medium tracking-[0.35em] text-white/95 sm:mt-5 sm:text-xs">
          LOADING
          <span className="opening-loader-dots" aria-hidden>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}
