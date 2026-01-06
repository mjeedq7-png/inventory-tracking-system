import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';

export default function PurchasingDashboard() {
  const { user } = useAuth();

  const quickActions = [
    { to: '/purchasing/inventory', label: 'Manage Inventory', icon: '📦', color: 'from-blue-500 to-indigo-600', desc: 'Update stock levels' },
    { to: '/purchasing/purchases', label: 'Record Purchase', icon: '🛒', color: 'from-emerald-500 to-teal-600', desc: 'Add new purchases' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">Purchasing Department Dashboard</p>
      </div>

      {/* Role Info Card */}
      <div className="card p-6 mb-8 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🛒</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Purchasing Team</h2>
            <p className="text-emerald-100">Warehouse & Inventory Management</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{action.icon}</span>
                <h3 className="font-semibold text-slate-800 group-hover:text-white transition-colors text-lg">
                  {action.label}
                </h3>
                <p className="text-slate-500 group-hover:text-white/80 transition-colors text-sm mt-1">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Inventory Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50">
            <p className="text-sm text-blue-600 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">--</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50">
            <p className="text-sm text-amber-600 font-medium">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">--</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50">
            <p className="text-sm text-emerald-600 font-medium">Recent Purchases</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">--</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
