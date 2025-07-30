import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from './cart.service';
import { Cart, CartDocument, CartItem, CartItemDocument } from '../../schemas/cart.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';

describe('CartService', () => {
  let service: CartService;
  let cartModel: Model<CartDocument>;
  let cartItemModel: Model<CartItemDocument>;
  let productModel: Model<ProductDocument>;

  const mockCartModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCartItemModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
    save: jest.fn(),
    populate: jest.fn(),
  };

  const mockProductModel = {
    findById: jest.fn(),
  };

  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
  };

  const mockProduct = {
    _id: new Types.ObjectId(),
    name: 'Test Product',
    price: 99.99,
    category: 'electronics',
    toJSON: jest.fn().mockReturnThis(),
  };

  const mockCart = {
    _id: new Types.ObjectId(),
    userId: mockUser._id,
    items: [],
    toJSON: jest.fn().mockReturnThis(),
    save: jest.fn(),
  };

  const mockCartItem = {
    _id: new Types.ObjectId(),
    cartId: mockCart._id,
    productId: {
      _id: mockProduct._id,
      name: mockProduct.name,
      price: mockProduct.price,
      category: mockProduct.category,
      toJSON: jest.fn().mockReturnThis(),
    },
    quantity: 1,
    toJSON: jest.fn().mockReturnThis(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: mockCartModel,
        },
        {
          provide: getModelToken(CartItem.name),
          useValue: mockCartItemModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartModel = module.get<Model<CartDocument>>(getModelToken(Cart.name));
    cartItemModel = module.get<Model<CartItemDocument>>(getModelToken(CartItem.name));
    productModel = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return existing cart with items', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              ...mockCartItem,
              productId: mockProduct,
            },
          ]),
        }),
      });

      const result = await service.getCart(mockUser._id.toString());

      expect(mockCartModel.findOne).toHaveBeenCalledWith({
        userId: new Types.ObjectId(mockUser._id.toString()),
      });
      expect(result).toHaveProperty('totalItems');
      expect(result).toHaveProperty('totalPrice');
    });

    it('should create new cart if none exists', async () => {
      mockCartModel.findOne.mockResolvedValue(null);
      mockCartModel.create.mockResolvedValue(mockCart);
      mockCartItemModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.getCart(mockUser._id.toString());

      expect(mockCartModel.create).toHaveBeenCalledWith({
        userId: new Types.ObjectId(mockUser._id.toString()),
        items: [],
      });
      expect(result).toHaveProperty('totalItems', 0);
      expect(result).toHaveProperty('totalPrice', 0);
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.findOne.mockResolvedValue(null);
      mockCartItemModel.create.mockResolvedValue(mockCartItem);
      jest.spyOn(service, 'getCart').mockResolvedValue({
        ...mockCart,
        items: [mockCartItem],
        totalItems: 1,
        totalPrice: 99.99,
      } as any);

      const result = await service.addToCart(
        mockUser._id.toString(),
        mockProduct._id.toString(),
        1
      );

      expect(mockCartItemModel.create).toHaveBeenCalledWith({
        cartId: mockCart._id,
        productId: new Types.ObjectId(mockProduct._id.toString()),
        quantity: 1,
      });
      expect(result).toHaveProperty('totalItems', 1);
    });

    it('should update existing item quantity', async () => {
      const existingItem = {
        ...mockCartItem,
        quantity: 1,
        save: jest.fn(),
      };
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.findOne.mockResolvedValue(existingItem);
      jest.spyOn(service, 'getCart').mockResolvedValue({
        ...mockCart,
        items: [existingItem],
        totalItems: 2,
        totalPrice: 199.98,
      } as any);

      const result = await service.addToCart(
        mockUser._id.toString(),
        mockProduct._id.toString(),
        1
      );

      expect(existingItem.quantity).toBe(2);
      expect(existingItem.save).toHaveBeenCalled();
      expect(result).toHaveProperty('totalItems', 2);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.findOne.mockResolvedValue(mockCartItem);
      mockCartItemModel.findByIdAndDelete.mockResolvedValue(mockCartItem);
      mockCart.items = [mockCartItem._id];
      jest.spyOn(service, 'getCart').mockResolvedValue({
        ...mockCart,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      } as any);

      const result = await service.removeFromCart(
        mockUser._id.toString(),
        mockCartItem._id.toString()
      );

      expect(mockCartItemModel.findByIdAndDelete).toHaveBeenCalledWith(mockCartItem._id);
      expect(result).toHaveProperty('totalItems', 0);
    });

    it('should return null if cart not found', async () => {
      mockCartModel.findOne.mockResolvedValue(null);

      const result = await service.removeFromCart(
        mockUser._id.toString(),
        mockCartItem._id.toString()
      );

      expect(result).toBeNull();
    });
  });

  describe('updateCartItem', () => {
    it('should update item quantity', async () => {
      const itemToUpdate = {
        ...mockCartItem,
        quantity: 1,
        save: jest.fn(),
      };
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.findOne.mockResolvedValue(itemToUpdate);
      jest.spyOn(service, 'getCart').mockResolvedValue({
        ...mockCart,
        items: [itemToUpdate],
        totalItems: 3,
        totalPrice: 299.97,
      } as any);

      const result = await service.updateCartItem(
        mockUser._id.toString(),
        mockCartItem._id.toString(),
        3
      );

      expect(itemToUpdate.quantity).toBe(3);
      expect(itemToUpdate.save).toHaveBeenCalled();
      expect(result).toHaveProperty('totalItems', 3);
    });

    it('should remove item if quantity is 0', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.findOne.mockResolvedValue(mockCartItem);
      mockCartItemModel.findByIdAndDelete.mockResolvedValue(mockCartItem);
      jest.spyOn(service, 'getCart').mockResolvedValue({
        ...mockCart,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      } as any);

      const result = await service.updateCartItem(
        mockUser._id.toString(),
        mockCartItem._id.toString(),
        0
      );

      expect(mockCartItemModel.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toHaveProperty('totalItems', 0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCart);
      mockCartItemModel.deleteMany.mockResolvedValue({});

      const result = await service.clearCart(mockUser._id.toString());

      expect(mockCartItemModel.deleteMany).toHaveBeenCalledWith({
        cartId: mockCart._id,
      });
      expect(mockCart.items).toEqual([]);
      expect(mockCart.save).toHaveBeenCalled();
    });

    it('should return null if cart not found', async () => {
      mockCartModel.findOne.mockResolvedValue(null);

      const result = await service.clearCart(mockUser._id.toString());

      expect(result).toBeNull();
    });
  });
});
