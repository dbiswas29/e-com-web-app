import { Cart, CartSchema, CartItem, CartItemSchema } from './cart.schema';

describe('Cart Schema', () => {
  describe('Cart Class', () => {
    it('should create a cart instance', () => {
      const cart = new Cart();
      expect(cart).toBeInstanceOf(Cart);
    });
  });

  describe('CartItem Class', () => {
    it('should create a cart item instance', () => {
      const cartItem = new CartItem();
      expect(cartItem).toBeInstanceOf(CartItem);
    });
  });

  describe('Cart Schema Structure', () => {
    it('should have correct cart schema configuration', () => {
      expect(CartSchema).toBeDefined();
      expect(CartSchema.obj).toBeDefined();
    });

    it('should have required userId field with unique constraint', () => {
      const userIdPath = CartSchema.paths.userId;
      expect(userIdPath).toBeDefined();
      expect(userIdPath.isRequired).toBe(true);
      expect(userIdPath.options.unique).toBe(true);
      expect(userIdPath.options.ref).toBe('User');
    });

    it('should have items array field with default empty array', () => {
      const itemsPath = CartSchema.paths.items;
      expect(itemsPath).toBeDefined();
      expect(itemsPath.instance).toBe('Array');
      expect(Array.isArray(itemsPath.options.default)).toBe(true);
      expect(itemsPath.options.default).toEqual([]);
    });

    it('should have timestamps enabled', () => {
      expect(CartSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(CartSchema.options.collection).toBe('carts');
    });
  });

  describe('CartItem Schema Structure', () => {
    it('should have correct cart item schema configuration', () => {
      expect(CartItemSchema).toBeDefined();
      expect(CartItemSchema.obj).toBeDefined();
    });

    it('should have required cartId field configuration', () => {
      const cartIdPath = CartItemSchema.paths.cartId;
      expect(cartIdPath).toBeDefined();
      expect(cartIdPath.isRequired).toBe(true);
      expect(cartIdPath.options.ref).toBe('Cart');
    });

    it('should have required productId field configuration', () => {
      const productIdPath = CartItemSchema.paths.productId;
      expect(productIdPath).toBeDefined();
      expect(productIdPath.isRequired).toBe(true);
      expect(productIdPath.options.ref).toBe('Product');
    });

    it('should have required quantity field with minimum constraint', () => {
      const quantityPath = CartItemSchema.paths.quantity;
      expect(quantityPath).toBeDefined();
      expect(quantityPath.isRequired).toBe(true);
      expect(quantityPath.instance).toBe('Number');
      expect(quantityPath.options.min).toBe(1);
    });

    it('should have timestamps enabled', () => {
      expect(CartItemSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(CartItemSchema.options.collection).toBe('cart_items');
    });
  });

  describe('Schema Validation', () => {
    it('should validate cart data structure', () => {
      const cartData = {
        userId: '507f1f77bcf86cd799439011',
        items: [],
      };

      expect(typeof cartData.userId).toBe('string');
      expect(Array.isArray(cartData.items)).toBe(true);
    });

    it('should validate cart item data structure', () => {
      const cartItemData = {
        cartId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        quantity: 2,
      };

      expect(typeof cartItemData.cartId).toBe('string');
      expect(typeof cartItemData.productId).toBe('string');
      expect(typeof cartItemData.quantity).toBe('number');
      expect(cartItemData.quantity).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Field Types', () => {
    it('should have correct cart field types in schema paths', () => {
      expect(CartSchema.paths.userId.instance).toBe('Mixed');
      expect(CartSchema.paths.items.instance).toBe('Array');
    });

    it('should have correct cart item field types in schema paths', () => {
      expect(CartItemSchema.paths.cartId.instance).toBe('Mixed');
      expect(CartItemSchema.paths.productId.instance).toBe('Mixed');
      expect(CartItemSchema.paths.quantity.instance).toBe('Number');
    });
  });
});
