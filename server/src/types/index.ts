import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  outletId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
