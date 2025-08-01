import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

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

    const filter: any = {
      isActive: true,
    };

    // Handle multiple categories or single category
    if (categories && categories.length > 0) {
      filter.category = { $in: categories };
    } else if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
      console.log('Price filter applied:', filter.price);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('Final filter:', JSON.stringify(filter, null, 2));

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(take)
        .sort({ createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      data: products.map(product => product.toJSON()),
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }

  async getCategories() {
    // Get unique categories from products with product count
    const categories = await this.productModel.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 }
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    return categories.map((categoryGroup, index) => ({
      id: `cat-${index + 1}`,
      name: categoryGroup._id,
      description: `Browse products in ${categoryGroup._id} category`,
      productCount: categoryGroup.count,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  async findByCategory(category: string): Promise<ProductDocument[]> {
    return this.productModel
      .find({
        category,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findRelatedProducts(productId: string, category: string, limit = 4): Promise<ProductDocument[]> {
    return this.productModel
      .find({
        category,
        isActive: true,
        _id: { $ne: productId }, // Exclude the current product
      })
      .limit(limit)
      .sort({ rating: -1 }) // Order by rating to get best related products
      .exec();
  }
}
