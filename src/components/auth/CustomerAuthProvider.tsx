"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CustomerProfile } from "@/lib/auth/customer/types";

type CustomerAuthContextValue = {
  customer: CustomerProfile | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

type CustomerAuthStoreState = {
  customer: CustomerProfile | null;
  hydrated: boolean;
};

const SERVER_AUTH_SNAPSHOT: CustomerAuthStoreState = {
  customer: null,
  hydrated: false,
};

let authState: CustomerAuthStoreState = {
  customer: null,
  hydrated: false,
};

const listeners = new Set<() => void>();
let authInitialized = false;

function notifyAuthStore() {
  for (const listener of listeners) {
    listener();
  }
}

function setAuthState(next: CustomerAuthStoreState) {
  authState = next;
  notifyAuthStore();
}

async function refreshCustomerSession() {
  try {
    const response = await fetch("/api/customers/me", { cache: "no-store" });
    const body = (await response.json()) as {
      success: boolean;
      customer?: CustomerProfile;
    };

    if (response.ok && body.success && body.customer) {
      setAuthState({ customer: body.customer, hydrated: true });
      return;
    }
  } catch {
    // Fall through to clear session state
  }

  setAuthState({ customer: null, hydrated: true });
}

async function logoutCustomerSession() {
  try {
    await fetch("/api/customers/logout", { method: "POST" });
  } catch {
    // Clear local state even if request fails
  }
  setAuthState({ customer: null, hydrated: true });
}

function subscribeAuthStore(listener: () => void) {
  listeners.add(listener);
  if (!authInitialized) {
    authInitialized = true;
    void refreshCustomerSession();
  }
  return () => {
    listeners.delete(listener);
  };
}

function getAuthSnapshot() {
  return authState;
}

function getAuthServerSnapshot(): CustomerAuthStoreState {
  return SERVER_AUTH_SNAPSHOT;
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const { customer, hydrated } = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );

  const refresh = useCallback(async () => {
    await refreshCustomerSession();
  }, []);

  const logout = useCallback(async () => {
    await logoutCustomerSession();
  }, []);

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      customer,
      hydrated,
      isAuthenticated: Boolean(customer),
      refresh,
      logout,
    }),
    [customer, hydrated, refresh, logout],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth(): CustomerAuthContextValue {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
}
