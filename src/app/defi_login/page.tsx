"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthClient } from "@dfinity/auth-client";

// Same helper for parsing BigInt strings
function parseBigIntFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string" && /^\d+$/.test(obj)) return Number(obj);
  if (Array.isArray(obj)) return obj.map(parseBigIntFields);
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, parseBigIntFields(v)])
    );
  }
  return obj;
}

export default function Login() {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const identityProvider =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_IDENTITY_PROVIDER_PROD
      : process.env.NEXT_PUBLIC_IDENTITY_PROVIDER_DEV;

  async function handleLogin() {
    if (!identityProvider) {
      alert("Identity provider not configured");
      return;
    }

    setLoading(true);

    try {
      const authClient = await AuthClient.create();

      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const p = identity.getPrincipal().toText();
          setPrincipal(p);

          let data;
          try {
            const res = await fetch("/api/defi", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "get_user_account",
                user: p,
              }),
            });

            data = parseBigIntFields(await res.json());
          } catch (networkErr) {
            console.error("Network error during login:", networkErr);
            alert("Network error. Please try again.");
            setLoading(false);
            return;
          }

          if (data.success && data.account) {
            setAccount(data.account);
            router.push("/defi"); // Redirect if account exists
          } else if (data.success && !data.account) {
            router.push("/defi_sign_up"); // Redirect if account does not exist
          } else if (data.error) {
            console.error("Login error:", data.error);
            alert(`Login failed: ${data.error}`);
          } else {
            alert("Login failed. Please try again.");
          }

          setLoading(false);
        },
      });
    } catch (err) {
      console.error("AuthClient initialization error:", err);
      alert("Failed to initialize authentication. Try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Login</h2>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login with Internet Identity"}
      </button>

      {principal && <p>Principal: {principal}</p>}
    </div>
  );
}
