import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '../cartStore'
import { apiClient } from '@/lib/api'
import { AxiosResponse } from 'axios'
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

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>
const mockToast = toast as jest.Mocked<typeof toast>

// Helper function to create mock Axios responses
const createMockResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
})

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store state
    useCartStore.setState({
      cart: null,
      isLoading: false,
    })
    jest.clearAllMocks()
  })

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockCart = {
        id: '1',
        userId: 'user1',
        items: [
          {
            id: 'item1',
            productId: 'product1',
            quantity: 1,
            product: {
              id: 'product1',
              name: 'Test Product',
              price: 99.99,
            },
          },
        ],
        totalItems: 1,
        totalPrice: 99.99,
      }

      mockApiClient.post.mockResolvedValue(createMockResponse(mockCart))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addToCart('product1', 2)
      })

      expect(mockApiClient.post).toHaveBeenCalledWith('/cart/add', {
        productId: 'product1',
        quantity: 2,
      })
      expect(result.current.cart).toEqual(mockCart)
      expect(result.current.isLoading).toBe(false)
      expect(mockToast.success).toHaveBeenCalledWith('Item added to cart!')
    })

    it('should handle add to cart error', async () => {
      const error = {
        response: {
          data: { message: 'Product not found' },
        },
      }

      mockApiClient.post.mockRejectedValue(error)

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        try {
          await result.current.addToCart('invalid-product', 1)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.isLoading).toBe(false)
      expect(mockToast.error).toHaveBeenCalledWith('Product not found')
    })

    it('should use default quantity of 1', async () => {
      const mockCart = {
        id: '1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }

      mockApiClient.post.mockResolvedValue(createMockResponse(mockCart))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addToCart('product1')
      })

      expect(mockApiClient.post).toHaveBeenCalledWith('/cart/add', {
        productId: 'product1',
        quantity: 1,
      })
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart successfully', async () => {
      const updatedCart = {
        id: '1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }

      // Set initial cart state
      useCartStore.setState({
        cart: {
          id: '1',
          items: [{ id: 'item1', productId: 'product1', quantity: 1 }],
          totalItems: 1,
          totalPrice: 99.99,
        } as any,
      })

      mockApiClient.delete.mockResolvedValue(createMockResponse(updatedCart))
      mockApiClient.get.mockResolvedValue(createMockResponse(updatedCart))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.removeFromCart('item1')
      })

      expect(mockApiClient.delete).toHaveBeenCalledWith('/cart/remove/item1')
      expect(result.current.isLoading).toBe(false)
      expect(mockToast.success).toHaveBeenCalledWith('Item removed from cart!')
    })

    it('should handle remove from cart error', async () => {
      const error = {
        response: {
          data: { message: 'Item not found' },
        },
      }

      mockApiClient.delete.mockRejectedValue(error)

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        try {
          await result.current.removeFromCart('invalid-item')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.isLoading).toBe(false)
      expect(mockToast.error).toHaveBeenCalledWith('Item not found')
    })
  })

  describe('updateCartItem', () => {
    it('should update cart item quantity successfully', async () => {
      const updatedCart = {
        id: '1',
        items: [{ id: 'item1', productId: 'product1', quantity: 3 }],
        totalItems: 3,
        totalPrice: 299.97,
      }

      mockApiClient.put.mockResolvedValue(createMockResponse(updatedCart))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.updateCartItem('item1', 3)
      })

      expect(mockApiClient.put).toHaveBeenCalledWith('/cart/update', {
        itemId: 'item1',
        quantity: 3,
      })
      expect(result.current.cart).toEqual(updatedCart)
      expect(mockToast.success).toHaveBeenCalledWith('Cart updated!')
    })
  })

  describe('clearCart', () => {
    it('should clear cart', () => {
      useCartStore.setState({
        cart: {
          id: '1',
          items: [{ id: 'item1' }],
          totalItems: 1,
          totalPrice: 99.99,
        } as any,
      })

      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.cart).toBeNull()
    })
  })

  describe('fetchCart', () => {
    it('should fetch cart successfully', async () => {
      const mockCart = {
        id: '1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }

      mockApiClient.get.mockResolvedValue(createMockResponse(mockCart))

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.fetchCart()
      })

      expect(mockApiClient.get).toHaveBeenCalledWith('/cart')
      expect(result.current.cart).toEqual(mockCart)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle fetch cart error', async () => {
      const error = {
        response: {
          data: { message: 'Unauthorized' },
          status: 401,
        },
      }

      mockApiClient.get.mockRejectedValue(error)

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        try {
          await result.current.fetchCart()
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.isLoading).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch cart:', error)
      
      consoleSpy.mockRestore()
    })
  })

  describe('getTotalItems', () => {
    it('should return total items in cart', () => {
      useCartStore.setState({
        cart: {
          totalItems: 5,
        } as any,
      })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalItems()).toBe(5)
    })

    it('should return 0 when cart is null', () => {
      useCartStore.setState({ cart: null })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalItems()).toBe(0)
    })
  })

  describe('getTotalPrice', () => {
    it('should return total price of cart', () => {
      useCartStore.setState({
        cart: {
          totalPrice: 199.98,
        } as any,
      })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalPrice()).toBe(199.98)
    })

    it('should return 0 when cart is null', () => {
      useCartStore.setState({ cart: null })

      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalPrice()).toBe(0)
    })
  })
})
