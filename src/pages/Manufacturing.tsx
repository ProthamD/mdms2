import { useEffect, useState } from 'react';
import { db } from '../services/mockBackend';
import type { Product } from '../services/mockBackend';
import { Settings, CheckCircle, XCircle } from 'lucide-react';

export const Manufacturing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feasibility, setFeasibility] = useState<{ feasible: boolean, reasoning: string[] } | null>(null);
  const [checking, setChecking] = useState(false);
  const [manufacturing, setManufacturing] = useState(false);
  const [msg, setMsg] = useState('');

  const loadProducts = () => {
    db.getProducts().then(p => {
      setProducts(p);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCheck = async () => {
    if (!selectedProduct || quantity < 1) return;
    setChecking(true);
    setMsg('');
    const res = await db.checkManufacturingFeasibility(selectedProduct, quantity);
    setFeasibility(res);
    setChecking(false);
  };

  const handleManufacture = async () => {
    if (!selectedProduct || quantity < 1) return;
    setManufacturing(true);
    try {
      await db.manufactureProduct(selectedProduct, quantity);
      setMsg(`Successfully manufactured ${quantity} units!`);
      setFeasibility(null);
      loadProducts();
    } catch (err: any) {
      setMsg(err.message);
    }
    setManufacturing(false);
  };

  if (loading) return <div className="animate-fade-in">Loading manufacturing module...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Intelligent Manufacturing</h1>
          <p className="page-subtitle">AI-assisted decision making for production.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mb-4 flex items-center gap-2"><Settings size={20} /> Production Setup</h3>
          
          <div className="form-group">
            <label className="form-label">Select Product to Manufacture</label>
            <select 
              className="form-input" 
              value={selectedProduct} 
              onChange={e => { setSelectedProduct(e.target.value); setFeasibility(null); setMsg(''); }}
              style={{ backgroundImage: 'none' }}
            >
              <option value="">-- Select Product --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current Stock: {p.stock})</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input 
              type="number" 
              className="form-input" 
              min={1} 
              value={quantity} 
              onChange={e => { setQuantity(parseInt(e.target.value) || 1); setFeasibility(null); setMsg(''); }} 
            />
          </div>

          <button 
            onClick={handleCheck} 
            className="btn btn-secondary w-full"
            disabled={!selectedProduct || checking}
          >
            {checking ? 'Analyzing...' : 'Check Feasibility & Intelligence Logic'}
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mb-4">Intelligent Analysis</h3>
          
          {!feasibility && !msg && <p className="text-muted">Select a product and quantity to analyze production feasibility based on current raw material stock.</p>}
          
          {msg && (
            <div style={{ padding: '1rem', background: msg.includes('Success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: msg.includes('Success') ? 'var(--success)' : 'var(--danger)', marginBottom: '1rem' }}>
              {msg}
            </div>
          )}

          {feasibility && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: feasibility.feasible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                {feasibility.feasible ? <CheckCircle color="var(--success)" /> : <XCircle color="var(--danger)" />}
                <strong style={{ color: feasibility.feasible ? 'var(--success)' : 'var(--danger)' }}>
                  {feasibility.feasible ? 'Production Feasible' : 'Production Blocked'}
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {feasibility.reasoning.map((reason, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.875rem' }}>
                    {reason}
                  </div>
                ))}
              </div>

              {feasibility.feasible && (
                <button 
                  onClick={handleManufacture} 
                  className="btn btn-primary w-full"
                  disabled={manufacturing}
                >
                  {manufacturing ? 'Manufacturing...' : 'Start Manufacturing Process'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
