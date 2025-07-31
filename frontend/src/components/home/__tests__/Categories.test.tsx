import { render, screen } from '@testing-library/react';
import { Categories } from '../Categories';
import { Category } from '@/types';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    productCount: 5,
    imageUrl: 'https://example.com/electronics.jpg',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Fashion',
    productCount: 3,
    imageUrl: 'https://example.com/fashion.jpg',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Home & Garden',
    productCount: 2,
    imageUrl: 'https://example.com/home-garden.jpg',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Sports & Fitness',
    productCount: 4,
    imageUrl: 'https://example.com/sports.jpg',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt, fill, ...props }: any) => {
    const mockProps: any = { src, alt, ...props };
    if (fill) mockProps['data-fill'] = 'true';
    return <img {...mockProps} />;
  };
});

describe('Categories', () => {
  it('should render empty state when no categories provided', () => {
    render(<Categories categories={[]} />);
    
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.children).toHaveLength(0);
  });

  it('should render all category links when categories provided', () => {
    render(<Categories categories={mockCategories} />);
    
    expect(screen.getByRole('link', { name: /electronics/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fashion/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home & garden/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sports & fitness/i })).toBeInTheDocument();
  });

  it('should have correct href attributes', () => {
    render(<Categories categories={mockCategories} />);
    
    expect(screen.getByRole('link', { name: /electronics/i })).toHaveAttribute(
      'href',
      '/products?category=Electronics'
    );
    expect(screen.getByRole('link', { name: /fashion/i })).toHaveAttribute(
      'href',
      '/products?category=Fashion'
    );
    expect(screen.getByRole('link', { name: /home & garden/i })).toHaveAttribute(
      'href',
      '/products?category=Home%20%26%20Garden'
    );
    expect(screen.getByRole('link', { name: /sports & fitness/i })).toHaveAttribute(
      'href',
      '/products?category=Sports%20%26%20Fitness'
    );
  });

  it('should render category images with correct alt text', () => {
    render(<Categories categories={mockCategories} />);
    
    expect(screen.getByAltText('Electronics')).toBeInTheDocument();
    expect(screen.getByAltText('Fashion')).toBeInTheDocument();
    expect(screen.getByAltText('Home & Garden')).toBeInTheDocument();
    expect(screen.getByAltText('Sports & Fitness')).toBeInTheDocument();
  });

  it('should have proper grid layout', () => {
    render(<Categories categories={mockCategories} />);
    
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
  });

  it('should have hover effects and styling classes', () => {
    render(<Categories categories={mockCategories} />);
    
    const electronicsLink = screen.getByRole('link', { name: /electronics/i });
    expect(electronicsLink).toHaveClass(
      'group',
      'relative',
      'overflow-hidden',
      'rounded-lg',
      'bg-white',
      'shadow-sm',
      'hover:shadow-lg',
      'transition-all',
      'duration-300',
      'animate-fade-in'
    );
  });

  it('should render category names as headings', () => {
    render(<Categories categories={mockCategories} />);
    
    const categoryHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(categoryHeadings).toHaveLength(4);
    
    expect(screen.getByRole('heading', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fashion' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Home & Garden' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sports & Fitness' })).toBeInTheDocument();
  });

  it('should have proper image structure', () => {
    render(<Categories categories={mockCategories} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img).toHaveAttribute('src');
    });
  });

  it('should render with category image containers', () => {
    render(<Categories categories={mockCategories} />);
    
    const electronicsLink = screen.getByRole('link', { name: /electronics/i });
    const imageContainer = electronicsLink.querySelector('.category-image-container');
    expect(imageContainer).toBeInTheDocument();
  });
});
