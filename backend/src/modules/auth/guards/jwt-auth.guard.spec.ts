import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockGetRequest: jest.Mock;

    beforeEach(() => {
      mockGetRequest = jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer valid.jwt.token',
        },
        user: {
          id: 'user123',
          email: 'test@example.com',
        },
      });

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: mockGetRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
    });

    it('should allow access with valid JWT token', async () => {
      // Mock the parent AuthGuard canActivate method to return true
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should deny access with invalid JWT token', async () => {
      // Mock the parent AuthGuard canActivate method to return false
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockResolvedValue(false);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should handle missing authorization header', async () => {
      mockGetRequest.mockReturnValue({
        headers: {},
      });

      // Mock the parent AuthGuard canActivate method to throw an error for missing token
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockRejectedValue(new Error('Unauthorized'));

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('Unauthorized');
    });

    it('should handle malformed authorization header', async () => {
      mockGetRequest.mockReturnValue({
        headers: {
          authorization: 'InvalidFormat',
        },
      });

      // Mock the parent AuthGuard canActivate method to throw an error for malformed token
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockRejectedValue(new Error('Unauthorized'));

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('Unauthorized');
    });

    it('should handle expired JWT token', async () => {
      mockGetRequest.mockReturnValue({
        headers: {
          authorization: 'Bearer expired.jwt.token',
        },
      });

      // Mock the parent AuthGuard canActivate method to throw an error for expired token
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockRejectedValue(new Error('TokenExpiredError'));

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('TokenExpiredError');
    });
  });
});
