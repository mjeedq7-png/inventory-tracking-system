import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminInventory from './pages/admin/Inventory';
import AdminSales from './pages/admin/Sales';
import AdminPurchases from './pages/admin/Purchases';
import AdminWaste from './pages/admin/Waste';
import AdminReports from './pages/admin/Reports';
// Outlet pages
import OutletDashboard from './pages/outlet/Dashboard';
import OutletSales from './pages/outlet/Sales';
import OutletWaste from './pages/outlet/Waste';
import OutletDailyClosing from './pages/outlet/DailyClosing';
// Purchasing pages
import PurchasingDashboard from './pages/purchasing/Dashboard';
import PurchasingInventory from './pages/purchasing/Inventory';
import PurchasingPurchases from './pages/purchasing/Purchases';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AdminInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AdminSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/purchases"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AdminPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/waste"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AdminWaste />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Purchasing routes */}
        <Route
          path="/purchasing"
          element={
            <ProtectedRoute allowedRoles={['PURCHASING']}>
              <PurchasingDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasing/inventory"
          element={
            <ProtectedRoute allowedRoles={['PURCHASING']}>
              <PurchasingInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasing/purchases"
          element={
            <ProtectedRoute allowedRoles={['PURCHASING']}>
              <PurchasingPurchases />
            </ProtectedRoute>
          }
        />

        {/* Outlet routes */}
        <Route
          path="/outlet"
          element={
            <ProtectedRoute
              allowedRoles={['OUTLET_CAFE', 'OUTLET_RESTAURANT', 'OUTLET_MINI_MARKET']}
            >
              <OutletDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outlet/sales"
          element={
            <ProtectedRoute
              allowedRoles={['OUTLET_CAFE', 'OUTLET_RESTAURANT', 'OUTLET_MINI_MARKET']}
            >
              <OutletSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outlet/waste"
          element={
            <ProtectedRoute
              allowedRoles={['OUTLET_CAFE', 'OUTLET_RESTAURANT', 'OUTLET_MINI_MARKET']}
            >
              <OutletWaste />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outlet/closing"
          element={
            <ProtectedRoute
              allowedRoles={['OUTLET_CAFE', 'OUTLET_RESTAURANT', 'OUTLET_MINI_MARKET']}
            >
              <OutletDailyClosing />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
