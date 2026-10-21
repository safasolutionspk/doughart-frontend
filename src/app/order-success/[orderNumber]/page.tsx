import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/Button";
import { OrderNumberBadge } from "@/components/orders/OrderNumberBadge";
import { fetchPublicOrderByNumber } from "@/lib/api";
import { formatPrice } from "@/lib/catalog";
import { formatPaymentMethod } from "@/lib/payment";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessName } from "@/lib/settings";
import { buildWhatsAppOrderConfirmationUrl, getWhatsAppNumber } from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ phone?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  const businessName = await getBusinessName();
  return buildPageMetadata({
    title: `Order ${orderNumber} confirmed`,
    description: `Your ${businessName} cake order has been received. We'll confirm details shortly.`,
    path: `/order-success/${orderNumber}`,
    noIndex: true,
    brandName: businessName,
  });
}

export default async function OrderSuccessPage({ params, searchParams }: PageProps) {
  const { orderNumber } = await params;
  const { phone } = await searchParams;

  if (!phone?.trim()) {
    notFound();
  }

  const order = await fetchPublicOrderByNumber(orderNumber, phone);

  if (!order) {
    notFound();
  }

  const waNumber = await getWhatsAppNumber();
  const whatsappHref = buildWhatsAppOrderConfirmationUrl(
    order.orderNumber,
    order.cakeType,
    order.finalAmount,
    waNumber,
  );

  return (
    <PublicPageLayout mainId="order-success" ariaLabel="Order confirmation">
        <section className="section-padding bg-linear-to-b from-brand-pink-lighter via-white to-brand-cream">
          <div className="section-container max-w-lg">
            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600"
                aria-hidden
              >
                ✓
              </div>
              <p className="section-eyebrow mt-6 text-center">Order confirmed</p>
              <h1 className="section-title mt-2 text-center text-2xl sm:text-3xl">
                Thank you, {order.customerName}!
              </h1>
              <p className="mt-3 text-center text-sm leading-relaxed text-brand-muted sm:text-base">
                {order.message}
              </p>

              <dl className="mt-8 space-y-3 rounded-xl bg-brand-pink-lighter/50 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/40 pb-3">
                  <dt className="text-xs text-brand-muted">Reference</dt>
                  <dd>
                    <OrderNumberBadge orderNumber={order.orderNumber} />
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-brand-muted">Cake</dt>
                  <dd className="text-right font-medium text-brand-brown">
                    {order.cakeType}
                  </dd>
                </div>
                {order.awaitingQuote ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Price</dt>
                    <dd className="font-medium text-brand-primary">Quote pending</dd>
                  </div>
                ) : order.finalAmount > 0 ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">
                      {order.quotedAmount ? "Approved price" : "Total"}
                    </dt>
                    <dd className="font-semibold text-brand-primary">
                      {formatPrice(order.finalAmount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-brand-muted">Payment</dt>
                  <dd className="text-right font-medium text-brand-brown">
                    {formatPaymentMethod(order.paymentMethod ?? "cash_on_delivery")}
                  </dd>
                </div>
                {order.cakeSize ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Pounds</dt>
                    <dd className="text-right font-medium text-brand-brown">
                      {order.cakeSize}
                    </dd>
                  </div>
                ) : null}
                {order.flavour ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Flavor</dt>
                    <dd className="text-right font-medium text-brand-brown">
                      {order.flavour}
                    </dd>
                  </div>
                ) : null}
                {order.eventDate ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Delivery date</dt>
                    <dd className="font-medium text-brand-brown">
                      {order.eventDate}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <p className="mt-4 text-sm text-brand-muted">
                Pay when your order is delivered.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={whatsappHref} className="w-full sm:flex-1">
                  WhatsApp us
                </Button>
                <Button
                  href="/cakes/all"
                  variant="outline"
                  className="w-full sm:flex-1"
                >
                  Continue shopping
                </Button>
              </div>

              <p className="mt-6 text-center text-xs text-brand-muted">
                Track anytime at{" "}
                <Link
                  href="/my-order"
                  className="font-semibold text-brand-primary hover:underline"
                >
                  My Order
                </Link>
                {" · "}
                <Link
                  href="/custom-cake"
                  className="font-semibold text-brand-primary hover:underline"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </section>
    </PublicPageLayout>
  );
}
