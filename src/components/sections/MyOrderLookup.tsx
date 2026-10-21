"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/components/auth/CustomerAuthProvider";
import { LoggedInOrdersSection } from "@/components/orders/LoggedInOrdersSection";
import { OrderNumberBadge } from "@/components/orders/OrderNumberBadge";
import { Button } from "@/components/ui/Button";
import { lookupOrder, type PublicOrderResponse } from "@/lib/api";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPaymentMethod } from "@/lib/payment";
import { buildWhatsAppOrderConfirmationUrl } from "@/lib/whatsapp";

const inputClass = cn(
  "w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-brown",
  "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
);

function formatOrderStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MyOrderLookup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, hydrated } = useCustomerAuth();
  const [showCustomCakeSuccess, setShowCustomCakeSuccess] = useState(false);
  const [showGuestLookup, setShowGuestLookup] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<PublicOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("customCakeSubmitted") === "1") {
      const timer = window.setTimeout(() => {
        setShowCustomCakeSuccess(true);
        router.replace("/my-order", { scroll: false });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hydrated && isAuthenticated) {
        setShowGuestLookup(false);
      } else if (hydrated && !isAuthenticated) {
        setShowGuestLookup(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, isAuthenticated]);

  async function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await lookupOrder(orderNumber, phone);
      setOrder(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Order not found. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      {showCustomCakeSuccess ? (
        <div
          className="rounded-xl border border-brand-primary/30 bg-brand-pink-lighter px-4 py-3 text-sm text-brand-brown"
          role="status"
          aria-live="polite"
        >
          Your custom cake request was received. We will send you a final price
          quote soon.
        </div>
      ) : null}

      {hydrated && isAuthenticated ? <LoggedInOrdersSection /> : null}

      <section className="space-y-4">
        {hydrated && isAuthenticated ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-brand-brown">
                Lookup by order number
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                For guest orders or orders placed before you signed in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowGuestLookup((v) => !v)}
              className="text-sm font-semibold text-brand-primary hover:underline"
            >
              {showGuestLookup ? "Hide lookup" : "Show lookup"}
            </button>
          </div>
        ) : null}

        {(!hydrated || !isAuthenticated || showGuestLookup) && (
          <form
            onSubmit={handleLookup}
            className="space-y-4 rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6"
          >
            {!isAuthenticated ? (
              <p className="text-sm text-brand-muted">
                Enter the order number and phone from your confirmation.
              </p>
            ) : null}
            <div>
              <label
                htmlFor="lookup-order"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-brown"
              >
                Order number
              </label>
              <input
                id="lookup-order"
                type="text"
                required
                placeholder="SA-260520-1234"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="lookup-phone"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-brown"
              >
                Phone used on order
              </label>
              <input
                id="lookup-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
            {error ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Looking up…" : "Find my order"}
            </Button>
          </form>
        )}

        {order ? <OrderDetails order={order} /> : null}
      </section>
    </div>
  );
}

function OrderDetails({ order }: { order: PublicOrderResponse }) {
  const whatsappHref = buildWhatsAppOrderConfirmationUrl(
    order.orderNumber,
    order.cakeType,
    order.finalAmount,
  );

  return (
    <div className="reveal-up space-y-5 rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="section-eyebrow">Order details</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-brand-brown">
          {order.cakeType}
        </h3>
        <OrderNumberBadge orderNumber={order.orderNumber} className="mt-2" />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <Detail label="Status" value={formatOrderStatus(order.status)} />
        <Detail
          label="Payment"
          value={formatPaymentMethod(order.paymentMethod ?? "cash_on_delivery")}
        />
        {order.awaitingQuote ? (
          <Detail label="Price" value="Quote pending" className="sm:col-span-2 text-brand-primary" />
        ) : (
          <Detail
            label={
              order.quotedAmount != null && order.quotedAmount > 0
                ? "Approved price"
                : "Total"
            }
            value={formatPrice(order.finalAmount)}
            className={
              order.quotedAmount != null && order.quotedAmount > 0
                ? "text-emerald-700 sm:col-span-2"
                : undefined
            }
          />
        )}
        {order.eventDate ? <Detail label="Delivery" value={order.eventDate} /> : null}
      </dl>

      <p className="text-sm text-brand-muted">
        Pay when your order is delivered.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href={whatsappHref}>WhatsApp us</Button>
        <Button href="/cakes/all" variant="outline">
          Continue shopping
        </Button>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-brand-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-brand-brown">{value}</dd>
    </div>
  );
}
