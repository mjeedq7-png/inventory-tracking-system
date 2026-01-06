import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import { getInventoryReport, getDashboardStats } from '../../lib/api';

interface ReportItem {
  product: { id: string; name: string; unit: string };
  purchased: number;
  sold: number;
  wasted: number;
  remaining: number;
}

interface DashboardStats {
  today: { cardSales: number; cashSales: number; totalSales: number };
  monthly: { cardSales: number; cashSales: number; totalSales: number };
  outletBreakdown: Record<string, { cardSales: number; cashSales: number; totalSales: number; type: string }>;
  outletCount: number;
  month: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, lowStock: 0, totalSold: 0, totalWasted: 0 });
  const [salesStats, setSalesStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [inventoryResponse, dashboardResponse] = await Promise.all([
          getInventoryReport(),
          getDashboardStats(),
        ]);

        if (inventoryResponse.success) {
          const data = inventoryResponse.data as ReportItem[];
          setStats({
            products: data.length,
            lowStock: data.filter(item => item.remaining < 10).length,
            totalSold: data.reduce((sum, item) => sum + item.sold, 0),
            totalWasted: data.reduce((sum, item) => sum + item.wasted, 0),
          });
        }

        if (dashboardResponse.success) {
          setSalesStats(dashboardResponse.data as DashboardStats);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
  };

  const quickActions = [
    { to: '/admin/inventory', label: 'View Inventory', icon: '📦', color: 'from-blue-500 to-indigo-600' },
    { to: '/admin/sales', label: 'Track Sales', icon: '💰', color: 'from-emerald-500 to-teal-600' },
    { to: '/admin/purchases', label: 'Purchases', icon: '🛒', color: 'from-amber-500 to-orange-600' },
    { to: '/admin/reports', label: 'View Reports', icon: '📊', color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your inventory today.</p>
      </div>

      {/* Sales KPI Section */}
      {salesStats && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Sales Overview - {salesStats.month}</h2>

          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Sales Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">Total Sales</p>
                    <p className="text-xs text-indigo-300">This Month</p>
                  </div>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(salesStats.monthly.totalSales)}</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-indigo-200">Today: <span className="font-semibold text-white">{formatCurrency(salesStats.today.totalSales)}</span></p>
                </div>
              </div>
            </div>

            {/* Card Sales */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Card Sales</p>
                    <p className="text-xs text-blue-200">This Month</p>
                  </div>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(salesStats.monthly.cardSales)}</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-blue-200">Today: <span className="font-semibold text-white">{formatCurrency(salesStats.today.cardSales)}</span></p>
                </div>
              </div>
            </div>

            {/* Cash Sales */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Cash Sales</p>
                    <p className="text-xs text-emerald-200">This Month</p>
                  </div>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(salesStats.monthly.cashSales)}</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-emerald-200">Today: <span className="font-semibold text-white">{formatCurrency(salesStats.today.cashSales)}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Outlet Breakdown */}
          {Object.keys(salesStats.outletBreakdown).length > 0 && (
            <div className="card p-6">
              <h3 className="text-md font-semibold text-slate-800 mb-4">Sales by Outlet</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(salesStats.outletBreakdown).map(([name, data]) => (
                  <div key={name} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-xl">
                          {data.type === 'CAFE' ? '☕' : data.type === 'RESTAURANT' ? '🍽️' : '🏪'}
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-800">{name}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Sales</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(data.totalSales)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Card</span>
                        <span className="text-blue-600">{formatCurrency(data.cardSales)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Cash</span>
                        <span className="text-emerald-600">{formatCurrency(data.cashSales)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? '...' : stats.products}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">Active items</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock Alert</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? '...' : stats.lowStock}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-amber-600 font-medium">Items need restock</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sold</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? '...' : stats.totalSold.toFixed(0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">Units sold</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Waste</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? '...' : stats.totalWasted.toFixed(0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🗑️</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">Units wasted</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <span className="text-3xl mb-3 block">{action.icon}</span>
                <h3 className="font-semibold text-slate-800 group-hover:text-white transition-colors">
                  {action.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Outlets Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Outlets Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'University Cafe', type: 'CAFE', icon: '☕' },
            { name: 'University Restaurant', type: 'RESTAURANT', icon: '🍽️' },
            { name: 'Mini Market', type: 'MINI_MARKET', icon: '🏪' },
          ].map((outlet) => (
            <div key={outlet.type} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">{outlet.icon}</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{outlet.name}</h3>
                <p className="text-sm text-slate-500">Active</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
