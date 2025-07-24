import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductFilters } from '../ProductFilters';
import { apiClient } from '@/lib/api';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockApiClient = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

const mockSearchParams = {
  get: jest.fn(),
  entries: jest.fn(() => []),
};

describe('ProductFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    
    // Mock API response with categories
    mockApiClient.mockResolvedValue({
      data: {
        data: [
          { category: 'Electronics', price: 100 },
          { category: 'Electronics', price: 200 },
          { category: 'Clothing', price: 50 },
          { category: 'Books', price: 20 },
        ],
        total: 4,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
    
    // Default search params
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return '';
        case 'category': return '';
        case 'minPrice': return '';
        case 'maxPrice': return '';
        default: return null;
      }
    });
  });

  it('should render filter components', async () => {
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Price Range')).toBeInTheDocument();
      expect(screen.getByText('Quick Filters')).toBeInTheDocument();
    });
  });

  it('should load and display categories from API', async () => {
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
    
    expect(mockApiClient).toHaveBeenCalledWith('/products');
  });

  it('should initialize filters from URL search params', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return 'Electronics,Clothing';
        case 'minPrice': return '50';
        case 'maxPrice': return '200';
        default: return '';
      }
    });
    
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('200')).toBeInTheDocument();
    });
  });

  it('should support legacy category parameter', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return '';
        case 'category': return 'Electronics';
        default: return '';
      }
    });
    
    render(<ProductFilters />);
    
    await waitFor(() => {
      // Should load categories and handle legacy param
      expect(mockApiClient).toHaveBeenCalled();
    });
  });

  it('should handle category selection', async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
    
    const electronicsCheckbox = screen.getByRole('checkbox', { name: /electronics/i });
    await user.click(electronicsCheckbox);
    
    expect(electronicsCheckbox).toBeChecked();
  });

  it('should handle price range input', async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Price Range')).toBeInTheDocument();
    });
    
    const minPriceInput = screen.getByPlaceholderText('$0');
    const maxPriceInput = screen.getByPlaceholderText('$1000');
    
    await user.type(minPriceInput, '100');
    await user.type(maxPriceInput, '500');
    
    expect(minPriceInput).toHaveValue(100);
    expect(maxPriceInput).toHaveValue(500);
  });

  it('should apply filters and update URL', async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
    
    // Select category
    const electronicsCheckbox = screen.getByRole('checkbox', { name: /electronics/i });
    await user.click(electronicsCheckbox);
    
    // Set price range
    const minPriceInput = screen.getByPlaceholderText('$0');
    const maxPriceInput = screen.getByPlaceholderText('$1000');
    await user.type(minPriceInput, '100');
    await user.type(maxPriceInput, '500');
    
    // Click apply price filter
    const applyButton = screen.getByRole('button', { name: /apply price filter/i });
    await user.click(applyButton);
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('categories=Electronics')
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('minPrice=100')
    );
  });

  it('should clear all filters', async () => {
    const user = userEvent.setup();
    
    // Start with some selected filters
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return 'Electronics';
        case 'minPrice': return '50';
        case 'maxPrice': return '200';
        default: return '';
      }
    });
    
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });
    
    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    await user.click(clearButton);
    
    expect(mockPush).toHaveBeenCalledWith('/products');
  });

  it('should handle API errors gracefully', async () => {
    mockApiClient.mockRejectedValue(new Error('API Error'));
    
    render(<ProductFilters />);
    
    await waitFor(() => {
      // Should still render the component even if API fails - check for basic structure
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Price Range')).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    render(<ProductFilters />);
    
    // Should show loading skeleton animations
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should handle multiple category selections', async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
    
    // Select multiple categories
    const electronicsCheckbox = screen.getByRole('checkbox', { name: /electronics/i });
    const clothingCheckbox = screen.getByRole('checkbox', { name: /clothing/i });
    
    await user.click(electronicsCheckbox);
    await user.click(clothingCheckbox);
    
    expect(electronicsCheckbox).toBeChecked();
    expect(clothingCheckbox).toBeChecked();
    
    // Since categories are automatically applied, the test should check for URL updates
    // Wait for the URL to be updated when categories are selected
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('categories=Electronics%2CClothing')
      );
    });
  });

  it('should validate price range inputs', async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByText('Price Range')).toBeInTheDocument();
    });
    
    const minPriceInput = screen.getByPlaceholderText('$0');
    const maxPriceInput = screen.getByPlaceholderText('$1000');
    
    // Enter valid price range
    await user.type(minPriceInput, '50');
    await user.type(maxPriceInput, '200');
    
    const applyButton = screen.getByRole('button', { name: /apply price filter/i });
    await user.click(applyButton);
    
    // Should update URL with price filters
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('minPrice=50')
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('maxPrice=200')
    );
  });

  it('should persist selected filters in UI', async () => {
    const user = userEvent.setup();
    
    // Initialize with selected filters
    mockSearchParams.get.mockImplementation((key) => {
      switch (key) {
        case 'categories': return 'Electronics,Books';
        case 'minPrice': return '20';
        case 'maxPrice': return '300';
        default: return '';
      }
    });
    
    render(<ProductFilters />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      expect(screen.getByDisplayValue('300')).toBeInTheDocument();
    });
    
    // Check that categories are pre-selected
    const electronicsCheckbox = screen.getByRole('checkbox', { name: /electronics/i });
    const booksCheckbox = screen.getByRole('checkbox', { name: /books/i });
    
    expect(electronicsCheckbox).toBeChecked();
    expect(booksCheckbox).toBeChecked();
  });
});
