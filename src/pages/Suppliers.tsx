import React, { useEffect, useState } from 'react';
import { db } from '../services/mockBackend';
import type { Supplier, Quotation, Part } from '../services/mockBackend';

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedPart, setSelectedPart] = useState('');

  const loadData = () => {
    Promise.all([db.getSuppliers(), db.getQuotations(), db.getParts()]).then(([s, q, p]) => {
      setSuppliers(s);
      setQuotations(q);
      setParts(p);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !selectedPart) return;
    await db.requestQuotation(selectedSupplier, selectedPart);
    setSelectedSupplier('');
    setSelectedPart('');
    loadData();
  };

  const handleAcceptQuotation = async (qId: string) => {
    await db.acceptQuotation(qId);
    loadData();
  };

  if (loading) return <div className="animate-fade-in">Loading suppliers...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers & Quotations</h1>
          <p className="page-subtitle">Manage suppliers and raw material orders.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 className="mb-4">Request Quotation</h3>
            <form onSubmit={handleRequestQuotation}>
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <select 
                  className="form-input" 
                  value={selectedSupplier} 
                  onChange={e => setSelectedSupplier(e.target.value)}
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Part Needed</label>
                <select 
                  className="form-input" 
                  value={selectedPart} 
                  onChange={e => setSelectedPart(e.target.value)}
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">-- Select Raw Material --</option>
                  {parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-4">Send Request</button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 className="mb-4">Supplier Directory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {suppliers.map(s => (
                <div key={s.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{s.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>{s.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mb-6">Recent Quotations</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier</th>
                  <th>Part</th>
                  <th>Price (ea)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quotations.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted">No quotations yet.</td></tr>
                ) : quotations.map(q => {
                  const supplier = suppliers.find(s => s.id === q.supplierId)?.name || q.supplierId;
                  const part = parts.find(p => p.id === q.partId)?.name || q.partId;
                  return (
                    <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{supplier}</td>
                      <td>{part}</td>
                      <td>${q.price.toFixed(2)}</td>
                      <td>
                        {q.status === 'pending' && <span className="badge badge-warning">Pending</span>}
                        {q.status === 'accepted' && <span className="badge badge-success">Accepted</span>}
                        {q.status === 'rejected' && <span className="badge badge-danger">Rejected</span>}
                      </td>
                      <td>
                        {q.status === 'pending' && (
                          <button onClick={() => handleAcceptQuotation(q.id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            Accept & Buy
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
