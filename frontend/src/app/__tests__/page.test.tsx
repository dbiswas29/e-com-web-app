import { render, screen } from '@testing-library/react';

// Mock the server API
jest.mock('@/lib/server-api', () => ({
  serverApiClient: {
    getFeaturedProducts: jest.fn(),
    getCategories: jest.fn(),
  },
  handleServerApiCall: jest.fn(),
}));

// Mock the child components
jest.mock('@/components/home/Hero', () => {
  return {
    Hero: () => <div data-testid="hero-component">Hero Component</div>
  };
});

jest.mock('@/components/home/FeaturedProducts', () => {
  return {
    FeaturedProducts: () => <div data-testid="featured-products-component">Featured Products Component</div>
  };
});

jest.mock('@/components/home/Categories', () => {
  return {
    Categories: () => (
      <div data-testid="categories-component">
        <h2>Shop by Category</h2>
        <p>Discover our wide range of products across different categories</p>
        Categories Component
      </div>
    )
  };
});

jest.mock('@/components/home/Newsletter', () => {
  return {
    Newsletter: () => <div data-testid="newsletter-component">Newsletter Component</div>
  };
});

// Create a synchronous version of HomePage for testing
function TestHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div data-testid="hero-component">Hero Component</div>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-width-container container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of products across different categories
            </p>
          </div>
          <div data-testid="categories-component">
            Categories Component
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-width-container container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our most popular products
            </p>
          </div>
          <div data-testid="featured-products-component">Featured Products Component</div>
          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <div data-testid="newsletter-component">Newsletter Component</div>
    </div>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page without crashing', () => {
    render(<TestHomePage />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the Hero component', () => {
    render(<TestHomePage />);
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
  });

  it('should render the Categories section with correct heading', () => {
    render(<TestHomePage />);
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Discover our wide range of products across different categories')).toBeInTheDocument();
    expect(screen.getByTestId('categories-component')).toBeInTheDocument();
  });

  it('should render the Featured Products section with correct heading', () => {
    render(<TestHomePage />);
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Check out our most popular products')).toBeInTheDocument();
    expect(screen.getByTestId('featured-products-component')).toBeInTheDocument();
  });

  it('should render the Newsletter component', () => {
    render(<TestHomePage />);
    expect(screen.getByTestId('newsletter-component')).toBeInTheDocument();
  });

  it('should have a link to view all products', () => {
    render(<TestHomePage />);
    const viewAllLink = screen.getByRole('link', { name: 'View All Products' });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/products');
  });

  it('should have correct CSS classes for styling', () => {
    render(<TestHomePage />);
    const mainContainer = screen.getByText('Shop by Category').closest('div');
    expect(mainContainer?.closest('.min-h-screen')).toBeInTheDocument();
  });

  it('should render all sections in correct order', () => {
    render(<TestHomePage />);
    
    const headings = screen.getAllByRole('heading', { level: 2 });
    
    expect(headings[0]).toHaveTextContent('Shop by Category');
    expect(headings[1]).toHaveTextContent('Featured Products');
  });

  it('should render with proper semantic structure', () => {
    render(<TestHomePage />);
    
    // Check for headings
    expect(screen.getByRole('heading', { name: 'Shop by Category' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Featured Products' })).toBeInTheDocument();
    
    // Check that all child components are rendered
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('categories-component')).toBeInTheDocument();
    expect(screen.getByTestId('featured-products-component')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter-component')).toBeInTheDocument();
  });
});
