import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { Button } from "@/components/ui/Button";
import { siteImages } from "@/lib/images";
import { getBusinessName } from "@/lib/settings";

export async function AboutUs() {
  const businessName = await getBusinessName();
  return (
    <section
      id="about"
      className="section-anchor section-padding bg-[#FFF8FA]"
      aria-labelledby="about-us-heading"
    >
      <div className="section-container">
        <div className="overflow-hidden rounded-3xl border border-brand-primary/10 bg-white/90">
          <div className="grid items-center gap-8 p-5 sm:gap-10 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            <Reveal direction="left" className="order-2 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                About Us
              </p>
              <h2
                id="about-us-heading"
                className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-brown sm:text-3xl"
              >
                Sweet moments, baked beautifully
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                {businessName} is a custom cake bakery dedicated to turning
                your celebrations into unforgettable memories. We combine elegant
                design with delicious flavour — whether you need a wedding
                showstopper, a birthday surprise, or a bespoke creation that is
                entirely your own.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
                Every cake is crafted with care, fresh ingredients, and
                thoughtful finishing so your celebration feels personal and
                complete.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/about" size="sm">
                  Learn more
                </Button>
                <Button href="/custom-cake" variant="outline" size="sm">
                  Design a custom cake
                </Button>
              </div>
              <p className="mt-4 text-xs text-brand-muted">
                Prefer to browse first?{" "}
                <Link
                  href="/cakes"
                  className="font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  Explore our cakes
                </Link>
                .
              </p>
            </Reveal>

            <Reveal delay={0.12} direction="right" className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-brand-border/50 bg-brand-pink-lighter/60 p-2 sm:p-3 lg:max-w-none">
                <div className="relative h-full w-full">
                  <Image
                    src={siteImages.aboutUs}
                    alt={`${businessName} About Us`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority={false}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
