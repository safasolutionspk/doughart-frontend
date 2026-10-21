"use client";

import { useEffect, useState } from "react";
import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { Button } from "@/components/ui/Button";
import {
  fetchCustomerOrders,
  type CustomerOrderSummary,
} from "@/lib/customer/orders";

export function LoggedInOrdersSection() {
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCustomerOrders();
        if (!cancelled) {
          setOrders(data);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your orders. Please refresh.");
        }
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-brand-brown">
          Your orders
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          Orders placed while signed in to your account.
        </p>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!loaded ? (
        <div className="space-y-3">
          <div className="h-28 animate-pulse rounded-2xl bg-brand-pink-lighter/60" />
          <div className="h-28 animate-pulse rounded-2xl bg-brand-pink-lighter/60" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-border/80 bg-white px-6 py-10 text-center shadow-sm">
          <p className="font-display text-lg font-semibold text-brand-brown">
            No orders on this account yet
          </p>
          <p className="mt-2 text-sm text-brand-muted">
            Place an order while logged in, or use the lookup below for guest
            orders.
          </p>
          <div className="mt-5">
            <Button href="/cakes">Browse cakes</Button>
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
  );
}
