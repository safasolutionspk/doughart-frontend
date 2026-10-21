import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { CakeDetailAddToCart } from "@/components/cart/CakeDetailAddToCart";
import { CatalogCardImage } from "@/components/catalog/CatalogCardImage";
import {
  fetchPublicCakeBySlug,
  formatPrice,
  getCategoryRef,
} from "@/lib/catalog";
import { getCakeImageSrc } from "@/lib/media";
import { buildPageMetadata, shopKeywords, siteUrl } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppOrderUrl, getWhatsAppNumber } from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{ slug: string; cakeSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, cakeSlug } = await params;
  const [cake, businessName] = await Promise.all([
    fetchPublicCakeBySlug(cakeSlug),
    getBusinessName(),
  ]);

  if (!cake) {
    return buildPageMetadata({
      title: "Cake not found",
      description: "This cake could not be found.",
      path: `/cakes/${slug}/${cakeSlug}`,
      noIndex: true,
      brandName: businessName,
    });
  }

  const category = getCategoryRef(cake);
  const title = cake.name;
  const description =
    cake.description ??
    `Order ${cake.name} from ${businessName} — ${formatPrice(cake.price)}. Place your order online or on WhatsApp.`;

  return buildPageMetadata({
    title,
    description,
    path: `/cakes/${category.slug}/${cake.slug}`,
    keywords: [cake.name, category.name, ...shopKeywords],
    brandName: businessName,
  });
}

export default async function CakeDetailPage({ params }: PageProps) {
  const { slug, cakeSlug } = await params;
  const cake = await fetchPublicCakeBySlug(cakeSlug);

  if (!cake) {
    notFound();
  }

  const category = getCategoryRef(cake);
  if (category.slug !== slug) {
    notFound();
  }

  const { apiImage, fallback } = getCakeImageSrc(cake.image, category.slug);
  const displayImage = apiImage ?? fallback;
  const [waNumber, businessName] = await Promise.all([
    getWhatsAppNumber(),
    getBusinessName(),
  ]);
  const whatsappHref = buildWhatsAppOrderUrl(cake.name, waNumber);
  const imageUrl = displayImage.startsWith("http")
    ? displayImage
    : new URL(displayImage, siteUrl).toString();
  const productUrl = new URL(`/cakes/${category.slug}/${cake.slug}`, siteUrl).toString();
  const canRenderProductStructuredData =
    Boolean(cake.name.trim()) &&
    Boolean(cake.description?.trim()) &&
    cake.price > 0 &&
    Boolean(displayImage.trim());
  const productStructuredData = canRenderProductStructuredData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: cake.name,
        description: cake.description,
        image: [imageUrl],
        category: category.name,
        sku: cake._id,
        brand: {
          "@type": "Brand",
          name: businessName,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "PKR",
          price: String(cake.price),
          availability: "https://schema.org/InStock",
          url: productUrl,
        },
      }
    : null;

  return (
    <PublicPageLayout mainId="cake-detail" ariaLabel={cake.name}>
        {productStructuredData ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(productStructuredData),
            }}
          />
        ) : null}
        <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
          <div className="section-container">
            <nav
              className="mb-8 text-sm text-brand-muted"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="font-medium text-brand-primary hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-brand-border">
                  /
                </li>
                <li>
                  <Link
                    href={`/cakes/${category.slug}`}
                    className="font-medium text-brand-primary hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden className="text-brand-border">
                  /
                </li>
                <li className="font-medium text-brand-brown">{cake.name}</li>
              </ol>
            </nav>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14 lg:items-start">
              <div className="card-premium relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-brand-border/70 bg-brand-pink-lighter p-2 shadow-sm sm:p-3 lg:max-w-none">
                <CatalogCardImage
                  apiImage={apiImage}
                  fallbackSrc={fallback}
                  alt={cake.name}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  objectFit="contain"
                  imageDisplay={cake.imageDisplay}
                />
              </div>

              <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:pt-2">
                <div>
                  <p className="section-eyebrow">{category.name}</p>
                  <h1 className="section-title mt-2 text-2xl sm:text-3xl lg:text-4xl">
                    {cake.name}
                  </h1>
                  <p className="mt-3 font-display text-2xl font-semibold text-brand-primary sm:text-3xl">
                    {formatPrice(cake.price)}
                  </p>
                </div>

                {cake.description ? (
                  <p className="text-sm leading-relaxed text-brand-muted sm:text-base">
                    {cake.description}
                  </p>
                ) : null}

                {cake.isCustomizable ? (
                  <p className="rounded-xl border border-brand-border bg-brand-pink-lighter/60 px-4 py-3 text-sm text-brand-brown">
                    This cake can be customized. Use Order Now to share your
                    preferences, or message us on WhatsApp.
                  </p>
                ) : null}

                <CakeDetailAddToCart
                  item={{
                    cakeSlug: cake.slug,
                    categorySlug: category.slug,
                    name: cake.name,
                    image: displayImage,
                    unitPrice: cake.price,
                    itemTypes: cake.itemTypes,
                  }}
                  whatsappHref={whatsappHref}
                />

                <p className="text-xs text-brand-muted">
                  Questions? Call us at{" "}
                  <a
                    href={siteConfig.phoneHref}
                    className="font-semibold text-brand-primary hover:underline"
                  >
                    {siteConfig.phone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
    </PublicPageLayout>
  );
}
