import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedListItem } from "@/components/animation/AnimatedListItem";
import { Reveal } from "@/components/animation/Reveal";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/Button";
import { features } from "@/lib/features";
import { capStaggerDelay } from "@/lib/animation/constants";
import { siteImages } from "@/lib/images";
import { orderProcessSteps } from "@/lib/orderProcess";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "About Us",
    description: `Learn about ${businessName} — handcrafted custom cakes, fresh ingredients, and a caring team behind every celebration.`,
    path: "/about",
    brandName: businessName,
  });
}

export default async function AboutPage() {
  const businessName = await getBusinessName();

  return (
    <PublicPageLayout mainId="about-page" ariaLabel={`About ${businessName}`}>
      <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <Reveal direction="left">
              <div>
                <SectionAnimatedHeader
                  eyebrow="Our Story"
                  title="Sweet moments, baked beautifully"
                  description={`${businessName} is a custom cake bakery dedicated to turning your celebrations into unforgettable memories. We combine elegant design with delicious flavour — whether you need a wedding showstopper, a birthday surprise, or a bespoke creation that is entirely your own.`}
                  titleAs="h1"
                  align="start"
                  className="max-w-none"
                  titleClassName="text-3xl sm:text-4xl"
                />
                <Reveal direction="up" delay={0.45} className="mt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button href="/cakes">Browse cakes</Button>
                    <Button href="/custom-cake" variant="outline">
                      Design a custom cake
                    </Button>
                  </div>
                </Reveal>
              </div>
            </Reveal>
            <Reveal delay={0.2} direction="scale">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-pink-lighter/50 p-2 shadow-lg shadow-brand-primary/15 lg:max-w-none sm:p-3">
                <Image
                  src={siteImages.aboutUs}
                  alt={`${businessName} About Us`}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-brand-border/40 bg-white/80">
        <div className="section-container">
          <SectionAnimatedHeader
            eyebrow="Why choose us"
            title={`The ${businessName} difference`}
            align="center"
            className="max-w-xl"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {features.map((feature, index) => (
              <AnimatedListItem key={feature.id} index={index}>
                <div className="animate-card rounded-2xl border border-brand-border/50 bg-gradient-to-b from-white to-brand-pink-lighter/40 p-5 text-center shadow-sm">
                  <h3 className="font-display text-base font-semibold text-brand-brown">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {feature.description}
                  </p>
                </div>
              </AnimatedListItem>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-brand-pink-lighter/25">
        <div className="section-container max-w-3xl">
          <SectionAnimatedHeader
            eyebrow="How it works"
            title="From idea to celebration"
            align="center"
            className="max-w-xl mx-auto"
          />
          <ol className="mt-8 space-y-4">
            {orderProcessSteps.map((step, index) => (
              <Reveal
                key={step.id}
                delay={capStaggerDelay(index, 0.08)}
                direction="up"
                as="li"
              >
                <div className="flex gap-4 rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-4 shadow-sm sm:px-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-brand-brown">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-brand-muted">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal direction="up" delay={0.35} className="mt-8 text-center">
            <p className="text-sm text-brand-muted">
              Ready to begin?{" "}
              <Link href="/contact" className="font-semibold text-brand-primary hover:underline">
                Get in touch
              </Link>{" "}
              or explore our{" "}
              <Link href="/gallery" className="font-semibold text-brand-primary hover:underline">
                gallery
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </PublicPageLayout>
  );
}
