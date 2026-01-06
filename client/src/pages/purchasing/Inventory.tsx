import { useState, useEffect, FormEvent } from 'react';
import Layout from '../../components/Layout';
import { getInventory, createInventory, getProducts, getOutlets } from '../../lib/api';
import type { Inventory, Product, Outlet } from '../../types';

export default function PurchasingInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    outletId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [inventoryResponse, productsResponse, outletsResponse] = await Promise.all([
        getInventory(),
        getProducts(),
        getOutlets(),
      ]);

      if (inventoryResponse.success) {
        setInventory(inventoryResponse.data as Inventory[]);
      }

      if (productsResponse.success) {
        setProducts(productsResponse.data as Product[]);
      }

      if (outletsResponse.success) {
        setOutlets(outletsResponse.data as Outlet[]);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await createInventory({
        productId: formData.productId,
        outletId: formData.outletId,
        quantity: parseFloat(formData.quantity),
        date: formData.date,
      });

      if (response.success) {
        setShowForm(false);
        setFormData({ productId: '', outletId: '', quantity: '', date: new Date().toISOString().split('T')[0] });
        fetchData();
      } else {
        setError(response.error || 'Failed to update inventory');
      }
    } catch {
      setError('Failed to update inventory');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Update Inventory'}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Update Inventory</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outlet</label>
                <select
                  value={formData.outletId}
                  onChange={(e) => setFormData({ ...formData, outletId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Outlet</option>
                  {outlets.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Outlet</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No inventory records</td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.outlet.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.quantity} {item.product.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString('ar-SA')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
