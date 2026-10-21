import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { OrderNowButton } from "@/components/cart/OrderNowButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CatalogCardImage } from "@/components/catalog/CatalogCardImage";
import {
  catalogCardActionsClassName,
  catalogCardBodyClassName,
  catalogCardContentClassName,
  catalogCardDescriptionClassName,
  catalogCardImageClassName,
  catalogCardShellClassName,
  catalogCardTitleClassName,
} from "@/lib/catalog/cardStyles";
import { cn } from "@/lib/cn";
import { formatPrice, getCategoryRef, type PublicCake } from "@/lib/catalog";
import { getCakeImageSrc } from "@/lib/media";
import { getWhatsAppNumber, buildWhatsAppOrderUrl } from "@/lib/whatsapp";

const defaultCardButtonClassName =
  "!h-8 w-full min-w-0 !min-w-0 max-w-full truncate !px-2 !text-[10px] sm:!h-8 sm:!text-[11px]";

const popularCardButtonClassName =
  "!h-6 w-full min-w-0 !min-w-0 max-w-full truncate !px-1.5 !text-[0.575rem] sm:!h-8 sm:!px-2 sm:!text-[11px]";

const popularSideButtonClassName =
  "!h-6 w-full min-w-0 !min-w-0 max-w-full truncate !px-1 !text-[0.55rem] sm:!h-8 sm:!px-2 sm:!text-[11px]";

type CakeCardProps = {
  cake: PublicCake;
  /** When false, omits the description line (homepage popular section). Default true. */
  showDescription?: boolean;
  /** Homepage Most Popular Items — narrower image-focused mobile card. */
  compactPopular?: boolean;
};

export async function CakeCard({
  cake,
  showDescription = true,
  compactPopular = false,
}: CakeCardProps) {
  const category = getCategoryRef(cake);
  const { apiImage, fallback } = getCakeImageSrc(cake.image, category.slug);
  const displayImage = apiImage ?? fallback;
  const detailHref = `/cakes/${category.slug}/${cake.slug}`;
  const waNumber = await getWhatsAppNumber();
  const whatsappHref = buildWhatsAppOrderUrl(cake.name, waNumber);
  const cartItem = {
    cakeSlug: cake.slug,
    categorySlug: category.slug,
    name: cake.name,
    image: displayImage,
    unitPrice: cake.price,
    itemTypes: cake.itemTypes,
  };

  const imageClassName = compactPopular
    ? "image-zoom-wrap relative aspect-square w-full shrink-0 overflow-hidden bg-brand-pink-lighter p-1.5 sm:p-2"
    : catalogCardImageClassName;

  const bodyClassName = compactPopular
    ? "flex min-h-0 flex-1 flex-col overflow-hidden p-1.5 sm:p-2.5"
    : catalogCardBodyClassName;

  const actionsClassName = compactPopular
    ? "mt-auto flex min-w-0 shrink-0 flex-col gap-1 pt-1"
    : catalogCardActionsClassName;

  const primaryButtonClassName = compactPopular
    ? popularCardButtonClassName
    : defaultCardButtonClassName;

  const sideButtonClassName = compactPopular
    ? popularSideButtonClassName
    : defaultCardButtonClassName;

  return (
    <Card as="article" padding="none" className={catalogCardShellClassName}>
      <Link href={detailHref} className="block shrink-0">
        <div className={imageClassName}>
          <CatalogCardImage
            apiImage={apiImage}
            fallbackSrc={fallback}
            alt={cake.name}
            sizes="(max-width: 640px) 10rem, (max-width: 1280px) 33vw, 25vw"
            objectFit="contain"
            imageDisplay={cake.imageDisplay}
          />
          <span className="pink-overlay" aria-hidden />
        </div>
      </Link>

      <div className={bodyClassName}>
        <div className={catalogCardContentClassName}>
          <Link href={detailHref} className="block shrink-0">
            <h3
              className={cn(
                catalogCardTitleClassName,
                compactPopular && "text-[0.7rem] leading-snug sm:text-sm",
                "transition-colors hover:text-brand-primary",
              )}
            >
              {cake.name}
            </h3>
          </Link>
          {showDescription ? (
            <p className={catalogCardDescriptionClassName}>
              {cake.description?.trim() || "\u00a0"}
            </p>
          ) : null}
          <p
            className={cn(
              "shrink-0 pt-0.5 font-display font-semibold text-brand-primary",
              compactPopular
                ? "text-[0.6875rem] sm:text-sm"
                : "text-xs sm:text-sm",
            )}
          >
            {formatPrice(cake.price)}
          </p>
        </div>

        <div className={actionsClassName}>
          <AddToCartButton
            item={cartItem}
            className={cn(primaryButtonClassName, "!min-w-0")}
          />
          <div
            className={cn(
              "grid min-w-0 grid-cols-2",
              compactPopular ? "gap-1 sm:gap-1.5" : "gap-1 sm:gap-1.5",
            )}
          >
            <OrderNowButton
              item={cartItem}
              size="sm"
              label="Order"
              className={sideButtonClassName}
            />
            <Button
              href={whatsappHref}
              variant="outline"
              size="sm"
              className={sideButtonClassName}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
