import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { ProductsGrid } from '../ProductsGrid';
import { apiClient } from '@/lib/api';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock ProductCard component
jest.mock('../ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid={`product-${product.id}`}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>{product.category}</p>
    </div>
  ),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockApiClient = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

const mockSearchParams = {
  get: jest.fn(),
};

const mockProducts = [
  {
    id: 1,
    name: 'Laptop',
    price: 999,
    category: 'Electronics',
    description: 'High-performance laptop',
    images: ['laptop.jpg'],
  },
  {
    id: 2,
    name: 'T-Shirt',
    price: 29,
    category: 'Clothing',
    description: 'Comfortable cotton t-shirt',
    images: ['tshirt.jpg'],
  },
  {
    id: 3,
    name: 'Book',
    price: 15,
    category: 'Books',
    description: 'Educational book',
    images: ['book.jpg'],
  },
];

describe('ProductsGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    
    // Default API response
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 3,
        page: 1,
        limit: 12,
        totalPages: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    // Default search params (no filters)
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return null;
        case 'category': return null;
        case 'minPrice': return null;
        case 'maxPrice': return null;
        case 'search': return null;
        default: return null;
      }
    });
  });

  it('should render products grid', async () => {
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<ProductsGrid />);
    
    // Should show loading skeletons with animate-pulse class
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(6);
  });

  it('should fetch products on mount', async () => {
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', {
        page: 1,
        limit: 12,
      });
    });
  });

  it('should fetch products with category filter', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'categories') return 'Electronics';
      return null;
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', {
        page: 1,
        limit: 12,
        categories: 'Electronics',
      });
    });
  });

  it('should support legacy single category parameter', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'category') return 'Electronics';
      return null;
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', {
        page: 1,
        limit: 12,
        category: 'Electronics',
      });
    });
  });

  it('should fetch products with price range filter', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'minPrice': return '50';
        case 'maxPrice': return '500';
        default: return null;
      }
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', {
        page: 1,
        limit: 12,
        minPrice: '50',
        maxPrice: '500',
      });
    });
  });

  it('should fetch products with search query', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'search') return 'laptop';
      return null;
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', {
        page: 1,
        limit: 12,
        search: 'laptop',
      });
    });
  });

  it('should handle multiple filters simultaneously', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return 'Electronics,Clothing';
        case 'minPrice': return '20';
        case 'maxPrice': return '1000';
        case 'search': return 'premium';
        default: return null;
      }
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', {
        page: 1,
        limit: 12,
        categories: 'Electronics,Clothing',
        minPrice: '20',
        maxPrice: '1000',
        search: 'premium',
      });
    });
  });

  it('should handle empty products response', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    mockApiClient.mockRejectedValue(new Error('Failed to fetch products'));
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    });
  });

  it('should show retry button on error', async () => {
    mockApiClient.mockRejectedValue(new Error('Failed to fetch products'));
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  it('should retry fetching products when retry button is clicked', async () => {
    const user = userEvent.setup();
    
    // First call fails
    mockApiClient.mockRejectedValueOnce(new Error('Failed to fetch products'));
    // Second call succeeds
    mockApiClient.mockResolvedValueOnce({
      data: {
        data: mockProducts,
        total: 3,
        page: 1,
        limit: 12,
        totalPages: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    
    await act(async () => {
      await user.click(retryButton);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
    
    expect(mockApiClient).toHaveBeenCalledTimes(2);
  });

  it('should refetch products when search params change', async () => {
    const { rerender } = await act(async () => {
      return render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledTimes(1);
    });
    
    // Change search params by creating a new mock instance
    const newMockSearchParams = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'categories') return 'Books';
        return null;
      }),
    };
    
    mockUseSearchParams.mockReturnValue(newMockSearchParams as any);
    
    await act(async () => {
      rerender(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledTimes(2);
      expect(mockApiClient).toHaveBeenLastCalledWith('/products', {
        page: 1,
        limit: 12,
        categories: 'Books',
      });
    });
  });

  it('should display pagination info', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 25,
        page: 1,
        limit: 12,
        totalPages: 3,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/showing 1-12 of 25 products/i)).toBeInTheDocument();
    });
  });

  it('should handle pagination navigation', async () => {
    const user = userEvent.setup();
    
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 25,
        page: 1,
        limit: 12,
        totalPages: 3,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
    
    const nextButton = screen.getByText('Next');
    
    await act(async () => {
      await user.click(nextButton);
    });
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products', expect.objectContaining({
        page: 2,
      }));
    });
  });

  it('should disable pagination buttons appropriately', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 25,
        page: 3,
        limit: 12,
        totalPages: 3,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    await act(async () => {
      render(<ProductsGrid />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Previous')).not.toBeDisabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });
  });
});
