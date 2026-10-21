import type { Metadata } from "next";
import { Reveal } from "@/components/animation/Reveal";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { ContactPageContent } from "@/components/sections/ContactPageContent";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Contact",
    description: `Contact ${businessName} for custom cake orders — phone, WhatsApp, email, and enquiries.`,
    path: "/contact",
    brandName: businessName,
  });
}

export default async function ContactPage() {
  const businessName = await getBusinessName();

  return (
    <PublicPageLayout mainId="contact-page" ariaLabel={`Contact ${businessName}`}>
      <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container max-w-5xl">
          <SectionAnimatedHeader
            eyebrow="We are here for you"
            title={`Contact ${businessName}`}
            titleAs="h1"
            align="center"
            className="max-w-xl"
            titleClassName="text-3xl sm:text-4xl"
          />
          <Reveal direction="up" delay={0.35} className="mt-10">
            <ContactPageContent />
          </Reveal>
        </div>
      </section>
    </PublicPageLayout>
  );
}
