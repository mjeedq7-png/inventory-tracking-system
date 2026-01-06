import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState } from '../types';
import { login as apiLogin } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return {
      token: user ? token : null,
      user,
      isAuthenticated: !!token && !!user,
    };
  });

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    if (!response.success) {
      throw new Error(response.error || 'Login failed');
    }
    const { token, user } = response.data as { token: string; user: User };
    setState({ token, user, isAuthenticated: true });
  };

  const logout = () => {
    setState({ token: null, user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
