import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoriesPage from '../page';
import { apiClient } from '@/lib/api';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt, className, fill, sizes, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      data-fill={fill ? 'true' : 'false'}
      data-sizes={sizes}
      {...props} 
    />
  );
});

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 14',
    price: 999,
    category: 'Electronics',
    imageUrl: 'https://example.com/iphone.jpg',
    description: 'Latest iPhone',
    stock: 10,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'MacBook Pro',
    price: 2499,
    category: 'Electronics',
    imageUrl: 'https://example.com/macbook.jpg',
    description: 'Powerful laptop',
    stock: 5,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'T-Shirt',
    price: 29,
    category: 'Clothing',
    imageUrl: 'https://example.com/tshirt.jpg',
    description: 'Comfortable shirt',
    stock: 20,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Jeans',
    price: 79,
    category: 'Clothing',
    imageUrl: 'https://example.com/jeans.jpg',
    description: 'Stylish jeans',
    stock: 15,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'The Great Gatsby',
    price: 15,
    category: 'Books',
    imageUrl: 'https://example.com/gatsby.jpg',
    description: 'Classic novel',
    stock: 8,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

describe('CategoriesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient.get.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as any);
  });

  it('should render the page header', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Shop by Category' })).toBeInTheDocument();
      expect(screen.getByText('Discover our curated collection of products across different categories. Find exactly what you\'re looking for with ease.')).toBeInTheDocument();
    });
  });

  it('should render categories grid after loading', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Electronics')).toHaveLength(2); // One in main grid, one in popular
      expect(screen.getAllByText('Clothing')).toHaveLength(2);
      expect(screen.getAllByText('Books')).toHaveLength(2);
    });
  });

  it('should show loading state initially', async () => {
    // Mock API to be slow
    mockApiClient.get.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({
        data: {
          data: mockProducts,
          total: 5,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any), 100);
    }));

    render(<CategoriesPage />);
    
    // During loading, skeleton should be visible
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Shop by Category' })).toBeInTheDocument();
    });
  });

  it('should display category counts correctly', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText('2 items')).toHaveLength(2); // Electronics and Clothing in popular section
      expect(screen.getByText('1 items')).toBeInTheDocument(); // Books
    });
  });

  it('should render category links with correct hrefs', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      const electronicsLinks = screen.getAllByRole('link', { name: /electronics/i });
      const clothingLinks = screen.getAllByRole('link', { name: /clothing/i });
      const booksLinks = screen.getAllByRole('link', { name: /books/i });

      expect(electronicsLinks[0]).toHaveAttribute('href', '/products?category=Electronics');
      expect(clothingLinks[0]).toHaveAttribute('href', '/products?category=Clothing');
      expect(booksLinks[0]).toHaveAttribute('href', '/products?category=Books');
    });
  });  it('should render featured categories section', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Popular Categories')).toBeInTheDocument();
    });
  });

  it('should render call to action section', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Can't find what you're looking for?")).toBeInTheDocument();
      expect(screen.getByText('Browse all our products or use our search feature to find exactly what you need.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View All Products' })).toHaveAttribute('href', '/products');
      expect(screen.getByRole('link', { name: 'Advanced Search' })).toHaveAttribute('href', '/products');
    });
  });

  it('should handle API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockApiClient.get.mockRejectedValue(new Error('API Error'));
    
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Categories')).toBeInTheDocument();
      expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('should retry loading when try again button is clicked', async () => {
    const user = userEvent.setup();
    mockApiClient.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Categories')).toBeInTheDocument();
    });
    
    // Reset mock to succeed on retry
    mockApiClient.get.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as any);
    
    const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
    await user.click(tryAgainButton);
    
    await waitFor(() => {
      expect(screen.getAllByText('Electronics')).toHaveLength(2);
    });
  });

  it('should handle empty products array', async () => {
    mockApiClient.get.mockResolvedValue({
      data: {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as any);
    
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Shop by Category' })).toBeInTheDocument();
      // Should not show any categories
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });
  });

  it('should handle invalid products data', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockApiClient.get.mockResolvedValue({
      data: {
        data: null, // Invalid data
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as any);
    
    render(<CategoriesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Categories')).toBeInTheDocument();
      expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('should display category images', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      
      // Check that each category has images (multiple images per category)
      const electronicsImages = screen.getAllByAltText('Electronics');
      expect(electronicsImages.length).toBeGreaterThan(0);
      const clothingImages = screen.getAllByAltText('Clothing');
      expect(clothingImages.length).toBeGreaterThan(0);
      const booksImages = screen.getAllByAltText('Books');
      expect(booksImages.length).toBeGreaterThan(0);
    });
  });

  it('should have proper page structure and classes', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      const pageContainer = screen.getByRole('heading', { name: 'Shop by Category' }).closest('.min-h-screen');
      expect(pageContainer).toHaveClass('bg-gray-50');
      
      const mainContainer = screen.getByRole('heading', { name: 'Shop by Category' }).closest('.max-width-container');
      expect(mainContainer).toHaveClass('container-padding', 'py-8');
    });
  });

  it('should group products by category correctly', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      // Should show 3 categories: Electronics (2 items), Clothing (2 items), Books (1 item)
      const categoryCards = document.querySelectorAll('[class*="group bg-white rounded-xl"]');
      expect(categoryCards.length).toBe(3);
    });
  });

  it('should render featured categories with limited display', async () => {
    render(<CategoriesPage />);
    
    await waitFor(() => {
      const featuredSection = screen.getByText('Popular Categories').closest('div');
      // Should show first 4 categories only in featured section
      expect(featuredSection).toBeInTheDocument();
    });
  });

  it('should encode category names in URLs correctly', async () => {
    // Add a category with special characters
    const productsWithSpecialCategory = [
      ...mockProducts,
      {
        id: '6',
        name: 'Garden Tool',
        price: 45,
        category: 'Home & Garden',
        imageUrl: 'https://example.com/tool.jpg',
        description: 'Useful tool',
        stock: 3,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ];
    
    mockApiClient.get.mockResolvedValue({
      data: {
        data: productsWithSpecialCategory,
        total: 6,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as any);
    
    render(<CategoriesPage />);
    
    await waitFor(() => {
      const homeGardenLinks = screen.getAllByRole('link', { name: /home & garden/i });
      expect(homeGardenLinks[0]).toHaveAttribute('href', '/products?category=Home%20%26%20Garden');
    });
  });

  it('should show correct loading skeleton structure', () => {
    render(<CategoriesPage />);
    
    const skeletonGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(skeletonGrid).toBeInTheDocument();
    
    const skeletonCards = document.querySelectorAll('.animate-pulse .bg-white.rounded-lg.shadow-md');
    expect(skeletonCards.length).toBe(6); // Should show 6 skeleton cards
  });

  it('should call API on component mount', () => {
    render(<CategoriesPage />);
    
    expect(mockApiClient.get).toHaveBeenCalledWith('/products');
  });

  it('should handle API response format correctly', async () => {
    mockApiClient.get.mockResolvedValue({
      data: {
        data: mockProducts,
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as any);
    
    render(<CategoriesPage />);
    
    await waitFor(() => {
      const electronicsElements = screen.getAllByText(/Electronics/);
      expect(electronicsElements.length).toBeGreaterThan(0);
      const clothingElements = screen.getAllByText(/Clothing/);
      expect(clothingElements.length).toBeGreaterThan(0);
      const booksElements = screen.getAllByText(/Books/);
      expect(booksElements.length).toBeGreaterThan(0);
    });
    
    expect(mockApiClient.get).toHaveBeenCalledTimes(1);
  });
});
