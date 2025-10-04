// app/defi/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "../../context/DefiContext";

// -------------------- Types --------------------
type DefiAction = "deposit" | "deposit_collateral" | "borrow" | "repay";

interface UserAccount {
  deposited: string;
  borrowed: string;
  collateral: string;
  credit_score: string;
  risk_advice?: string;
}

interface ApiResponse {
  success: boolean;
  advice?: string;
  balance?: number;
  account?: UserAccount;
}

// -------------------- DeFi Dashboard --------------------
export default function DeFiDashboard() {
  const { principal } = useAuth(); // from AuthContext
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<DefiAction>("deposit");
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [balance, setBalance] = useState(0);
  const [advice, setAdvice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!principal) return alert("You must be logged in first");

    try {
      const res = await fetch("/api/defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, user: principal, amount: Number(amount) }),
      });

      const data: ApiResponse = await res.json();
      setAccount(data.account ?? null);
      setBalance(data.balance ?? 0);
      setAdvice(data.advice ?? "");
    } catch (err) {
      console.error(err);
      alert("Error executing action");
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>DeFi Dashboard</h1>

      {!principal ? (
        <p>Please log in to access your dashboard.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as DefiAction)}
            style={{ marginRight: "0.5rem" }}
          >
            <option value="deposit">Deposit</option>
            <option value="deposit_collateral">Deposit Collateral</option>
            <option value="borrow">Borrow</option>
            <option value="repay">Repay</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      )}

      {account && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Account Info for {principal}</h2>
          <p>Deposited: {account.deposited}</p>
          <p>Borrowed: {account.borrowed}</p>
          <p>Collateral: {account.collateral}</p>
          <p>Credit Score: {account.credit_score}</p>
          <p>AI Advice: {advice || "No advice yet"}</p>
          <p>Balance: {balance}</p>
        </div>
      )}
    </div>
  );
}
