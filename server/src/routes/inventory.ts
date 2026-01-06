import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { UserRole } from '@prisma/client';
import prisma from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Get inventory with optional filters
router.get(
  '/',
  authenticate,
  [
    query('outletId').optional().isString(),
    query('date').optional().isISO8601(),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { outletId, date } = req.query;
      const user = req.user!;

      // Non-owner users can only see their own outlet's inventory
      const effectiveOutletId =
        user.role === UserRole.OWNER ? (outletId as string) : user.outletId;

      const where: Record<string, unknown> = {};
      if (effectiveOutletId) where.outletId = effectiveOutletId;
      if (date) where.date = new Date(date as string);

      const inventory = await prisma.inventory.findMany({
        where,
        include: {
          product: true,
          outlet: true,
        },
        orderBy: { date: 'desc' },
      });

      res.json({ success: true, data: inventory });
    } catch (error) {
      console.error('Get inventory error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Create/update inventory entry
router.post(
  '/',
  authenticate,
  authorize(UserRole.OWNER, UserRole.PURCHASING),
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('outletId').notEmpty().withMessage('Outlet ID is required'),
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
      const { productId, outletId, quantity, date } = req.body;

      // Validate non-negative quantity
      if (parseFloat(quantity) < 0) {
        res.status(400).json({ success: false, error: 'Quantity cannot be negative' });
        return;
      }

      const inventory = await prisma.inventory.upsert({
        where: {
          productId_outletId_date: {
            productId,
            outletId,
            date: new Date(date),
          },
        },
        update: { quantity },
        create: {
          productId,
          outletId,
          quantity,
          date: new Date(date),
        },
        include: {
          product: true,
          outlet: true,
        },
      });

      res.status(201).json({ success: true, data: inventory });
    } catch (error) {
      console.error('Create inventory error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
