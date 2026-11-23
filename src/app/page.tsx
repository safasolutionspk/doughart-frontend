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
import { buildPageMetadata, shopKeywords } from "@/lib/seo";
import { fetchPublicSettings, getBusinessName } from "@/lib/settings";
import { buildBakeryStructuredData } from "@/lib/structuredData";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: `${businessName} | Custom Cakes & Cake Delivery in Lahore`,
    description: `${businessName} crafts custom cakes, birthday cakes, celebration cakes, and cupcakes in Lahore. Order cakes online for local delivery, or request a bespoke design.`,
    path: "/",
    keywords: [...shopKeywords, "DoughArt Bakers", "DoughArt cakes"],
    brandName: businessName,
  });
}

export default async function Home() {
  const [businessName, settings] = await Promise.all([
    getBusinessName(),
    fetchPublicSettings(),
  ]);
  const bakeryStructuredData = buildBakeryStructuredData(
    settings,
    businessName,
  );

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
        <Hero businessName={businessName} />
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
