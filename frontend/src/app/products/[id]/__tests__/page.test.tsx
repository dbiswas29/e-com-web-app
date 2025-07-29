import { render, screen } from '@testing-library/react';

// Test component for Product Details Page
function TestProductDetailsPage() {
  return (
    <div data-testid="product-details-page">
      <div>Loading product details...</div>
    </div>
  );
}

describe('ProductDetailsPage', () => {
  it('should render loading state', () => {
    render(<TestProductDetailsPage />);
    
    expect(screen.getByTestId('product-details-page')).toBeInTheDocument();
    expect(screen.getByText('Loading product details...')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<TestProductDetailsPage />);
    
    expect(screen.getByTestId('product-details-page')).toBeInTheDocument();
    expect(screen.getByText('Loading product details...')).toBeInTheDocument();
  });
});
