"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/components/auth/CustomerAuthProvider";
import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { buildLoginRedirectUrl } from "@/lib/auth/returnUrl";
import {
  fetchCustomerOrders,
  type CustomerOrderSummary,
} from "@/lib/customer/orders";
import { Button } from "@/components/ui/Button";

export function AccountPageContent() {
  const router = useRouter();
  const { customer, hydrated, isAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(buildLoginRedirectUrl("/account", { authRequired: false }));
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadError(null);
      try {
        const data = await fetchCustomerOrders();
        if (!cancelled) {
          setOrders(data);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Could not load your orders. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setOrdersLoaded(true);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated || !customer) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 rounded-2xl bg-brand-pink-lighter/60" />
        <div className="h-40 rounded-2xl bg-brand-pink-lighter/60" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-brown">
          Your details
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-brand-muted">Name</dt>
            <dd className="font-medium text-brand-brown">{customer.name}</dd>
          </div>
          <div>
            <dt className="text-brand-muted">Email</dt>
            <dd className="font-medium text-brand-brown">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-brand-muted">Phone</dt>
            <dd className="font-medium text-brand-brown">{customer.phone}</dd>
          </div>
        </dl>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-brown sm:text-2xl">
              Your orders
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Orders placed while signed in. For older guest orders, use{" "}
              <Link href="/my-order" className="font-medium text-brand-primary hover:underline">
                order lookup
              </Link>
              .
            </p>
          </div>
          <Button href="/cakes" variant="outline" size="sm">
            Order again
          </Button>
        </div>

        {loadError ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {loadError}
          </p>
        ) : null}

        {!ordersLoaded ? (
          <div className="animate-pulse space-y-3">
            <div className="h-28 rounded-2xl bg-brand-pink-lighter/60" />
            <div className="h-28 rounded-2xl bg-brand-pink-lighter/60" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-brand-border/80 bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-display text-lg font-semibold text-brand-brown">
              No orders yet
            </p>
            <p className="mt-2 text-sm text-brand-muted">
              When you place an order while logged in, it will appear here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/cakes">Browse cakes</Button>
              <Button href="/my-order" variant="outline">
                Lookup guest order
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li key={order.orderNumber}>
                <CustomerOrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
