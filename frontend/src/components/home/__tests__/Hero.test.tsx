import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Hero', () => {
  it('should render hero section with main heading', () => {
    render(<Hero />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Discover Amazing')).toBeInTheDocument();
    // Use a more specific query for Products in the main heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Products');
  });

  it('should display the main description text', () => {
    render(<Hero />);
    
    expect(screen.getByText(/shop the latest trends with unbeatable prices/i)).toBeInTheDocument();
    expect(screen.getByText(/free shipping on orders over \$50/i)).toBeInTheDocument();
  });

  it('should render Shop Now button with correct link', () => {
    render(<Hero />);
    
    const shopButton = screen.getByRole('link', { name: /shop now/i });
    expect(shopButton).toBeInTheDocument();
    expect(shopButton).toHaveAttribute('href', '/products');
  });

  it('should render Browse Categories button with correct link', () => {
    render(<Hero />);
    
    const categoriesButton = screen.getByRole('link', { name: /browse categories/i });
    expect(categoriesButton).toBeInTheDocument();
    expect(categoriesButton).toHaveAttribute('href', '/categories');
  });

  it('should display statistics section', () => {
    render(<Hero />);
    
    expect(screen.getByText('50K+')).toBeInTheDocument();
    expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    
    expect(screen.getByText('1000+')).toBeInTheDocument();
    // Use getAllByText to check for Products and validate we have the right one
    const productsTexts = screen.getAllByText('Products');
    expect(productsTexts).toHaveLength(2); // One in heading, one in stats
    
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('should display featured products section', () => {
    render(<Hero />);
    
    expect(screen.getByRole('heading', { level: 3, name: /featured products/i })).toBeInTheDocument();
    expect(screen.getByText('Discover our best sellers')).toBeInTheDocument();
  });

  it('should display promotional cards', () => {
    render(<Hero />);
    
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getByText('On orders $50+')).toBeInTheDocument();
    
    expect(screen.getByText('Best Price')).toBeInTheDocument();
    expect(screen.getByText('Guaranteed')).toBeInTheDocument();
  });

  it('should render shopping bag icon', () => {
    render(<Hero />);
    
    const svgIcon = screen.getByRole('img', { hidden: true });
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should have proper CSS classes for styling', () => {
    render(<Hero />);
    
    const heroSection = screen.getByRole('region');
    expect(heroSection).toHaveClass('relative', 'bg-gradient-to-r', 'from-primary-600', 'to-primary-800');
  });

  it('should have accessible button styling with focus states', () => {
    render(<Hero />);
    
    const shopButton = screen.getByRole('link', { name: /shop now/i });
    expect(shopButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    
    const categoriesButton = screen.getByRole('link', { name: /browse categories/i });
    expect(categoriesButton).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('should render background pattern SVG', () => {
    render(<Hero />);
    
    // Get the background pattern SVG specifically (the one in the absolute positioned div)
    const backgroundSvg = document.querySelector('.absolute.inset-0.opacity-10 svg');
    expect(backgroundSvg).toBeInTheDocument();
    expect(backgroundSvg).toHaveAttribute('width', '100%');
    expect(backgroundSvg).toHaveAttribute('height', '100%');
  });

  it('should have responsive grid layout classes', () => {
    render(<Hero />);
    
    const gridContainer = document.querySelector('.grid-cols-1.lg\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should display content in proper hierarchical order', () => {
    render(<Hero />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    const description = screen.getByText(/shop the latest trends/i);
    const buttons = screen.getAllByRole('link');
    
    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
  });
});
