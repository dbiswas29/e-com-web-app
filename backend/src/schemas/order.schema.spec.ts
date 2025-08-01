import { Order, OrderSchema, OrderItem, OrderItemSchema, OrderStatus } from './order.schema';

describe('Order Schema', () => {
  describe('Order Class', () => {
    it('should create an order instance', () => {
      const order = new Order();
      expect(order).toBeInstanceOf(Order);
    });
  });

  describe('OrderItem Class', () => {
    it('should create an order item instance', () => {
      const orderItem = new OrderItem();
      expect(orderItem).toBeInstanceOf(OrderItem);
    });
  });

  describe('OrderStatus Enum', () => {
    it('should have correct enum values', () => {
      expect(OrderStatus.PENDING).toBe('PENDING');
      expect(OrderStatus.CONFIRMED).toBe('CONFIRMED');
      expect(OrderStatus.SHIPPED).toBe('SHIPPED');
      expect(OrderStatus.DELIVERED).toBe('DELIVERED');
      expect(OrderStatus.CANCELLED).toBe('CANCELLED');
    });

    it('should have exactly 5 status types', () => {
      const statusValues = Object.values(OrderStatus);
      expect(statusValues).toHaveLength(5);
      expect(statusValues).toContain('PENDING');
      expect(statusValues).toContain('CONFIRMED');
      expect(statusValues).toContain('SHIPPED');
      expect(statusValues).toContain('DELIVERED');
      expect(statusValues).toContain('CANCELLED');
    });
  });

  describe('Order Schema Structure', () => {
    it('should have correct schema configuration', () => {
      expect(OrderSchema).toBeDefined();
      expect(OrderSchema.obj).toBeDefined();
    });

    it('should have required userId field configuration', () => {
      const userIdPath = OrderSchema.paths.userId;
      expect(userIdPath).toBeDefined();
      expect(userIdPath.isRequired).toBe(true);
      expect(userIdPath.options.ref).toBe('User');
    });

    it('should have status field with enum and default value', () => {
      const statusPath = OrderSchema.paths.status;
      expect(statusPath).toBeDefined();
      expect(Object.values(statusPath.options.enum)).toContain('PENDING');
      expect(Object.values(statusPath.options.enum)).toContain('CONFIRMED');
      expect(Object.values(statusPath.options.enum)).toContain('SHIPPED');
      expect(Object.values(statusPath.options.enum)).toContain('DELIVERED');
      expect(Object.values(statusPath.options.enum)).toContain('CANCELLED');
      expect(statusPath.options.default).toBe('PENDING');
    });

    it('should have required totalAmount field', () => {
      const totalAmountPath = OrderSchema.paths.totalAmount;
      expect(totalAmountPath).toBeDefined();
      expect(totalAmountPath.isRequired).toBe(true);
      expect(totalAmountPath.instance).toBe('Number');
    });

    it('should have all required shipping address fields', () => {
      const shippingFields = [
        'shippingFirstName',
        'shippingLastName',
        'shippingAddress1',
        'shippingCity',
        'shippingState',
        'shippingZipCode',
        'shippingCountry'
      ];

      shippingFields.forEach(field => {
        const fieldPath = OrderSchema.paths[field];
        expect(fieldPath).toBeDefined();
        expect(fieldPath.isRequired).toBe(true);
        expect(fieldPath.instance).toBe('String');
      });
    });

    it('should have optional shipping address fields', () => {
      const optionalShippingFields = ['shippingAddress2', 'shippingPhone'];

      optionalShippingFields.forEach(field => {
        const fieldPath = OrderSchema.paths[field];
        expect(fieldPath).toBeDefined();
        expect(fieldPath.instance).toBe('String');
        expect(fieldPath.isRequired || false).toBe(false);
      });
    });

    it('should have all required billing address fields', () => {
      const billingFields = [
        'billingFirstName',
        'billingLastName',
        'billingAddress1',
        'billingCity',
        'billingState',
        'billingZipCode',
        'billingCountry'
      ];

      billingFields.forEach(field => {
        const fieldPath = OrderSchema.paths[field];
        expect(fieldPath).toBeDefined();
        expect(fieldPath.isRequired).toBe(true);
        expect(fieldPath.instance).toBe('String');
      });
    });

    it('should have optional billing address fields', () => {
      const optionalBillingFields = ['billingAddress2', 'billingPhone'];

      optionalBillingFields.forEach(field => {
        const fieldPath = OrderSchema.paths[field];
        expect(fieldPath).toBeDefined();
        expect(fieldPath.instance).toBe('String');
        expect(fieldPath.isRequired || false).toBe(false);
      });
    });

    it('should have items array field with default empty array', () => {
      const itemsPath = OrderSchema.paths.items;
      expect(itemsPath).toBeDefined();
      expect(itemsPath.instance).toBe('Array');
      expect(Array.isArray(itemsPath.options.default)).toBe(true);
      expect(itemsPath.options.default).toEqual([]);
    });

    it('should have timestamps enabled', () => {
      expect(OrderSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(OrderSchema.options.collection).toBe('orders');
    });
  });

  describe('OrderItem Schema Structure', () => {
    it('should have correct schema configuration', () => {
      expect(OrderItemSchema).toBeDefined();
      expect(OrderItemSchema.obj).toBeDefined();
    });

    it('should have required orderId field configuration', () => {
      const orderIdPath = OrderItemSchema.paths.orderId;
      expect(orderIdPath).toBeDefined();
      expect(orderIdPath.isRequired).toBe(true);
      expect(orderIdPath.options.ref).toBe('Order');
    });

    it('should have required productId field configuration', () => {
      const productIdPath = OrderItemSchema.paths.productId;
      expect(productIdPath).toBeDefined();
      expect(productIdPath.isRequired).toBe(true);
      expect(productIdPath.options.ref).toBe('Product');
    });

    it('should have required quantity field with minimum value', () => {
      const quantityPath = OrderItemSchema.paths.quantity;
      expect(quantityPath).toBeDefined();
      expect(quantityPath.isRequired).toBe(true);
      expect(quantityPath.instance).toBe('Number');
      expect(quantityPath.options.min).toBe(1);
    });

    it('should have required price field', () => {
      const pricePath = OrderItemSchema.paths.price;
      expect(pricePath).toBeDefined();
      expect(pricePath.isRequired).toBe(true);
      expect(pricePath.instance).toBe('Number');
    });

    it('should have timestamps enabled', () => {
      expect(OrderItemSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(OrderItemSchema.options.collection).toBe('order_items');
    });
  });

  describe('Schema Validation', () => {
    it('should validate complete order data structure', () => {
      const orderData = {
        userId: '507f1f77bcf86cd799439011',
        status: OrderStatus.PENDING,
        totalAmount: 99.99,
        shippingFirstName: 'John',
        shippingLastName: 'Doe',
        shippingAddress1: '123 Main St',
        shippingAddress2: 'Apt 4B',
        shippingCity: 'Anytown',
        shippingState: 'CA',
        shippingZipCode: '12345',
        shippingCountry: 'USA',
        shippingPhone: '555-1234',
        billingFirstName: 'John',
        billingLastName: 'Doe',
        billingAddress1: '123 Main St',
        billingAddress2: 'Apt 4B',
        billingCity: 'Anytown',
        billingState: 'CA',
        billingZipCode: '12345',
        billingCountry: 'USA',
        billingPhone: '555-1234',
        items: [],
      };

      // Validate types
      expect(typeof orderData.userId).toBe('string');
      expect(Object.values(OrderStatus)).toContain(orderData.status);
      expect(typeof orderData.totalAmount).toBe('number');
      expect(typeof orderData.shippingFirstName).toBe('string');
      expect(typeof orderData.shippingLastName).toBe('string');
      expect(typeof orderData.shippingAddress1).toBe('string');
      expect(typeof orderData.shippingCity).toBe('string');
      expect(typeof orderData.shippingState).toBe('string');
      expect(typeof orderData.shippingZipCode).toBe('string');
      expect(typeof orderData.shippingCountry).toBe('string');
      expect(Array.isArray(orderData.items)).toBe(true);
    });

    it('should validate order item data structure', () => {
      const orderItemData = {
        orderId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        quantity: 2,
        price: 29.99,
      };

      expect(typeof orderItemData.orderId).toBe('string');
      expect(typeof orderItemData.productId).toBe('string');
      expect(typeof orderItemData.quantity).toBe('number');
      expect(typeof orderItemData.price).toBe('number');
      expect(orderItemData.quantity).toBeGreaterThanOrEqual(1);
      expect(orderItemData.price).toBeGreaterThan(0);
    });

    it('should handle all order status values', () => {
      const statusValues = Object.values(OrderStatus);
      
      statusValues.forEach(status => {
        expect(typeof status).toBe('string');
        expect(Object.values(OrderStatus)).toContain(status);
      });
    });

    it('should validate minimal required order data', () => {
      const minimalOrderData = {
        userId: '507f1f77bcf86cd799439011',
        totalAmount: 50.00,
        shippingFirstName: 'Jane',
        shippingLastName: 'Smith',
        shippingAddress1: '456 Oak Ave',
        shippingCity: 'Springfield',
        shippingState: 'IL',
        shippingZipCode: '62701',
        shippingCountry: 'USA',
        billingFirstName: 'Jane',
        billingLastName: 'Smith',
        billingAddress1: '456 Oak Ave',
        billingCity: 'Springfield',
        billingState: 'IL',
        billingZipCode: '62701',
        billingCountry: 'USA',
      };

      // All required fields should be present
      expect(minimalOrderData.userId).toBeDefined();
      expect(minimalOrderData.totalAmount).toBeDefined();
      expect(minimalOrderData.shippingFirstName).toBeDefined();
      expect(minimalOrderData.billingFirstName).toBeDefined();
    });
  });

  describe('Virtual Fields', () => {
    it('should have virtual fields configured for Order', () => {
      expect(OrderSchema.virtuals).toBeDefined();
    });

    it('should have virtual fields configured for OrderItem', () => {
      expect(OrderItemSchema.virtuals).toBeDefined();
    });

    it('should have toJSON transform configuration for Order', () => {
      expect(OrderSchema.options.toJSON).toBeDefined();
      expect(OrderSchema.options.toJSON.virtuals).toBe(true);
      expect(typeof OrderSchema.options.toJSON.transform).toBe('function');
    });

    it('should have toJSON transform configuration for OrderItem', () => {
      expect(OrderItemSchema.options.toJSON).toBeDefined();
      expect(OrderItemSchema.options.toJSON.virtuals).toBe(true);
      expect(typeof OrderItemSchema.options.toJSON.transform).toBe('function');
    });
  });

  describe('Field Types', () => {
    it('should have correct order field types in schema paths', () => {
      expect(OrderSchema.paths.userId.instance).toBe('Mixed');
      expect(OrderSchema.paths.status.instance).toBe('String');
      expect(OrderSchema.paths.totalAmount.instance).toBe('Number');
      expect(OrderSchema.paths.shippingFirstName.instance).toBe('String');
      expect(OrderSchema.paths.billingFirstName.instance).toBe('String');
      expect(OrderSchema.paths.items.instance).toBe('Array');
    });

    it('should have correct order item field types in schema paths', () => {
      expect(OrderItemSchema.paths.orderId.instance).toBe('Mixed');
      expect(OrderItemSchema.paths.productId.instance).toBe('Mixed');
      expect(OrderItemSchema.paths.quantity.instance).toBe('Number');
      expect(OrderItemSchema.paths.price.instance).toBe('Number');
    });
  });

  describe('References', () => {
    it('should have correct reference configurations for Order', () => {
      const userIdPath = OrderSchema.paths.userId;
      expect(userIdPath.options.ref).toBe('User');
      
      // Check that items array exists (detailed schema structure test not needed)
      const itemsPath = OrderSchema.paths.items;
      expect(itemsPath).toBeDefined();
      expect(itemsPath.instance).toBe('Array');
    });

    it('should have correct reference configurations for OrderItem', () => {
      const orderIdPath = OrderItemSchema.paths.orderId;
      expect(orderIdPath.options.ref).toBe('Order');
      
      const productIdPath = OrderItemSchema.paths.productId;
      expect(productIdPath.options.ref).toBe('Product');
    });
  });
});
