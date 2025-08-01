import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '../page';

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page header', () => {
    render(<ContactPage />);
    
    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByText("We're here to help! Reach out to us with any questions, concerns, or feedback. Our customer support team is ready to assist you.")).toBeInTheDocument();
  });

  it('should render the contact form', () => {
    render(<ContactPage />);
    
    expect(screen.getByRole('heading', { name: 'Send us a Message' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('should render contact information section', () => {
    render(<ContactPage />);
    
    expect(screen.getByRole('heading', { name: 'Get in Touch' })).toBeInTheDocument();
    expect(screen.getByText('123 E-Commerce Street', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('support@ecommerce.com')).toBeInTheDocument();
  });

  it('should render FAQ section', () => {
    render(<ContactPage />);
    
    expect(screen.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeInTheDocument();
    expect(screen.getByText('How can I track my order?')).toBeInTheDocument();
    expect(screen.getByText('What is your return policy?')).toBeInTheDocument();
    expect(screen.getByText('Do you offer international shipping?')).toBeInTheDocument();
  });

  it('should render business hours section', () => {
    render(<ContactPage />);
    
    expect(screen.getByRole('heading', { name: 'Business Hours' })).toBeInTheDocument();
    expect(screen.getByText('Monday - Friday')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 6:00 PM EST')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM - 4:00 PM EST')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('should have proper form structure', () => {
    render(<ContactPage />);
    
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Check form inputs
    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const phoneInput = screen.getByPlaceholderText(/enter your phone number/i);
    const messageTextarea = screen.getByPlaceholderText(/tell us how we can help you/i);
    
    expect(firstNameInput).toHaveAttribute('type', 'text');
    expect(firstNameInput).toHaveAttribute('name', 'firstName');
    expect(lastNameInput).toHaveAttribute('type', 'text');
    expect(lastNameInput).toHaveAttribute('name', 'lastName');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('name', 'phone');
    expect(messageTextarea).toHaveAttribute('name', 'message');
  });

  it('should have form labels for accessibility', () => {
    render(<ContactPage />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should have subject dropdown with options', () => {
    render(<ContactPage />);
    
    const subjectSelect = screen.getByLabelText(/subject/i);
    expect(subjectSelect).toBeInTheDocument();
    
    // Check select options
    expect(screen.getByText('Select a subject')).toBeInTheDocument();
    expect(screen.getByText('General Inquiry')).toBeInTheDocument();
    expect(screen.getByText('Technical Support')).toBeInTheDocument();
    expect(screen.getByText('Order Issue')).toBeInTheDocument();
    expect(screen.getByText('Product Question')).toBeInTheDocument();
    expect(screen.getByText('Billing Question')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('should allow user input in form fields', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);
    
    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const phoneInput = screen.getByPlaceholderText(/enter your phone number/i);
    const messageTextarea = screen.getByPlaceholderText(/tell us how we can help you/i);
    
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(phoneInput, '+1234567890');
    await user.type(messageTextarea, 'This is a test message');
    
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('+1234567890');
    expect(messageTextarea).toHaveValue('This is a test message');
  });

  it('should allow subject selection', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);
    
    const subjectSelect = screen.getByLabelText(/subject/i);
    await user.selectOptions(subjectSelect, 'support');
    
    expect(subjectSelect).toHaveValue('support');
  });

  it('should have clickable form submit button', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Should be clickable
    await user.click(submitButton);
    // Since there's no form handling logic, just check it doesn't crash
  });

  it('should display emergency support information', () => {
    render(<ContactPage />);
    
    expect(screen.getByText('Emergency Support:')).toBeInTheDocument();
    expect(screen.getByText(/emergency@ecommerce.com/)).toBeInTheDocument();
  });

  it('should have proper grid layout structure', () => {
    render(<ContactPage />);
    
    const mainGrid = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
    expect(mainGrid).toBeInTheDocument();
  });

  it('should render contact icons and visual elements', () => {
    render(<ContactPage />);
    
    // Should have SVG icons for address, phone, and email
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should have proper page styling classes', () => {
    render(<ContactPage />);
    
    const pageContainer = screen.getByRole('heading', { name: 'Contact Us' }).closest('.min-h-screen');
    expect(pageContainer).toHaveClass('bg-gray-50');
    
    const mainContainer = screen.getByRole('heading', { name: 'Contact Us' }).closest('.max-width-container');
    expect(mainContainer).toHaveClass('container-padding', 'py-12');
  });

  it('should render contact form with white background', () => {
    render(<ContactPage />);
    
    const formContainer = screen.getByRole('heading', { name: 'Send us a Message' }).closest('.bg-white');
    expect(formContainer).toHaveClass('rounded-lg', 'shadow-md', 'p-8');
  });

  it('should render contact information cards with proper styling', () => {
    render(<ContactPage />);
    
    const contactCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-md');
    expect(contactCards.length).toBeGreaterThanOrEqual(2); // Form + contact info sections
  });

  it('should have textarea with proper attributes', () => {
    render(<ContactPage />);
    
    const messageTextarea = screen.getByPlaceholderText(/tell us how we can help you/i);
    expect(messageTextarea).toHaveAttribute('rows', '6');
    expect(messageTextarea).toHaveClass('resize-none');
  });

  it('should render all FAQ items', () => {
    render(<ContactPage />);
    
    const faqItems = [
      'How can I track my order?',
      'What is your return policy?',
      'Do you offer international shipping?',
      'How can I change my order?'
    ];
    
    faqItems.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  it('should have proper input styling classes', () => {
    render(<ContactPage />);
    
    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    expect(firstNameInput).toHaveClass('input', 'w-full');
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    expect(emailInput).toHaveClass('input', 'w-full');
  });

  it('should render all business hours correctly', () => {
    render(<ContactPage />);
    
    const businessHours = [
      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
      { day: 'Sunday', hours: 'Closed' }
    ];
    
    businessHours.forEach(({ day, hours }) => {
      expect(screen.getByText(day)).toBeInTheDocument();
      expect(screen.getByText(hours)).toBeInTheDocument();
    });
  });

  it('should render support team availability message', () => {
    render(<ContactPage />);
    
    expect(screen.getByText('Mon-Fri 9AM-6PM EST')).toBeInTheDocument();
    expect(screen.getByText("We'll respond within 24 hours")).toBeInTheDocument();
  });

  it('should have proper form field grouping', () => {
    render(<ContactPage />);
    
    // Name fields should be in a grid
    const nameGrid = screen.getByPlaceholderText(/enter your first name/i).closest('.grid-cols-1.md\\:grid-cols-2');
    expect(nameGrid).toBeInTheDocument();
  });

  it('should render with proper semantic HTML structure', () => {
    render(<ContactPage />);
    
    // Should have proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1, name: 'Contact Us' });
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    const h3Headings = screen.getAllByRole('heading', { level: 3 });
    
    expect(h1).toBeInTheDocument();
    expect(h2Headings.length).toBeGreaterThan(0);
    expect(h3Headings.length).toBeGreaterThan(0);
  });

  it('should have emergency contact highlighted section', () => {
    render(<ContactPage />);
    
    const emergencySection = screen.getByText('Emergency Support:').closest('.bg-primary-50');
    expect(emergencySection).toHaveClass('rounded-lg');
    expect(emergencySection).toBeInTheDocument();
  });
});
