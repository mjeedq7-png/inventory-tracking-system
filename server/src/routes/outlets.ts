import { Router, Response } from 'express';
import prisma from '../lib/db.js';
import { authenticate } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Get all outlets
router.get(
  '/',
  authenticate,
  async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const outlets = await prisma.outlet.findMany({
        orderBy: { name: 'asc' },
      });

      res.json({ success: true, data: outlets });
    } catch (error) {
      console.error('Get outlets error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
