import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { UserRole } from '@prisma/client';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import prisma from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Configure multer for image uploads
const uploadsDir = path.join(process.cwd(), 'uploads', 'waste');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Get waste records with optional filters
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

      const waste = await prisma.waste.findMany({
        where,
        include: {
          product: true,
          outlet: true,
        },
        orderBy: { date: 'desc' },
      });

      res.json({ success: true, data: waste });
    } catch (error) {
      console.error('Get waste error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Record waste with optional image
router.post(
  '/',
  authenticate,
  authorize(
    UserRole.OWNER,
    UserRole.OUTLET_CAFE,
    UserRole.OUTLET_RESTAURANT,
    UserRole.OUTLET_MINI_MARKET
  ),
  upload.single('image'),
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('reason').optional().isString(),
  ],
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    try {
      const { productId, quantity, date, reason } = req.body;
      const user = req.user!;

      const outletId = req.body.outletId || user.outletId;
      if (!outletId) {
        res.status(400).json({ success: false, error: 'Outlet ID is required' });
        return;
      }

      if (parseFloat(quantity) < 0) {
        res.status(400).json({ success: false, error: 'Quantity cannot be negative' });
        return;
      }

      let imageUrl: string | undefined;

      // Process and compress image if uploaded
      if (req.file) {
        const filename = `waste-${Date.now()}.webp`;
        const filepath = path.join(uploadsDir, filename);

        await sharp(req.file.buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filepath);

        imageUrl = `/uploads/waste/${filename}`;
      }

      const waste = await prisma.waste.create({
        data: {
          outletId,
          productId,
          quantity,
          date: new Date(date),
          reason,
          imageUrl,
        },
        include: {
          product: true,
          outlet: true,
        },
      });

      res.status(201).json({ success: true, data: waste });
    } catch (error) {
      console.error('Create waste error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
