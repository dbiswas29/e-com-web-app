import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '../cartStore'
import { localCartService } from '@/lib/localCartService'
import toast from 'react-hot-toast'

// Mock dependencies
jest.mock('@/lib/localCartService')
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockLocalCartService = localCartService as jest.Mocked<typeof localCartService>
const mockToast = toast as jest.Mocked<typeof toast>

describe('useCartStore', () => {
  const mockCart = {
    id: 'local-cart',
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
          imageUrl: '/test.jpg',
          description: 'Test description',
          category: 'electronics',
          rating: 4.5,
          reviewCount: 10,
          stock: 5,
          features: ['Feature 1'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    totalItems: 1,
    totalPrice: 99.99,
    updatedAt: new Date().toISOString(),
  }

  beforeEach(() => {
    // Reset store state
    useCartStore.setState({
      cart: null,
      isLoading: false,
    })
    jest.clearAllMocks()
  })

  describe('fetchCart', () => {
    it('should fetch cart successfully', async () => {
      mockLocalCartService.getCart.mockResolvedValue(mockCart)

      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.fetchCart()
      })

      expect(mockLocalCartService.getCart).toHaveBeenCalled()
      expect(result.current.cart).toEqual(mockCart)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('getTotalItems', () => {
    it('should return total items count', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        useCartStore.setState({ cart: mockCart })
      })

      expect(result.current.getTotalItems()).toBe(1)
    })

    it('should return 0 when cart is null', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalItems()).toBe(0)
    })
  })

  describe('getTotalPrice', () => {
    it('should return total price', () => {
      const { result } = renderHook(() => useCartStore())
      
      act(() => {
        useCartStore.setState({ cart: mockCart })
      })

      expect(result.current.getTotalPrice()).toBe(99.99)
    })

    it('should return 0 when cart is null', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.getTotalPrice()).toBe(0)
    })
  })
})
