export type UserRole =
  | 'OWNER'
  | 'PURCHASING'
  | 'OUTLET_CAFE'
  | 'OUTLET_RESTAURANT'
  | 'OUTLET_MINI_MARKET';

export type OutletType = 'CAFE' | 'RESTAURANT' | 'MINI_MARKET';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  outlet?: Outlet;
}

export interface Outlet {
  id: string;
  name: string;
  type: OutletType;
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  category: string;
  isFixed: boolean;
}

export interface Inventory {
  id: string;
  product: Product;
  outlet: Outlet;
  quantity: number;
  date: string;
}

export interface Purchase {
  id: string;
  product: Product;
  quantity: number;
  date: string;
  enteredBy: Pick<User, 'id' | 'name' | 'email'>;
}

export interface Sale {
  id: string;
  outlet: Outlet;
  product: Product;
  quantity: number;
  date: string;
}

export interface Waste {
  id: string;
  outlet: Outlet;
  product: Product;
  quantity: number;
  imageUrl?: string;
  reason?: string;
  date: string;
}

export interface DailyClosing {
  id: string;
  outlet: Outlet;
  cardSales: number;
  cashSales: number;
  netCash: number;
  date: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
