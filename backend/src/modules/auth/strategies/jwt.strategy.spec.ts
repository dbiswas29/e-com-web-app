import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with id and email from payload', async () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 9999999999,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
      });
    });

    it('should extract id from sub field in payload', async () => {
      const payload = {
        sub: '507f1f77bcf86cd799439011',
        email: 'user@test.com',
        iat: 1234567890,
        exp: 9999999999,
      };

      const result = await strategy.validate(payload);

      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.email).toBe('user@test.com');
    });

    it('should handle payload with additional fields', async () => {
      const payload = {
        sub: 'user456',
        email: 'another@example.com',
        role: 'admin',
        firstName: 'John',
        lastName: 'Doe',
        iat: 1234567890,
        exp: 9999999999,
      };

      const result = await strategy.validate(payload);

      // Should only return id and email, ignoring other fields
      expect(result).toEqual({
        id: 'user456',
        email: 'another@example.com',
      });
      expect(result).not.toHaveProperty('role');
      expect(result).not.toHaveProperty('firstName');
      expect(result).not.toHaveProperty('lastName');
    });

    it('should handle payload with undefined sub', async () => {
      const payload = {
        sub: undefined,
        email: 'test@example.com',
        iat: 1234567890,
        exp: 9999999999,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: undefined,
        email: 'test@example.com',
      });
    });

    it('should handle payload with undefined email', async () => {
      const payload = {
        sub: 'user789',
        email: undefined,
        iat: 1234567890,
        exp: 9999999999,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user789',
        email: undefined,
      });
    });

    it('should handle empty payload', async () => {
      const payload = {};

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: undefined,
        email: undefined,
      });
    });
  });
});
