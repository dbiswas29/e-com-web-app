import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('rounded-full', 'border-b-2', 'border-blue-600');
  });

  it('should render with default medium size', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-16', 'w-16');
  });

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-32', 'w-32');
  });

  it('should render without message by default', () => {
    render(<LoadingSpinner />);
    
    const message = screen.queryByText(/loading/i);
    expect(message).not.toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Please wait..." />);
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should render message with proper styling', () => {
    render(<LoadingSpinner message="Loading data..." />);
    
    const message = screen.getByText('Loading data...');
    expect(message).toHaveClass('text-gray-600', 'text-center');
  });

  it('should have proper container layout', () => {
    render(<LoadingSpinner />);
    
    const container = document.querySelector('.flex.flex-col');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('items-center', 'justify-center', 'space-y-4');
  });

  it('should render spinner with correct animation classes', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin', 'rounded-full');
  });

  it('should render spinner with correct border styling', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('border-b-2', 'border-blue-600');
  });

  it('should handle all size variants correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8', 'w-8');

    rerender(<LoadingSpinner size="md" />);
    spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-16', 'w-16');

    rerender(<LoadingSpinner size="lg" />);
    spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-32', 'w-32');
  });

  it('should combine size and message props correctly', () => {
    render(<LoadingSpinner size="lg" message="Processing..." />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-32', 'w-32');
    
    const message = screen.getByText('Processing...');
    expect(message).toBeInTheDocument();
  });

  it('should maintain consistent spacing between spinner and message', () => {
    render(<LoadingSpinner message="Loading..." />);
    
    const container = document.querySelector('.space-y-4');
    expect(container).toBeInTheDocument();
  });

  it('should render multiple spinners independently', () => {
    render(
      <div>
        <LoadingSpinner size="sm" />
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
    
    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners).toHaveLength(2);
    
    expect(spinners[0]).toHaveClass('h-8', 'w-8');
    expect(spinners[1]).toHaveClass('h-32', 'w-32');
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not render paragraph element when message is not provided', () => {
    render(<LoadingSpinner />);
    
    const paragraph = document.querySelector('p');
    expect(paragraph).not.toBeInTheDocument();
  });

  it('should render paragraph element when message is provided', () => {
    render(<LoadingSpinner message="Test message" />);
    
    const paragraph = document.querySelector('p.text-gray-600.text-center');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Test message');
  });

  it('should handle empty message string', () => {
    render(<LoadingSpinner message="" />);
    
    const paragraph = document.querySelector('p');
    expect(paragraph).not.toBeInTheDocument();
  });

  it('should handle undefined size gracefully', () => {
    render(<LoadingSpinner size={undefined} />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-16', 'w-16'); // Default size
  });

  it('should maintain proper aspect ratio for all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      const spinner = document.querySelector('.animate-spin');
      
      const heightClass = spinner?.classList.toString().match(/h-\d+/)?.[0];
      const widthClass = spinner?.classList.toString().match(/w-\d+/)?.[0];
      
      expect(heightClass?.replace('h-', '')).toBe(widthClass?.replace('w-', ''));
      unmount();
    });
  });

  it('should be accessible for screen readers', () => {
    render(<LoadingSpinner message="Loading content" />);
    
    // The component should be accessible to screen readers through the visible message
    const message = screen.getByText('Loading content');
    expect(message).toBeInTheDocument();
  });

  it('should render with consistent blue color theme', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.border-blue-600');
    expect(spinner).toBeInTheDocument();
  });

  it('should center content properly', () => {
    render(<LoadingSpinner message="Loading..." />);
    
    const container = document.querySelector('.flex');
    expect(container).toHaveClass('items-center', 'justify-center');
    
    const message = screen.getByText('Loading...');
    expect(message).toHaveClass('text-center');
  });

  it('should handle long messages gracefully', () => {
    const longMessage = 'This is a very long loading message that should still be displayed properly without breaking the layout';
    render(<LoadingSpinner message={longMessage} />);
    
    const message = screen.getByText(longMessage);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-center');
  });

  it('should maintain proper DOM structure', () => {
    render(<LoadingSpinner message="Test" />);
    
    const container = document.querySelector('.flex.flex-col.items-center.justify-center.space-y-4');
    expect(container).toBeInTheDocument();
    
    const spinner = container?.querySelector('.animate-spin');
    const message = container?.querySelector('p');
    
    expect(spinner).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
