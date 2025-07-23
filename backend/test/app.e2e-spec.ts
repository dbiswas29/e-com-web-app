import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    prismaService = app.get<PrismaService>(PrismaService);
    
    await app.init();

    // Clean database before tests
    await prismaService.cartItem.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.order.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();

    // Seed test data
    await seedTestData();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  async function seedTestData() {
    // Create test products
    await prismaService.product.createMany({
      data: [
        {
          id: 'product-1',
          name: 'Test Laptop',
          description: 'A test laptop',
          price: 999.99,
          category: 'electronics',
          imageUrl: '/test-laptop.jpg',
          stock: 10,
          features: '["8GB RAM", "256GB SSD"]',
          isActive: true,
        },
        {
          id: 'product-2',
          name: 'Test Phone',
          description: 'A test phone',
          price: 699.99,
          category: 'electronics',
          imageUrl: '/test-phone.jpg',
          stock: 5,
          features: '["5G", "128GB Storage"]',
          isActive: true,
        },
        {
          id: 'product-3',
          name: 'Test Shirt',
          description: 'A test shirt',
          price: 29.99,
          category: 'clothing',
          imageUrl: '/test-shirt.jpg',
          stock: 20,
          features: '["Cotton", "Machine Washable"]',
          isActive: true,
        },
      ],
    });
  }

  describe('Authentication (e2e)', () => {
    describe('/auth/register (POST)', () => {
      it('should register a new user', async () => {
        const registerDto = {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(201);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.user.email).toBe(registerDto.email);
        expect(response.body.user.firstName).toBe(registerDto.firstName);

        // Store for later tests
        authToken = response.body.accessToken;
        userId = response.body.user.id;
      });

      it('should fail with invalid email', async () => {
        const registerDto = {
          email: 'invalid-email',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(400);
      });

      it('should fail with duplicate email', async () => {
        const registerDto = {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(409);
      });
    });

    describe('/auth/login (POST)', () => {
      it('should login with valid credentials', async () => {
        const loginDto = {
          email: 'test@example.com',
          password: 'password123',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(200);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.user.email).toBe(loginDto.email);
      });

      it('should fail with invalid credentials', async () => {
        const loginDto = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };

        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(401);
      });
    });

    describe('/auth/profile (GET)', () => {
      it('should get user profile with valid token', async () => {
        const response = await request(app.getHttpServer())
          .get('/auth/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.email).toBe('test@example.com');
        expect(response.body.firstName).toBe('John');
      });

      it('should fail without token', async () => {
        await request(app.getHttpServer())
          .get('/auth/profile')
          .expect(401);
      });
    });
  });

  describe('Products (e2e)', () => {
    describe('/products (GET)', () => {
      it('should get all products', async () => {
        const response = await request(app.getHttpServer())
          .get('/products')
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('total');
        expect(response.body.data).toHaveLength(3);
      });

      it('should filter products by category', async () => {
        const response = await request(app.getHttpServer())
          .get('/products?category=electronics')
          .expect(200);

        expect(response.body.data).toHaveLength(2);
        response.body.data.forEach((product) => {
          expect(product.category).toBe('electronics');
        });
      });

      it('should filter products by multiple categories', async () => {
        const response = await request(app.getHttpServer())
          .get('/products?categories=electronics,clothing')
          .expect(200);

        expect(response.body.data).toHaveLength(3);
      });

      it('should filter products by price range', async () => {
        const response = await request(app.getHttpServer())
          .get('/products?minPrice=500&maxPrice=1000')
          .expect(200);

        response.body.data.forEach((product) => {
          expect(product.price).toBeGreaterThanOrEqual(500);
          expect(product.price).toBeLessThanOrEqual(1000);
        });
      });

      it('should search products', async () => {
        const response = await request(app.getHttpServer())
          .get('/products?search=laptop')
          .expect(200);

        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].name).toContain('Laptop');
      });

      it('should paginate products', async () => {
        const response = await request(app.getHttpServer())
          .get('/products?page=1&limit=2')
          .expect(200);

        expect(response.body.data).toHaveLength(2);
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(2);
      });
    });

    describe('/products/:id (GET)', () => {
      it('should get product by id', async () => {
        const response = await request(app.getHttpServer())
          .get('/products/product-1')
          .expect(200);

        expect(response.body.id).toBe('product-1');
        expect(response.body.name).toBe('Test Laptop');
      });

      it('should return null for non-existent product', async () => {
        await request(app.getHttpServer())
          .get('/products/non-existent')
          .expect(200);
      });
    });

    describe('/products/category/:category (GET)', () => {
      it('should get products by category', async () => {
        const response = await request(app.getHttpServer())
          .get('/products/category/electronics')
          .expect(200);

        expect(response.body).toHaveLength(2);
        response.body.forEach((product) => {
          expect(product.category).toBe('electronics');
        });
      });
    });
  });

  describe('Cart (e2e)', () => {
    describe('/cart (GET)', () => {
      it('should get empty cart for new user', async () => {
        const response = await request(app.getHttpServer())
          .get('/cart')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toBeNull();
      });

      it('should fail without authentication', async () => {
        await request(app.getHttpServer())
          .get('/cart')
          .expect(401);
      });
    });

    describe('/cart/add (POST)', () => {
      it('should add item to cart', async () => {
        const addToCartDto = {
          productId: 'product-1',
          quantity: 2,
        };

        const response = await request(app.getHttpServer())
          .post('/cart/add')
          .set('Authorization', `Bearer ${authToken}`)
          .send(addToCartDto)
          .expect(201);

        expect(response.body).toHaveProperty('items');
        expect(response.body.totalItems).toBe(2);
        expect(response.body.items[0].productId).toBe('product-1');
        expect(response.body.items[0].quantity).toBe(2);
      });

      it('should increase quantity for existing item', async () => {
        const addToCartDto = {
          productId: 'product-1',
          quantity: 1,
        };

        const response = await request(app.getHttpServer())
          .post('/cart/add')
          .set('Authorization', `Bearer ${authToken}`)
          .send(addToCartDto)
          .expect(201);

        expect(response.body.totalItems).toBe(3);
      });

      it('should fail without authentication', async () => {
        const addToCartDto = {
          productId: 'product-1',
          quantity: 1,
        };

        await request(app.getHttpServer())
          .post('/cart/add')
          .send(addToCartDto)
          .expect(401);
      });
    });

    describe('/cart/update/:itemId (PUT)', () => {
      let cartItemId: string;

      beforeAll(async () => {
        // Get current cart to find item ID
        const cartResponse = await request(app.getHttpServer())
          .get('/cart')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        cartItemId = cartResponse.body.items[0].id;
      });

      it('should update cart item quantity', async () => {
        const updateDto = {
          quantity: 5,
        };

        const response = await request(app.getHttpServer())
          .put(`/cart/update/${cartItemId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateDto)
          .expect(200);

        expect(response.body.totalItems).toBe(5);
      });
    });

    describe('/cart/remove/:itemId (DELETE)', () => {
      let cartItemId: string;

      beforeAll(async () => {
        // Add another item to test removal
        await request(app.getHttpServer())
          .post('/cart/add')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ productId: 'product-2', quantity: 1 })
          .expect(201);

        // Get current cart to find item ID
        const cartResponse = await request(app.getHttpServer())
          .get('/cart')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        cartItemId = cartResponse.body.items.find(
          (item) => item.productId === 'product-2'
        ).id;
      });

      it('should remove item from cart', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/cart/remove/${cartItemId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.totalItems).toBe(5); // Only product-1 left
      });
    });
  });

  describe('Users (e2e)', () => {
    describe('/users/profile (GET)', () => {
      it('should get user profile', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.email).toBe('test@example.com');
        expect(response.body.firstName).toBe('John');
      });
    });

    describe('/users/profile (PUT)', () => {
      it('should update user profile', async () => {
        const updateDto = {
          firstName: 'Johnny',
          lastName: 'Smith',
        };

        const response = await request(app.getHttpServer())
          .put('/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateDto)
          .expect(200);

        expect(response.body.firstName).toBe('Johnny');
        expect(response.body.lastName).toBe('Smith');
      });
    });
  });
});
