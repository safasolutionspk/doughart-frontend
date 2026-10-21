import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedListItem } from "@/components/animation/AnimatedListItem";
import { Reveal } from "@/components/animation/Reveal";
import { SectionAnimatedHeader } from "@/components/animation/SectionAnimatedHeader";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { CakeCard } from "@/components/catalog/CakeCard";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";
import { ShopEmptyState } from "@/components/catalog/ShopEmptyState";
import { fetchPublicCakes, fetchPublicCategories } from "@/lib/catalog";
import { buildPageMetadata, shopKeywords } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ALL_SLUG = "all";

function getCategoryTitle(
  slug: string,
  categories: Awaited<ReturnType<typeof fetchPublicCategories>>,
): string {
  if (slug === ALL_SLUG) {
    return "All Menu";
  }
  const match = categories.find((category) => category.slug === slug);
  if (match) {
    return match.name;
  }
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [categories, businessName] = await Promise.all([
    fetchPublicCategories(),
    getBusinessName(),
  ]);
  const title = getCategoryTitle(slug, categories);
  const activeCategory =
    slug !== ALL_SLUG
      ? categories.find((category) => category.slug === slug)
      : undefined;
  const description =
    activeCategory?.description ??
    `Shop ${title.toLowerCase()} at ${businessName} — browse cakes, place your order online, or request customizations on WhatsApp.`;

  return buildPageMetadata({
    title,
    description,
    path: `/cakes/${slug}`,
    keywords: [slug, title.toLowerCase(), ...shopKeywords],
    brandName: businessName,
  });
}

export default async function CakesCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await fetchPublicCategories();

  let cakes: Awaited<ReturnType<typeof fetchPublicCakes>>;
  if (slug === ALL_SLUG) {
    cakes = (await fetchPublicCakes()) ?? [];
  } else {
    const result = await fetchPublicCakes({ categorySlug: slug });
    if (result === null) {
      notFound();
    }
    cakes = result;
  }

  const title = getCategoryTitle(slug, categories);
  const activeCategory =
    slug !== ALL_SLUG
      ? categories.find((category) => category.slug === slug)
      : undefined;
  const description = activeCategory?.description;

  return (
    <PublicPageLayout mainId="cakes-category" ariaLabel={`${title} cakes`}>
        <section className="section-padding bg-gradient-to-b from-brand-pink-lighter via-white to-brand-cream">
          <div className="section-container">
            <nav
              className="mb-6 text-sm text-brand-muted"
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
                <li className="font-medium text-brand-brown">{title}</li>
              </ol>
            </nav>

            <SectionAnimatedHeader
              eyebrow="Shop cakes"
              title={title}
              description={
                description ??
                "Handcrafted celebration cakes — order yours online or chat with us on WhatsApp."
              }
              titleAs="h1"
              align="center"
              className="max-w-2xl"
              titleClassName="text-2xl sm:text-3xl lg:text-4xl"
            />

            <Reveal direction="up" delay={0.25} variant="text" className="mt-6 sm:mt-8">
              <CategoryTabs categories={categories} activeSlug={slug} />
            </Reveal>

            {categories.length === 0 ? (
              <ShopEmptyState
                title="Catalog coming soon"
                description="We're preparing our cake collection. In the meantime, you can request a bespoke design made just for you."
                primaryHref="/custom-cake"
                primaryLabel="Request a custom cake"
                secondaryHref="/"
                secondaryLabel="Back to home"
              />
            ) : cakes.length === 0 ? (
              <ShopEmptyState
                title={`No ${title.toLowerCase()} yet`}
                description="This category is empty for now. Browse other categories or tell us what you'd like — we'll bake something special."
                primaryHref="/custom-cake"
                primaryLabel="Request a custom cake"
                secondaryHref="/cakes/all"
                secondaryLabel="Browse all menu"
              />
            ) : (
              <ul className="mt-6 grid grid-cols-2 items-stretch gap-2 sm:gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3">
                {cakes.map((cake, index) => (
                  <AnimatedListItem
                    key={cake._id}
                    index={index}
                    className="flex h-full min-w-0"
                  >
                    <CakeCard cake={cake} />
                  </AnimatedListItem>
                ))}
              </ul>
            )}
          </div>
        </section>
    </PublicPageLayout>
  );
}
