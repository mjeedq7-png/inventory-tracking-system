import { useState, useEffect, FormEvent } from 'react';
import Layout from '../../components/Layout';
import { useTranslations } from '../../hooks/useLanguage';
import { getDailyClosing, createDailyClosing } from '../../lib/api';
import type { DailyClosing } from '../../types';

export default function OutletDailyClosing() {
  const t = useTranslations();
  const [closings, setClosings] = useState<DailyClosing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cardSales: '',
    cashSales: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await getDailyClosing();
      if (response.success) {
        setClosings(response.data as DailyClosing[]);
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
      const response = await createDailyClosing({
        cardSales: parseFloat(formData.cardSales),
        cashSales: parseFloat(formData.cashSales),
        date: formData.date,
      });

      if (response.success) {
        setShowForm(false);
        setFormData({ cardSales: '', cashSales: '', date: new Date().toISOString().split('T')[0] });
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

  const netCash = formData.cashSales ? parseFloat(formData.cashSales) : 0;
  const totalSales = (parseFloat(formData.cardSales) || 0) + (parseFloat(formData.cashSales) || 0);

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t.pages.dailyClosing.title}</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? t.actions.cancel : t.pages.dailyClosing.submitClosing}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">{t.pages.dailyClosing.submitClosing}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.closing.cardSales}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cardSales}
                  onChange={(e) => setFormData({ ...formData, cardSales: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.closing.cashSales}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cashSales}
                  onChange={(e) => setFormData({ ...formData, cashSales: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">{t.pages.sales.totalSales}: <span className="font-bold">{totalSales.toFixed(2)}</span></p>
                <p className="text-sm text-gray-600">{t.closing.netCash}: <span className="font-bold">{netCash.toFixed(2)}</span></p>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? t.labels.loading : t.actions.submit}
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.labels.date}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.closing.cardSales}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.closing.cashSales}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.closing.netCash}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {closings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">{t.labels.noData}</td>
                  </tr>
                ) : (
                  closings.map((closing) => (
                    <tr key={closing.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(closing.date).toLocaleDateString('ar-SA')}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{closing.cardSales}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{closing.cashSales}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{closing.netCash}</td>
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
