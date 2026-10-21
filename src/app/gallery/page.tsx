import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedListItem } from "@/components/animation/AnimatedListItem";
import { Reveal } from "@/components/animation/Reveal";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { GalleryImageTile } from "@/components/gallery/GalleryImageTile";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { galleryCopy, fetchPublicGalleryImages } from "@/lib/gallery";
import { cn } from "@/lib/cn";
import { externalLinkProps } from "@/lib/links";
import { realAssets } from "@/lib/realAssets";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: "Gallery",
    description: `Browse ${businessName} custom cake creations — weddings, birthdays, anniversaries, and celebration favourites.`,
    path: "/gallery",
    brandName: businessName,
  });
}

export default async function GalleryPage() {
  const businessName = await getBusinessName();
  const waveBg = realAssets.galleryWaveBg;
  const images = await fetchPublicGalleryImages(businessName);

  return (
    <PublicPageLayout mainId="gallery-page" ariaLabel="Gallery">
      <section
        className={cn(
          "section-padding relative overflow-hidden",
          !waveBg && "bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream",
        )}
        style={
          waveBg
            ? {
                backgroundImage: `url(${waveBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        <div className="section-container relative z-10">
          <SectionAnimatedHeader
            eyebrow={galleryCopy.subtitle}
            title={galleryCopy.heading}
            description="A glimpse of the cakes we have crafted for weddings, birthdays, and every sweet celebration in between."
            titleAs="h1"
            align="center"
            className="max-w-2xl"
            titleClassName="text-3xl sm:text-4xl"
          />
          <Reveal direction="up" delay={0.45} className="mt-5 text-center">
            <Link
              href={galleryCopy.instagramHref}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 border-brand-primary bg-brand-primary px-5 py-2.5",
                "text-sm font-semibold text-white shadow-md shadow-brand-primary/35 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand-primary",
              )}
              {...externalLinkProps}
            >
              {galleryCopy.instagramLabel}
            </Link>
          </Reveal>

          {images.length === 0 ? (
            <p className="mt-10 text-center text-sm text-brand-muted">
              Gallery photos will appear here once they are added in Admin.
            </p>
          ) : (
            <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {images.map((image, index) => (
                <AnimatedListItem key={image.id} index={index}>
                  <div className="card-premium image-zoom-wrap group relative aspect-square overflow-hidden rounded-xl border border-white/90 bg-white shadow-sm shadow-brand-primary/10">
                    <GalleryImageTile
                      image={image}
                      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 240px"
                      imageClassName="image-zoom-target"
                    />
                  </div>
                </AnimatedListItem>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PublicPageLayout>
  );
}
