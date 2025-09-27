"use client";

import { useEffect, useState } from "react";
import { getTokensFromLocalStorage, refreshAccessTokenIfNeeded } from "@utils/tokenUtils";

interface Account {
  code: string;
  name: string;
  balance: number;
}

interface Subgroup {
  accounts: Account[];
  subtotal: number;
}

interface PnLData {
  grouped: { INCOME: Record<string, Subgroup>; EXPENSE: Record<string, Subgroup> };
  totals: { INCOME: number; EXPENSE: number };
  net_profit: number;
}

interface CashFlowData {
  operating: number;
  investing: number;
  financing: number;
  net_change: number;
}

export default function PnLAndCashFlow() {
  const [pnl, setPnl] = useState<PnLData | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const { accessToken, refreshToken } = getTokensFromLocalStorage();
      if (!accessToken || !refreshToken) throw new Error("Missing token");
      const fresh = await refreshAccessTokenIfNeeded(accessToken, refreshToken);

      const [pnlRes, cashFlowRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pnl/`, {
          headers: { Authorization: `Bearer ${fresh}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cashflow/`, {
          headers: { Authorization: `Bearer ${fresh}` },
        }),
      ]);

      if (pnlRes.ok) setPnl(await pnlRes.json());
      if (cashFlowRes.ok) setCashFlow(await cashFlowRes.json());
    } catch (err) {
      console.error("Error fetching PnL or Cash Flow:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!pnl || !cashFlow) return <div>No data</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      {/* PnL Section */}
      <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1rem" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Profit & Loss</h2>
        <div>
          {Object.entries(pnl.grouped).map(([section, subgroups]) => (
            <div key={section}>
              <h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>{section}</h3>
              {Object.entries(subgroups).map(([sg, { accounts, subtotal }]) => (
                <div key={sg}>
                  <p style={{ fontWeight: "bold" }}>{sg}</p>
                  {accounts.map((acc) => (
                    <div key={acc.code} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{acc.name}</span>
                      <span>{Number(acc.balance).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <span>Subtotal</span>
                    <span>{Number(subtotal).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #ddd", marginTop: "1rem", paddingTop: "0.5rem", fontWeight: "bold" }}>
          Net Profit: {Number(pnl.net_profit).toFixed(2)}
        </div>
      </div>

      {/* Cash Flow Section */}
      <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1rem" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Cash Flow</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Operating Activities</span>
          <span>{Number(cashFlow.operating).toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Investing Activities</span>
          <span>{Number(cashFlow.investing).toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Financing Activities</span>
          <span>{Number(cashFlow.financing).toFixed(2)}</span>
        </div>
        <div style={{ borderTop: "1px solid #ddd", marginTop: "1rem", paddingTop: "0.5rem", fontWeight: "bold" }}>
          Net Change in Cash: {Number(cashFlow.net_change).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
