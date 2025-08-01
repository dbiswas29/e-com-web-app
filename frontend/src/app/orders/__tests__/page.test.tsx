import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import OrdersPage from '../page';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { transformOrderData } from '@/lib/transformers';
import toast from 'react-hot-toast';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth store
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock the transformers
jest.mock('@/lib/transformers', () => ({
  transformOrderData: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ShoppingBagIcon: ({ className }: any) => <div data-testid="shopping-bag-icon" className={className} />,
  ClockIcon: ({ className }: any) => <div data-testid="clock-icon" className={className} />,
  CheckCircleIcon: ({ className }: any) => <div data-testid="check-circle-icon" className={className} />,
  TruckIcon: ({ className }: any) => <div data-testid="truck-icon" className={className} />,
  XCircleIcon: ({ className }: any) => <div data-testid="x-circle-icon" className={className} />,
  EyeIcon: ({ className }: any) => <div data-testid="eye-icon" className={className} />,
}));

// Mock LoadingPage component
jest.mock('@/components/ui/LoadingSpinner', () => ({
  LoadingPage: ({ message }: { message: string }) => (
    <div data-testid="loading-page">{message}</div>
  ),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockApiClient = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
const mockTransformOrderData = transformOrderData as jest.MockedFunction<typeof transformOrderData>;
const mockToastError = toast.error as jest.MockedFunction<typeof toast.error>;

// Helper function to create proper Axios response
const createAxiosResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
} as any);

const mockOrder = {
  id: 'order-123',
  status: 'confirmed' as const,
  totalAmount: 99.99,
  createdAt: '2023-01-15T10:30:00.000Z',
  items: [
    {
      id: 'item-1',
      quantity: 2,
      price: 29.99,
      product: {
        id: 'product-1',
        name: 'Test Product 1',
        description: 'A great test product',
        imageUrl: '/images/product1.jpg',
        price: 29.99,
        category: 'Electronics',
        stock: 10,
      },
    },
    {
      id: 'item-2',
      quantity: 1,
      price: 39.99,
      product: {
        id: 'product-2',
        name: 'Test Product 2',
        description: 'Another test product',
        imageUrl: '/images/product2.jpg',
        price: 39.99,
        category: 'Books',
        stock: 5,
      },
    },
  ],
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Test St',
    address2: 'Apt 4B',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'Test Country',
    phone: '555-1234',
  },
};

describe('OrdersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
    } as any);

    mockTransformOrderData.mockImplementation((order) => order);
  });

  describe('Authentication', () => {
    it('should redirect to login when not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      } as any);
      
      render(<OrdersPage />);
      
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('should not redirect when authenticated', () => {
      render(<OrdersPage />);
      
      expect(mockPush).not.toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('Loading State', () => {
    it('should show loading page while fetching orders', () => {
      mockApiClient.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<OrdersPage />);
      
      expect(screen.getByTestId('loading-page')).toBeInTheDocument();
      expect(screen.getByText('Loading your orders...')).toBeInTheDocument();
    });
  });

  describe('Orders Fetching', () => {
    it('should fetch orders on component mount', async () => {
      mockApiClient.mockResolvedValue(createAxiosResponse([mockOrder]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(mockApiClient).toHaveBeenCalledWith('/orders');
      });
    });

    it('should transform order data after fetching', async () => {
      const rawOrderData = { ...mockOrder, rawField: 'test' };
      mockApiClient.mockResolvedValue(createAxiosResponse([rawOrderData]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(mockTransformOrderData).toHaveBeenCalledWith(rawOrderData, 0, [rawOrderData]);
      });
    });

    it('should handle API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockApiClient.mockRejectedValue(new Error('API Error'));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Failed to load orders');
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching orders:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Empty Orders State', () => {
    it('should show empty state when no orders exist', async () => {
      mockApiClient.mockResolvedValue(createAxiosResponse([]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('shopping-bag-icon')).toBeInTheDocument();
        expect(screen.getByText('No orders yet')).toBeInTheDocument();
        expect(screen.getByText('You haven\'t placed any orders yet. Start shopping to see your orders here!')).toBeInTheDocument();
      });
    });

    it('should navigate to products page when Start Shopping is clicked', async () => {
      const user = userEvent.setup();
      mockApiClient.mockResolvedValue(createAxiosResponse([]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Start Shopping')).toBeInTheDocument();
      });
      
      const startShoppingButton = screen.getByText('Start Shopping');
      await user.click(startShoppingButton);
      
      expect(mockPush).toHaveBeenCalledWith('/products');
    });
  });

  describe('Orders Display', () => {
    beforeEach(async () => {
      mockApiClient.mockResolvedValue({ 
        data: [mockOrder],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      } as any);
    });

    it('should display orders list with correct information', async () => {
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('My Orders')).toBeInTheDocument();
        expect(screen.getByText('Track and manage your orders')).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`#${mockOrder.id.slice(-8)}`))).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
      });
    });

    it('should display order date correctly', async () => {
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Placed on January 15, 2023')).toBeInTheDocument();
      });
    });

    it('should display order items preview', async () => {
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Qty: 2')).toBeInTheDocument();
        expect(screen.getByText('Qty: 1')).toBeInTheDocument();
      });
    });

    it('should show "more items" indicator when order has more than 3 items', async () => {
      const orderWithManyItems = {
        ...mockOrder,
        items: [
          ...mockOrder.items,
          { ...mockOrder.items[0], id: 'item-3' },
          { ...mockOrder.items[0], id: 'item-4' },
        ],
      };
      
      mockApiClient.mockResolvedValue(createAxiosResponse([orderWithManyItems]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('+1 more items')).toBeInTheDocument();
      });
    });
  });

  describe('Order Status Icons and Colors', () => {
    const statusTests = [
      { status: 'pending', icon: 'clock-icon', colorClass: 'bg-yellow-100' },
      { status: 'confirmed', icon: 'check-circle-icon', colorClass: 'bg-blue-100' },
      { status: 'shipped', icon: 'truck-icon', colorClass: 'bg-purple-100' },
      { status: 'delivered', icon: 'check-circle-icon', colorClass: 'bg-green-100' },
      { status: 'cancelled', icon: 'x-circle-icon', colorClass: 'bg-red-100' },
    ];

    statusTests.forEach(({ status, icon, colorClass }) => {
      it(`should display correct icon and color for ${status} status`, async () => {
        const orderWithStatus = { ...mockOrder, status: status as any };
        mockApiClient.mockResolvedValue(createAxiosResponse([orderWithStatus]));
        
        render(<OrdersPage />);
        
        await waitFor(() => {
          expect(screen.getByTestId(icon)).toBeInTheDocument();
          expect(screen.getByText(status.charAt(0).toUpperCase() + status.slice(1))).toHaveClass(colorClass);
        });
      });
    });
  });

  describe('Order Details Modal', () => {
    beforeEach(async () => {
      mockApiClient.mockResolvedValue(createAxiosResponse([mockOrder]));
    });

    it('should open order details modal when View Details is clicked', async () => {
      const user = userEvent.setup();
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText(`Order Details #${mockOrder.id.slice(-8)}`)).toBeInTheDocument();
    });

    it('should display order information in modal', async () => {
      const user = userEvent.setup();
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText('Order Information')).toBeInTheDocument();
      expect(screen.getByText('Total: $99.99')).toBeInTheDocument();
      expect(screen.getByText(/Order Date: January 15, 2023/)).toBeInTheDocument();
    });

    it('should display shipping address in modal', async () => {
      const user = userEvent.setup();
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText('Shipping Address')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
      expect(screen.getByText('Apt 4B')).toBeInTheDocument();
      expect(screen.getByText('Test City, TS 12345')).toBeInTheDocument();
      expect(screen.getByText('Test Country')).toBeInTheDocument();
      expect(screen.getByText('Phone: 555-1234')).toBeInTheDocument();
    });

    it('should display order items in modal', async () => {
      const user = userEvent.setup();
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText('Order Items')).toBeInTheDocument();
      expect(screen.getAllByText('Test Product 1')).toHaveLength(2); // One in list, one in modal
      expect(screen.getByText('A great test product')).toBeInTheDocument();
      expect(screen.getByText('$59.98')).toBeInTheDocument(); // 2 * 29.99
    });

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText(`Order Details #${mockOrder.id.slice(-8)}`)).toBeInTheDocument();
      
      const closeButton = screen.getByTestId('x-circle-icon');
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText(`Order Details #${mockOrder.id.slice(-8)}`)).not.toBeInTheDocument();
      });
    });

    it('should handle shipping address without optional fields', async () => {
      const user = userEvent.setup();
      const orderWithoutOptionalFields = {
        ...mockOrder,
        shippingAddress: {
          ...mockOrder.shippingAddress,
          address2: '',
          phone: '',
        },
      };
      
      mockApiClient.mockResolvedValue(createAxiosResponse([orderWithoutOptionalFields]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByText('View Details');
      await user.click(viewDetailsButton);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
      expect(screen.queryByText('Apt 4B')).not.toBeInTheDocument();
      expect(screen.queryByText('Phone:')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile when View Profile is clicked', async () => {
      const user = userEvent.setup();
      mockApiClient.mockResolvedValue(createAxiosResponse([]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText('View Profile')).toBeInTheDocument();
      });
      
      const viewProfileButton = screen.getByText('View Profile');
      await user.click(viewProfileButton);
      
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      mockApiClient.mockResolvedValue(createAxiosResponse([mockOrder]));
    });

    it('should have proper heading structure', async () => {
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'My Orders' })).toBeInTheDocument();
      });
    });

    it('should have accessible buttons', async () => {
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'View Profile' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
      });
    });

    it('should have proper alt text for product images', async () => {
      render(<OrdersPage />);
      
      await waitFor(() => {
        const productImage = screen.getByAltText('Test Product 1');
        expect(productImage).toBeInTheDocument();
        expect(productImage).toHaveAttribute('src', '/images/product1.jpg');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty order items array', async () => {
      const orderWithNoItems = { ...mockOrder, items: [] };
      mockApiClient.mockResolvedValue(createAxiosResponse([orderWithNoItems]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`#${mockOrder.id.slice(-8)}`))).toBeInTheDocument();
      });
      
      // Should not crash and should still display order info
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('should handle malformed date gracefully', async () => {
      const orderWithBadDate = { ...mockOrder, createdAt: 'invalid-date' };
      mockApiClient.mockResolvedValue(createAxiosResponse([orderWithBadDate]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`#${mockOrder.id.slice(-8)}`))).toBeInTheDocument();
      });
    });

    it('should handle unknown order status', async () => {
      const orderWithUnknownStatus = { ...mockOrder, status: 'unknown' as any };
      mockApiClient.mockResolvedValue(createAxiosResponse([orderWithUnknownStatus]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('clock-icon')).toBeInTheDocument(); // Default icon
        expect(screen.getByText('Unknown')).toHaveClass('bg-gray-100'); // Default color
      });
    });

    it('should handle very long order IDs', async () => {
      const orderWithLongId = { ...mockOrder, id: 'very-long-order-id-that-exceeds-normal-length-123456789' };
      mockApiClient.mockResolvedValue(createAxiosResponse([orderWithLongId]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp('#23456789'))).toBeInTheDocument(); // Last 8 characters
      });
    });
  });

  describe('Multiple Orders', () => {
    it('should display multiple orders correctly', async () => {
      const secondOrder = {
        ...mockOrder,
        id: 'order-456',
        status: 'delivered' as const,
        totalAmount: 149.99,
        createdAt: '2023-02-20T15:45:00.000Z',
      };
      
      mockApiClient.mockResolvedValue(createAxiosResponse([mockOrder, secondOrder]));
      
      render(<OrdersPage />);
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`#${mockOrder.id.slice(-8)}`))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`#${secondOrder.id.slice(-8)}`))).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('$149.99')).toBeInTheDocument();
        expect(screen.getByText('Confirmed')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
      });
    });
  });
});
