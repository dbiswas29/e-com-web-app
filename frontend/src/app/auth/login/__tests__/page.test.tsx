import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from '../page';
import { useAuthStore } from '@/store/authStore';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the auth store
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockPush = jest.fn();
const mockLogin = jest.fn();

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    } as any);
  });

  it('should render the login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render link to register page', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByRole('link', { name: /create a new account/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/auth/register');
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      // The form validation will show "Invalid email address" for empty email
      // and "Password is required" for empty password
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Type invalid email and trigger blur to activate validation
    await act(async () => {
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.tab(); // Move away from email input to trigger blur validation
    });
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should call login function with correct data on valid submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should redirect to home page on successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should handle login errors gracefully', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });
    
    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
    } as any);
    
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
  });

  it('should have proper form structure', () => {
    render(<LoginPage />);
    
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    expect(form).toBeInTheDocument();
    
    // Check form has proper inputs
    expect(screen.getByPlaceholderText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByPlaceholderText(/password/i)).toHaveAttribute('type', 'password');
  });

  it('should have proper page styling', () => {
    render(<LoginPage />);
    
    const pageContainer = screen.getByText('Sign in to your account').closest('.min-h-screen');
    expect(pageContainer).toHaveClass('flex', 'items-center', 'justify-center', 'bg-gray-50');
  });

  it('should handle remember me checkbox', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(rememberCheckbox).not.toBeChecked();
    
    await user.click(rememberCheckbox);
    expect(rememberCheckbox).toBeChecked();
  });

  it('should display forgot password link', () => {
    render(<LoginPage />);
    
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot your password/i });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '#');
  });

  it('should validate email format with various invalid emails', async () => {
    const user = userEvent.setup();
    const invalidEmails = ['invalid', 'test@', '@domain.com', 'test..email@domain.com'];
    
    for (const invalidEmail of invalidEmails) {
      const { unmount } = render(<LoginPage />);
      
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await act(async () => {
        await user.clear(emailInput);
        await user.type(emailInput, invalidEmail);
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
      
      unmount(); // Clean up between iterations
    }
  });

  it('should handle form submission with valid data and successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'securePassword123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'securePassword123');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should handle network errors during login', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Network error'));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password');
    });
    
    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should show validation errors and clear them when corrected', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Submit with invalid data to trigger validation
    await act(async () => {
      await user.type(emailInput, 'invalid');
      // Touch the password field to trigger its validation
      await user.click(passwordInput);
      await user.click(submitButton);
    });
    
    // Check validation errors appear after submission
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    // Fix the email and password, then submit again
    await act(async () => {
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });
    
    // After successful submission attempt, validation errors should be gone
    // Note: The form won't actually submit because login is mocked, but errors should clear
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    });
  });

  it('should prevent multiple form submissions when loading', async () => {
    const user = userEvent.setup();
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
    } as any);
    
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
    
    // Try to click disabled button
    await user.click(submitButton);
    
    // Login should not be called
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should have accessible form labels', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    // Check that inputs have proper attributes for accessibility
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
  });

  it('should render all required form elements', () => {
    render(<LoginPage />);
    
    // Check main elements exist
    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    // Check for form by using querySelector since it doesn't have role="form"
    expect(document.querySelector('form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create a new account/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument();
  });
});
