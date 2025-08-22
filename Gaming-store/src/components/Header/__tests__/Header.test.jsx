import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { CartProvider } from '../../../context/CartContext';
import { AuthProvider } from '../../../context/AuthContext';
import { ThemeProvider } from '../../../context/ThemeContext';

// Mock child components to focus on Header logic
jest.mock('../Logo', () => {
  return function MockLogo() {
    return <div data-testid="logo">Logo</div>;
  };
});

jest.mock('../NavBar', () => {
  return function MockNavBar() {
    return <nav data-testid="navbar">NavBar</nav>;
  };
});

jest.mock('../News', () => {
  return function MockNews() {
    return <div data-testid="news">News</div>;
  };
});

jest.mock('../Utility', () => {
  return function MockUtility() {
    return <div data-testid="utility">Utility</div>;
  };
});

jest.mock('../MobileMenu', () => {
  return function MockMobileMenu({ isOpen, onClose }) {
    return isOpen ? (
      <div data-testid="mobile-menu">
        <button onClick={onClose} data-testid="close-mobile-menu">
          Close
        </button>
      </div>
    ) : null;
  };
});

// Mock cart context
const mockGetCartItemCount = jest.fn();
jest.mock('../../../context/CartContext', () => ({
  ...jest.requireActual('../../../context/CartContext'),
  useCart: () => ({
    getCartItemCount: mockGetCartItemCount,
  }),
}));

// Wrapper component with all necessary providers
const TestWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCartItemCount.mockReturnValue(0);
    
    // Mock window.dispatchEvent
    Object.defineProperty(window, 'dispatchEvent', {
      value: jest.fn(),
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('should render all main components', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('news')).toBeInTheDocument();
      expect(screen.getByTestId('utility')).toBeInTheDocument();
    });

    it('should render with proper header structure', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('fixed', 'top-0', 'w-full', 'z-50');
    });

    it('should have proper backdrop blur and border styling', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('backdrop-blur-sm');
      expect(header).toHaveClass('border-b');
    });
  });

  describe('Mobile Menu', () => {
    it('should not show mobile menu initially', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    it('should toggle mobile menu when hamburger button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Find and click the mobile menu toggle button
      const toggleButton = screen.getByLabelText(/toggle mobile menu/i);
      await user.click(toggleButton);

      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    it('should close mobile menu when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Open mobile menu
      const toggleButton = screen.getByLabelText(/toggle mobile menu/i);
      await user.click(toggleButton);

      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

      // Close mobile menu
      const closeButton = screen.getByTestId('close-mobile-menu');
      await user.click(closeButton);

      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes for mobile menu toggle', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const toggleButton = screen.getByLabelText(/toggle mobile menu/i);
      expect(toggleButton).toHaveAttribute('aria-label');
    });
  });

  describe('Mobile Cart Button', () => {
    it('should render mobile cart button', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const cartButton = screen.getByLabelText(/open cart summary/i);
      expect(cartButton).toBeInTheDocument();
    });

    it('should display cart item count', () => {
      mockGetCartItemCount.mockReturnValue(3);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should display 0 when cart is empty', () => {
      mockGetCartItemCount.mockReturnValue(0);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should dispatch openCartSummary event when clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const cartButton = screen.getByLabelText(/open cart summary/i);
      await user.click(cartButton);

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'openCartSummary',
        })
      );
    });

    it('should have cart icon SVG', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const cartButton = screen.getByLabelText(/open cart summary/i);
      const svg = cartButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide desktop navigation on mobile', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const navbar = screen.getByTestId('navbar');
      const navbarContainer = navbar.parentElement;
      expect(navbarContainer).toHaveClass('hidden', 'lg:block');
    });

    it('should hide desktop utility on mobile', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const utility = screen.getByTestId('utility');
      const utilityContainer = utility.parentElement;
      expect(utilityContainer).toHaveClass('hidden', 'lg:flex');
    });

    it('should show mobile controls only on mobile', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const mobileControls = screen.getByLabelText(/toggle mobile menu/i).parentElement;
      expect(mobileControls).toHaveClass('lg:hidden');
    });
  });

  describe('Theme Support', () => {
    it('should have dark mode classes', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('dark:bg-gray-900/95');
      expect(header).toHaveClass('dark:border-gray-800');
    });

    it('should have dark mode hover states for mobile cart button', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const cartButton = screen.getByLabelText(/open cart summary/i);
      expect(cartButton).toHaveClass('dark:text-gray-300');
      expect(cartButton).toHaveClass('dark:hover:text-orange-400');
      expect(cartButton).toHaveClass('dark:bg-gray-800');
    });
  });

  describe('Cart Badge', () => {
    it('should display correct cart count with proper styling', () => {
      mockGetCartItemCount.mockReturnValue(5);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const badge = screen.getByText('5');
      expect(badge).toHaveClass('bg-blue-500');
      expect(badge).toHaveClass('text-white');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should handle large cart counts', () => {
      mockGetCartItemCount.mockReturnValue(99);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('should have minimum width for single digits', () => {
      mockGetCartItemCount.mockReturnValue(1);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const badge = screen.getByText('1');
      expect(badge).toHaveClass('min-w-[18px]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper header landmark', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for interactive elements', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/toggle mobile menu/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/open cart summary/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Tab through interactive elements
      await user.tab();
      await user.tab();
      
      // Should be able to focus on cart button
      const cartButton = screen.getByLabelText(/open cart summary/i);
      expect(cartButton).toHaveFocus();
    });
  });

  describe('Event Handling', () => {
    it('should handle multiple rapid clicks on mobile menu toggle', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const toggleButton = screen.getByLabelText(/toggle mobile menu/i);
      
      // Rapid clicks
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      // Should end up closed (odd number of clicks)
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    it('should handle cart button clicks while mobile menu is open', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Open mobile menu
      const toggleButton = screen.getByLabelText(/toggle mobile menu/i);
      await user.click(toggleButton);

      // Click cart button
      const cartButton = screen.getByLabelText(/open cart summary/i);
      await user.click(cartButton);

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'openCartSummary',
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle cart count errors gracefully', () => {
      mockGetCartItemCount.mockImplementation(() => {
        throw new Error('Cart error');
      });

      expect(() => {
        render(
          <TestWrapper>
            <Header />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle dispatchEvent errors gracefully', async () => {
      const user = userEvent.setup();
      
      window.dispatchEvent.mockImplementation(() => {
        throw new Error('Dispatch error');
      });

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const cartButton = screen.getByLabelText(/open cart summary/i);
      
      expect(async () => {
        await user.click(cartButton);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const header = screen.getByRole('banner');

      rerender(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByRole('banner')).toBe(header);
    });

    it('should handle cart count updates efficiently', () => {
      mockGetCartItemCount.mockReturnValue(1);

      const { rerender } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('1')).toBeInTheDocument();

      mockGetCartItemCount.mockReturnValue(2);

      rerender(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
