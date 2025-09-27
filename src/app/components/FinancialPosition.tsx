'use client'
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

interface Period {
    start_date: string | null;
    end_date: string | null;
}

interface BalanceSheetData {
    grouped: {
        ASSET?: Record<string, Subgroup>;
        LIABILITY?: Record<string, Subgroup>;
        EQUITY?: Record<string, Subgroup>;
    };
    totals?: { ASSET?: number; LIABILITY?: number; EQUITY?: number };
    warning?: string;
    assets?: number;
    liabilities?: number;
    equity?: number;
    period_data?: Period;
}

export default function BalanceSheet() {
    const [data, setData] = useState<BalanceSheetData | null>(null);
    const [editing, setEditing] = useState<{ code: string; value: number; creditCode?: string; entryType?: "debit" | "credit"; } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            const { accessToken, refreshToken } = getTokensFromLocalStorage();
            if (!accessToken || !refreshToken) throw new Error("Missing token");

            const fresh = await refreshAccessTokenIfNeeded(accessToken, refreshToken);
            setToken(fresh);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/balance-sheet`, {
                headers: { Authorization: `Bearer ${fresh}` },
            });

            if (res.ok) {
                setData(await res.json());
            }
        } catch (err) {
            console.error("Error fetching balance sheet:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function saveAdjustment() {
        if (!editing || !editing.creditCode || !token) return;

        const isDebit = editing.entryType === "credit" ? false : true;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/manual-adjustment/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                debit_account: isDebit ? editing.code : editing.creditCode,
                credit_account: isDebit ? editing.creditCode : editing.code,
                amount: editing.value,
            }),
        });
        setEditing(null);
        fetchData();
    }

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data</div>;

    const renderSection = (section: string, subgroups: Record<string, Subgroup>) => (
        <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ textDecoration: "underline" }}>{section}</h3>
            {Object.entries(subgroups).map(([subgroup, { accounts, subtotal }]) => (
                <div key={subgroup} style={{ marginBottom: "0.5rem" }}>
                    <p style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>{subgroup}</p>
                    {accounts.map((acc) => (
                        <div key={acc.code} style={{ display: "flex", justifyContent: "space-between", marginLeft: "1rem" }}>
                            <span>{acc.name}</span>
                            {editing?.code === acc.code ? (
                                <div>
                                    <input
                                        type="number"
                                        value={editing.value}
                                        onChange={(e) =>
                                            setEditing((prev) => prev && { ...prev, value: parseFloat(e.target.value) })
                                        }
                                    />
                                    <select
                                        value={editing.entryType || "debit"}
                                        onChange={(e) =>
                                            setEditing((prev) => prev && { ...prev, entryType: e.target.value as "debit" | "credit" })
                                        }
                                    >
                                        <option value="debit">Debit</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                    <select
                                        value={editing.creditCode || ""}
                                        onChange={(e) =>
                                            setEditing((prev) => prev && { ...prev, creditCode: e.target.value })
                                        }
                                    >
                                        <option value="">Credit Account</option>
                                        {accounts.filter((a) => a.code !== acc.code).map((a) => (
                                            <option key={a.code} value={a.code}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button onClick={saveAdjustment}>Save</button>
                                </div>
                            ) : (
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setEditing({ code: acc.code, value: acc.balance, creditCode: "", entryType: "debit" })}
                                >
                                    {acc.balance.toFixed(2)}
                                </span>
                            )}
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "1rem", fontWeight: "bold" }}>
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>Balance Sheet</h2>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                Period: ({data.period_data?.start_date} – {data.period_data?.end_date})
            </div>

            {/* Two-column layout */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "3rem" }}>
                <div style={{ flex: 1 }}>
                    {data.grouped.ASSET && renderSection("Assets", data.grouped.ASSET)}
                    <p style={{ fontWeight: "bold", textAlign: "right", marginTop: "0.5rem" }}>
                        Total Assets: {data.assets?.toFixed(2)}
                    </p>
                </div>

                <div style={{ flex: 1 }}>
                    {data.grouped.LIABILITY && (
                        <>
                            {renderSection("Liabilities", data.grouped.LIABILITY)}
                            <p style={{ fontWeight: "bold", textAlign: "right", marginTop: "0.5rem" }}>
                                Total Liabilities: {data.liabilities?.toFixed(2)}
                            </p>
                        </>
                    )}
                    {data.grouped.EQUITY && (
                        <>
                            {renderSection("Equity", data.grouped.EQUITY)}
                            <p style={{ fontWeight: "bold", textAlign: "right", marginTop: "0.5rem" }}>
                                Total Equity: {data.equity?.toFixed(2)}
                            </p>
                        </>
                    )}
                    <p style={{ fontWeight: "bold", textAlign: "right", marginTop: "1rem", borderTop: "1px solid #ccc", paddingTop: "0.5rem" }}>
                        Total Liabilities + Equity: {(Number(data.liabilities || 0) + Number(data.equity || 0)).toFixed(2)}
                    </p>
                </div>
            </div>

            {data.warning && (
                <div style={{ marginTop: "1rem", padding: "0.5rem", borderTop: "1px solid #ccc", color: "darkred" }}>
                    <strong>Warning:</strong> {data.warning}
                </div>
            )}
        </div>
    );
}
