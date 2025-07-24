import { render, screen } from '@testing-library/react';
import AboutPage from '../page';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function Image({ alt, ...props }: any) {
    return <img alt={alt} {...props} />;
  };
});

describe('AboutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page without crashing', () => {
    render(<AboutPage />);
    expect(screen.getByText('About Our Store')).toBeInTheDocument();
  });

  it('should render the main heading', () => {
    render(<AboutPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('About Our Store');
    expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'font-bold', 'text-gray-900');
  });

  it('should render the hero section with description', () => {
    render(<AboutPage />);
    
    expect(screen.getByText(/We're passionate about bringing you the best products/)).toBeInTheDocument();
    expect(screen.getByText(/with exceptional customer service and a seamless shopping experience/)).toBeInTheDocument();
  });

  it('should render the Our Story section', () => {
    render(<AboutPage />);
    
    const storyHeading = screen.getByRole('heading', { name: 'Our Story' });
    expect(storyHeading).toBeInTheDocument();
    expect(storyHeading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
    
    // Check for story content
    expect(screen.getByText(/Founded in 2024, our e-commerce platform/)).toBeInTheDocument();
    expect(screen.getByText(/Today, we've grown into a comprehensive platform/)).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    render(<AboutPage />);
    
    const pageContainer = screen.getByText('About Our Store').closest('.min-h-screen');
    expect(pageContainer).toHaveClass('bg-gray-50');
  });

  it('should render with responsive design classes', () => {
    render(<AboutPage />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('text-4xl', 'md:text-5xl');
  });

  it('should have proper semantic structure with headings', () => {
    render(<AboutPage />);
    
    // Check for main heading (h1)
    expect(screen.getByRole('heading', { level: 1, name: 'About Our Store' })).toBeInTheDocument();
    
    // Check for section heading (h2)
    expect(screen.getByRole('heading', { level: 2, name: 'Our Story' })).toBeInTheDocument();
  });

  it('should render hero description with proper styling', () => {
    render(<AboutPage />);
    
    const heroDescription = screen.getByText(/We're passionate about bringing you the best products/);
    expect(heroDescription).toHaveClass('text-xl', 'text-gray-600');
  });

  it('should have content in proper sections', () => {
    render(<AboutPage />);
    
    // Check that story content is present
    expect(screen.getByText(/shopping online should be easy, enjoyable, and trustworthy/)).toBeInTheDocument();
    expect(screen.getByText(/We believe in the power of innovation, sustainability, and community/)).toBeInTheDocument();
  });

  it('should render with grid layout for story section', () => {
    render(<AboutPage />);
    
    const storySection = screen.getByText('Our Story').closest('.grid');
    expect(storySection).toHaveClass('grid-cols-1', 'lg:grid-cols-2', 'gap-12');
  });

  it('should have proper spacing and typography', () => {
    render(<AboutPage />);
    
    const storyContent = screen.getByText(/Founded in 2024, our e-commerce platform/);
    expect(storyContent.closest('.space-y-4')).toBeInTheDocument();
  });
});
