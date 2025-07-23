import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('CartService', () => {
  let service: CartService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    const mockCart = {
      id: '1',
      userId: 'user1',
      items: [
        {
          id: '1',
          cartId: '1',
          productId: 'product1',
          quantity: 2,
          product: {
            id: 'product1',
            name: 'Test Product',
            price: 99.99,
            features: '["feature1", "feature2"]',
          },
        },
      ],
    };

    it('should return cart with calculated totals', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);

      const result = await service.getCart('user1');

      expect(result).toEqual({
        ...mockCart,
        totalItems: 2,
        totalPrice: 199.98,
        items: [
          {
            ...mockCart.items[0],
            product: {
              ...mockCart.items[0].product,
              features: ['feature1', 'feature2'],
            },
          },
        ],
      });

      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    it('should return null when cart not found', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      const result = await service.getCart('user1');

      expect(result).toBeNull();
    });
  });

  describe('addToCart', () => {
    const mockCart = {
      id: '1',
      userId: 'user1',
    };

    const mockCartItem = {
      id: '1',
      cartId: '1',
      productId: 'product1',
      quantity: 1,
    };

    it('should add new item to existing cart', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);

      const cartWithItems = {
        id: '1',
        userId: 'user1',
        items: [],
        totalItems: 1,
        totalPrice: 99.99,
      } as any;

      jest.spyOn(service, 'getCart').mockResolvedValue(cartWithItems);

      const result = await service.addToCart('user1', 'product1', 1);

      expect(result).toEqual(cartWithItems);
      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: '1',
          productId: 'product1',
          quantity: 1,
        },
      });
    });

    it('should create new cart when user has no cart', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue(mockCartItem);

      const cartWithItems = {
        id: '1',
        userId: 'user1',
        items: [],
        totalItems: 1,
        totalPrice: 99.99,
      } as any;

      jest.spyOn(service, 'getCart').mockResolvedValue(cartWithItems);

      const result = await service.addToCart('user1', 'product1', 1);

      expect(result).toEqual(cartWithItems);
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith({
        data: { userId: 'user1' },
      });
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockCart = {
        id: '1',
        userId: 'user1',
      };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.delete.mockResolvedValue({});

      const updatedCart = {
        id: '1',
        userId: 'user1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      } as any;

      jest.spyOn(service, 'getCart').mockResolvedValue(updatedCart);

      const result = await service.removeFromCart('user1', '1');

      expect(result).toEqual(updatedCart);
      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
          cartId: '1',
        },
      });
    });

    it('should throw error when cart not found', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(service.removeFromCart('user1', 'item1')).rejects.toThrow('Cart not found');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const mockCart = {
        id: '1',
        userId: 'user1',
      };

      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      const emptyCart = {
        id: '1',
        userId: 'user1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      } as any;

      jest.spyOn(service, 'getCart').mockResolvedValue(emptyCart);

      const result = await service.clearCart('user1');

      expect(result).toEqual(emptyCart);
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: '1' },
      });
    });

    it('should handle case when cart does not exist', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      const emptyCart = {
        id: '1',
        userId: 'user1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      } as any;

      jest.spyOn(service, 'getCart').mockResolvedValue(emptyCart);

      const result = await service.clearCart('user1');

      expect(result).toEqual(emptyCart);
      expect(mockPrismaService.cartItem.deleteMany).not.toHaveBeenCalled();
    });
  });
});
