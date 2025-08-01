import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    it('should get user profile successfully', async () => {
      const expectedResult = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(expectedResult);

      const result = await controller.getProfile(mockRequest);

      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedResult);
    });

    it('should handle user not found', async () => {
      mockUsersService.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.getProfile(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateProfile', () => {
    const mockRequest = {
      user: {
        id: '1',
      },
    };

    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    };

    it('should update user profile successfully', async () => {
      const expectedResult = {
        id: '1',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updateProfile.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(mockRequest, updateData);

      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(expectedResult);
    });

    it('should update profile with partial data', async () => {
      const partialUpdateData = {
        firstName: 'Jane',
      };

      const expectedResult = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updateProfile.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(mockRequest, partialUpdateData);

      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('1', partialUpdateData);
      expect(result).toEqual(expectedResult);
    });

    it('should handle user not found during update', async () => {
      mockUsersService.updateProfile.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.updateProfile(mockRequest, updateData),
      ).rejects.toThrow(NotFoundException);
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('1', updateData);
    });

    it('should handle invalid email format', async () => {
      const invalidUpdateData = {
        email: 'invalid-email',
      };

      mockUsersService.updateProfile.mockRejectedValue(
        new Error('Invalid email format'),
      );

      await expect(
        controller.updateProfile(mockRequest, invalidUpdateData),
      ).rejects.toThrow('Invalid email format');
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('1', invalidUpdateData);
    });
  });
});
