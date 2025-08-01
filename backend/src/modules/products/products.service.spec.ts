import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductsService } from './products.service';
import { Product, ProductDocument } from '../../schemas/product.schema';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<ProductDocument>;

  const mockProductModel = {
    find: jest.fn(),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    distinct: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockProduct = {
    _id: new Types.ObjectId(),
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'electronics',
    imageUrl: 'test-image.jpg',
    stock: 10,
    isActive: true,
    tags: ['test', 'product'],
    toJSON: jest.fn().mockReturnThis(),
  };

  const mockProducts = [mockProduct];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const defaultParams = {
      skip: 0,
      take: 20,
      category: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      search: undefined,
    };

    beforeEach(() => {
      // Reset all mocks
      jest.clearAllMocks();
      
      // Setup the proper mock chain for find operations
      const chainMock = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      };
      
      mockProductModel.find.mockReturnValue(chainMock);
      mockProductModel.countDocuments.mockResolvedValue(1);
    });

    it('should return all products with default parameters', async () => {
      const result = await service.findAll(defaultParams);

      expect(mockProductModel.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockProductModel.countDocuments).toHaveBeenCalledWith({ isActive: true });
      expect(result).toEqual({
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should filter by category', async () => {
      const params = { ...defaultParams, category: 'electronics' };
      
      await service.findAll(params);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        category: 'electronics',
      });
    });

    it('should filter by multiple categories', async () => {
      const params = { ...defaultParams, categories: ['electronics', 'books'] };
      
      await service.findAll(params);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        category: { $in: ['electronics', 'books'] },
      });
    });

    it('should filter by price range', async () => {
      const params = { ...defaultParams, minPrice: 50, maxPrice: 150 };
      
      await service.findAll(params);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        price: { $gte: 50, $lte: 150 },
      });
    });

    it('should search products by name and description', async () => {
      const params = { ...defaultParams, search: 'test' };
      
      await service.findAll(params);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        isActive: true,
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } },
        ],
      });
    });

    it('should handle pagination correctly', async () => {
      const params = { ...defaultParams, skip: 20, take: 10 };
      
      const result = await service.findAll(params);

      expect(result.page).toBe(3); // (skip + take) / take = (20 + 10) / 10 = 3
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.findOne(mockProduct._id.toString());

      expect(mockProductModel.findById).toHaveBeenCalledWith(mockProduct._id.toString());
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('getCategories', () => {
    it('should return distinct categories', async () => {
      const categoriesAggregation = [
        { _id: 'electronics', count: 10 },
        { _id: 'books', count: 5 },
      ];
      mockProductModel.aggregate.mockResolvedValue(categoriesAggregation);

      const result = await service.getCategories();

      expect(mockProductModel.aggregate).toHaveBeenCalledWith([
        { $match: { isActive: true } },
        { 
          $group: { 
            _id: '$category', 
            count: { $sum: 1 }
          } 
        },
        { $sort: { _id: 1 } }
      ]);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'cat-1',
        name: 'electronics',
        description: 'Browse products in electronics category',
        productCount: 10,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const category = 'electronics';

      const chainMock = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      };
      
      mockProductModel.find.mockReturnValue(chainMock);

      const result = await service.findByCategory(category);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        category: 'electronics',
        isActive: true,
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findRelatedProducts', () => {
    it('should return related products by category', async () => {
      const productId = mockProduct._id.toString();
      const category = mockProduct.category;
      
      const relatedProducts = [
        { ...mockProduct, _id: new Types.ObjectId(), name: 'Related Product' }
      ];
      
      const chainMock = {
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(relatedProducts),
      };
      
      mockProductModel.find.mockReturnValue(chainMock);

      const result = await service.findRelatedProducts(productId, category, 4);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        category: mockProduct.category,
        isActive: true,
        _id: { $ne: productId },
      });
      expect(result).toEqual(relatedProducts);
    });
  });
});
