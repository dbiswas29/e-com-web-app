import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto';

describe('Auth DTOs', () => {
  describe('LoginDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'invalid-email',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail validation with empty email', async () => {
      const dto = plainToClass(LoginDto, {
        email: '',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with short password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: '123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation with empty password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with missing fields', async () => {
      const dto = plainToClass(LoginDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(2); // email and password errors
    });
  });

  describe('RegisterDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail validation with short password', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: '123',
        firstName: 'John',
        lastName: 'Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation with empty firstName', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
        firstName: '',
        lastName: 'Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with empty lastName', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with missing required fields', async () => {
      const dto = plainToClass(RegisterDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(4); // email, password, firstName, lastName errors
    });

    it('should fail validation with non-string firstName', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
        firstName: 123,
        lastName: 'Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('RefreshTokenDto', () => {
    it('should pass validation with valid refresh token', async () => {
      const dto = plainToClass(RefreshTokenDto, {
        refreshToken: 'valid.jwt.refresh.token',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with empty refresh token', async () => {
      const dto = plainToClass(RefreshTokenDto, {
        refreshToken: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('refreshToken');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with non-string refresh token', async () => {
      const dto = plainToClass(RefreshTokenDto, {
        refreshToken: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('refreshToken');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation with missing refresh token', async () => {
      const dto = plainToClass(RefreshTokenDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('refreshToken');
    });
  });
});
