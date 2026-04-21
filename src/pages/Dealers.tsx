import { useEffect, useState } from 'react';
import { db } from '../services/mockBackend';
import type { Dealer, DealerRequest, Product } from '../services/mockBackend';

export const Dealers = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [requests, setRequests] = useState<DealerRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsgs, setErrorMsgs] = useState<Record<string, string>>({});

  const loadData = () => {
    Promise.all([db.getDealers(), db.getDealerRequests(), db.getProducts()]).then(([d, r, p]) => {
      setDealers(d);
      setRequests(r);
      setProducts(p);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFulfill = async (reqId: string) => {
    try {
      await db.fulfillDealerRequest(reqId);
      setErrorMsgs(prev => ({ ...prev, [reqId]: '' }));
      loadData();
    } catch (err: any) {
      setErrorMsgs(prev => ({ ...prev, [reqId]: err.message }));
    }
  };

  if (loading) return <div className="animate-fade-in">Loading dealers...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dealers & Requests</h1>
          <p className="page-subtitle">Manage product orders from dealers.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="mb-6">Dealer Requests</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Dealer</th>
                <th>Product Requested</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const dealer = dealers.find(d => d.id === r.dealerId)?.name || r.dealerId;
                const product = products.find(p => p.id === r.productId)?.name || r.productId;
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{dealer}</td>
                    <td>{product}</td>
                    <td>{r.quantity}</td>
                    <td>
                      {r.status === 'pending' ? (
                        <span className="badge badge-warning">Pending</span>
                      ) : (
                        <span className="badge badge-success">Fulfilled</span>
                      )}
                    </td>
                    <td>
                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button onClick={() => handleFulfill(r.id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            Fulfill Request
                          </button>
                          {errorMsgs[r.id] && <span className="text-danger" style={{ fontSize: '0.75rem' }}>{errorMsgs[r.id]}</span>}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 className="mb-4">Registered Dealers</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {dealers.map(d => (
            <div key={d.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', minWidth: '200px', flex: '1 1 200px' }}>
              <h4 style={{ margin: 0 }}>{d.name}</h4>
              <p className="text-muted" style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>ID: {d.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
