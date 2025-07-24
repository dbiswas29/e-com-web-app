import { render, screen, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Newsletter } from '../Newsletter';

// Mock window.alert
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('Newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render newsletter signup form', () => {
    render(<Newsletter />);
    
    expect(screen.getByRole('heading', { level: 2, name: /stay updated/i })).toBeInTheDocument();
    expect(screen.getByText(/subscribe to our newsletter/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('should display promotional text correctly', () => {
    render(<Newsletter />);
    
    expect(screen.getByText(/be the first to know about new products/i)).toBeInTheDocument();
    expect(screen.getByText(/exclusive deals, and special offers/i)).toBeInTheDocument();
  });

  it('should handle email input changes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should require email input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveAttribute('type', 'email');
    
    await user.click(submitButton);
    
    // Form should not submit without email
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText(/subscribing\.\.\./i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    // Fast forward timer to complete the "API call"
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Newsletter signup:', 'test@example.com');
      expect(alertSpy).toHaveBeenCalledWith('Thank you for subscribing!');
      // Email input should be cleared
      expect(emailInput).toHaveValue('');
    });
    
    // Button should be re-enabled
    expect(submitButton).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    // Should show loading text and disabled state
    expect(screen.getByText(/subscribing\.\.\./i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should handle multiple submissions correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    // First submission
    await user.type(emailInput, 'test1@example.com');
    await user.click(submitButton);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(emailInput).toHaveValue('');
    });
    
    // Second submission
    await user.type(emailInput, 'test2@example.com');
    await user.click(submitButton);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Newsletter signup:', 'test2@example.com');
      expect(alertSpy).toHaveBeenCalledTimes(2);
    });
    
    consoleSpy.mockRestore();
  });

  it('should prevent form submission when already loading', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    // Try to click again while loading
    await user.click(submitButton);
    
    // Only advance timer once to complete first submission
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      // Should only log once
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledTimes(1);
    });
    
    consoleSpy.mockRestore();
  });

  it('should have proper form structure and accessibility', () => {
    render(<Newsletter />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should have proper CSS classes for styling', () => {
    render(<Newsletter />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-white');
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    expect(emailInput).toHaveClass('flex-1', 'px-4', 'py-3', 'rounded-lg');
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    expect(submitButton).toHaveClass('bg-yellow-400', 'text-gray-900', 'font-medium');
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.keyboard('{Enter}');
    
    // Should submit form via Enter key
    expect(screen.getByText(/subscribing\.\.\./i)).toBeInTheDocument();
  });

  it('should clear email after successful submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
    
    await user.keyboard('{Enter}');
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(emailInput).toHaveValue('');
    });
  });
});
