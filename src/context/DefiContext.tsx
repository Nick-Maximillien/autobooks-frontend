// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";

// -------------------- Types --------------------
type AuthContextType = {
  user: string | null; // alias for principal
  principal: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// -------------------- Context --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------- Provider --------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const principalText = identity.getPrincipal().toText();
        setPrincipal(principalText);
        setIsAuthenticated(true);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider:
        process.env.NEXT_PUBLIC_II_CANISTER_URL ||
        "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principalText = identity.getPrincipal().toText();
        setPrincipal(principalText);
        setIsAuthenticated(true);
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setPrincipal(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: principal, // expose "user" alongside "principal"
        principal,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -------------------- Hook --------------------
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
