import { render, screen } from '@testing-library/react';
import { Categories } from '../Categories';

describe('Categories', () => {
  it('should render all category links', () => {
    render(<Categories />);
    
    expect(screen.getByRole('link', { name: /electronics/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fashion/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home & garden/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sports & fitness/i })).toBeInTheDocument();
  });

  it('should have correct href attributes', () => {
    render(<Categories />);
    
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
    render(<Categories />);
    
    expect(screen.getByAltText('Electronics')).toBeInTheDocument();
    expect(screen.getByAltText('Fashion')).toBeInTheDocument();
    expect(screen.getByAltText('Home & Garden')).toBeInTheDocument();
    expect(screen.getByAltText('Sports & Fitness')).toBeInTheDocument();
  });

  it('should have proper grid layout', () => {
    render(<Categories />);
    
    const gridContainer = screen.getByRole('link', { name: /electronics/i }).closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
  });

  it('should have hover effects and styling classes', () => {
    render(<Categories />);
    
    const electronicsLink = screen.getByRole('link', { name: /electronics/i });
    expect(electronicsLink).toHaveClass(
      'group',
      'relative',
      'overflow-hidden',
      'rounded-lg',
      'bg-white',
      'shadow-sm',
      'hover:shadow-lg',
      'transition-shadow'
    );
  });

  it('should render category names as headings', () => {
    render(<Categories />);
    
    const categoryHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(categoryHeadings).toHaveLength(4);
    
    expect(screen.getByRole('heading', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fashion' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Home & Garden' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sports & Fitness' })).toBeInTheDocument();
  });

  it('should have proper image structure', () => {
    render(<Categories />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    
    images.forEach(img => {
      expect(img).toHaveClass('w-full', 'h-full', 'object-cover');
    });
  });

  it('should render aspect-square containers for images', () => {
    render(<Categories />);
    
    const electronicsLink = screen.getByRole('link', { name: /electronics/i });
    const aspectContainer = electronicsLink.querySelector('.aspect-square');
    expect(aspectContainer).toBeInTheDocument();
    expect(aspectContainer).toHaveClass('relative');
  });
});
