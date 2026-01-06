import { PrismaClient, UserRole, OutletType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create outlets
  const cafe = await prisma.outlet.upsert({
    where: { id: 'outlet-cafe' },
    update: {},
    create: {
      id: 'outlet-cafe',
      name: 'University Cafe',
      type: OutletType.CAFE,
    },
  });

  const restaurant = await prisma.outlet.upsert({
    where: { id: 'outlet-restaurant' },
    update: {},
    create: {
      id: 'outlet-restaurant',
      name: 'University Restaurant',
      type: OutletType.RESTAURANT,
    },
  });

  const miniMarket = await prisma.outlet.upsert({
    where: { id: 'outlet-mini-market' },
    update: {},
    create: {
      id: 'outlet-mini-market',
      name: 'Mini Market',
      type: OutletType.MINI_MARKET,
    },
  });

  console.log('Created outlets:', { cafe, restaurant, miniMarket });

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@inventory.com' },
    update: {},
    create: {
      email: 'owner@inventory.com',
      password: hashedPassword,
      name: 'Owner Admin',
      role: UserRole.OWNER,
    },
  });

  const purchasing = await prisma.user.upsert({
    where: { email: 'purchasing@inventory.com' },
    update: {},
    create: {
      email: 'purchasing@inventory.com',
      password: hashedPassword,
      name: 'Purchasing Staff',
      role: UserRole.PURCHASING,
    },
  });

  const cafeUser = await prisma.user.upsert({
    where: { email: 'cafe@inventory.com' },
    update: { outletId: cafe.id, role: UserRole.OUTLET_CAFE },
    create: {
      email: 'cafe@inventory.com',
      password: hashedPassword,
      name: 'Cafe Staff',
      role: UserRole.OUTLET_CAFE,
      outletId: cafe.id,
    },
  });

  const restaurantUser = await prisma.user.upsert({
    where: { email: 'restaurant@inventory.com' },
    update: { outletId: restaurant.id, role: UserRole.OUTLET_RESTAURANT },
    create: {
      email: 'restaurant@inventory.com',
      password: hashedPassword,
      name: 'Restaurant Staff',
      role: UserRole.OUTLET_RESTAURANT,
      outletId: restaurant.id,
    },
  });

  const miniMarketUser = await prisma.user.upsert({
    where: { email: 'minimarket@inventory.com' },
    update: { outletId: miniMarket.id, role: UserRole.OUTLET_MINI_MARKET },
    create: {
      email: 'minimarket@inventory.com',
      password: hashedPassword,
      name: 'Mini Market Staff',
      role: UserRole.OUTLET_MINI_MARKET,
      outletId: miniMarket.id,
    },
  });

  console.log('Created users:', { owner, purchasing, cafeUser, restaurantUser, miniMarketUser });

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'product-coffee' },
      update: {},
      create: {
        id: 'product-coffee',
        name: 'Coffee Beans',
        unit: 'kg',
        category: 'Beverages',
        isFixed: false,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-sugar' },
      update: {},
      create: {
        id: 'product-sugar',
        name: 'Sugar',
        unit: 'kg',
        category: 'Ingredients',
        isFixed: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-bread' },
      update: {},
      create: {
        id: 'product-bread',
        name: 'Bread',
        unit: 'pieces',
        category: 'Bakery',
        isFixed: false,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-water' },
      update: {},
      create: {
        id: 'product-water',
        name: 'Bottled Water',
        unit: 'bottles',
        category: 'Beverages',
        isFixed: true,
      },
    }),
  ]);

  console.log('Created products:', products);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
