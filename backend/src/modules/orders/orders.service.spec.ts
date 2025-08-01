import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrdersService } from './orders.service';
import { Order, OrderDocument, OrderItem, OrderItemDocument, OrderStatus } from '../../schemas/order.schema';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: Model<OrderDocument>;
  let orderItemModel: Model<OrderItemDocument>;

  const mockOrderModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn(),
        }),
      }),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    }),
  };

  const mockOrderItemModel = {
    insertMany: jest.fn(),
  };

  const mockUserId = new Types.ObjectId();
  const mockOrderId = new Types.ObjectId();
  const mockProductId = new Types.ObjectId();
  const mockOrderItemId = new Types.ObjectId();

  const mockProduct = {
    _id: mockProductId,
    name: 'Test Product',
    price: 99.99,
    category: 'electronics',
    toJSON: jest.fn().mockReturnThis(),
  };

  const mockOrderItem = {
    _id: mockOrderItemId,
    orderId: mockOrderId,
    productId: mockProduct,
    quantity: 2,
    price: 99.99,
    toJSON: jest.fn().mockReturnThis(),
  };

  const mockOrderData = {
    userId: mockUserId.toString(),
    status: OrderStatus.PENDING,
    totalAmount: 199.98,
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country',
    },
    items: [
      {
        productId: mockProductId.toString(),
        quantity: 2,
        price: 99.99,
      },
    ],
  };

  const mockOrder = {
    _id: mockOrderId,
    userId: mockUserId,
    status: OrderStatus.PENDING,
    totalAmount: 199.98,
    shippingAddress: mockOrderData.shippingAddress,
    items: [mockOrderItemId],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(this),
    toJSON: jest.fn().mockReturnThis(),
  };

  const mockPopulatedOrder = {
    ...mockOrder,
    items: [mockOrderItem],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
        {
          provide: getModelToken(OrderItem.name),
          useValue: mockOrderItemModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get<Model<OrderDocument>>(getModelToken(Order.name));
    orderItemModel = module.get<Model<OrderItemDocument>>(getModelToken(OrderItem.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with items successfully', async () => {
      const createdOrderItems = [
        {
          _id: mockOrderItemId,
          orderId: mockOrderId,
          productId: mockProductId,
          quantity: 2,
          price: 99.99,
        },
      ];

      mockOrderModel.create.mockResolvedValue(mockOrder);
      mockOrderItemModel.insertMany.mockResolvedValue(createdOrderItems);
      
      // Mock the findOne method call at the end of create
      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPopulatedOrder),
        }),
      });

      const result = await service.create(mockOrderData);

      expect(mockOrderModel.create).toHaveBeenCalledWith({
        ...mockOrderData,
        userId: new Types.ObjectId(mockOrderData.userId),
      });
      expect(mockOrderItemModel.insertMany).toHaveBeenCalledWith([
        {
          orderId: mockOrderId,
          productId: new Types.ObjectId(mockOrderData.items[0].productId),
          quantity: mockOrderData.items[0].quantity,
          price: mockOrderData.items[0].price,
        },
      ]);
      expect(mockOrder.save).toHaveBeenCalled();
      expect(result).toEqual(mockPopulatedOrder);
    });

    it('should create an order without items', async () => {
      const orderDataWithoutItems = {
        ...mockOrderData,
        items: [],
      };

      mockOrderModel.create.mockResolvedValue(mockOrder);
      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOrder),
        }),
      });

      const result = await service.create(orderDataWithoutItems);

      expect(mockOrderModel.create).toHaveBeenCalledWith({
        ...orderDataWithoutItems,
        userId: new Types.ObjectId(orderDataWithoutItems.userId),
      });
      expect(mockOrderItemModel.insertMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders with populated items and products', async () => {
      const orders = [mockPopulatedOrder];
      
      mockOrderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(orders),
          }),
        }),
      });

      const result = await service.findAll();

      expect(mockOrderModel.find).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should return empty array when no orders exist', async () => {
      mockOrderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByUserId', () => {
    it('should return orders for a specific user', async () => {
      const userOrders = [mockPopulatedOrder];
      
      mockOrderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(userOrders),
          }),
        }),
      });

      const result = await service.findByUserId(mockUserId.toString());

      expect(mockOrderModel.find).toHaveBeenCalledWith({
        userId: new Types.ObjectId(mockUserId.toString()),
      });
      expect(result).toEqual(userOrders);
    });

    it('should return empty array when user has no orders', async () => {
      mockOrderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await service.findByUserId('507f1f77bcf86cd799439011');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPopulatedOrder),
        }),
      });

      const result = await service.findOne(mockOrderId.toString());

      expect(mockOrderModel.findById).toHaveBeenCalledWith(mockOrderId.toString());
      expect(result).toEqual(mockPopulatedOrder);
    });

    it('should return null when order not found', async () => {
      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await service.findOne('nonexistent-order-id');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update order status successfully', async () => {
      const updatedOrder = {
        ...mockPopulatedOrder,
        status: OrderStatus.CONFIRMED,
      };

      mockOrderModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedOrder),
        }),
      });

      const result = await service.updateStatus(mockOrderId.toString(), OrderStatus.CONFIRMED);

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrderId.toString(),
        { status: OrderStatus.CONFIRMED },
        { new: true }
      );
      expect(result).toEqual(updatedOrder);
    });

    it('should return null when order to update is not found', async () => {
      mockOrderModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await service.updateStatus('nonexistent-order-id', OrderStatus.CANCELLED);

      expect(result).toBeNull();
    });

    it('should handle all order status updates', async () => {
      const statuses = [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
      ];

      for (const status of statuses) {
        const updatedOrder = {
          ...mockPopulatedOrder,
          status,
        };

        mockOrderModel.findByIdAndUpdate.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedOrder),
          }),
        });

        const result = await service.updateStatus(mockOrderId.toString(), status);

        expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
          mockOrderId.toString(),
          { status },
          { new: true }
        );
        expect(result.status).toBe(status);
      }
    });
  });

  describe('alias methods', () => {
    it('should call create when createOrder is called', async () => {
      const orderData = {
        userId: '507f1f77bcf86cd799439011',
        items: [],
        totalAmount: 100,
      };

      const mockOrder = { _id: '6495ef000000000000000001', ...orderData };
      
      mockOrderModel.create.mockResolvedValue(mockOrder);
      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOrder),
        }),
      });

      const result = await service.createOrder(orderData);

      expect(mockOrderModel.create).toHaveBeenCalledWith({
        ...orderData,
        userId: expect.any(Types.ObjectId),
      });
      expect(result).toEqual(mockOrder);
    });

    it('should call findByUserId when getUserOrders is called', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockOrders = [{ _id: '6495ef000000000000000001', userId }];

      mockOrderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockOrders),
          }),
        }),
      });

      const result = await service.getUserOrders(userId);

      expect(mockOrderModel.find).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
      expect(result).toEqual(mockOrders);
    });

    it('should call findOne when getOrderById is called', async () => {
      const orderId = '6495ef000000000000000001';
      const userId = '507f1f77bcf86cd799439011';
      const mockOrder = { _id: orderId, userId: new Types.ObjectId(userId) };

      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOrder),
        }),
      });

      const result = await service.getOrderById(orderId, userId);

      expect(mockOrderModel.findById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it('should return null when getOrderById is called with wrong userId', async () => {
      const orderId = '6495ef000000000000000001';
      const userId = '507f1f77bcf86cd799439011';
      const wrongUserId = '507f1f77bcf86cd799439012';
      const mockOrder = { _id: orderId, userId: new Types.ObjectId(userId) };

      mockOrderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOrder),
        }),
      });

      const result = await service.getOrderById(orderId, wrongUserId);

      expect(result).toBeNull();
    });

    it('should call updateStatus when updateOrderStatus is called', async () => {
      const orderId = '6495ef000000000000000001';
      const status = 'CONFIRMED';
      const mockOrder = { _id: orderId, status: OrderStatus.CONFIRMED };

      mockOrderModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOrder),
        }),
      });

      const result = await service.updateOrderStatus(orderId, status);

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(orderId, { status: OrderStatus.CONFIRMED }, { new: true });
      expect(result).toEqual(mockOrder);
    });

    it('should call findAll when getAllOrders is called', async () => {
      const mockOrders = [{ _id: '6495ef000000000000000001' }];

      mockOrderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockOrders),
          }),
        }),
      });

      const result = await service.getAllOrders();

      expect(mockOrderModel.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockOrders);
    });
  });
});