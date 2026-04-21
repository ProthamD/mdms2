import { useEffect, useState } from 'react';
import { db } from '../services/mockBackend';
import type { Transaction } from '../services/mockBackend';

export const Billing = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getTransactions().then(txs => {
      // Sort newest first
      setTransactions(txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-fade-in">Loading billing...</div>;

  const totalRevenue = transactions.filter(t => t.type === 'sell_products').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'buy_parts').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing & Transactions</h1>
          <p className="page-subtitle">Manage company financials and invoice history.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <h3 className="text-muted">Total Revenue</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--success)' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--danger)' }}>
          <h3 className="text-muted">Total Expenses</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--danger)' }}>${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', borderLeft: `4px solid ${totalRevenue - totalExpenses >= 0 ? 'var(--info)' : 'var(--danger)'}` }}>
          <h3 className="text-muted">Net Profit</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0, color: totalRevenue - totalExpenses >= 0 ? 'var(--info)' : 'var(--danger)' }}>
            ${(totalRevenue - totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 className="mb-6">Transaction History</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}</td>
                  <td>{t.id}</td>
                  <td>{t.description}</td>
                  <td>
                    {t.type === 'sell_products' ? (
                      <span className="badge badge-success">Income</span>
                    ) : (
                      <span className="badge badge-danger">Expense</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 'bold', color: t.type === 'sell_products' ? 'var(--success)' : 'var(--danger)' }}>
                    {t.type === 'sell_products' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
