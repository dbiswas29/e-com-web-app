import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartItems } from '../CartItems';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

// Mock the stores
jest.mock('@/store/cartStore');
jest.mock('@/store/authStore');

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('CartItems', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
      loading: false,
    });

    mockUseCartStore.mockReturnValue({
      cart: {
        id: '1',
        items: [
          {
            id: '1',
            quantity: 2,
            product: {
              id: '1',
              name: 'Test Product',
              price: 99.99,
              category: 'electronics',
              imageUrl: '/test-image.jpg',
              description: 'Test description',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        totalItems: 2,
        total: 199.98,
      },
      isLoading: false,
      fetchCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      addToCart: jest.fn(),
      clearCart: jest.fn(),
      isCartItemLoading: jest.fn().mockReturnValue(false),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart items when authenticated and has items', () => {
    render(<CartItems />);
    
    expect(screen.getByText(/Cart Items \(2\)/)).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows login prompt when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
      loading: false,
    });

    render(<CartItems />);
    
    expect(screen.getByText('Please login to view your cart')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseCartStore.mockReturnValue({
      cart: null,
      isLoading: true,
      fetchCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      addToCart: jest.fn(),
      clearCart: jest.fn(),
      isCartItemLoading: jest.fn().mockReturnValue(false),
    });

    render(<CartItems />);
    
    expect(screen.getByText('Cart Items')).toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(3);
  });

  it('shows empty cart message when no items', () => {
    mockUseCartStore.mockReturnValue({
      cart: { id: '1', items: [], totalItems: 0, total: 0 },
      isLoading: false,
      fetchCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      addToCart: jest.fn(),
      clearCart: jest.fn(),
      isCartItemLoading: jest.fn().mockReturnValue(false),
    });

    render(<CartItems />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start Shopping')).toBeInTheDocument();
  });
});
