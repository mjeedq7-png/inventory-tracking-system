import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { UserRole } from '@prisma/client';
import prisma from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Get daily closing records with optional filters
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

      const closings = await prisma.dailyClosing.findMany({
        where,
        include: {
          outlet: true,
        },
        orderBy: { date: 'desc' },
      });

      res.json({ success: true, data: closings });
    } catch (error) {
      console.error('Get daily closing error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Record daily closing
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
    body('cardSales').isNumeric().withMessage('Card sales must be a number'),
    body('cashSales').isNumeric().withMessage('Cash sales must be a number'),
    body('date').isISO8601().withMessage('Valid date is required'),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { cardSales, cashSales, date } = req.body;
      const user = req.user!;

      const outletId = req.body.outletId || user.outletId;
      if (!outletId) {
        res.status(400).json({ success: false, error: 'Outlet ID is required' });
        return;
      }

      // Calculate net cash (can be extended with deductions logic)
      const netCash = parseFloat(cashSales);

      const closing = await prisma.dailyClosing.upsert({
        where: {
          outletId_date: {
            outletId,
            date: new Date(date),
          },
        },
        update: {
          cardSales,
          cashSales,
          netCash,
        },
        create: {
          outletId,
          cardSales,
          cashSales,
          netCash,
          date: new Date(date),
        },
        include: {
          outlet: true,
        },
      });

      res.status(201).json({ success: true, data: closing });
    } catch (error) {
      console.error('Create daily closing error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
