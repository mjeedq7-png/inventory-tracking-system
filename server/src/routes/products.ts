import { Router, Response } from 'express';
import prisma from '../lib/db.js';
import { authenticate } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Get all products
router.get(
  '/',
  authenticate,
  async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
      });

      res.json({ success: true, data: products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
