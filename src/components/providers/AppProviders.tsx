"use client";

import { BusinessNameProvider } from "@/components/providers/BusinessNameProvider";
import { CustomerAuthProvider } from "@/components/auth/CustomerAuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import type { ReactNode } from "react";

export function AppProviders({
  children,
  businessName,
}: {
  children: ReactNode;
  businessName: string;
}) {
  return (
    <BusinessNameProvider businessName={businessName}>
      <CustomerAuthProvider>
        <CartProvider>{children}</CartProvider>
      </CustomerAuthProvider>
    </BusinessNameProvider>
  );
}
