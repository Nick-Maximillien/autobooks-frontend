"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthClient } from "@dfinity/auth-client";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    if (!username) return alert("Enter a username");

    setLoading(true);
    const authClient = await AuthClient.create();

    await authClient.login({
      identityProvider: "https://identity.ic0.app", // Internet Identity
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();

        const res = await fetch("/api/defi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "signup",
            username,
            principal,
          }),
        });

        const data = await res.json();
        if (data.success) {
          router.push("/defi/dashboard"); // ✅ Go straight to dashboard
        } else if (data.reason === "already_exists") {
          router.push("/login"); // ✅ Redirect to login if already signed up
        } else {
          alert("Signup failed");
        }
        setLoading(false);
      },
    });
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
