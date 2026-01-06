import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { UserRole } from '@prisma/client';
import prisma from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Get purchases with optional filters
router.get(
  '/',
  authenticate,
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('productId').optional().isString(),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { startDate, endDate, productId } = req.query;

      const where: Record<string, unknown> = {};
      if (productId) where.productId = productId;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) (where.date as Record<string, Date>).gte = new Date(startDate as string);
        if (endDate) (where.date as Record<string, Date>).lte = new Date(endDate as string);
      }

      const purchases = await prisma.purchase.findMany({
        where,
        include: {
          product: true,
          enteredBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { date: 'desc' },
      });

      res.json({ success: true, data: purchases });
    } catch (error) {
      console.error('Get purchases error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Record a purchase
router.post(
  '/',
  authenticate,
  authorize(UserRole.OWNER, UserRole.PURCHASING),
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

      if (parseFloat(quantity) < 0) {
        res.status(400).json({ success: false, error: 'Quantity cannot be negative' });
        return;
      }

      const purchase = await prisma.purchase.create({
        data: {
          productId,
          quantity,
          date: new Date(date),
          enteredById: user.userId,
        },
        include: {
          product: true,
          enteredBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      res.status(201).json({ success: true, data: purchase });
    } catch (error) {
      console.error('Create purchase error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
