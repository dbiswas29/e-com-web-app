import { render, screen } from '@testing-library/react';
import { FeaturedProducts } from '../FeaturedProducts';

// Mock ProductCard component
jest.mock('@/components/products/ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid={`product-card-${product.id}`}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  ),
}));

const mockProducts = [
  {
    id: '1',
    name: 'Laptop',
    price: 999,
    category: 'Electronics',
    description: 'High-performance laptop',
    imageUrl: 'laptop.jpg',
    images: ['laptop.jpg'],
    stock: 10,
    rating: 4.5,
    reviewCount: 25,
    features: ['Feature 1'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'T-Shirt',
    price: 29,
    category: 'Clothing',
    description: 'Comfortable cotton t-shirt',
    imageUrl: 'tshirt.jpg',
    images: ['tshirt.jpg'],
    stock: 15,
    rating: 4.0,
    reviewCount: 10,
    features: ['Feature 1'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Book',
    price: 15,
    category: 'Books',
    description: 'Educational book',
    imageUrl: 'book.jpg',
    images: ['book.jpg'],
    stock: 20,
    rating: 5.0,
    reviewCount: 5,
    features: ['Feature 1'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Headphones',
    price: 199,
    category: 'Electronics',
    description: 'Wireless headphones',
    imageUrl: 'headphones.jpg',
    images: ['headphones.jpg'],
    stock: 8,
    rating: 4.2,
    reviewCount: 15,
    features: ['Feature 1'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

describe('FeaturedProducts', () => {
  it('should show loading skeleton when no products are provided', () => {
    render(<FeaturedProducts products={[]} />);
    
    // Should show 4 loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(4);
  });

  it('should show loading skeleton when products prop is undefined', () => {
    render(<FeaturedProducts products={undefined as any} />);
    
    // Should show 4 loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(4);
  });

  it('should display products when provided', () => {
    render(<FeaturedProducts products={mockProducts} />);
    
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-4')).toBeInTheDocument();
  });

  it('should display products in grid layout', () => {
    render(<FeaturedProducts products={mockProducts} />);
    
    const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-6');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should render ProductCard for each product', () => {
    render(<FeaturedProducts products={mockProducts} />);
    
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('$15')).toBeInTheDocument();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('$199')).toBeInTheDocument();
  });

  it('should show loading skeleton structure when no products', () => {
    render(<FeaturedProducts products={[]} />);
    
    // Should have skeleton structure
    const backgroundDivs = document.querySelectorAll('.bg-gray-200');
    expect(backgroundDivs.length).toBeGreaterThan(0);
    
    // Check for proper skeleton elements
    const aspectSquare = document.querySelector('.aspect-square.bg-gray-200.rounded-lg.mb-4');
    expect(aspectSquare).toBeInTheDocument();
  });

  it('should handle partial products (less than 4)', () => {
    const partialProducts = mockProducts.slice(0, 2);
    render(<FeaturedProducts products={partialProducts} />);
    
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-card-4')).not.toBeInTheDocument();
  });
});
