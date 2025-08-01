import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    createOrder: jest.fn(),
    getUserOrders: jest.fn(),
    getOrderById: jest.fn(),
    updateOrderStatus: jest.fn(),
    getAllOrders: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    const orderData = {
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          price: 29.99,
        },
        {
          productId: 'product-2',
          quantity: 1,
          price: 39.99,
        },
      ],
      shippingInfo: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        phone: '555-1234',
      },
      billingInfo: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        phone: '555-1234',
      },
    };

    it('should create order successfully', async () => {
      const expectedResult = {
        id: 'order-1',
        userId: '1',
        items: orderData.items,
        totalAmount: 99.97,
        status: 'pending',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        phone: '555-1234',
        createdAt: new Date(),
      };

      mockOrdersService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(mockRequest, orderData);

      expect(mockOrdersService.createOrder).toHaveBeenCalledWith({
        userId: '1',
        items: orderData.items,
        totalAmount: 99.97,
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        phone: '555-1234',
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty items array', async () => {
      const invalidOrderData = {
        ...orderData,
        items: [],
      };

      mockOrdersService.createOrder.mockRejectedValue(
        new BadRequestException('Order must contain at least one item'),
      );

      await expect(
        controller.createOrder(mockRequest, invalidOrderData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should calculate total amount correctly', async () => {
      const expectedTotalAmount = 2 * 29.99 + 1 * 39.99; // 99.97
      const expectedResult = {
        id: 'order-1',
        userId: '1',
        items: orderData.items,
        totalAmount: expectedTotalAmount,
        status: 'pending',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        phone: '555-1234',
        createdAt: new Date(),
      };

      mockOrdersService.createOrder.mockResolvedValue(expectedResult);

      await controller.createOrder(mockRequest, orderData);

      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: expectedTotalAmount,
        }),
      );
    });
  });

  describe('getUserOrders', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should get user orders successfully', async () => {
      const expectedResult = [
        {
          id: 'order-1',
          userId: '1',
          totalAmount: 99.97,
          status: 'pending',
          createdAt: new Date(),
        },
        {
          id: 'order-2',
          userId: '1',
          totalAmount: 149.99,
          status: 'completed',
          createdAt: new Date(),
        },
      ];

      mockOrdersService.getUserOrders.mockResolvedValue(expectedResult);

      const result = await controller.getUserOrders(mockRequest);

      expect(mockOrdersService.getUserOrders).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array for user with no orders', async () => {
      mockOrdersService.getUserOrders.mockResolvedValue([]);

      const result = await controller.getUserOrders(mockRequest);

      expect(mockOrdersService.getUserOrders).toHaveBeenCalledWith('1');
      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should get order by ID successfully', async () => {
      const orderId = 'order-1';
      const expectedResult = {
        id: 'order-1',
        userId: '1',
        totalAmount: 99.97,
        status: 'pending',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 29.99,
          },
        ],
        createdAt: new Date(),
      };

      mockOrdersService.getOrderById.mockResolvedValue(expectedResult);

      const result = await controller.getOrderById(mockRequest, orderId);

      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('order-1', '1');
      expect(result).toEqual(expectedResult);
    });

    it('should handle order not found', async () => {
      const orderId = 'non-existent-order';

      mockOrdersService.getOrderById.mockRejectedValue(
        new NotFoundException('Order not found'),
      );

      await expect(
        controller.getOrderById(mockRequest, orderId),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('non-existent-order', '1');
    });

    it('should handle order belonging to different user', async () => {
      const orderId = 'order-2';

      mockOrdersService.getOrderById.mockRejectedValue(
        new NotFoundException('Order not found'),
      );

      await expect(
        controller.getOrderById(mockRequest, orderId),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('order-2', '1');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = 'order-1';
      const statusUpdate = { status: 'shipped' };

      const expectedResult = {
        id: 'order-1',
        userId: '1',
        totalAmount: 99.97,
        status: 'shipped',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersService.updateOrderStatus.mockResolvedValue(expectedResult);

      const result = await controller.updateOrderStatus(orderId, statusUpdate);

      expect(mockOrdersService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'shipped');
      expect(result).toEqual(expectedResult);
    });

    it('should handle order not found', async () => {
      const orderId = 'non-existent-order';
      const statusUpdate = { status: 'shipped' };

      mockOrdersService.updateOrderStatus.mockRejectedValue(
        new NotFoundException('Order not found'),
      );

      await expect(
        controller.updateOrderStatus(orderId, statusUpdate),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrdersService.updateOrderStatus).toHaveBeenCalledWith('non-existent-order', 'shipped');
    });

    it('should handle invalid status', async () => {
      const orderId = 'order-1';
      const statusUpdate = { status: 'invalid-status' };

      mockOrdersService.updateOrderStatus.mockRejectedValue(
        new BadRequestException('Invalid order status'),
      );

      await expect(
        controller.updateOrderStatus(orderId, statusUpdate),
      ).rejects.toThrow(BadRequestException);
      expect(mockOrdersService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'invalid-status');
    });
  });

  describe('getAllOrders', () => {
    it('should get all orders successfully (admin)', async () => {
      const expectedResult = [
        {
          id: 'order-1',
          userId: '1',
          totalAmount: 99.97,
          status: 'pending',
          createdAt: new Date(),
        },
        {
          id: 'order-2',
          userId: '2',
          totalAmount: 149.99,
          status: 'completed',
          createdAt: new Date(),
        },
      ];

      mockOrdersService.getAllOrders.mockResolvedValue(expectedResult);

      const result = await controller.getAllOrders();

      expect(mockOrdersService.getAllOrders).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no orders exist', async () => {
      mockOrdersService.getAllOrders.mockResolvedValue([]);

      const result = await controller.getAllOrders();

      expect(mockOrdersService.getAllOrders).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
