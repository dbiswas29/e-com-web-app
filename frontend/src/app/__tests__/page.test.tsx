import { render, screen } from '@testing-library/react';
import HomePage from '../page';

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
    Categories: () => <div data-testid="categories-component">Categories Component</div>
  };
});

jest.mock('@/components/home/Newsletter', () => {
  return {
    Newsletter: () => <div data-testid="newsletter-component">Newsletter Component</div>
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page without crashing', () => {
    render(<HomePage />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the Hero component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
  });

  it('should render the Categories section with correct heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Discover our wide range of products across different categories')).toBeInTheDocument();
    expect(screen.getByTestId('categories-component')).toBeInTheDocument();
  });

  it('should render the Featured Products section with correct heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Check out our most popular products')).toBeInTheDocument();
    expect(screen.getByTestId('featured-products-component')).toBeInTheDocument();
  });

  it('should render the Newsletter component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('newsletter-component')).toBeInTheDocument();
  });

  it('should have a link to view all products', () => {
    render(<HomePage />);
    const viewAllLink = screen.getByRole('link', { name: 'View All Products' });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/products');
  });

  it('should have correct CSS classes for styling', () => {
    render(<HomePage />);
    const mainContainer = screen.getByText('Shop by Category').closest('div');
    expect(mainContainer?.closest('.min-h-screen')).toBeInTheDocument();
  });

  it('should render all sections in correct order', () => {
    render(<HomePage />);
    
    const headings = screen.getAllByRole('heading', { level: 2 });
    
    expect(headings[0]).toHaveTextContent('Shop by Category');
    expect(headings[1]).toHaveTextContent('Featured Products');
  });

  it('should render with proper semantic structure', () => {
    render(<HomePage />);
    
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
