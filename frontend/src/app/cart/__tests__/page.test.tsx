import { render, screen } from '@testing-library/react';
import CartPage from '../page';

// Mock the child components
jest.mock('@/components/cart/CartItems', () => {
  return {
    CartItems: () => <div data-testid="cart-items">Cart Items Component</div>
  };
});

jest.mock('@/components/cart/CartSummary', () => {
  return {
    CartSummary: () => <div data-testid="cart-summary">Cart Summary Component</div>
  };
});

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page without crashing', () => {
    render(<CartPage />);
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('should render the correct page header', () => {
    render(<CartPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Shopping Cart');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
    
    expect(screen.getByText('Review your items and proceed to checkout')).toBeInTheDocument();
  });

  it('should render both CartItems and CartSummary components', () => {
    render(<CartPage />);
    
    expect(screen.getByTestId('cart-items')).toBeInTheDocument();
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    render(<CartPage />);
    
    // Check for proper grid layout
    const cartItemsContainer = screen.getByTestId('cart-items').closest('.lg\\:col-span-2');
    const cartSummaryContainer = screen.getByTestId('cart-summary').closest('.lg\\:col-span-1');
    
    expect(cartItemsContainer).toBeInTheDocument();
    expect(cartSummaryContainer).toBeInTheDocument();
  });

  it('should have proper page styling', () => {
    render(<CartPage />);
    
    const pageContainer = screen.getByText('Shopping Cart').closest('.min-h-screen');
    expect(pageContainer).toHaveClass('bg-gray-50');
  });

  it('should render components in correct order', () => {
    render(<CartPage />);
    
    const cartItems = screen.getByTestId('cart-items');
    const cartSummary = screen.getByTestId('cart-summary');
    
    // In the DOM, cart items should come before cart summary
    expect(cartItems.compareDocumentPosition(cartSummary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should have proper semantic structure', () => {
    render(<CartPage />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { level: 1, name: 'Shopping Cart' })).toBeInTheDocument();
    
    // Check that description text is present
    expect(screen.getByText('Review your items and proceed to checkout')).toBeInTheDocument();
  });

  it('should have responsive grid layout', () => {
    render(<CartPage />);
    
    const gridContainer = screen.getByTestId('cart-items').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3', 'gap-8');
  });
});
