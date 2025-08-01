import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E Tests (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-e2e'),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication (e2e)', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('user');
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body.user.email).toBe(testUser.email);
          authToken = response.body.accessToken;
          userId = response.body.user._id;
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('user');
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body.user.email).toBe(testUser.email);
        });
    });

    it('/auth/profile (GET) - should require authentication', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('/auth/profile (GET) - should return user profile when authenticated', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBe(testUser.email);
          expect(response.body.firstName).toBe(testUser.firstName);
        });
    });
  });

  describe('Products (e2e)', () => {
    it('/products (GET) - should return products list', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('products');
          expect(response.body).toHaveProperty('total');
          expect(Array.isArray(response.body.products)).toBe(true);
        });
    });

    it('/products?category=electronics (GET) - should filter by category', () => {
      return request(app.getHttpServer())
        .get('/products?category=electronics')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('products');
          expect(Array.isArray(response.body.products)).toBe(true);
        });
    });

    it('/products?search=test (GET) - should search products', () => {
      return request(app.getHttpServer())
        .get('/products?search=test')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('products');
          expect(Array.isArray(response.body.products)).toBe(true);
        });
    });
  });

  describe('Cart (e2e)', () => {
    it('/cart (GET) - should require authentication', () => {
      return request(app.getHttpServer())
        .get('/cart')
        .expect(401);
    });

    it('/cart (GET) - should return empty cart for new user', () => {
      return request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('items');
          expect(Array.isArray(response.body.items)).toBe(true);
          expect(response.body.items).toHaveLength(0);
        });
    });

    it('/cart/add (POST) - should require authentication', () => {
      return request(app.getHttpServer())
        .post('/cart/add')
        .send({ productId: 'test-product-id', quantity: 1 })
        .expect(401);
    });
  });

  describe('Orders (e2e)', () => {
    it('/orders (GET) - should require authentication', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect(401);
    });

    it('/orders (GET) - should return empty orders list for new user', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body).toHaveLength(0);
        });
    });

    it('/orders (POST) - should require authentication', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({ items: [] })
        .expect(401);
    });
  });

  describe('Users (e2e)', () => {
    it('/users/profile (GET) - should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .expect(401);
    });

    it('/users/profile (GET) - should return user profile', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBe('test@example.com');
          expect(response.body.firstName).toBe('Test');
        });
    });

    it('/users/profile (PUT) - should require authentication', () => {
      return request(app.getHttpServer())
        .put('/users/profile')
        .send({ firstName: 'Updated' })
        .expect(401);
    });

    it('/users/profile (PUT) - should update user profile', () => {
      return request(app.getHttpServer())
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ firstName: 'Updated' })
        .expect(200)
        .then((response) => {
          expect(response.body.firstName).toBe('Updated');
        });
    });
  });
});
