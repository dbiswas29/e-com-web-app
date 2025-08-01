import { render } from '@testing-library/react';
import { Providers } from '../providers';
import { useAuthStore } from '@/store/authStore';

// Mock the auth store
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockCheckAuth = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('Providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector) => {
      const state = {
        checkAuth: mockCheckAuth,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
      };
      return selector(state);
    });
  });

  it('should render children', () => {
    const TestChild = () => <div data-testid="test-child">Test Child</div>;
    
    const { getByTestId } = render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(getByTestId('test-child')).toBeInTheDocument();
    expect(getByTestId('test-child')).toHaveTextContent('Test Child');
  });

  it('should call checkAuth on mount', () => {
    const TestChild = () => <div>Test Child</div>;
    
    render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should call checkAuth only once even with multiple renders', () => {
    const TestChild = () => <div>Test Child</div>;
    
    const { rerender } = render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    // Re-render the component
    rerender(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    // checkAuth should still only be called once due to useEffect dependencies
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should render multiple children', () => {
    const TestChild1 = () => <div data-testid="test-child-1">Test Child 1</div>;
    const TestChild2 = () => <div data-testid="test-child-2">Test Child 2</div>;
    
    const { getByTestId } = render(
      <Providers>
        <TestChild1 />
        <TestChild2 />
      </Providers>
    );
    
    expect(getByTestId('test-child-1')).toBeInTheDocument();
    expect(getByTestId('test-child-2')).toBeInTheDocument();
  });

  it('should handle null children', () => {
    const { container } = render(
      <Providers>
        {null}
      </Providers>
    );
    
    // Provider wrapper should exist but with no content
    expect(container.innerHTML).toBe('');
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should handle undefined children', () => {
    const { container } = render(
      <Providers>
        {undefined}
      </Providers>
    );
    
    // Provider wrapper should exist but with no content
    expect(container.innerHTML).toBe('');
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should handle string children', () => {
    const { getByText } = render(
      <Providers>
        Test String Child
      </Providers>
    );
    
    expect(getByText('Test String Child')).toBeInTheDocument();
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should handle array of children', () => {
    const children = [
      <div key="1" data-testid="child-1">Child 1</div>,
      <div key="2" data-testid="child-2">Child 2</div>,
      <div key="3" data-testid="child-3">Child 3</div>,
    ];
    
    const { getByTestId } = render(
      <Providers>
        {children}
      </Providers>
    );
    
    expect(getByTestId('child-1')).toBeInTheDocument();
    expect(getByTestId('child-2')).toBeInTheDocument();
    expect(getByTestId('child-3')).toBeInTheDocument();
  });

  it('should work with nested components', () => {
    const NestedComponent = () => (
      <div data-testid="nested">
        <span data-testid="nested-child">Nested Child</span>
      </div>
    );
    
    const { getByTestId } = render(
      <Providers>
        <NestedComponent />
      </Providers>
    );
    
    expect(getByTestId('nested')).toBeInTheDocument();
    expect(getByTestId('nested-child')).toBeInTheDocument();
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should maintain referential equality of checkAuth in useEffect dependency', () => {
    const TestChild = () => <div>Test Child</div>;
    
    // Mock checkAuth to be a stable reference
    const stableCheckAuth = jest.fn();
    mockUseAuthStore.mockImplementation((selector) => {
      const state = {
        checkAuth: stableCheckAuth,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
      };
      return selector(state);
    });
    
    const { rerender } = render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(stableCheckAuth).toHaveBeenCalledTimes(1);
    
    // Re-render with same checkAuth reference
    rerender(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    // Should not call checkAuth again due to stable reference
    expect(stableCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should call checkAuth again if reference changes', () => {
    const TestChild = () => <div>Test Child</div>;
    
    const firstCheckAuth = jest.fn();
    const secondCheckAuth = jest.fn();
    
    // First render with first checkAuth
    mockUseAuthStore.mockImplementation((selector) => {
      const state = {
        checkAuth: firstCheckAuth,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
      };
      return selector(state);
    });
    
    const { rerender } = render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(firstCheckAuth).toHaveBeenCalledTimes(1);
    
    // Second render with different checkAuth reference
    mockUseAuthStore.mockImplementation((selector) => {
      const state = {
        checkAuth: secondCheckAuth,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
      };
      return selector(state);
    });
    
    rerender(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(secondCheckAuth).toHaveBeenCalledTimes(1);
    expect(firstCheckAuth).toHaveBeenCalledTimes(1); // Should still be 1
  });

  it('should handle complex children structure', () => {
    const ComplexChildren = () => (
      <>
        <header data-testid="header">Header</header>
        <main data-testid="main">
          <section data-testid="section">
            <article data-testid="article">Article Content</article>
          </section>
        </main>
        <footer data-testid="footer">Footer</footer>
      </>
    );
    
    const { getByTestId } = render(
      <Providers>
        <ComplexChildren />
      </Providers>
    );
    
    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('main')).toBeInTheDocument();
    expect(getByTestId('section')).toBeInTheDocument();
    expect(getByTestId('article')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
    expect(mockCheckAuth).toHaveBeenCalledTimes(1);
  });

  it('should use React.ReactNode type correctly', () => {
    // Testing various React node types
    const { getByText, getByTestId } = render(
      <Providers>
        <div data-testid="div-child">Div Child</div>
        <span>Span Child</span>
        <p>Paragraph Child</p>
        {42}
        {true && <div data-testid="conditional">Conditional Child</div>}
        {['Array', ' ', 'Children'].map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </Providers>
    );
    
    expect(getByTestId('div-child')).toBeInTheDocument();
    expect(getByText('Span Child')).toBeInTheDocument();
    expect(getByText('Paragraph Child')).toBeInTheDocument();
    expect(getByText('42')).toBeInTheDocument();
    expect(getByTestId('conditional')).toBeInTheDocument();
    expect(getByText('Array')).toBeInTheDocument();
    expect(getByText('Children')).toBeInTheDocument();
  });
});
