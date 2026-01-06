import axios from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors (skip for login endpoint)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  try {
    const response = await api.post<ApiResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function getInventory(params?: { outletId?: string; date?: string }) {
  const response = await api.get<ApiResponse>('/inventory', { params });
  return response.data;
}

export async function getProducts() {
  const response = await api.get<ApiResponse>('/products');
  return response.data;
}

export async function getOutlets() {
  const response = await api.get<ApiResponse>('/outlets');
  return response.data;
}

export async function createInventory(data: {
  productId: string;
  outletId: string;
  quantity: number;
  date: string;
}) {
  const response = await api.post<ApiResponse>('/inventory', data);
  return response.data;
}

export async function getSales(params?: {
  outletId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const response = await api.get<ApiResponse>('/sales', { params });
  return response.data;
}

export async function createSale(data: {
  productId: string;
  outletId?: string;
  quantity: number;
  date: string;
}) {
  const response = await api.post<ApiResponse>('/sales', data);
  return response.data;
}

export async function getPurchases(params?: {
  productId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const response = await api.get<ApiResponse>('/purchases', { params });
  return response.data;
}

export async function createPurchase(data: {
  productId: string;
  quantity: number;
  date: string;
}) {
  const response = await api.post<ApiResponse>('/purchases', data);
  return response.data;
}

export async function getWaste(params?: {
  outletId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const response = await api.get<ApiResponse>('/waste', { params });
  return response.data;
}

export async function createWaste(data: FormData) {
  const response = await api.post<ApiResponse>('/waste', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getDailyClosing(params?: {
  outletId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const response = await api.get<ApiResponse>('/daily-closing', { params });
  return response.data;
}

export async function createDailyClosing(data: {
  outletId?: string;
  cardSales: number;
  cashSales: number;
  date: string;
}) {
  const response = await api.post<ApiResponse>('/daily-closing', data);
  return response.data;
}

export async function getInventoryReport(params?: {
  outletId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const response = await api.get<ApiResponse>('/reports/inventory', { params });
  return response.data;
}

export async function getSalesReport(params: {
  outletId?: string;
  startDate: string;
  endDate: string;
}) {
  const response = await api.get<ApiResponse>('/reports/sales', { params });
  return response.data;
}

export async function getDailySummaryReport(params: {
  startDate: string;
  endDate: string;
}) {
  const response = await api.get<ApiResponse>('/reports/daily-summary', { params });
  return response.data;
}

export async function getDashboardStats() {
  const response = await api.get<ApiResponse>('/reports/dashboard-stats');
  return response.data;
}

export default api;
