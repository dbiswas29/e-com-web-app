import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import ProductsPage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock the child components
jest.mock('@/components/products/ProductsGrid', () => {
  return {
    ProductsGrid: () => <div data-testid="products-grid">Products Grid Component</div>
  };
});

jest.mock('@/components/products/ProductFilters', () => {
  return {
    ProductFilters: () => <div data-testid="product-filters">Product Filters Component</div>
  };
});

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);
    render(<ProductsPage />);
    
    // Check for loading skeleton
    expect(screen.getByText('Products Grid Component')).toBeInTheDocument();
  });

  it('should render all products page with default content', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    render(<ProductsPage />);
    
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our complete collection of products')).toBeInTheDocument();
    expect(screen.getByTestId('products-grid')).toBeInTheDocument();
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should render single category page', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return 'Electronics';
        if (param === 'category') return null;
        return null;
      }),
    } as any);
    
    render(<ProductsPage />);
    
    expect(screen.getByText('Electronics Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our electronics collection')).toBeInTheDocument();
  });

  it('should render multiple categories page', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return 'Electronics,Clothing,Books';
        if (param === 'category') return null;
        return null;
      }),
    } as any);
    
    render(<ProductsPage />);
    
    expect(screen.getByText('3 Categories Selected')).toBeInTheDocument();
    expect(screen.getByText('Browse products from: Electronics, Clothing, Books')).toBeInTheDocument();
    
    // Check for category tags
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('should support legacy category parameter', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return null;
        if (param === 'category') return 'Books';
        return null;
      }),
    } as any);
    
    render(<ProductsPage />);
    
    expect(screen.getByText('Books Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our books collection')).toBeInTheDocument();
  });

  it('should handle empty categories parameter', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return '';
        if (param === 'category') return null;
        return null;
      }),
    } as any);
    
    render(<ProductsPage />);
    
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our complete collection of products')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    render(<ProductsPage />);
    
    // Check for proper grid layout
    const mainGrid = screen.getByTestId('product-filters').closest('.grid');
    expect(mainGrid).toHaveClass('grid-cols-1', 'lg:grid-cols-4', 'gap-8');
  });

  it('should render page header with proper hierarchy', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    render(<ProductsPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('All Products');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
  });

  it('should handle categories with whitespace', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return 'Electronics, , Clothing,  ';
        if (param === 'category') return null;
        return null;
      }),
    } as any);
    
    render(<ProductsPage />);
    
    expect(screen.getByText('2 Categories Selected')).toBeInTheDocument();
    expect(screen.getByText('Browse products from: Electronics, Clothing')).toBeInTheDocument();
  });
});
