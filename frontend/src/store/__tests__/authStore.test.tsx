import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuthStore } from '../authStore'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

// Mock dependencies
jest.mock('@/lib/api')
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock cookies-next
jest.mock('cookies-next', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}))

// Mock cartStore import
jest.mock('../cartStore', () => ({
  useCartStore: {
    getState: () => ({
      fetchCart: jest.fn(),
      clearCart: jest.fn(),
    }),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>
const mockedToast = toast as jest.Mocked<typeof toast>

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store state
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
    })
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle successful login', async () => {
    const mockUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    const mockResponse = {
      data: {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any

    mockedApiClient.post.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login('john@example.com', 'password123')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(mockedToast.success).toHaveBeenCalledWith('Login successful!')
  })

  it('should handle login error', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    }

    mockedApiClient.post.mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      try {
        await result.current.login('john@example.com', 'wrongpassword')
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(mockedToast.error).toHaveBeenCalledWith('Invalid credentials')
  })

  it('should handle successful registration', async () => {
    const mockUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    const mockResponse = {
      data: {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any

    mockedApiClient.post.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(mockedToast.success).toHaveBeenCalledWith('Registration successful!')
  })

  it('should handle registration error', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Email already exists'
        }
      }
    }

    mockedApiClient.post.mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        })
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(mockedToast.error).toHaveBeenCalledWith('Email already exists')
  })

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuthStore())

    // First set some user data
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(mockedToast.success).toHaveBeenCalledWith('Logged out successfully')
  })

  it('should handle successful checkAuth', async () => {
    const mockUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    mockedApiClient.get.mockResolvedValue({ 
      data: mockUser,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any)

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.checkAuth()
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle checkAuth error', async () => {
    mockedApiClient.get.mockRejectedValue(new Error('Unauthorized'))

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.checkAuth()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should set loading state during login', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    const mockResponse = {
      data: {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any

    mockedApiClient.post.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    )

    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.login('john@example.com', 'password123')
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should set loading state during registration', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    const mockResponse = {
      data: {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any

    mockedApiClient.post.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    )

    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle login with default error message', async () => {
    mockedApiClient.post.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      try {
        await result.current.login('john@example.com', 'password123')
      } catch (error) {
        // Expected to throw
      }
    })

    expect(mockedToast.error).toHaveBeenCalledWith('Login failed')
  })

  it('should handle registration with default error message', async () => {
    mockedApiClient.post.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        })
      } catch (error) {
        // Expected to throw
      }
    })

    expect(mockedToast.error).toHaveBeenCalledWith('Registration failed')
  })
})
