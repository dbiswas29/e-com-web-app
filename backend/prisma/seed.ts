import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create sample products
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
      stock: 50,
      rating: 4.5,
      reviewCount: 128,
      features: JSON.stringify(['Noise Cancellation', 'Wireless', '30h Battery', 'Fast Charging']),
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracker with heart rate monitoring and GPS.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
      category: 'Electronics',
      stock: 30,
      rating: 4.7,
      reviewCount: 89,
      features: JSON.stringify(['Heart Rate Monitor', 'GPS', 'Water Resistant', 'Sleep Tracking']),
    },
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      category: 'Fashion',
      stock: 100,
      rating: 4.3,
      reviewCount: 256,
      features: JSON.stringify(['Organic Cotton', 'Sustainable', 'Comfortable Fit', 'Multiple Colors']),
    },
    {
      name: 'Professional Camera Lens',
      description: '85mm f/1.8 portrait lens for professional photography.',
      price: 599.99,
      imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      reviewCount: 67,
      features: JSON.stringify(['85mm Focal Length', 'f/1.8 Aperture', 'Portrait Lens', 'Professional Grade']),
    },
    {
      name: 'Yoga Mat Premium',
      description: 'High-quality yoga mat with superior grip and cushioning.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      category: 'Sports & Fitness',
      stock: 75,
      rating: 4.6,
      reviewCount: 134,
      features: JSON.stringify(['Non-Slip', 'Eco-Friendly', 'Extra Thick', 'Carrying Strap']),
    },
    {
      name: 'Coffee Bean Grinder',
      description: 'Electric burr grinder for the perfect coffee experience.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
      category: 'Kitchen',
      stock: 25,
      rating: 4.4,
      reviewCount: 98,
      features: JSON.stringify(['Burr Grinder', 'Multiple Settings', 'Easy Clean', 'Compact Design']),
    },
    {
      name: 'Minimalist Desk Lamp',
      description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      category: 'Home & Garden',
      stock: 40,
      rating: 4.5,
      reviewCount: 76,
      features: JSON.stringify(['LED', 'Adjustable Brightness', 'Color Temperature', 'USB Charging']),
    },
    {
      name: 'Bestselling Novel',
      description: 'Award-winning fiction novel that captivated millions of readers.',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      category: 'Books',
      stock: 200,
      rating: 4.7,
      reviewCount: 1245,
      features: JSON.stringify(['Bestseller', 'Award Winner', 'Fiction', 'Paperback']),
    },
  ];

  console.log('Creating products...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  // Create admin user
  const hashedPassword = await argon2.hash('admin123');
  
  console.log('Creating admin user...');
  await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create test user
  const testUserPassword = await argon2.hash('password123');
  
  console.log('Creating test user...');
  await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: testUserPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    },
  });

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
