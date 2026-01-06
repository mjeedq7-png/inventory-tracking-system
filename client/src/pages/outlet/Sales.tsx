import { useState, useEffect, FormEvent } from 'react';
import Layout from '../../components/Layout';
import { useTranslations } from '../../hooks/useLanguage';
import { getSales, createSale, getProducts } from '../../lib/api';
import type { Sale, Product } from '../../types';

export default function OutletSales() {
  const t = useTranslations();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [salesResponse, productsResponse] = await Promise.all([
        getSales(),
        getProducts(),
      ]);

      if (salesResponse.success) {
        setSales(salesResponse.data as Sale[]);
      }

      if (productsResponse.success) {
        setProducts(productsResponse.data as Product[]);
      }
    } catch {
      setError(t.messages.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await createSale({
        productId: formData.productId,
        quantity: parseFloat(formData.quantity),
        date: formData.date,
      });

      if (response.success) {
        setShowForm(false);
        setFormData({ productId: '', quantity: '', date: new Date().toISOString().split('T')[0] });
        fetchData();
      } else {
        setError(response.error || t.messages.error);
      }
    } catch {
      setError(t.messages.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t.pages.sales.title}</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? t.actions.cancel : t.pages.sales.recordSale}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">{t.pages.sales.recordSale}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.labels.product}</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">{t.pages.sales.selectProduct}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.labels.quantity}</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.labels.date}</label>
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
                  {submitting ? t.labels.loading : t.actions.save}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <p className="text-gray-500">{t.labels.loading}</p>}

        {!loading && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.labels.product}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.labels.quantity}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.labels.date}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">{t.labels.noData}</td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{sale.quantity} {sale.product.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(sale.date).toLocaleDateString('ar-SA')}</td>
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
