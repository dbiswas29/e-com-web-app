import { localAuthService } from '../localAuthService'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

// Mock window object and global localStorage
Object.defineProperty(global, 'window', {
  writable: true,
  value: {
    localStorage: localStorageMock,
  }
})

Object.defineProperty(global, 'localStorage', {
  writable: true,
  value: localStorageMock,
})

describe('LocalAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    document.cookie = ''
  })

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'user@test.com',
        password: 'password123'
      }

      const result = await localAuthService.login(credentials)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user.email).toBe(credentials.email)
      expect(result.user).not.toHaveProperty('password')
    })

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }

      await expect(localAuthService.login(credentials)).rejects.toThrow('User not found')
    })

    it('should reject wrong password', async () => {
      const credentials = {
        email: 'user@test.com',
        password: 'wrongpassword'
      }

      await expect(localAuthService.login(credentials)).rejects.toThrow('Invalid password')
    })
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      }

      // Mock localStorage to return empty users array initially
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ users: [] }))

      const result = await localAuthService.register(userData)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user.email).toBe(userData.email)
      expect(result.user.firstName).toBe(userData.firstName)
      expect(result.user.lastName).toBe(userData.lastName)
      expect(result.user).not.toHaveProperty('password')
    })

    it('should reject registration with existing email', async () => {
      const userData = {
        email: 'user@test.com', // This email already exists in default users
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }

      await expect(localAuthService.register(userData)).rejects.toThrow('User with this email already exists')
    })
  })

  describe('getProfile', () => {
    it('should return user profile for valid token', async () => {
      const token = 'local_token_local-user-2_1234567890_abc123'

      const result = await localAuthService.getProfile(token)

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('firstName')
      expect(result).toHaveProperty('lastName')
      expect(result).not.toHaveProperty('password')
    })

    it('should reject invalid token', async () => {
      const token = 'invalid_token'

      await expect(localAuthService.getProfile(token)).rejects.toThrow('Invalid token')
    })

    it('should reject token for non-existent user', async () => {
      const token = 'local_token_non-existent-user_1234567890_abc123'

      await expect(localAuthService.getProfile(token)).rejects.toThrow('User not found')
    })
  })

  describe('getAllUsers', () => {
    it('should return all users without passwords', () => {
      const users = localAuthService.getAllUsers()

      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBeGreaterThan(0)
      
      users.forEach(user => {
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('firstName')
        expect(user).toHaveProperty('lastName')
        expect(user).not.toHaveProperty('password')
      })
    })
  })

  describe('resetUsers', () => {
    it('should reset users to default', () => {
      localAuthService.resetUsers()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ecommerce_users')
    })
  })
})
