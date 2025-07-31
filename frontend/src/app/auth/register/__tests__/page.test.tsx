import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import RegisterPage from '../page';
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
const mockRegister = jest.fn();

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: false,
    } as any);
  });

  it('should render the registration form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should render link to login page', () => {
    render(<RegisterPage />);
    
    const loginLink = screen.getByRole('link', { name: /sign in to your existing account/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    
    // Fill in all required fields but use invalid email
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'notanemail');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    // Change the input type to text to bypass browser validation
    const emailElement = emailInput as HTMLInputElement;
    emailElement.type = 'text';
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      // Look for the exact error message from the validation schema
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('should call register function with correct data on valid submission', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    
    render(<RegisterPage />);
    
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  it('should redirect to home page on successful registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    
    render(<RegisterPage />);
    
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should handle registration errors gracefully', async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValue(new Error('Email already exists'));
    
    render(<RegisterPage />);
    
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
    
    // Error is handled by the store, not redirected
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: true,
    } as any);
    
    render(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
  });

  it('should have proper form structure', () => {
    render(<RegisterPage />);
    
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Check that all required inputs have proper attributes
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    
    expect(firstNameInput).toHaveAttribute('type', 'text');
    expect(firstNameInput).toHaveAttribute('autoComplete', 'given-name');
    expect(lastNameInput).toHaveAttribute('type', 'text');
    expect(lastNameInput).toHaveAttribute('autoComplete', 'family-name');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('autoComplete', 'new-password');
  });

  it('should prevent multiple form submissions when loading', async () => {
    const user = userEvent.setup();
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: true,
    } as any);
    
    render(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
    
    // Try to click disabled button
    await user.click(submitButton);
    
    // Register should not be called
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should have accessible form labels', () => {
    render(<RegisterPage />);
    
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    
    // Check that form fields are accessible by their placeholders
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    
    // Check that inputs have proper name attributes for form submission
    expect(firstNameInput).toHaveAttribute('name', 'firstName');
    expect(lastNameInput).toHaveAttribute('name', 'lastName');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(confirmPasswordInput).toHaveAttribute('name', 'confirmPassword');
  });

  it('should validate password strength', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, '123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should handle form submission with valid data and successful registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true, user: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' } });
    
    render(<RegisterPage />);
    
    // Fill out form
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    // Verify registration was called with correct data
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should clear errors when correcting input', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    
    // Submit empty form to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
    
    // Fix the first name field
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    await user.type(firstNameInput, 'John');
    
    // The error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
    });
  });

  it('should render all required form elements', () => {
    render(<RegisterPage />);
    
    // Header
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    
    // Form fields
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    
    // Submit button
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    
    // Link to login
    expect(screen.getByRole('link', { name: /sign in to your existing account/i })).toBeInTheDocument();
  });
});
