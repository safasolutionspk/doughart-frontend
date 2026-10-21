import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AboutUs } from "@/components/sections/AboutUs";
import { CakeCategories } from "@/components/sections/CakeCategories";
import { ComboOffersSection } from "@/components/sections/ComboOffersSection";
import { CustomCakeBuilder } from "@/components/sections/CustomCakeBuilder";
import { FeatureStrip } from "@/components/sections/FeatureStrip";
import { Hero } from "@/components/sections/Hero";
import { MostPopularItems } from "@/components/sections/MostPopularItems";
import { Newsletter } from "@/components/sections/Newsletter";
import { OrderProcess } from "@/components/sections/OrderProcess";
import { Reviews } from "@/components/sections/Reviews";
import { contactInfo } from "@/lib/contact";
import { siteImages } from "@/lib/images";
import { buildPageMetadata, siteUrl } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";
import { socialLinks } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: `${businessName} | Custom Cakes & Cake Delivery in Lahore`,
    description: `${businessName} crafts custom cakes for birthdays, weddings, and celebrations in Lahore. Browse designs, place orders online, or request a bespoke cake.`,
    path: "/",
    brandName: businessName,
  });
}

export default async function Home() {
  const businessName = await getBusinessName();
  const bakeryStructuredData = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: businessName,
    url: siteUrl,
    image: new URL(siteImages.hero, siteUrl).toString(),
    logo: new URL(siteImages.logo, siteUrl).toString(),
    telephone: contactInfo.phoneInternational,
    email: contactInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Thokkar Niaz Baig",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    openingHours: ["Mo-Sa 07:00-20:00", "Su 08:00-18:00"],
    sameAs: socialLinks.map((link) => link.href),
  } as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bakeryStructuredData),
        }}
      />
      <Header />
      <main
        id="home"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
        aria-label="Page content"
      >
        <Hero />
        <FeatureStrip />
        <AboutUs />
        <CakeCategories />
        <MostPopularItems />
        <CustomCakeBuilder />
        <ComboOffersSection />
        <OrderProcess />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
