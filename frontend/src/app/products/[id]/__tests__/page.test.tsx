import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailsPage from '../page';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/store/cartStore');
jest.mock('@/store/authStore');
jest.mock('@/lib/api');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  imageUrl: 'https://example.com/product.jpg',
  category: 'Electronics',
  stock: 10,
  rating: 4.5,
  reviewCount: 25,
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
};

describe('ProductDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue(mockRouter as any);
    
    mockUseCartStore.mockReturnValue({
      addToCart: jest.fn(),
      isItemLoading: jest.fn().mockReturnValue(false),
    } as any);
    
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
    } as any);
    
    mockApiClient.get.mockResolvedValue({ 
      data: mockProduct,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any);
  });

  it('should render loading state initially', () => {
    render(<ProductDetailsPage />);
    
    // Check for loading skeleton elements (the Back button is not shown in loading state)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render product details after loading', async () => {
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getAllByText('Electronics')[0]).toBeInTheDocument(); // Use getAllByText to handle multiple elements
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(25 reviews)')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('should render product features', async () => {
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Features')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('should show out of stock when stock is 0', async () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    mockApiClient.get.mockResolvedValue({ 
      data: outOfStockProduct,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any);
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Out of Stock')[0]).toBeInTheDocument(); // Use getAllByText
    });
    
    const addToCartButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addToCartButton).toBeDisabled();
  });

  it('should show low stock warning when stock is low', async () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    mockApiClient.get.mockResolvedValue({ 
      data: lowStockProduct,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any);
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Only 3 left!')).toBeInTheDocument();
    });
    
    expect(screen.getByText('(Only 3 left)')).toBeInTheDocument();
  });

  it('should handle quantity selection', async () => {
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    const quantitySelect = screen.getByLabelText('Quantity:');
    fireEvent.change(quantitySelect, { target: { value: '3' } });
    
    expect(quantitySelect).toHaveValue('3');
  });

  it('should add product to cart when authenticated', async () => {
    const mockAddToCart = jest.fn();
    mockUseCartStore.mockReturnValue({
      addToCart: mockAddToCart,
      isItemLoading: jest.fn().mockReturnValue(false),
    } as any);
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });

  it('should show login prompt when not authenticated', async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
    } as any);
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    expect(mockToast.error).toHaveBeenCalledWith('Please log in to add items to cart');
  });

  it('should handle multiple quantities when adding to cart', async () => {
    const mockAddToCart = jest.fn();
    mockUseCartStore.mockReturnValue({
      addToCart: mockAddToCart,
      isItemLoading: jest.fn().mockReturnValue(false),
    } as any);
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    // Select quantity 3
    const quantitySelect = screen.getByLabelText('Quantity:');
    fireEvent.change(quantitySelect, { target: { value: '3' } });
    
    const addToCartButton = screen.getByRole('button', { name: /add 3 to cart/i });
    fireEvent.click(addToCartButton);
    
    // Should call addToCart 3 times
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledTimes(3);
    });
  });

  it('should handle API error and show error message', async () => {
    mockApiClient.get.mockRejectedValue(new Error('API Error'));
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });
    
    expect(screen.getByText("The product you're looking for doesn't exist or has been removed.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse All Products' })).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    const backButton = screen.getByText('Back to Products');
    fireEvent.click(backButton);
    
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('should handle image selection', async () => {
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    // Check that the main image thumbnail has the selected border style
    const mainImageThumbnail = screen.getByRole('button', { name: /test product view 1/i });
    expect(mainImageThumbnail).toHaveClass('border-primary-500');
  });

  it('should display product details grid', async () => {
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Product Details')).toBeInTheDocument();
    });
    
    expect(screen.getAllByText('Electronics')[1]).toBeInTheDocument(); // Use the second occurrence in details grid
    expect(screen.getByText('10 available')).toBeInTheDocument();
    expect(screen.getByText('4.5/5.0')).toBeInTheDocument();
  });

  it('should display loading state when adding to cart', async () => {
    mockUseCartStore.mockReturnValue({
      addToCart: jest.fn(),
      isItemLoading: jest.fn().mockReturnValue(true),
    } as any);
    
    render(<ProductDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    const addToCartButton = screen.getByRole('button', { name: /adding/i });
    expect(addToCartButton).toBeDisabled();
  });
});
