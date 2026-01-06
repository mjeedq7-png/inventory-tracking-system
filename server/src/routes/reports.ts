import { Router, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { UserRole } from '@prisma/client';
import prisma from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

// Inventory report - calculates remaining stock using formula: Remaining = Purchases - Sales - Waste
router.get(
  '/inventory',
  authenticate,
  [
    query('outletId').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { outletId, startDate, endDate } = req.query;
      const user = req.user!;

      const effectiveOutletId =
        user.role === UserRole.OWNER ? (outletId as string) : user.outletId;

      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.gte = new Date(startDate as string);
      if (endDate) dateFilter.lte = new Date(endDate as string);

      const products = await prisma.product.findMany();

      const report = await Promise.all(
        products.map(async (product) => {
          const purchaseWhere: Record<string, unknown> = { productId: product.id };
          const saleWhere: Record<string, unknown> = { productId: product.id };
          const wasteWhere: Record<string, unknown> = { productId: product.id };

          if (Object.keys(dateFilter).length > 0) {
            purchaseWhere.date = dateFilter;
            saleWhere.date = dateFilter;
            wasteWhere.date = dateFilter;
          }
          if (effectiveOutletId) {
            saleWhere.outletId = effectiveOutletId;
            wasteWhere.outletId = effectiveOutletId;
          }

          const [purchases, sales, waste] = await Promise.all([
            prisma.purchase.aggregate({
              where: purchaseWhere,
              _sum: { quantity: true },
            }),
            prisma.sale.aggregate({
              where: saleWhere,
              _sum: { quantity: true },
            }),
            prisma.waste.aggregate({
              where: wasteWhere,
              _sum: { quantity: true },
            }),
          ]);

          const purchasedQty = purchases._sum.quantity?.toNumber() || 0;
          const soldQty = sales._sum.quantity?.toNumber() || 0;
          const wastedQty = waste._sum.quantity?.toNumber() || 0;
          const remaining = purchasedQty - soldQty - wastedQty;

          return {
            product,
            purchased: purchasedQty,
            sold: soldQty,
            wasted: wastedQty,
            remaining,
          };
        })
      );

      res.json({ success: true, data: report });
    } catch (error) {
      console.error('Inventory report error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Sales report
router.get(
  '/sales',
  authenticate,
  [
    query('outletId').optional().isString(),
    query('startDate').isISO8601().withMessage('Start date is required'),
    query('endDate').isISO8601().withMessage('End date is required'),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { outletId, startDate, endDate } = req.query;
      const user = req.user!;

      const effectiveOutletId =
        user.role === UserRole.OWNER ? (outletId as string) : user.outletId;

      const where: Record<string, unknown> = {
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      };
      if (effectiveOutletId) where.outletId = effectiveOutletId;

      const sales = await prisma.sale.findMany({
        where,
        include: {
          product: true,
          outlet: true,
        },
        orderBy: { date: 'asc' },
      });

      // Group by date
      const salesByDate = sales.reduce((acc, sale) => {
        const dateKey = sale.date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, items: [], totalQuantity: 0 };
        }
        acc[dateKey].items.push(sale);
        acc[dateKey].totalQuantity += (sale.quantity as Decimal).toNumber();
        return acc;
      }, {} as Record<string, { date: string; items: typeof sales; totalQuantity: number }>);

      res.json({ success: true, data: Object.values(salesByDate) });
    } catch (error) {
      console.error('Sales report error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Daily closing summary report
router.get(
  '/daily-summary',
  authenticate,
  authorize(UserRole.OWNER),
  [
    query('startDate').isISO8601().withMessage('Start date is required'),
    query('endDate').isISO8601().withMessage('End date is required'),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { startDate, endDate } = req.query;

      const closings = await prisma.dailyClosing.findMany({
        where: {
          date: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        include: {
          outlet: true,
        },
        orderBy: [{ date: 'asc' }, { outletId: 'asc' }],
      });

      // Aggregate totals
      const totals = closings.reduce(
        (acc, closing) => ({
          totalCardSales: acc.totalCardSales + (closing.cardSales as Decimal).toNumber(),
          totalCashSales: acc.totalCashSales + (closing.cashSales as Decimal).toNumber(),
          totalNetCash: acc.totalNetCash + (closing.netCash as Decimal).toNumber(),
        }),
        { totalCardSales: 0, totalCashSales: 0, totalNetCash: 0 }
      );

      res.json({
        success: true,
        data: {
          closings,
          totals,
        },
      });
    } catch (error) {
      console.error('Daily summary report error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Dashboard KPI stats for admin
router.get(
  '/dashboard-stats',
  authenticate,
  authorize(UserRole.OWNER),
  async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Get today's date range
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      // Get all daily closings for this month
      const monthlyClosings = await prisma.dailyClosing.findMany({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: { outlet: true },
      });

      // Get today's closings
      const todayClosings = await prisma.dailyClosing.findMany({
        where: {
          date: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        include: { outlet: true },
      });

      // Calculate monthly totals
      const monthlyTotals = monthlyClosings.reduce(
        (acc, closing) => ({
          cardSales: acc.cardSales + (closing.cardSales as Decimal).toNumber(),
          cashSales: acc.cashSales + (closing.cashSales as Decimal).toNumber(),
          totalSales: acc.totalSales + (closing.cardSales as Decimal).toNumber() + (closing.cashSales as Decimal).toNumber(),
        }),
        { cardSales: 0, cashSales: 0, totalSales: 0 }
      );

      // Calculate today's totals
      const todayTotals = todayClosings.reduce(
        (acc, closing) => ({
          cardSales: acc.cardSales + (closing.cardSales as Decimal).toNumber(),
          cashSales: acc.cashSales + (closing.cashSales as Decimal).toNumber(),
          totalSales: acc.totalSales + (closing.cardSales as Decimal).toNumber() + (closing.cashSales as Decimal).toNumber(),
        }),
        { cardSales: 0, cashSales: 0, totalSales: 0 }
      );

      // Get totals by outlet for this month
      const outletTotals = monthlyClosings.reduce((acc, closing) => {
        const outletName = closing.outlet.name;
        if (!acc[outletName]) {
          acc[outletName] = { cardSales: 0, cashSales: 0, totalSales: 0, type: closing.outlet.type };
        }
        acc[outletName].cardSales += (closing.cardSales as Decimal).toNumber();
        acc[outletName].cashSales += (closing.cashSales as Decimal).toNumber();
        acc[outletName].totalSales += (closing.cardSales as Decimal).toNumber() + (closing.cashSales as Decimal).toNumber();
        return acc;
      }, {} as Record<string, { cardSales: number; cashSales: number; totalSales: number; type: string }>);

      // Get outlet count
      const outletCount = await prisma.outlet.count();

      res.json({
        success: true,
        data: {
          today: todayTotals,
          monthly: monthlyTotals,
          outletBreakdown: outletTotals,
          outletCount,
          month: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        },
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
