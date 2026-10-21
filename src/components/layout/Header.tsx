"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CustomerHeaderAuth } from "@/components/auth/CustomerHeaderAuth";
import { CartIconLink } from "@/components/cart/CartIconLink";
import { useBusinessName } from "@/components/providers/BusinessNameProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { siteImages } from "@/lib/images";
import { navLinks } from "@/lib/site";

export function Header() {
  const businessName = useBusinessName();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) {
      return;
    }

    const syncOffset = () => {
      document.documentElement.style.setProperty(
        "--header-offset",
        `${el.offsetHeight}px`,
      );
    };

    syncOffset();
    const observer = new ResizeObserver(syncOffset);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-brand-border/70 bg-white/95 shadow-sm shadow-brand-primary/5 backdrop-blur-md"
      >
        <div
          className={cn(
            "section-container flex min-w-0 items-center gap-3",
            "min-h-16 py-1.5 sm:min-h-[4.5rem] sm:gap-4 sm:py-2",
            "lg:min-h-[5.5rem] lg:gap-5 lg:py-2.5",
          )}
        >
          {/* LEFT — large standalone logo only (no card/plate) */}
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center self-center"
            onClick={closeMenu}
            aria-label={`${businessName} home`}
          >
            <Image
              src={siteImages.logo}
              alt={businessName}
              width={167}
              height={89}
              unoptimized
              priority
              className="h-auto w-[6.25rem] object-contain object-left"
            />
          </Link>

          {/* MIDDLE — flexible nav / spacer */}
          <div className="flex min-w-0 flex-1 items-center justify-center lg:justify-start lg:pl-2">
            <nav
              className="hidden items-center gap-0.5 lg:flex"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-2.5 py-1.5 text-sm font-medium text-brand-brown/85 transition-colors hover:bg-brand-pink-lighter hover:text-brand-primary xl:px-3"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT — account, cart, CTA, mobile menu */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <CustomerHeaderAuth
              className="hidden min-[480px]:flex"
              onNavigate={closeMenu}
            />
            <CartIconLink onNavigate={closeMenu} />

            <Button
              href="/custom-cake"
              size="sm"
              variant="primary"
              className="hidden whitespace-nowrap lg:inline-flex"
            >
              Order Now
            </Button>

            <button
              type="button"
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-10 sm:w-10 lg:hidden",
                menuOpen
                  ? "border-brand-primary bg-brand-pink-lighter text-brand-primary"
                  : "border-brand-border text-brand-brown hover:border-brand-primary hover:bg-brand-pink-lighter",
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            >
              {menuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[60] bg-brand-brown/20 backdrop-blur-[2px] lg:hidden"
          style={{ top: "var(--header-offset)" }}
          aria-hidden
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id="mobile-nav-panel"
        className={cn(
          "fixed right-0 z-[70] flex h-[calc(100dvh-var(--header-offset))] w-[min(18.5rem,86vw)] flex-col border-l border-brand-border bg-gradient-to-b from-white to-brand-pink-lighter/40 shadow-2xl shadow-brand-primary/10 transition-transform duration-300 ease-out lg:hidden",
          menuOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        style={{ top: "var(--header-offset)" }}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between border-b border-brand-border/80 bg-white/90 px-4 py-3">
          <span className="font-display text-sm font-semibold text-brand-brown">
            Menu
          </span>
          <button
            type="button"
            className="rounded-full p-2 text-brand-muted hover:bg-brand-pink-lighter hover:text-brand-primary"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <ul className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  tabIndex={menuOpen ? undefined : -1}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-pink-lighter/80 hover:text-brand-primary"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 border-t border-brand-border/80 bg-white/90 p-4">
          <CustomerHeaderAuth onNavigate={closeMenu} compact />
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-brand-brown">Cart</span>
            <CartIconLink onNavigate={closeMenu} />
          </div>
          <Button
            href="/custom-cake"
            variant="primary"
            className="w-full shadow-md shadow-brand-primary/25"
            size="md"
            tabIndex={menuOpen ? undefined : -1}
            onClick={closeMenu}
          >
            Order Now
          </Button>
        </div>
      </nav>
    </>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
