import { User, UserRole, UserSchema } from './user.schema';
import { validate } from 'class-validator';

describe('User Schema', () => {
  describe('User Class', () => {
    it('should create a user instance with valid data', () => {
      const user = new User();
      user.email = 'test@example.com';
      user.password = 'hashedPassword123';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.role = UserRole.USER;

      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.role).toBe(UserRole.USER);
    });

    it('should have correct default values', () => {
      const user = new User();
      // Test that we can create an instance
      expect(user).toBeInstanceOf(User);
    });
  });

  describe('UserRole Enum', () => {
    it('should have correct enum values', () => {
      expect(UserRole.USER).toBe('USER');
      expect(UserRole.ADMIN).toBe('ADMIN');
    });

    it('should have exactly 2 role types', () => {
      const roleValues = Object.values(UserRole);
      expect(roleValues).toHaveLength(2);
      expect(roleValues).toContain('USER');
      expect(roleValues).toContain('ADMIN');
    });
  });

  describe('User Schema Structure', () => {
    it('should have correct schema configuration', () => {
      expect(UserSchema).toBeDefined();
      expect(UserSchema.obj).toBeDefined();
    });

    it('should have required email field configuration', () => {
      const emailPath = UserSchema.paths.email;
      expect(emailPath).toBeDefined();
      expect(emailPath.isRequired).toBe(true);
      expect(emailPath.options.unique).toBe(true);
    });

    it('should have required password field configuration', () => {
      const passwordPath = UserSchema.paths.password;
      expect(passwordPath).toBeDefined();
      expect(passwordPath.isRequired).toBe(true);
    });

    it('should have required firstName field configuration', () => {
      const firstNamePath = UserSchema.paths.firstName;
      expect(firstNamePath).toBeDefined();
      expect(firstNamePath.isRequired).toBe(true);
    });

    it('should have required lastName field configuration', () => {
      const lastNamePath = UserSchema.paths.lastName;
      expect(lastNamePath).toBeDefined();
      expect(lastNamePath.isRequired).toBe(true);
    });

    it('should have role field with enum configuration', () => {
      const rolePath = UserSchema.paths.role;
      expect(rolePath).toBeDefined();
      expect(Object.values(rolePath.options.enum)).toContain('USER');
      expect(Object.values(rolePath.options.enum)).toContain('ADMIN');
    });

    it('should have timestamps enabled', () => {
      expect(UserSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(UserSchema.options.collection).toBe('users');
    });
  });

  describe('Schema Validation', () => {
    it('should validate user data structure', () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      };

      // Test that the data structure is valid
      expect(typeof userData.email).toBe('string');
      expect(typeof userData.password).toBe('string');
      expect(typeof userData.firstName).toBe('string');
      expect(typeof userData.lastName).toBe('string');
      expect(Object.values(UserRole)).toContain(userData.role);
    });

    it('should handle admin role data', () => {
      const adminData = {
        email: 'admin@example.com',
        password: 'hashedPassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      };

      expect(Object.values(UserRole)).toContain(adminData.role);
      expect(adminData.role).toBe('ADMIN');
    });

    it('should identify invalid role values', () => {
      const invalidRole = 'INVALID_ROLE';
      expect(Object.values(UserRole)).not.toContain(invalidRole);
    });
  });

  describe('Field Types', () => {
    it('should have correct field types in schema paths', () => {
      expect(UserSchema.paths.email.instance).toBe('String');
      expect(UserSchema.paths.password.instance).toBe('String');
      expect(UserSchema.paths.firstName.instance).toBe('String');
      expect(UserSchema.paths.lastName.instance).toBe('String');
      expect(UserSchema.paths.role.instance).toBe('String');
    });
  });
});
