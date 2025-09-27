'use client'

import { useEffect, useState } from 'react';
import { getTokensFromLocalStorage, refreshAccessTokenIfNeeded } from '../../utils/tokenUtils';

export default function BSPL() {
    const [balanceSheet, setBalanceSheet] = useState<any | null>(null);
    const [pnl, setPnL] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchAccounting = async () => {
            try {
                const { accessToken, refreshToken } = getTokensFromLocalStorage();
                if (!accessToken || !refreshToken) throw new Error('Missing tokens');

                const validToken = await refreshAccessTokenIfNeeded(accessToken, refreshToken);
                const [bsRes, pnlRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/balance-sheet/`, {
                        headers: { Authorization: `Bearer ${validToken}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profit-loss/`, {
                        headers: { Authorization: `Bearer ${validToken}` },
                    }),
                ]);

                if (!bsRes.ok || !pnlRes.ok) throw new Error('Failed to fetch accounting data');

                setBalanceSheet(await bsRes.json());
                setPnL(await pnlRes.json());
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false)
            }
        };

        fetchAccounting();
    }, []);

    if (loading) return <div>Loading accounting data...</div>;
    if (error) return <div className='errorText'>{error}</div>;
    if (!balanceSheet || !pnl) return <div>No accounting data available</div>;

    return (
        <div className='accountingCard'>
            <h2>Balance Sheet</h2>
            <p><strong>Assets:</strong>{balanceSheet.assets}</p>
            <p><strong>Liabilities:</strong>{balanceSheet.liabilities}</p>
            <p><strong>Equity:</strong>{balanceSheet.equity}</p>


            <h2>Profit and Loss</h2>
            <p><strong>Revenue:</strong>{pnl.revenue}</p>
            <p><strong>Expenses:</strong>{pnl.expenses}</p>
            <p><strong>Net Profit:</strong>{pnl.net_profit}</p>
        </div>
    );
}