import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'electronics',
        isActive: true,
        features: '["feature1", "feature2"]',
        images: '[]',
        createdAt: new Date(),
      },
    ];

    it('should return products with pagination', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result).toEqual({
        data: [
          {
            ...mockProducts[0],
            features: ['feature1', 'feature2'],
            images: [],
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by single category', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ category: 'electronics' });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          category: 'electronics',
        },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by multiple categories', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ categories: ['electronics', 'clothing'] });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          category: {
            in: ['electronics', 'clothing'],
          },
        },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by price range', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ minPrice: 50, maxPrice: 150 });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          price: {
            gte: 50,
            lte: 150,
          },
        },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should search products by name and description', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ search: 'test' });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [
            { name: { contains: 'test' } },
            { description: { contains: 'test' } },
          ],
        },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle pagination parameters', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);
      mockPrismaService.product.count.mockResolvedValue(0);

      await service.findAll({ skip: 20, take: 10 });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 20,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'electronics',
      isActive: true,
      features: '["feature1", "feature2"]',
      images: '[]',
      createdAt: new Date(),
    };

    it('should return a single product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual({
        ...mockProduct,
        features: ['feature1', 'feature2'],
        images: [],
      });

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByCategory', () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Electronics Product',
        category: 'electronics',
        isActive: true,
        features: '[]',
        images: '[]',
        createdAt: new Date(),
      },
    ];

    it('should return products by category', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findByCategory('electronics');

      expect(result).toEqual([
        {
          ...mockProducts[0],
          features: [],
          images: [],
        },
      ]);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          category: 'electronics',
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
