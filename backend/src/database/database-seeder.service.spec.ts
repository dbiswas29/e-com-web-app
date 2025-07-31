import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseSeeder } from './database-seeder.service';
import { User, UserDocument } from '../schemas/user.schema';
import { Product, ProductDocument } from '../schemas/product.schema';

describe('DatabaseSeeder', () => {
  let service: DatabaseSeeder;
  let userModel: Model<UserDocument>;
  let productModel: Model<ProductDocument>;

  const mockUserModel = {
    deleteMany: jest.fn(),
    insertMany: jest.fn(),
    countDocuments: jest.fn(),
  };

  const mockProductModel = {
    deleteMany: jest.fn(),
    insertMany: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    // Clear environment variables
    delete process.env.SEED_DATABASE;
    delete process.env.CLEAR_DATABASE;
    delete process.env.NODE_ENV;
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseSeeder,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<DatabaseSeeder>(DatabaseSeeder);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    productModel = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call seedDatabase when SEED_DATABASE is true', async () => {
      process.env.NODE_ENV = 'development';
      process.env.SEED_DATABASE = 'true';
      const seedDatabaseSpy = jest.spyOn(service as any, 'seedDatabase').mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(seedDatabaseSpy).toHaveBeenCalled();
    });

    it('should not call seedDatabase when SEED_DATABASE is false', async () => {
      process.env.NODE_ENV = 'development';
      process.env.SEED_DATABASE = 'false';
      const seedDatabaseSpy = jest.spyOn(service as any, 'seedDatabase').mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(seedDatabaseSpy).not.toHaveBeenCalled();
    });

    it('should not call seedDatabase when NODE_ENV is not development', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SEED_DATABASE = 'true';
      const seedDatabaseSpy = jest.spyOn(service as any, 'seedDatabase').mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(seedDatabaseSpy).not.toHaveBeenCalled();
    });
  });

  describe('seedDatabase', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      process.env.SEED_DATABASE = 'true';
      process.env.CLEAR_DATABASE = 'true';
    });

    it('should seed users and products successfully', async () => {
      mockUserModel.deleteMany.mockResolvedValue({});
      mockProductModel.deleteMany.mockResolvedValue({});
      const seedUsersSpy = jest.spyOn(service as any, 'seedUsers').mockResolvedValue(undefined);
      const seedProductsSpy = jest.spyOn(service as any, 'seedProducts').mockResolvedValue(undefined);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await (service as any).seedDatabase();

      expect(mockUserModel.deleteMany).toHaveBeenCalled();
      expect(mockProductModel.deleteMany).toHaveBeenCalled();
      expect(seedUsersSpy).toHaveBeenCalled();
      expect(seedProductsSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('✅ Database seeding completed!');

      consoleSpy.mockRestore();
    });
  });
});
