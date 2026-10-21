import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { WordReveal } from "@/components/animation/WordReveal";
import { GalleryImageTile } from "@/components/gallery/GalleryImageTile";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { capStaggerDelay } from "@/lib/animation/constants";
import {
  fetchPublicGalleryImages,
  galleryCopy,
  type GalleryDisplayImage,
} from "@/lib/gallery";
import { cn } from "@/lib/cn";
import { externalLinkProps } from "@/lib/links";
import { realAssets } from "@/lib/realAssets";

/** Homepage preview — shows Admin gallery uploads when available. */
export async function Gallery() {
  const waveBg = realAssets.galleryWaveBg;
  const images = await fetchPublicGalleryImages();
  const preview = images.slice(0, 8);

  return (
    <section
      id="gallery"
      className={cn(
        "section-anchor relative overflow-hidden py-10 sm:py-12",
        !waveBg && "bg-[#FFF8FA]",
      )}
      aria-labelledby="gallery-heading"
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
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-10 xl:grid-cols-[minmax(0,18rem)_1fr]">
          <Reveal direction="up" variant="text" className="max-w-sm shrink-0 lg:max-w-none">
            <div>
              <SectionEyebrow align="start">{galleryCopy.subtitle}</SectionEyebrow>
              <WordReveal
                text={galleryCopy.heading}
                as="h2"
                id="gallery-heading"
                delay={0.12}
                className="mt-2 block w-full font-display text-xl font-bold leading-snug text-brand-brown sm:text-2xl lg:text-[1.65rem]"
              />
              <Link
                href={galleryCopy.instagramHref}
                className={cn(
                  "mt-5 inline-flex items-center gap-2 rounded-full border-2 border-brand-primary bg-brand-primary px-5 py-2.5",
                  "text-sm font-semibold text-white shadow-md shadow-brand-primary/35",
                  "transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-primary hover:shadow-lg hover:shadow-brand-primary/25",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                )}
                {...externalLinkProps}
              >
                <InstagramIcon className="h-4 w-4 shrink-0" />
                {galleryCopy.instagramLabel}
              </Link>
              {images.length > 0 ? (
                <Link
                  href="/gallery"
                  className="mt-3 block text-sm font-semibold text-brand-primary hover:underline"
                >
                  View full gallery
                </Link>
              ) : null}
            </div>
          </Reveal>

          {preview.length === 0 ? (
            <p className="text-sm text-brand-muted">
              Gallery photos will appear here once they are added in Admin.
            </p>
          ) : (
            <ul
              className={cn(
                "flex items-center justify-start gap-2 overflow-x-auto pb-1",
                "snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "lg:justify-end lg:gap-2.5",
              )}
            >
              {preview.map((image, index) => (
                <Reveal
                  key={image.id}
                  as="li"
                  delay={capStaggerDelay(index, 0.1)}
                  direction="scale"
                  variant="card"
                  className="w-[5.75rem] shrink-0 snap-start sm:w-[6.5rem] md:w-[7.25rem] lg:w-[7.75rem]"
                >
                  <GalleryCard image={image} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

type GalleryCardProps = {
  image: GalleryDisplayImage;
};

function GalleryCard({ image }: GalleryCardProps) {
  return (
    <Link
      href="/gallery"
      className="card-premium group relative block aspect-square overflow-hidden rounded-xl border-2 border-white/95 bg-white shadow-md shadow-brand-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      aria-label={`View ${image.alt} in gallery`}
    >
      <GalleryImageTile
        image={image}
        sizes="(max-width: 640px) 92px, (max-width: 1024px) 104px, 124px"
        imageClassName="image-zoom-target"
      />
      <span
        className="absolute inset-0 flex items-center justify-center bg-brand-brown/0 transition-colors group-hover:bg-brand-primary/20"
        aria-hidden
      >
        <span className="flex h-7 w-7 scale-0 items-center justify-center rounded-full bg-white/95 text-brand-primary shadow-sm transition-transform group-hover:scale-100">
          <InstagramIcon className="h-3.5 w-3.5" />
        </span>
      </span>
    </Link>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
