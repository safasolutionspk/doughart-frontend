/**
 * Public contact, WhatsApp, and social configuration.
 * `businessName` here is only the technical fallback when Admin settings
 * cannot be loaded. Live customer UI should prefer getBusinessName() /
 * useBusinessName() from settings.
 */
export const contactInfo = {
  businessName: "DoughArt",
  phoneDisplay: "0327 7707333",
  phoneInternational: "+923277707333",
  phoneHref: "tel:+923277707333",
  whatsappDisplay: "0327 7707333",
  whatsappNumber: "923277707333",
  whatsappBaseUrl: "https://wa.me/923277707333",
  email: "doughartbakers@gmail.com",
  emailHref: "mailto:doughartbakers@gmail.com",
  address: "Thokkar Niaz Baig, Lahore, Punjab, Pakistan",
  businessHours: {
    weekdays: "Mon–Sat: 7:00 AM - 8:00 PM",
    sunday: "Sunday: 8:00 AM - 6:00 PM",
  },
  social: {
    instagram: "https://www.instagram.com/dough.art/",
    facebook: "https://www.facebook.com/artdough.1",
  },
} as const;

export type ContactInfo = typeof contactInfo;
