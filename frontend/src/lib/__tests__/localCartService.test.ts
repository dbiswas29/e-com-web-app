import { localCartService } from '../localCartService'
import { localProductService } from '../localDataService'

// Mock the product service
jest.mock('../localDataService', () => ({
  localProductService: {
    getProductById: jest.fn(),
    getProducts: jest.fn(),
  },
}))

const mockProductService = localProductService as jest.Mocked<typeof localProductService>

// Mock window and localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: 'accessToken=local_token_user123_1234567890_abc123',
})

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('LocalCartService', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
    
    // Mock sample products
    const mockProduct = {
      id: 'product1',
      name: 'Test Product',
      price: 10,
      imageUrl: '/test.jpg',
      description: 'Test description',
      category: 'test',
      rating: 4.5,
      reviewCount: 10,
      stock: 100,
      features: ['feature1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockProductService.getProductById.mockResolvedValue(mockProduct)
    mockProductService.getProducts.mockResolvedValue({
      data: [mockProduct],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    })
  })

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const result = await localCartService.addToCart('product1', 2)
      
      expect(result.success).toBe(true)
      expect(result.cart.items).toHaveLength(1)
      expect(result.cart.items[0]).toMatchObject({
        productId: 'product1',
        quantity: 2,
      })
    })

    it('should update quantity for existing item', async () => {
      // First add an item
      await localCartService.addToCart('product1', 2)
      
      // Add the same item again
      const result = await localCartService.addToCart('product1', 1)
      
      expect(result.success).toBe(true)
      expect(result.cart.items).toHaveLength(1)
      expect(result.cart.items[0].quantity).toBe(3)
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      // First add an item
      const addResult = await localCartService.addToCart('product1', 2)
      const itemId = addResult.cart.items[0].id
      
      // Remove the item
      const result = await localCartService.removeFromCart(itemId)
      
      expect(result.success).toBe(true)
      expect(result.cart.items).toHaveLength(0)
    })
  })

  describe('updateCartItem', () => {
    it('should update item quantity', async () => {
      // First add an item
      const addResult = await localCartService.addToCart('product1', 2)
      const itemId = addResult.cart.items[0].id
      
      // Update the quantity
      const result = await localCartService.updateCartItem(itemId, 5)
      
      expect(result.success).toBe(true)
      expect(result.cart.items[0].quantity).toBe(5)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      // Add some items
      await localCartService.addToCart('product1', 2)
      
      // Clear the cart
      const result = await localCartService.clearCart()
      
      expect(result.success).toBe(true)
      expect(result.cart.items).toHaveLength(0)
    })
  })

  describe('getUserCart', () => {
    it('should return current user cart', async () => {
      // Add an item first
      await localCartService.addToCart('product1', 2)
      
      // Get the cart
      const cart = await localCartService.getUserCart('user123')
      
      expect(cart.userId).toBe('user123')
      expect(cart.items).toHaveLength(1)
    })
  })
})
