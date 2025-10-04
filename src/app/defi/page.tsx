"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/DefiContext";
import Link from "next/link";

// -------------------- Types --------------------
type DefiAction =
  | "deposit"
  | "deposit_collateral"
  | "withdraw_collateral"
  | "borrow"
  | "repay"
  | "signup"
  | "get_user_account"
  | "get_total_supply";

interface UserAccount {
  deposited: number;
  borrowed: number;
  collateral: number;
  credit_score: number;
  risk_advice?: string;
  username?: string;
}

interface ApiResponse {
  success: boolean;
  username?: string;
  advice?: string;
  balance?: number;
  account?: any;
  totalSupply?: number;
  balances?: { user: string; balance: number }[];
}

// -------------------- Helper --------------------
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

// -------------------- Dashboard --------------------
export default function DeFiDashboard() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [action, setAction] = useState<DefiAction>("deposit");
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [advice, setAdvice] = useState<string>("");
  const [username, setUsername] = useState<string>(user ?? "");
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [allBalances, setAllBalances] = useState<{ user: string; balance: number }[]>([]);

  // Refs to detect changes
  const prevDepositedRef = useRef<number>(0);
  const prevBorrowedRef = useRef<number>(0);
  const prevCollateralRef = useRef<number>(0);
  const prevBalanceRef = useRef<number>(balance);
  const prevAdviceRef = useRef<string>(advice);

  const [depositedChanged, setDepositedChanged] = useState(false);
  const [borrowedChanged, setBorrowedChanged] = useState(false);
  const [collateralChanged, setCollateralChanged] = useState(false);
  const [balanceChanged, setBalanceChanged] = useState(false);
  const [adviceChanged, setAdviceChanged] = useState(false);

  async function fetchDashboard() {
    if (!user) return;

    try {
      // Fetch user account
      const resAccount = await fetch("/api/defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_user_account", user }),
      });
      let accountData: ApiResponse = parseBigIntFields(await resAccount.json());

      const acct = accountData.account ?? null;

      // Highlight changes
      if (acct) {
        if (prevDepositedRef.current !== acct.deposited) {
          setDepositedChanged(true);
          setTimeout(() => setDepositedChanged(false), 1000);
        }
        prevDepositedRef.current = acct.deposited;

        if (prevBorrowedRef.current !== acct.borrowed) {
          setBorrowedChanged(true);
          setTimeout(() => setBorrowedChanged(false), 1000);
        }
        prevBorrowedRef.current = acct.borrowed;

        if (prevCollateralRef.current !== acct.collateral) {
          setCollateralChanged(true);
          setTimeout(() => setCollateralChanged(false), 1000);
        }
        prevCollateralRef.current = acct.collateral;
      }

      if (prevBalanceRef.current !== (accountData.balance ?? 0)) {
        setBalanceChanged(true);
        setTimeout(() => setBalanceChanged(false), 1000);
      }
      prevBalanceRef.current = accountData.balance ?? 0;

      if (prevAdviceRef.current !== (accountData.advice ?? "")) {
        setAdviceChanged(true);
        setTimeout(() => setAdviceChanged(false), 1000);
      }
      prevAdviceRef.current = accountData.advice ?? "";

      setAccount(acct);
      setBalance(accountData.balance ?? 0);
      setAdvice(accountData.advice ?? "");
      setUsername(accountData.username ?? user);

      // Fetch total supply & all balances
      const resSupply = await fetch("/api/defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_total_supply" }),
      });
      let supplyData: ApiResponse = parseBigIntFields(await resSupply.json());
      setTotalSupply(supplyData.totalSupply ?? 0);
      setAllBalances(supplyData.balances ?? []);
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return alert("You must be logged in");

    try {
      const res = await fetch("/api/defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          user,
          username,
          amount: amount ? Number(amount) : undefined,
        }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      let data: ApiResponse = parseBigIntFields(await res.json());

      setAccount(data.account ?? null);
      setBalance(data.balance ?? 0);
      setAdvice(data.advice ?? "");
      setUsername(data.username ?? user);

      // Refresh total supply & all balances for state-changing actions
      if (["deposit", "deposit_collateral", "withdraw_collateral", "borrow", "repay"].includes(action)) {
        if (data.totalSupply !== undefined) setTotalSupply(data.totalSupply);
        if (data.balances) setAllBalances(data.balances);
      }
    } catch (err) {
      console.error(err);
      alert("Error executing action");
    }
  }

  console.log("Data:", { account, balance, advice, totalSupply, allBalances });

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "white", backgroundColor: "#121212" }}>
      <h1>DeFi Dashboard</h1>

      {!user ? (
        <p><Link href="/defi_login">Please login to continue.</Link></p>
      ) : (
        <>
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
              <option value="withdraw_collateral">Withdraw Collateral</option>
              <option value="borrow">Borrow</option>
              <option value="repay">Repay</option>
              <option value="signup">Signup</option>
            </select>
            <button type="submit">Submit</button>
          </form>

          <button onClick={fetchDashboard} style={{ marginBottom: "1rem" }}>
            Refresh Dashboard
          </button>

          {account && (
            <div style={{ marginTop: "1rem" }}>
              <h2>Account Info for {username}</h2>
              <p
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor: depositedChanged ? "yellow" : "transparent",
                }}
              >
                Deposited: {account.deposited}
              </p>
              <p
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor: borrowedChanged ? "orange" : "transparent",
                }}
              >
                Borrowed: {account.borrowed}
              </p>
              <p
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor: collateralChanged ? "lightblue" : "transparent",
                }}
              >
                Collateral: {account.collateral}
              </p>
              <p
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor: balanceChanged ? "lime" : "transparent",
                }}
              >
                Balance: {balance}
              </p>
              <p>Credit Score: {account.credit_score}</p>
              <p
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor: adviceChanged ? "lightgreen" : "transparent",
                }}
              >
                AI Advice: {advice || "No advice yet"}
              </p>
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <h2>Total Stablecoin Supply: {totalSupply}</h2>
            <h3>All User Balances:</h3>
            <ul>
              {allBalances.map((b) => (
                <li key={b.user}>
                  {b.user}: {b.balance}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
