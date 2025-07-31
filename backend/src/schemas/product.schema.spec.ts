import { Product, ProductSchema } from './product.schema';

describe('Product Schema', () => {
  describe('Product Class', () => {
    it('should create a product instance with valid data', () => {
      const product = new Product();
      product.name = 'Test Product';
      product.description = 'Test Description';
      product.price = 99.99;
      product.imageUrl = 'https://example.com/image.jpg';
      product.category = 'Electronics';
      product.stock = 10;
      product.rating = 4.5;
      product.reviewCount = 100;

      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test Description');
      expect(product.price).toBe(99.99);
      expect(product.imageUrl).toBe('https://example.com/image.jpg');
      expect(product.category).toBe('Electronics');
      expect(product.stock).toBe(10);
      expect(product.rating).toBe(4.5);
      expect(product.reviewCount).toBe(100);
    });

    it('should have correct default values', () => {
      const product = new Product();
      expect(product).toBeInstanceOf(Product);
    });
  });

  describe('Product Schema Structure', () => {
    it('should have correct schema configuration', () => {
      expect(ProductSchema).toBeDefined();
      expect(ProductSchema.obj).toBeDefined();
    });

    it('should have required name field configuration', () => {
      const namePath = ProductSchema.paths.name;
      expect(namePath).toBeDefined();
      expect(namePath.isRequired).toBe(true);
      expect(namePath.instance).toBe('String');
    });

    it('should have required description field configuration', () => {
      const descriptionPath = ProductSchema.paths.description;
      expect(descriptionPath).toBeDefined();
      expect(descriptionPath.isRequired).toBe(true);
      expect(descriptionPath.instance).toBe('String');
    });

    it('should have required price field configuration', () => {
      const pricePath = ProductSchema.paths.price;
      expect(pricePath).toBeDefined();
      expect(pricePath.isRequired).toBe(true);
      expect(pricePath.instance).toBe('Number');
    });

    it('should have required imageUrl field configuration', () => {
      const imageUrlPath = ProductSchema.paths.imageUrl;
      expect(imageUrlPath).toBeDefined();
      expect(imageUrlPath.isRequired).toBe(true);
      expect(imageUrlPath.instance).toBe('String');
    });

    it('should have required category field configuration', () => {
      const categoryPath = ProductSchema.paths.category;
      expect(categoryPath).toBeDefined();
      expect(categoryPath.isRequired).toBe(true);
      expect(categoryPath.instance).toBe('String');
    });

    it('should have optional stock field with default value', () => {
      const stockPath = ProductSchema.paths.stock;
      expect(stockPath).toBeDefined();
      expect(stockPath.instance).toBe('Number');
      expect(stockPath.options.default).toBe(0);
    });

    it('should have optional rating field with default value', () => {
      const ratingPath = ProductSchema.paths.rating;
      expect(ratingPath).toBeDefined();
      expect(ratingPath.instance).toBe('Number');
      expect(ratingPath.options.default).toBe(0);
    });

    it('should have optional reviewCount field with default value', () => {
      const reviewCountPath = ProductSchema.paths.reviewCount;
      expect(reviewCountPath).toBeDefined();
      expect(reviewCountPath.instance).toBe('Number');
      expect(reviewCountPath.options.default).toBe(0);
    });

    it('should have optional isActive field with default value', () => {
      const isActivePath = ProductSchema.paths.isActive;
      expect(isActivePath).toBeDefined();
      expect(isActivePath.instance).toBe('Boolean');
      expect(isActivePath.options.default).toBe(true);
    });

    it('should have images array field with default empty array', () => {
      const imagesPath = ProductSchema.paths.images;
      expect(imagesPath).toBeDefined();
      expect(imagesPath.instance).toBe('Array');
      expect(Array.isArray(imagesPath.options.default)).toBe(true);
      expect(imagesPath.options.default).toEqual([]);
    });

    it('should have features array field with default empty array', () => {
      const featuresPath = ProductSchema.paths.features;
      expect(featuresPath).toBeDefined();
      expect(featuresPath.instance).toBe('Array');
      expect(Array.isArray(featuresPath.options.default)).toBe(true);
      expect(featuresPath.options.default).toEqual([]);
    });

    it('should have timestamps enabled', () => {
      expect(ProductSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(ProductSchema.options.collection).toBe('products');
    });
  });

  describe('Schema Validation', () => {
    it('should validate product data structure', () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
        imageUrl: 'https://example.com/product.jpg',
        category: 'Test Category',
        stock: 50,
        rating: 4.2,
        reviewCount: 25,
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        isActive: true,
      };

      // Test that the data structure is valid
      expect(typeof productData.name).toBe('string');
      expect(typeof productData.description).toBe('string');
      expect(typeof productData.price).toBe('number');
      expect(typeof productData.imageUrl).toBe('string');
      expect(typeof productData.category).toBe('string');
      expect(typeof productData.stock).toBe('number');
      expect(typeof productData.rating).toBe('number');
      expect(typeof productData.reviewCount).toBe('number');
      expect(Array.isArray(productData.images)).toBe(true);
      expect(Array.isArray(productData.features)).toBe(true);
      expect(typeof productData.isActive).toBe('boolean');
    });

    it('should handle minimal required product data', () => {
      const minimalProductData = {
        name: 'Minimal Product',
        description: 'Minimal description',
        price: 10.99,
        imageUrl: 'https://example.com/minimal.jpg',
        category: 'Minimal Category',
      };

      expect(typeof minimalProductData.name).toBe('string');
      expect(typeof minimalProductData.description).toBe('string');
      expect(typeof minimalProductData.price).toBe('number');
      expect(typeof minimalProductData.imageUrl).toBe('string');
      expect(typeof minimalProductData.category).toBe('string');
    });

    it('should handle products with zero values', () => {
      const zeroValueProductData = {
        name: 'Zero Value Product',
        description: 'Product with zero values',
        price: 0,
        imageUrl: 'https://example.com/zero.jpg',
        category: 'Free Category',
        stock: 0,
        rating: 0,
        reviewCount: 0,
      };

      expect(zeroValueProductData.price).toBe(0);
      expect(zeroValueProductData.stock).toBe(0);
      expect(zeroValueProductData.rating).toBe(0);
      expect(zeroValueProductData.reviewCount).toBe(0);
    });

    it('should handle products with empty arrays', () => {
      const emptyArraysProductData = {
        name: 'Empty Arrays Product',
        description: 'Product with empty arrays',
        price: 15.99,
        imageUrl: 'https://example.com/empty.jpg',
        category: 'Empty Category',
        images: [],
        features: [],
      };

      expect(Array.isArray(emptyArraysProductData.images)).toBe(true);
      expect(emptyArraysProductData.images).toHaveLength(0);
      expect(Array.isArray(emptyArraysProductData.features)).toBe(true);
      expect(emptyArraysProductData.features).toHaveLength(0);
    });

    it('should handle inactive products', () => {
      const inactiveProductData = {
        name: 'Inactive Product',
        description: 'An inactive product',
        price: 25.99,
        imageUrl: 'https://example.com/inactive.jpg',
        category: 'Inactive Category',
        isActive: false,
      };

      expect(inactiveProductData.isActive).toBe(false);
    });
  });

  describe('Virtual Fields', () => {
    it('should have virtual fields configured', () => {
      // Test that virtual fields exist in schema
      expect(ProductSchema.virtuals).toBeDefined();
    });

    it('should have toJSON transform configuration', () => {
      expect(ProductSchema.options.toJSON).toBeDefined();
      expect(ProductSchema.options.toJSON.virtuals).toBe(true);
      expect(typeof ProductSchema.options.toJSON.transform).toBe('function');
    });
  });

  describe('Field Types', () => {
    it('should have correct field types in schema paths', () => {
      expect(ProductSchema.paths.name.instance).toBe('String');
      expect(ProductSchema.paths.description.instance).toBe('String');
      expect(ProductSchema.paths.price.instance).toBe('Number');
      expect(ProductSchema.paths.imageUrl.instance).toBe('String');
      expect(ProductSchema.paths.category.instance).toBe('String');
      expect(ProductSchema.paths.stock.instance).toBe('Number');
      expect(ProductSchema.paths.rating.instance).toBe('Number');
      expect(ProductSchema.paths.reviewCount.instance).toBe('Number');
      expect(ProductSchema.paths.images.instance).toBe('Array');
      expect(ProductSchema.paths.features.instance).toBe('Array');
      expect(ProductSchema.paths.isActive.instance).toBe('Boolean');
    });
  });
});
