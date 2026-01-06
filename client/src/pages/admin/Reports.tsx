import { useState } from 'react';
import Layout from '../../components/Layout';
import { getInventoryReport, getSalesReport, getDailySummaryReport } from '../../lib/api';

interface InventoryReportItem {
  product: { id: string; name: string; unit: string };
  purchased: number;
  sold: number;
  wasted: number;
  remaining: number;
}

export default function AdminReports() {
  const [reportType, setReportType] = useState<'inventory' | 'sales' | 'daily'>('inventory');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState<InventoryReportItem[] | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    setReportData(null);

    try {
      let response;
      if (reportType === 'inventory') {
        response = await getInventoryReport({ startDate, endDate });
      } else if (reportType === 'sales') {
        if (!startDate || !endDate) {
          setError('Please select start and end dates');
          setLoading(false);
          return;
        }
        response = await getSalesReport({ startDate, endDate });
      } else {
        if (!startDate || !endDate) {
          setError('Please select start and end dates');
          setLoading(false);
          return;
        }
        response = await getDailySummaryReport({ startDate, endDate });
      }

      if (response.success) {
        setReportData(response.data as InventoryReportItem[]);
      } else {
        setError(response.error || 'Failed to load report');
      }
    } catch {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'inventory' | 'sales' | 'daily')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="inventory">Inventory Report</option>
                <option value="sales">Sales Report</option>
                <option value="daily">Daily Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {reportData && reportType === 'inventory' && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Purchased
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Wasted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(reportData as InventoryReportItem[]).map((item) => (
                  <tr key={item.product.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.purchased} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.sold} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.wasted} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.remaining} {item.product.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
