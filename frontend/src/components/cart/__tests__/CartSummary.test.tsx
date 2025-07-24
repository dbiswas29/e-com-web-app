import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CartSummary } from '../CartSummary'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

// Mock stores
jest.mock('@/store/cartStore')
jest.mock('@/store/authStore')

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

describe('CartSummary', () => {
  const mockCart = {
    id: 'cart-1',
    userId: 'user-1',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        quantity: 2,
        product: {
          id: 'product-1',
          name: 'Test Product',
          price: 99.99,
          imageUrl: '/test-image.jpg',
          description: 'Test description',
          category: 'electronics',
          rating: 4.5,
          reviewCount: 10,
          stock: 5,
          features: ['Feature 1'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    ],
    totalItems: 2,
    totalPrice: 199.98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  beforeEach(() => {
    mockUseCartStore.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 2),
      getTotalPrice: jest.fn(() => 199.98),
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: jest.fn(() => false),
    })

    mockUseAuthStore.mockReturnValue({
      user: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    jest.clearAllMocks()
  })

  it('should render order summary when authenticated and has items', () => {
    render(<CartSummary />)

    expect(screen.getByText('Order Summary')).toBeInTheDocument()
    expect(screen.getByText(/Subtotal \(2 items\)/)).toBeInTheDocument()
    expect(screen.getByText('$199.98')).toBeInTheDocument()
    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('Tax')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('should show login prompt when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    render(<CartSummary />)

    expect(screen.getByText('Please login to view your order summary')).toBeInTheDocument()
    expect(screen.getByText('Sign in to see your cart total and proceed to checkout')).toBeInTheDocument()
  })

  it('should calculate free shipping for orders over $50', () => {
    mockUseCartStore.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 2),
      getTotalPrice: jest.fn(() => 199.98), // Over $50
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: jest.fn(() => false),
    })

    render(<CartSummary />)

    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('should calculate shipping for orders under $50', () => {
    mockUseCartStore.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 1),
      getTotalPrice: jest.fn(() => 25.00), // Under $50
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: jest.fn(() => false),
    })

    render(<CartSummary />)

    expect(screen.getByText('$5.99')).toBeInTheDocument()
  })

  it('should show checkout button when has items', () => {
    render(<CartSummary />)

    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument()
  })

  it('should show empty cart message when no items', () => {
    mockUseCartStore.mockReturnValue({
      cart: { ...mockCart, items: [], totalItems: 0, totalPrice: 0 },
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: jest.fn(() => false),
    })

    render(<CartSummary />)

    expect(screen.getByText('Cart is Empty')).toBeInTheDocument()
    expect(screen.getByText('Free shipping on orders over $50')).toBeInTheDocument()
  })

  it('should calculate tax correctly', () => {
    const subtotal = 100.00
    const expectedTax = subtotal * 0.08 // 8% tax
    
    mockUseCartStore.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 2),
      getTotalPrice: jest.fn(() => subtotal),
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: jest.fn(() => false),
    })

    render(<CartSummary />)

    expect(screen.getByText(`$${expectedTax.toFixed(2)}`)).toBeInTheDocument()
  })

  it('should calculate total correctly with tax and shipping', () => {
    const subtotal = 30.00 // Under $50 for shipping
    const shipping = 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax
    
    mockUseCartStore.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 1),
      getTotalPrice: jest.fn(() => subtotal),
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: jest.fn(() => false),
    })

    render(<CartSummary />)

    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument()
  })

  it('should show item count correctly', () => {
    render(<CartSummary />)

    expect(screen.getByText(/2 items/)).toBeInTheDocument()
  })
})
