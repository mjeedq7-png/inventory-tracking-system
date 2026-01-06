import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { UserRole } from '@prisma/client';
import prisma from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Get sales with optional filters
router.get(
  '/',
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

      const where: Record<string, unknown> = {};
      if (effectiveOutletId) where.outletId = effectiveOutletId;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) (where.date as Record<string, Date>).gte = new Date(startDate as string);
        if (endDate) (where.date as Record<string, Date>).lte = new Date(endDate as string);
      }

      const sales = await prisma.sale.findMany({
        where,
        include: {
          product: true,
          outlet: true,
        },
        orderBy: { date: 'desc' },
      });

      res.json({ success: true, data: sales });
    } catch (error) {
      console.error('Get sales error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Record a sale
router.post(
  '/',
  authenticate,
  authorize(
    UserRole.OWNER,
    UserRole.OUTLET_CAFE,
    UserRole.OUTLET_RESTAURANT,
    UserRole.OUTLET_MINI_MARKET
  ),
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('date').isISO8601().withMessage('Valid date is required'),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { productId, quantity, date } = req.body;
      const user = req.user!;

      // Outlet users can only record sales for their outlet
      const outletId = req.body.outletId || user.outletId;
      if (!outletId) {
        res.status(400).json({ success: false, error: 'Outlet ID is required' });
        return;
      }

      if (parseFloat(quantity) < 0) {
        res.status(400).json({ success: false, error: 'Quantity cannot be negative' });
        return;
      }

      const sale = await prisma.sale.create({
        data: {
          outletId,
          productId,
          quantity,
          date: new Date(date),
        },
        include: {
          product: true,
          outlet: true,
        },
      });

      res.status(201).json({ success: true, data: sale });
    } catch (error) {
      console.error('Create sale error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
