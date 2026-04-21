import { useEffect, useState } from 'react';
import { db } from '../services/mockBackend';
import type { Part, Product } from '../services/mockBackend';

export const Inventory = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([db.getParts(), db.getProducts()]).then(([p, pr]) => {
      setParts(p);
      setProducts(pr);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-fade-in">Loading inventory...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Track raw materials and finished products.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div className="glass-panel" style={{ flex: '1 1 500px', padding: '1.5rem' }}>
          <div className="flex justify-between items-center mb-6">
            <h3>Raw Materials (Parts)</h3>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Part ID</th>
                  <th>Name</th>
                  <th>Stock Levels</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {parts.map(part => (
                  <tr key={part.id}>
                    <td>{part.id}</td>
                    <td>{part.name}</td>
                    <td>{part.stock}</td>
                    <td>
                      {part.stock < 20 ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Optimal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel" style={{ flex: '1 1 500px', padding: '1.5rem' }}>
          <div className="flex justify-between items-center mb-6">
            <h3>Finished Goods (Products)</h3>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Prod ID</th>
                  <th>Name</th>
                  <th>Stock Levels</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.name}</td>
                    <td>{prod.stock}</td>
                    <td>${prod.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
