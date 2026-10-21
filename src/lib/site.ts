import { contactInfo } from "@/lib/contact";

/**
 * Static site chrome defaults. `name` is the fallback brand only —
 * prefer getBusinessName() / useBusinessName() for customer-visible text.
 */
export const siteConfig = {
  name: contactInfo.businessName,
  tagline: "Custom Cakes",
  slogan: "Baked with love, designed just for you",
  address: contactInfo.address,
  phone: contactInfo.phoneDisplay,
  phoneHref: contactInfo.phoneHref,
  whatsapp: contactInfo.whatsappDisplay,
  whatsappInternational: contactInfo.whatsappNumber,
  email: contactInfo.email,
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Cakes", href: "/cakes" },
  { label: "Custom Cakes", href: "/custom-cake" },
  { label: "My Order", href: "/my-order" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
] as const;

export const socialLinks = [
  { label: "Facebook", href: contactInfo.social.facebook },
  { label: "Instagram", href: contactInfo.social.instagram },
] as const;
