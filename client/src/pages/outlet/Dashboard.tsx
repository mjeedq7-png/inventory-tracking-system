import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslations } from '../../hooks/useLanguage';
import Layout from '../../components/Layout';

export default function OutletDashboard() {
  const { user } = useAuth();
  const t = useTranslations();

  const quickActions = [
    { to: '/outlet/sales', label: t.pages.sales.recordSale, icon: '💰', color: 'from-emerald-500 to-teal-600', desc: t.pages.sales.subtitle },
    { to: '/outlet/waste', label: t.pages.waste.recordWaste, icon: '🗑️', color: 'from-red-500 to-rose-600', desc: t.pages.waste.subtitle },
    { to: '/outlet/closing', label: t.nav.dailyClosing, icon: '📋', color: 'from-blue-500 to-indigo-600', desc: t.pages.dailyClosing.subtitle },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          {t.pages.dashboard.welcome}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">
          {user?.outlet?.name ? `${user.outlet.name}` : t.nav.dashboard}
        </p>
      </div>

      {/* Outlet Info Card */}
      {user?.outlet && (
        <div className="card p-6 mb-8 bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span className="text-3xl">
                {user.outlet.type === 'CAFE' ? '☕' : user.outlet.type === 'RESTAURANT' ? '🍽️' : '🏪'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.outlet.name}</h2>
              <p className="text-indigo-200">{t.labels.outlet}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{t.pages.dashboard.quickActions}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Today's Summary Placeholder */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{t.labels.today}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50">
            <p className="text-sm text-emerald-600 font-medium">{t.nav.sales} {t.labels.today}</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">--</p>
          </div>
          <div className="p-4 rounded-xl bg-red-50">
            <p className="text-sm text-red-600 font-medium">{t.nav.waste} {t.labels.today}</p>
            <p className="text-2xl font-bold text-red-700 mt-1">--</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50">
            <p className="text-sm text-blue-600 font-medium">{t.nav.dailyClosing}</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">--</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
