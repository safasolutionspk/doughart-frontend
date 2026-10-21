import Link from "next/link";
import { OrderNumberBadge } from "@/components/orders/OrderNumberBadge";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { CustomerOrderSummary } from "@/lib/customer/orders";
import { parseCustomCakeNotes } from "@/lib/orders/customCakeNotes";
import { formatPaymentMethod } from "@/lib/payment";

function formatOrderStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDeliveryDate(value?: string): string {
  if (!value) {
    return "—";
  }
  try {
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

export function CustomerOrderCard({ order }: { order: CustomerOrderSummary }) {
  const detailHref = `/order-success/${encodeURIComponent(order.orderNumber)}?phone=${encodeURIComponent(order.phone)}`;
  const parsed = order.isCustomCake
    ? parseCustomCakeNotes(order.specialInstructions)
    : {};

  return (
    <article className="rounded-2xl border border-brand-border/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-brand-brown">
            {order.cakeType}
          </p>
          {order.isCustomCake ? (
            <span className="mt-1 inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
              Custom cake
            </span>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold text-brand-primary">
            {order.awaitingQuote
              ? "Quote pending"
              : formatPrice(order.finalAmount)}
          </p>
          {!order.awaitingQuote && order.quotedAmount ? (
            <p className="text-[10px] text-brand-muted">Approved price</p>
          ) : null}
        </div>
      </div>

      {order.cakeSize || order.flavour || order.messageOnCake || parsed.giftNote ? (
        <dl className="mt-2 grid gap-1.5 text-xs text-brand-muted sm:grid-cols-2">
          {order.cakeSize ? (
            <div>
              <dt className="font-medium text-brand-brown">Pounds</dt>
              <dd>{order.cakeSize}</dd>
            </div>
          ) : null}
          {order.flavour ? (
            <div>
              <dt className="font-medium text-brand-brown">Flavour</dt>
              <dd>{order.flavour}</dd>
            </div>
          ) : null}
          {order.isCustomCake && order.messageOnCake ? (
            <div className="sm:col-span-2">
              <dt className="font-medium text-brand-brown">Message</dt>
              <dd className="line-clamp-2">{order.messageOnCake}</dd>
            </div>
          ) : null}
          {order.isCustomCake && parsed.giftNote ? (
            <div className="sm:col-span-2">
              <dt className="font-medium text-brand-brown">Gift note</dt>
              <dd className="line-clamp-2">{parsed.giftNote}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-brand-muted">Status</dt>
          <dd className="font-medium text-brand-brown">
            {formatOrderStatus(order.status)}
          </dd>
        </div>
        <div>
          <dt className="text-brand-muted">Payment</dt>
          <dd className="font-medium text-brand-brown">
            {formatPaymentMethod(order.paymentMethod ?? "cash_on_delivery")}
          </dd>
        </div>
        <div>
          <dt className="text-brand-muted">Delivery</dt>
          <dd className="font-medium text-brand-brown">
            {formatDeliveryDate(order.eventDate)}
          </dd>
        </div>
        <div>
          <dt className="text-brand-muted">Placed</dt>
          <dd className="font-medium text-brand-brown">
            {formatDateTime(order.createdAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <OrderNumberBadge orderNumber={order.orderNumber} />
        <Link
          href={detailHref}
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-full",
            "bg-brand-primary px-3.5 text-xs font-semibold text-white",
            "transition-colors hover:bg-brand-button-hover",
          )}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
