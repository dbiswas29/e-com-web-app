import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CartItems } from '../CartItems'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

// Mock stores
jest.mock('@/store/cartStore')
jest.mock('@/store/authStore')

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ href, children, className }: any) {
    return <a href={href} className={className}>{children}</a>
  }
})

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

describe('CartItems', () => {
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

  const mockFetchCart = jest.fn()
  const mockUpdateCartItem = jest.fn()
  const mockRemoveFromCart = jest.fn()
  const mockIsCartItemLoading = jest.fn(() => false)

  beforeEach(() => {
    mockUseCartStore.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateCartItem: mockUpdateCartItem,
      clearCart: jest.fn(),
      fetchCart: mockFetchCart,
      getTotalItems: jest.fn(() => 2),
      getTotalPrice: jest.fn(() => 199.98),
      isItemLoading: jest.fn(() => false),
      isCartItemLoading: mockIsCartItemLoading,
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

  it('should render cart items when authenticated and has items', () => {
    render(<CartItems />)

    expect(screen.getByText('Cart Items (2)')).toBeInTheDocument()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
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

    render(<CartItems />)

    expect(screen.getByText('Please login to view your cart')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    mockUseCartStore.mockReturnValue({
      cart: null,
      isLoading: true,
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

    render(<CartItems />)

    expect(screen.getByText('Cart Items')).toBeInTheDocument()
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(3)
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

    render(<CartItems />)

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Start Shopping')).toBeInTheDocument()
  })

  it('should update cart item quantity', async () => {
    mockUpdateCartItem.mockResolvedValue(undefined)

    render(<CartItems />)

    // Find the plus button to increase quantity
    const plusButtons = screen.getAllByRole('button')
    const plusButton = plusButtons.find(button => 
      button.querySelector('svg path[d*="M12 4.5v15m7.5-7.5h-15"]')
    )
    
    if (plusButton) {
      fireEvent.click(plusButton)
      
      await waitFor(() => {
        expect(mockUpdateCartItem).toHaveBeenCalledWith('item-1', 3)
      })
    }
  })

  it('should remove cart item', async () => {
    mockRemoveFromCart.mockResolvedValue(undefined)

    render(<CartItems />)

    const removeButton = screen.getByTitle('Remove item')
    fireEvent.click(removeButton)

    await waitFor(() => {
      expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1')
    })
  })

  it('should increase quantity with plus button', async () => {
    mockUpdateCartItem.mockResolvedValue(undefined)

    render(<CartItems />)

    const buttons = screen.getAllByRole('button')
    const plusButton = buttons.find(button => button.querySelector('svg path[d*="M12 4.5v15m7.5-7.5h-15"]'))
    
    fireEvent.click(plusButton!)

    await waitFor(() => {
      expect(mockUpdateCartItem).toHaveBeenCalledWith('item-1', 3)
    })
  })

  it('should decrease quantity with minus button', async () => {
    mockUpdateCartItem.mockResolvedValue(undefined)

    render(<CartItems />)

    const buttons = screen.getAllByRole('button')
    const minusButton = buttons.find(button => button.querySelector('svg path[d*="M5 12h14"]'))
    
    fireEvent.click(minusButton!)

    await waitFor(() => {
      expect(mockUpdateCartItem).toHaveBeenCalledWith('item-1', 1)
    })
  })

  it('should disable buttons when item is loading', () => {
    mockIsCartItemLoading.mockReturnValue(true)

    render(<CartItems />)

    const buttons = screen.getAllByRole('button')
    const minusButton = buttons.find(button => button.querySelector('svg path[d*="M5 12h14"]'))
    const plusButton = buttons.find(button => button.querySelector('svg path[d*="M12 4.5v15m7.5-7.5h-15"]'))
    const removeButton = screen.getByTitle('Remove item')

    expect(minusButton).toBeDisabled()
    expect(plusButton).toBeDisabled()
    expect(removeButton).toBeDisabled()
  })

  it('should fetch cart on mount when authenticated', () => {
    render(<CartItems />)

    expect(mockFetchCart).toHaveBeenCalled()
  })

  it('should not fetch cart on mount when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    render(<CartItems />)

    expect(mockFetchCart).not.toHaveBeenCalled()
  })
})
