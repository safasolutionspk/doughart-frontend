"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { DEFAULT_BUSINESS_NAME } from "@/lib/settings";

const BusinessNameContext = createContext<string>(DEFAULT_BUSINESS_NAME);

export function BusinessNameProvider({
  businessName,
  children,
}: {
  businessName: string;
  children: ReactNode;
}) {
  const value =
    businessName.trim().length > 0 ? businessName.trim() : DEFAULT_BUSINESS_NAME;

  return (
    <BusinessNameContext.Provider value={value}>
      {children}
    </BusinessNameContext.Provider>
  );
}

/** Client components: configured business name from layout settings fetch. */
export function useBusinessName(): string {
  return useContext(BusinessNameContext);
}
