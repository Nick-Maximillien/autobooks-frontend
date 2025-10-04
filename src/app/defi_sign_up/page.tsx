"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthClient } from "@dfinity/auth-client";

// Helper to parse BigInt strings into numbers
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

export default function Signup() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const identityProvider =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_IDENTITY_PROVIDER_PROD
      : process.env.NEXT_PUBLIC_IDENTITY_PROVIDER_DEV;

  async function handleSignup() {
    if (!username) return alert("Enter a username");
    if (!identityProvider) return alert("Identity provider not configured");

    setLoading(true);

    try {
      const authClient = await AuthClient.create();

      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toText();

          let data;
          try {
            const res = await fetch("/api/defi", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "signup",
                user: principal,
                username,
              }),
            });

            data = parseBigIntFields(await res.json());
          } catch (networkErr) {
            console.error("Network error during signup:", networkErr);
            alert("Network error. Please try again.");
            setLoading(false);
            return;
          }

          if (data.success) {
            router.push("/defi"); // Go straight to dashboard
          } else if (data.reason === "already_exists") {
            router.push("/defi_login"); // Redirect to login if already signed up
          } else if (data.error) {
            console.error("Signup error:", data.error);
            alert(`Signup error: ${data.error}`);
          } else {
            alert("Signup failed. Please try again.");
          }

          setLoading(false);
        },
      });
    } catch (err) {
      console.error("AuthClient error:", err);
      alert("Failed to initialize authentication. Try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  );
}
