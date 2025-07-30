import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Product, ProductDocument } from '../schemas/product.schema';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async seedDatabase() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data for fresh start
    await this.productModel.deleteMany({});
    await this.userModel.deleteMany({});
    
    console.log('🗑️ Cleared existing data');

    // Seed users
    await this.seedUsers();
    
    // Seed products
    await this.seedProducts();

    console.log('✅ Database seeding completed with 9 products!');
  }

  private async seedUsers() {
    try {
      // Check if users already exist
      const existingUserCount = await this.userModel.countDocuments();
      if (existingUserCount > 0) {
        console.log('👥 Users already exist, skipping user seeding');
        return;
      }

      const users = [
        {
          email: 'admin@example.com',
          password: await bcrypt.hash('admin123', 12),
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
        },
        {
          email: 'user@example.com',
          password: await bcrypt.hash('user123', 12),
          firstName: 'Regular',
          lastName: 'User',
          role: UserRole.USER,
        },
      ];

      await this.userModel.insertMany(users);
      console.log('✅ Users seeded');
    } catch (error) {
      console.log('⚠️  Users already exist or error occurred:', error.message);
    }
  }

  private async seedProducts() {
    try {
      // Check if products already exist
      const existingProductCount = await this.productModel.countDocuments();
      if (existingProductCount >= 9) {
        console.log('📦 Products already exist (9 products), skipping product seeding');
        return;
      }

      // Clear existing products to ensure we have exactly 9
      await this.productModel.deleteMany({});
      console.log('🗑️ Cleared existing products');

      const products = [
      {
        name: 'Minimalist Desk Lamp',
        description: 'A sleek and modern desk lamp perfect for any workspace. Features adjustable brightness and color temperature.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Lighting',
        stock: 25,
        rating: 4.5,
        reviewCount: 12,
        features: ['Adjustable brightness', 'USB charging port', 'Touch control', 'Energy efficient LED'],
        isActive: true,
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Premium ergonomic office chair with lumbar support and adjustable height. Perfect for long working hours.',
        price: 299.99,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Furniture',
        stock: 15,
        rating: 4.8,
        reviewCount: 28,
        features: ['Lumbar support', 'Adjustable height', 'Breathable mesh', '360° swivel'],
        isActive: true,
      },
      {
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Electronics',
        stock: 50,
        rating: 4.2,
        reviewCount: 45,
        features: ['Fast charging', 'LED indicator', 'Non-slip base', 'Universal compatibility'],
        isActive: true,
      },
      {
        name: 'Smart Water Bottle',
        description: 'Intelligent water bottle that tracks your hydration and reminds you to drink water throughout the day.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Health & Fitness',
        stock: 30,
        rating: 4.0,
        reviewCount: 18,
        features: ['Hydration tracking', 'App connectivity', 'Insulated design', 'LED reminders'],
        isActive: true,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Premium mechanical keyboard with RGB backlighting and customizable switches. Perfect for gaming and typing.',
        price: 129.99,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Electronics',
        stock: 20,
        rating: 4.7,
        reviewCount: 35,
        features: ['Mechanical switches', 'RGB backlighting', 'Programmable keys', 'USB-C connectivity'],
        isActive: true,
      },
      {
        name: 'Standing Desk Converter',
        description: 'Adjustable standing desk converter that transforms any desk into a standing workstation. Promotes better posture.',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Furniture',
        stock: 12,
        rating: 4.4,
        reviewCount: 22,
        features: ['Height adjustable', 'Easy conversion', 'Monitor shelf', 'Keyboard tray'],
        isActive: true,
      },
      {
        name: 'Premium Coffee Maker',
        description: 'Professional-grade coffee maker with built-in grinder and programmable settings. Perfect for coffee enthusiasts.',
        price: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Kitchen & Dining',
        stock: 18,
        rating: 4.6,
        reviewCount: 32,
        features: ['Built-in grinder', 'Programmable timer', 'Thermal carafe', 'Auto shut-off'],
        isActive: true,
      },
      {
        name: 'Organic Skincare Set',
        description: 'Complete 5-piece organic skincare routine with cleanser, toner, serum, moisturizer, and sunscreen.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Beauty & Personal Care',
        stock: 35,
        rating: 4.3,
        reviewCount: 24,
        features: ['100% organic', 'Cruelty-free', 'All skin types', 'Travel-friendly'],
        isActive: true,
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Double-wall insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format'
        ],
        category: 'Kitchen & Dining',
        stock: 45,
        rating: 4.1,
        reviewCount: 38,
        features: ['Double-wall insulation', 'Leak-proof lid', 'BPA-free', 'Dishwasher safe'],
        isActive: true,
      }
    ];

      await this.productModel.insertMany(products);
      console.log('✅ Products seeded');
    } catch (error) {
      console.log('⚠️  Error seeding products:', error.message);
    }
  }
}
