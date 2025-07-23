import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductCard } from '../ProductCard'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

// Mock stores
jest.mock('@/store/cartStore')
jest.mock('@/store/authStore')
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockToast = toast as jest.Mocked<typeof toast>

describe('ProductCard', () => {
  const mockProduct = {
    id: 'product-1',
    name: 'Test Product',
    price: 99.99,
    imageUrl: '/test-image.jpg',
    description: 'Test product description',
    category: 'electronics',
    rating: 4.5,
    reviewCount: 10,
    stock: 5,
    features: ['Feature 1', 'Feature 2'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockAddToCart = jest.fn()

  beforeEach(() => {
    mockUseCartStore.mockReturnValue({
      cart: null,
      isLoading: false,
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getProfile: jest.fn(),
    })

    jest.clearAllMocks()
  })

  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('electronics')).toBeInTheDocument()
    expect(screen.getByText('(10)')).toBeInTheDocument()
    expect(screen.getByText('Only 5 left in stock!')).toBeInTheDocument()
  })

  it('should display correct rating stars', () => {
    render(<ProductCard product={mockProduct} />)

    // For rating 4.5, should have 4 full stars, 1 half star, and 0 empty stars
    const starContainer = screen.getByText('(10)').previousElementSibling
    
    // Count all star-related SVG elements (includes both full stars and half-star elements)
    const allStarSvgs = starContainer?.querySelectorAll('svg')
    expect(allStarSvgs).toHaveLength(6) // 4 full + 2 for half star (outline + filled overlay)
    
    // Verify the rating is displayed
    expect(screen.getByText('(10)')).toBeInTheDocument()
  })

  it('should show out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)

    // There are multiple "Out of Stock" elements (badge and button), so get all
    const outOfStockElements = screen.getAllByText('Out of Stock')
    expect(outOfStockElements).toHaveLength(2) // badge and button
  })

  it('should add to cart when authenticated and button clicked', async () => {
    mockAddToCart.mockResolvedValue(undefined)

    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith('product-1')
    })
  })

  it('should show error when not authenticated and trying to add to cart', async () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getProfile: jest.fn(),
    })

    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)

    expect(mockToast.error).toHaveBeenCalledWith('Please log in to add items to cart')
    expect(mockAddToCart).not.toHaveBeenCalled()
  })

  it('should disable add to cart button when loading', () => {
    mockUseCartStore.mockReturnValue({
      cart: null,
      isLoading: true,
      addToCart: mockAddToCart,
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      fetchCart: jest.fn(),
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
    })

    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    expect(addToCartButton).toBeDisabled()
  })

  it('should disable add to cart when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)

    const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' })
    expect(outOfStockButton).toBeDisabled()
  })

  it('should not show add to cart button when showAddToCart is false', () => {
    render(<ProductCard product={mockProduct} showAddToCart={false} />)

    const addToCartButton = screen.queryByRole('button', { name: /add to cart/i })
    expect(addToCartButton).not.toBeInTheDocument()
  })

  it('should render product link correctly', () => {
    render(<ProductCard product={mockProduct} />)

    const productLink = screen.getByRole('link')
    expect(productLink).toHaveAttribute('href', '/products/product-1')
  })

  it('should handle add to cart error gracefully', async () => {
    mockAddToCart.mockRejectedValue(new Error('Network error'))

    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith('product-1')
    })

    // Error should be handled silently (as per the component code)
  })
})
