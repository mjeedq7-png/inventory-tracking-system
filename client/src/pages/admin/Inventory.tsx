import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getInventory } from '../../lib/api';
import type { Inventory } from '../../types';

export default function AdminInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getInventory();
        if (response.success) {
          setInventory(response.data as Inventory[]);
        } else {
          setError(response.error || 'Failed to load inventory');
        }
      } catch {
        setError('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-slate-500 mt-1">Manage your stock across all outlets</p>
        </div>
      </div>

      {loading && (
        <div className="card p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading inventory...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="card overflow-hidden">
          <table className="table-modern">
            <thead>
              <tr>
                <th className="text-start">Product</th>
                <th className="text-start">Outlet</th>
                <th className="text-start">Quantity</th>
                <th className="text-start">Date</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="empty-state-text">No inventory records found</p>
                      <p className="text-slate-400 text-sm mt-1">Start by adding purchases to your inventory</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">{item.product.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.product.name}</p>
                          <p className="text-xs text-slate-500">{item.product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{item.outlet.name}</span>
                    </td>
                    <td>
                      <span className="font-medium text-slate-800">{item.quantity}</span>
                      <span className="text-slate-500 ms-1">{item.product.unit}</span>
                    </td>
                    <td className="text-slate-500">
                      {new Date(item.date).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
