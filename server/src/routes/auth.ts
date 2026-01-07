import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/db.js';
import { generateToken } from '../middleware/auth.js';
import { ApiResponse, JwtPayload } from '../types/index.js';
import { UserRole, OutletType } from '@prisma/client';

const router = Router();

// Seed endpoint - visit /api/auth/seed once to populate database
router.get('/seed', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: 'owner@inventory.com' } });
    if (existingUser) {
      res.json({ success: true, data: { message: 'Database already seeded!' } });
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const cafe = await prisma.outlet.create({ data: { id: 'outlet-cafe', name: 'University Cafe', type: OutletType.CAFE } });
    const restaurant = await prisma.outlet.create({ data: { id: 'outlet-restaurant', name: 'University Restaurant', type: OutletType.RESTAURANT } });
    const miniMarket = await prisma.outlet.create({ data: { id: 'outlet-mini-market', name: 'Mini Market', type: OutletType.MINI_MARKET } });

    await prisma.user.create({ data: { email: 'owner@inventory.com', password: hashedPassword, name: 'Owner Admin', role: UserRole.OWNER } });
    await prisma.user.create({ data: { email: 'purchasing@inventory.com', password: hashedPassword, name: 'Purchasing Staff', role: UserRole.PURCHASING } });
    await prisma.user.create({ data: { email: 'cafe@inventory.com', password: hashedPassword, name: 'Cafe Staff', role: UserRole.OUTLET_CAFE, outletId: cafe.id } });
    await prisma.user.create({ data: { email: 'restaurant@inventory.com', password: hashedPassword, name: 'Restaurant Staff', role: UserRole.OUTLET_RESTAURANT, outletId: restaurant.id } });
    await prisma.user.create({ data: { email: 'minimarket@inventory.com', password: hashedPassword, name: 'Mini Market Staff', role: UserRole.OUTLET_MINI_MARKET, outletId: miniMarket.id } });

    await prisma.product.create({ data: { id: 'product-coffee', name: 'Coffee Beans', unit: 'kg', category: 'Beverages' } });
    await prisma.product.create({ data: { id: 'product-sugar', name: 'Sugar', unit: 'kg', category: 'Ingredients' } });
    await prisma.product.create({ data: { id: 'product-bread', name: 'Bread', unit: 'pieces', category: 'Bakery' } });
    await prisma.product.create({ data: { id: 'product-water', name: 'Bottled Water', unit: 'bottles', category: 'Beverages' } });

    res.json({ success: true, data: { message: 'Database seeded successfully!' } });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: 'Failed to seed database' });
  }
});

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response<ApiResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { outlet: true },
      });

      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        outletId: user.outletId ?? undefined,
      };

      const token = generateToken(payload);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            outlet: user.outlet,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
