import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  const mockCartService = {
    getCart: jest.fn(),
    addToCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should get user cart successfully', async () => {
      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [
          {
            id: 'item-1',
            productId: 'product-1',
            quantity: 2,
            price: 29.99,
          },
        ],
        total: 59.98,
      };

      mockCartService.getCart.mockResolvedValue(expectedResult);

      const result = await controller.getCart(mockRequest);

      expect(mockCartService.getCart).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResult);
    });

    it('should return empty cart for new user', async () => {
      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [],
        total: 0,
      };

      mockCartService.getCart.mockResolvedValue(expectedResult);

      const result = await controller.getCart(mockRequest);

      expect(mockCartService.getCart).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addToCart', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should add item to cart successfully', async () => {
      const body = {
        productId: 'product-1',
        quantity: 2,
      };

      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [
          {
            id: 'item-1',
            productId: 'product-1',
            quantity: 2,
            price: 29.99,
          },
        ],
        total: 59.98,
      };

      mockCartService.addToCart.mockResolvedValue(expectedResult);

      const result = await controller.addToCart(mockRequest, body);

      expect(mockCartService.addToCart).toHaveBeenCalledWith('1', 'product-1', 2);
      expect(result).toEqual(expectedResult);
    });

    it('should add item with default quantity of 1', async () => {
      const body = {
        productId: 'product-1',
      };

      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [
          {
            id: 'item-1',
            productId: 'product-1',
            quantity: 1,
            price: 29.99,
          },
        ],
        total: 29.99,
      };

      mockCartService.addToCart.mockResolvedValue(expectedResult);

      const result = await controller.addToCart(mockRequest, body);

      expect(mockCartService.addToCart).toHaveBeenCalledWith('1', 'product-1', 1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle product not found', async () => {
      const body = {
        productId: 'non-existent-product',
        quantity: 1,
      };

      mockCartService.addToCart.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(controller.addToCart(mockRequest, body)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCartService.addToCart).toHaveBeenCalledWith('1', 'non-existent-product', 1);
    });
  });

  describe('updateCartItem', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should update cart item quantity successfully', async () => {
      const body = {
        itemId: 'item-1',
        quantity: 3,
      };

      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [
          {
            id: 'item-1',
            productId: 'product-1',
            quantity: 3,
            price: 29.99,
          },
        ],
        total: 89.97,
      };

      mockCartService.updateCartItem.mockResolvedValue(expectedResult);

      const result = await controller.updateCartItem(mockRequest, body);

      expect(mockCartService.updateCartItem).toHaveBeenCalledWith('1', 'item-1', 3);
      expect(result).toEqual(expectedResult);
    });

    it('should handle cart item not found', async () => {
      const body = {
        itemId: 'non-existent-item',
        quantity: 2,
      };

      mockCartService.updateCartItem.mockRejectedValue(
        new NotFoundException('Cart item not found'),
      );

      await expect(controller.updateCartItem(mockRequest, body)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCartService.updateCartItem).toHaveBeenCalledWith('1', 'non-existent-item', 2);
    });

    it('should handle invalid quantity', async () => {
      const body = {
        itemId: 'item-1',
        quantity: 0,
      };

      mockCartService.updateCartItem.mockRejectedValue(
        new BadRequestException('Quantity must be greater than 0'),
      );

      await expect(controller.updateCartItem(mockRequest, body)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCartService.updateCartItem).toHaveBeenCalledWith('1', 'item-1', 0);
    });
  });

  describe('removeFromCart', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should remove item from cart successfully', async () => {
      const itemId = 'item-1';

      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [],
        total: 0,
      };

      mockCartService.removeFromCart.mockResolvedValue(expectedResult);

      const result = await controller.removeFromCart(mockRequest, itemId);

      expect(mockCartService.removeFromCart).toHaveBeenCalledWith('1', 'item-1');
      expect(result).toEqual(expectedResult);
    });

    it('should handle cart item not found', async () => {
      const itemId = 'non-existent-item';

      mockCartService.removeFromCart.mockRejectedValue(
        new NotFoundException('Cart item not found'),
      );

      await expect(controller.removeFromCart(mockRequest, itemId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCartService.removeFromCart).toHaveBeenCalledWith('1', 'non-existent-item');
    });
  });

  describe('clearCart', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should clear cart successfully', async () => {
      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [],
        total: 0,
      };

      mockCartService.clearCart.mockResolvedValue(expectedResult);

      const result = await controller.clearCart(mockRequest);

      expect(mockCartService.clearCart).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty cart', async () => {
      const expectedResult = {
        id: 'cart-1',
        userId: '1',
        items: [],
        total: 0,
      };

      mockCartService.clearCart.mockResolvedValue(expectedResult);

      const result = await controller.clearCart(mockRequest);

      expect(mockCartService.clearCart).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResult);
    });
  });
});
