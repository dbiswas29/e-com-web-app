import { render, screen, waitFor } from '@testing-library/react';
import { FeaturedProducts } from '../FeaturedProducts';
import { apiClient } from '@/lib/api';

// Mock API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock ProductCard component
jest.mock('@/components/products/ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid={`product-card-${product.id}`}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  ),
}));

const mockApiClient = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

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
  {
    id: 4,
    name: 'Headphones',
    price: 199,
    category: 'Electronics',
    description: 'Wireless headphones',
    images: ['headphones.jpg'],
  },
];

describe('FeaturedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading skeleton initially', () => {
    mockApiClient.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<FeaturedProducts />);
    
    // Should show 4 loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(4);
  });

  it('should fetch and display featured products', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-4')).toBeInTheDocument();
    });
  });

  it('should call API with correct parameters', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/products?limit=4');
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockApiClient.mockRejectedValue(new Error('API Error'));
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch featured products:', expect.any(Error));
    });
    
    // Should not show any product cards on error
    await waitFor(() => {
      expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('should display products in grid layout', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      const gridContainer = document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  it('should handle empty products response', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: [],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(screen.queryByTestId(/product-card-/)).not.toBeInTheDocument();
    });
  });

  it('should render ProductCard for each product', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('$999')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('$29')).toBeInTheDocument();
      expect(screen.getByText('Book')).toBeInTheDocument();
      expect(screen.getByText('$15')).toBeInTheDocument();
      expect(screen.getByText('Headphones')).toBeInTheDocument();
      expect(screen.getByText('$199')).toBeInTheDocument();
    });
  });

  it('should only fetch products once on mount', async () => {
    mockApiClient.mockResolvedValue({
      data: {
        data: mockProducts,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    const { rerender } = render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledTimes(1);
    });
    
    // Re-render shouldn't trigger another API call
    rerender(<FeaturedProducts />);
    
    expect(mockApiClient).toHaveBeenCalledTimes(1);
  });

  it('should show loading state before API response', () => {
    mockApiClient.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          data: { data: mockProducts },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }), 100)
      )
    );
    
    render(<FeaturedProducts />);
    
    // Initially should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(4);
    
    // Should have skeleton structure
    const backgroundDivs = document.querySelectorAll('.bg-gray-200');
    expect(backgroundDivs.length).toBeGreaterThan(0);
  });

  it('should handle partial products response', async () => {
    const partialProducts = mockProducts.slice(0, 2);
    
    mockApiClient.mockResolvedValue({
      data: {
        data: partialProducts,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    render(<FeaturedProducts />);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-card-4')).not.toBeInTheDocument();
    });
  });
});
