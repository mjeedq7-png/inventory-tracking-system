import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import salesRoutes from './routes/sales.js';
import purchasesRoutes from './routes/purchases.js';
import wasteRoutes from './routes/waste.js';
import dailyClosingRoutes from './routes/daily-closing.js';
import reportsRoutes from './routes/reports.js';
import productsRoutes from './routes/products.js';
import outletsRoutes from './routes/outlets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/daily-closing', dailyClosingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/outlets', outletsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
