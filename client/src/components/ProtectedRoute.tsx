import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'OWNER') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'PURCHASING') {
      return <Navigate to="/purchasing" replace />;
    } else {
      return <Navigate to="/outlet" replace />;
    }
  }

  return <>{children}</>;
}
