import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const mockResponse = {
      data: [
        {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          category: 'electronics',
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    it('should return products with default parameters', async () => {
      mockProductsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        categories: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        search: undefined,
      });
    });

    it('should handle query parameters', async () => {
      mockProductsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(
        '2',       // page
        '10',      // limit
        'electronics', // category
        undefined, // categories
        '50',      // minPrice
        '150',     // maxPrice
        'test'     // search
      );

      expect(service.findAll).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        categories: ['electronics'],
        minPrice: 50,
        maxPrice: 150,
        search: 'test',
      });
    });

    it('should handle categories array parameter', async () => {
      mockProductsService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(
        '1',
        '20',
        undefined,
        'electronics,clothing'
      );

      expect(service.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        categories: ['electronics', 'clothing'],
        minPrice: undefined,
        maxPrice: undefined,
        search: undefined,
      });
    });

    it('should handle invalid pagination parameters', async () => {
      mockProductsService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll('invalid', 'invalid');

      expect(service.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        categories: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        search: undefined,
      });
    });
  });

  describe('findOne', () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
    };

    it('should return a product by id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should handle product not found', async () => {
      mockProductsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nonexistent')).rejects.toThrow('Product not found');
    });
  });

  describe('findByCategory', () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Electronics Product',
        category: 'electronics',
      },
    ];

    it('should return products by category', async () => {
      mockProductsService.findByCategory.mockResolvedValue(mockProducts);

      const result = await controller.findByCategory('electronics');

      expect(result).toEqual(mockProducts);
      expect(service.findByCategory).toHaveBeenCalledWith('electronics');
    });
  });
});
