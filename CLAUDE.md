# CLAUDE.md - Inventory & Sales Tracking System

## Project Overview
Web-based inventory and sales tracking for 3 university outlets (Cafe, Restaurant, Mini Market).
Non-POS system - all manual data entry. No external integrations.

## Tech Stack
- Frontend: React
- Backend: Node.js
- Database: PostgreSQL
- Hosting: Railway

## User Roles
1. **Owner (Admin)** - Full dashboard, all outlets visibility
2. **Purchasing** - Warehouse/inventory input only
3. **Outlet Accounts** - Cafe, Restaurant, Mini Market (separate logins)

## Core Business Logic

### Inventory Formula
```
Remaining = Purchases - Sales - Waste
```

### Daily Closing Formula
```
Net Cash = Total Cash Sales - (any deductions)
```

## Database Entities
- users (id, role, outlet_id, email, password)
- outlets (id, name, type: cafe|restaurant|mini_market)
- products (id, name, unit, category, is_fixed)
- inventory (id, product_id, outlet_id, quantity, date)
- purchases (id, product_id, quantity, date, entered_by)
- sales (id, outlet_id, product_id, quantity, date)
- waste (id, outlet_id, product_id, quantity, image_url, reason, date)
- daily_closing (id, outlet_id, card_sales, cash_sales, net_cash, date)

## API Endpoints Pattern
- GET/POST /api/inventory
- GET/POST /api/sales
- GET/POST /api/purchases
- GET/POST /api/waste
- GET/POST /api/daily-closing
- GET /api/reports/[type]

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Arabic RTL support required for UI
- All API responses follow: { success: boolean, data?: any, error?: string }

## Common Commands
- npm run dev: Start development server
- npm run build: Build for production
- npm run test: Run tests
- npm run db:migrate: Run database migrations
- npm run db:seed: Seed test data

## Testing Requirements
- Each API endpoint must have test coverage
- Test the inventory formula calculation
- Test role-based access control

## Common Mistakes to Avoid
- Don't forget RTL support for Arabic
- Always validate user role before data access
- Don't allow negative inventory quantities
- Always include date filtering in reports
- Image uploads for waste must be compressed

## File Structure
```
/src
  /app (or /pages)
    /api
    /admin
    /outlet
    /purchasing
  /components
  /lib
    /db
    /auth
    /utils
  /types
```