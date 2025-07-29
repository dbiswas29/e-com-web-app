import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    skip?: number;
    take?: number;
    category?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const { skip = 0, take = 20, category, categories, minPrice, maxPrice, search } = params || {};

    console.log('ProductsService.findAll called with params:', { skip, take, category, categories, minPrice, maxPrice, search });

    const where: any = {
      isActive: true,
    };

    // Handle multiple categories or single category
    if (categories && categories.length > 0) {
      where.category = {
        in: categories,
      };
    } else if (category) {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
      console.log('Price filter applied:', where.price);
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    console.log('Final where clause:', JSON.stringify(where, null, 2));

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map(product => ({
        ...product,
        features: JSON.parse(product.features || '[]'),
        images: JSON.parse((product as any).images || '[]'),
      })),
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      features: JSON.parse(product.features || '[]'),
      images: JSON.parse((product as any).images || '[]'),
    };
  }

  async getCategories() {
    // Get unique categories from products with product count
    const categories = await this.prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true,
      },
      _count: {
        category: true,
      },
    });

    return categories.map((categoryGroup, index) => ({
      id: `cat-${index + 1}`,
      name: categoryGroup.category,
      description: `Browse products in ${categoryGroup.category} category`,
      productCount: categoryGroup._count.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  async findByCategory(category: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(product => ({
      ...product,
      features: JSON.parse(product.features || '[]'),
      images: JSON.parse((product as any).images || '[]'),
    }));
  }

  async findRelatedProducts(productId: string, category: string, limit = 4) {
    const products = await this.prisma.product.findMany({
      where: {
        category,
        isActive: true,
        id: { not: productId }, // Exclude the current product
      },
      take: limit,
      orderBy: { rating: 'desc' }, // Order by rating to get best related products
    });

    return products.map(product => ({
      ...product,
      features: JSON.parse(product.features || '[]'),
      images: JSON.parse((product as any).images || '[]'),
    }));
  }
}
