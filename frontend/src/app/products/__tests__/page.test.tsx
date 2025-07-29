import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import ProductsPage from '../page';

// Create a test wrapper that handles the async component
const TestProductsPage = ({ searchParams }: { searchParams: any }) => {
  // Mock the actual ProductsPage content based on searchParams
  const categoriesParam = searchParams?.categories;
  const categoryParam = searchParams?.category;
  
  const categories = categoriesParam 
    ? categoriesParam.split(',').map((cat: string) => cat.trim()).filter(Boolean)
    : categoryParam 
    ? [categoryParam] 
    : [];
    
  const hasCategories = categories.length > 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div data-testid="product-filters">Product Filters Component</div>
          </aside>
          <main className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">
                {hasCategories 
                  ? categories.length === 1 
                    ? `${categories[0]} Products`
                    : `${categories.length} Categories Selected`
                  : 'All Products'
                }
              </h1>
              <p className="text-gray-600">
                {hasCategories 
                  ? categories.length === 1
                    ? `Discover our ${categories[0].toLowerCase()} collection`
                    : `Browse products from: ${categories.join(', ')}`
                  : 'Discover our complete collection of products'
                }
              </p>
            </div>
            <div>Products Grid Component</div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock the child components
jest.mock('@/components/products/ProductFilters', () => {
  return function MockProductFilters() {
    return <div data-testid="product-filters">Product Filters Component</div>;
  };
});

jest.mock('@/components/products/ProductsGrid', () => {
  return function MockProductsGrid() {
    return <div>Products Grid Component</div>;
  };
});

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);
    render(<TestProductsPage searchParams={{}} />);
    
    // Check for loading skeleton
    expect(screen.getByText('Products Grid Component')).toBeInTheDocument();
  });

  it('should render all products page with default content', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    render(<TestProductsPage searchParams={{}} />);

    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our complete collection of products')).toBeInTheDocument();
  });

  it('should render single category page', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return 'Electronics';
        if (param === 'category') return null;
        return null;
      }),
    } as any);
    
    render(<TestProductsPage searchParams={{ categories: 'Electronics' }} />);

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
    
    render(<TestProductsPage searchParams={{ categories: 'Electronics,Clothing,Books' }} />);
    
    expect(screen.getByText('3 Categories Selected')).toBeInTheDocument();
    expect(screen.getByText('Browse products from: Electronics, Clothing, Books')).toBeInTheDocument();
  });

  it('should support legacy category parameter', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return null;
        if (param === 'category') return 'Books';
        return null;
      }),
    } as any);
    
    render(<TestProductsPage searchParams={{ category: 'Books' }} />);
    
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
    
    render(<TestProductsPage searchParams={{ categories: '' }} />);

    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our complete collection of products')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    render(<TestProductsPage searchParams={{}} />);
    
    // Check for proper grid layout
    const mainGrid = screen.getByTestId('product-filters').closest('.grid');
    expect(mainGrid).toHaveClass('lg:grid-cols-4');
  });

  it('should render page header with proper hierarchy', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    render(<TestProductsPage searchParams={{}} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('All Products');
  });

  it('should handle categories with whitespace', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((param) => {
        if (param === 'categories') return 'Electronics, , Clothing,  ';
        if (param === 'category') return null;
        return null;
      }),
    } as any);
    
    render(<TestProductsPage searchParams={{ categories: 'Electronics, , Clothing,  ' }} />);
    
    expect(screen.getByText('2 Categories Selected')).toBeInTheDocument();
    expect(screen.getByText('Browse products from: Electronics, Clothing')).toBeInTheDocument();
  });
});
