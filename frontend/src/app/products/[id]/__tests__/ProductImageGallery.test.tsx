import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductImageGallery } from '../ProductImageGallery';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function Image({ alt, src, width, height, priority, className, ...props }: any) {
    // Handle Next.js Image specific props properly
    const imgProps: any = { 
      alt, 
      src, 
      className,
      ...props 
    };
    if (width) imgProps['data-width'] = width.toString();
    if (height) imgProps['data-height'] = height.toString();
    if (priority) imgProps['data-priority'] = 'true';
    return <img {...imgProps} />;
  };
});

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronLeftIcon: function ChevronLeftIcon(props: any) {
    return <div data-testid="chevron-left" {...props}>Left</div>;
  },
  ChevronRightIcon: function ChevronRightIcon(props: any) {
    return <div data-testid="chevron-right" {...props}>Right</div>;
  },
}));

describe('ProductImageGallery', () => {
  const mockProps = {
    productName: 'Test Product',
    productImages: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    mainImageUrl: 'https://example.com/main.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the main image with correct alt text', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const mainImage = screen.getByAltText('Test Product - Image 1');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', 'https://example.com/main.jpg');
  });

  it('should render navigation arrows', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should render image counter', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('should render 4 thumbnail images', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    expect(thumbnails).toHaveLength(4);
  });

  it('should render dot indicators', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const dots = screen.getAllByLabelText(/Go to image/);
    expect(dots).toHaveLength(4);
  });

  it('should navigate to next image when next button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    await user.click(nextButton);
    
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product - Image 2')).toBeInTheDocument();
  });

  it('should navigate to previous image when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    // Go to next first
    const nextButton = screen.getByLabelText('Next image');
    await user.click(nextButton);
    
    // Then go back
    const prevButton = screen.getByLabelText('Previous image');
    await user.click(prevButton);
    
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('should wrap around when navigating past the last image', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    
    // Click next 4 times to wrap around
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('should wrap around when navigating before the first image', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    await user.click(prevButton);
    
    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('should select image when thumbnail is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    await user.click(thumbnails[2]); // Click third thumbnail
    
    expect(screen.getByText('3 / 4')).toBeInTheDocument();
  });

  it('should select image when dot indicator is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const thirdDot = screen.getByLabelText('Go to image 3');
    await user.click(thirdDot);
    
    expect(screen.getByText('3 / 4')).toBeInTheDocument();
  });

  it('should highlight the active thumbnail', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    const firstThumbnail = thumbnails[0].closest('button');
    
    expect(firstThumbnail).toHaveClass('border-primary-500', 'ring-2', 'ring-primary-200');
  });

  it('should highlight the active dot indicator', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const firstDot = screen.getByLabelText('Go to image 1');
    expect(firstDot).toHaveClass('bg-primary-600', 'scale-125');
  });

  it('should update active states when navigating', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    await user.click(nextButton);
    
    // Check second thumbnail is now active
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    const secondThumbnail = thumbnails[1].closest('button');
    expect(secondThumbnail).toHaveClass('border-primary-500');
    
    // Check second dot is now active
    const secondDot = screen.getByLabelText('Go to image 2');
    expect(secondDot).toHaveClass('bg-primary-600', 'scale-125');
  });

  it('should handle empty product images array', () => {
    const propsWithNoImages = {
      ...mockProps,
      productImages: [],
    };
    
    render(<ProductImageGallery {...propsWithNoImages} />);
    
    // Should still render 4 images using fallbacks
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.getAllByAltText(/Test Product thumbnail/)).toHaveLength(4);
  });

  it('should remove duplicate images', () => {
    const propsWithDuplicates = {
      ...mockProps,
      productImages: [
        'https://example.com/main.jpg', // Duplicate of main image
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
    };
    
    render(<ProductImageGallery {...propsWithDuplicates} />);
    
    // Should still render 4 images total (no duplicates + fallbacks)
    expect(screen.getAllByAltText(/Test Product thumbnail/)).toHaveLength(4);
  });

  it('should limit images to maximum of 4', () => {
    const propsWithManyImages = {
      ...mockProps,
      productImages: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg',
        'https://example.com/image5.jpg',
        'https://example.com/image6.jpg',
      ],
    };
    
    render(<ProductImageGallery {...propsWithManyImages} />);
    
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.getAllByAltText(/Test Product thumbnail/)).toHaveLength(4);
  });

  it('should use fallback images when needed', () => {
    const propsWithOneImage = {
      ...mockProps,
      productImages: [],
    };
    
    render(<ProductImageGallery {...propsWithOneImage} />);
    
    // Should use fallback images to reach 4 total
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    expect(thumbnails).toHaveLength(4);
  });

  it('should have proper accessibility attributes', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');
    
    expect(prevButton).toHaveAttribute('aria-label', 'Previous image');
    expect(nextButton).toHaveAttribute('aria-label', 'Next image');
    
    const dots = screen.getAllByLabelText(/Go to image/);
    dots.forEach((dot, index) => {
      expect(dot).toHaveAttribute('aria-label', `Go to image ${index + 1}`);
    });
  });

  it('should handle keyboard navigation', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    const prevButton = screen.getByLabelText('Previous image');
    
    // Buttons should be focusable
    nextButton.focus();
    expect(nextButton).toHaveFocus();
    
    prevButton.focus();
    expect(prevButton).toHaveFocus();
  });

  it('should render with proper CSS classes for styling', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    // Check main container
    const mainContainer = screen.getByAltText('Test Product - Image 1').closest('.relative');
    expect(mainContainer).toHaveClass('aspect-square', 'bg-white', 'rounded-lg', 'overflow-hidden', 'group');
    
    // Check navigation buttons have hover effects
    const nextButton = screen.getByLabelText('Next image');
    expect(nextButton).toHaveClass('hover:bg-opacity-70', 'transition-opacity', 'duration-200');
  });

  it('should show overlay on active thumbnail', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    const firstThumbnail = thumbnails[0].closest('button');
    
    // Active thumbnail should have overlay
    const overlay = firstThumbnail?.querySelector('.bg-primary-500.bg-opacity-20');
    expect(overlay).toBeInTheDocument();
    
    // Click second thumbnail
    await user.click(thumbnails[1]);
    
    // First thumbnail should no longer have overlay
    const firstOverlay = firstThumbnail?.querySelector('.bg-primary-500.bg-opacity-20');
    expect(firstOverlay).not.toBeInTheDocument();
    
    // Second thumbnail should now have overlay
    const secondThumbnail = thumbnails[1].closest('button');
    const secondOverlay = secondThumbnail?.querySelector('.bg-primary-500.bg-opacity-20');
    expect(secondOverlay).toBeInTheDocument();
  });

  it('should handle rapid navigation clicks', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    
    // Rapid clicks
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    
    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('should maintain image aspect ratio', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const mainImageContainer = screen.getByAltText('Test Product - Image 1').closest('.aspect-square');
    expect(mainImageContainer).toBeInTheDocument();
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    thumbnails.forEach(thumbnail => {
      const container = thumbnail.closest('.aspect-square');
      expect(container).toBeInTheDocument();
    });
  });

  it('should render images with correct priority attribute', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const mainImage = screen.getByAltText('Test Product - Image 1');
    // Check for the data attribute that our mock creates
    expect(mainImage).toHaveAttribute('data-priority', 'true');
  });

  it('should handle edge case with single main image and no product images', () => {
    const minimalProps = {
      productName: 'Minimal Product',
      productImages: [],
      mainImageUrl: 'https://example.com/single.jpg',
    };
    
    render(<ProductImageGallery {...minimalProps} />);
    
    // Should still show 4 images using fallbacks
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.getAllByAltText(/Minimal Product thumbnail/)).toHaveLength(4);
  });

  it('should update counter correctly when selecting images directly', async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery {...mockProps} />);
    
    // Select third thumbnail directly
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    await user.click(thumbnails[2]);
    
    expect(screen.getByText('3 / 4')).toBeInTheDocument();
    
    // Select first thumbnail directly
    await user.click(thumbnails[0]);
    
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('should handle long product names in alt text', () => {
    const longNameProps = {
      ...mockProps,
      productName: 'This is a very long product name that should be handled properly in alt text',
    };
    
    render(<ProductImageGallery {...longNameProps} />);
    
    const mainImage = screen.getByAltText('This is a very long product name that should be handled properly in alt text - Image 1');
    expect(mainImage).toBeInTheDocument();
  });

  it('should apply hover styles to navigation buttons', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    const prevButton = screen.getByLabelText('Previous image');
    
    expect(nextButton).toHaveClass('hover:bg-opacity-70');
    expect(prevButton).toHaveClass('hover:bg-opacity-70');
  });

  it('should apply hover styles to thumbnails', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    thumbnails.forEach((thumbnail, index) => {
      const button = thumbnail.closest('button');
      if (index === 0) {
        // First thumbnail is active, should have active styles
        expect(button).toHaveClass('border-primary-500', 'ring-2', 'ring-primary-200');
      } else {
        // Other thumbnails should have hover styles
        expect(button).toHaveClass('hover:border-primary-300');
      }
    });
  });

  it('should apply hover styles to dot indicators', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const dots = screen.getAllByLabelText(/Go to image/);
    const inactiveDots = dots.slice(1); // Skip first dot which is active
    
    inactiveDots.forEach(dot => {
      expect(dot).toHaveClass('hover:bg-gray-400');
    });
  });

  it('should render main image with correct dimensions', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const mainImage = screen.getByAltText('Test Product - Image 1');
    expect(mainImage).toHaveAttribute('data-width', '600');
    expect(mainImage).toHaveAttribute('data-height', '600');
    expect(mainImage).toHaveClass('w-full', 'h-full', 'object-cover');
  });

  it('should render thumbnail images with correct dimensions', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    thumbnails.forEach(thumbnail => {
      expect(thumbnail).toHaveAttribute('data-width', '150');
      expect(thumbnail).toHaveAttribute('data-height', '150');
      expect(thumbnail).toHaveClass('w-full', 'h-full', 'object-cover');
    });
  });

  it('should apply priority loading to main image', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const mainImage = screen.getByAltText('Test Product - Image 1');
    expect(mainImage).toHaveAttribute('data-priority', 'true');
  });

  it('should not apply priority loading to thumbnail images', () => {
    render(<ProductImageGallery {...mockProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product thumbnail/);
    thumbnails.forEach(thumbnail => {
      expect(thumbnail).not.toHaveAttribute('data-priority');
    });
  });
});
