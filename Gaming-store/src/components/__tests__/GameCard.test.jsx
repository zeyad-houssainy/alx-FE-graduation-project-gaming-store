import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import GameCard from '../GameCard';
import { CartProvider } from '../../context/CartContext';

// Mock useCart hook
const mockAddToCart = jest.fn();
const mockUpdateQuantity = jest.fn();

const mockCartContext = {
  addToCart: mockAddToCart,
  updateQuantity: mockUpdateQuantity,
  items: [],
};

// Mock the CartContext
jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: () => mockCartContext,
}));

// Wrapper component with all necessary providers
const TestWrapper = ({ children, cartItems = [] }) => {
  // Update mock context with provided cart items
  mockCartContext.items = cartItems;
  
  return (
    <BrowserRouter>
      <CartProvider>
        {children}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('GameCard', () => {
  const mockGame = {
    id: 1,
    name: 'Test Game',
    background_image: 'test-image.jpg',
    rating: 4.5,
    price: 29.99,
    platforms: [
      { platform: { name: 'PC' } },
      { platform: { name: 'PlayStation 5' } }
    ],
    genres: [{ name: 'Action' }],
  };

  const mockGameWithStringPlatforms = {
    ...mockGame,
    platforms: ['PC', 'Xbox'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCartContext.items = [];
  });

  describe('Rendering', () => {
    it('should render game card with all basic information', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('PC')).toBeInTheDocument();
    });

    it('should render with fallback values when data is missing', () => {
      const incompleteGame = {
        id: 2,
        name: 'Incomplete Game',
      };

      render(
        <TestWrapper>
          <GameCard game={incompleteGame} />
        </TestWrapper>
      );

      expect(screen.getByText('Incomplete Game')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument(); // Default price
      expect(screen.getByText('⭐ N/A')).toBeInTheDocument(); // Default rating
    });

    it('should handle string array platforms', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGameWithStringPlatforms} />
        </TestWrapper>
      );

      expect(screen.getByText('PC')).toBeInTheDocument();
    });

    it('should not render when game is undefined', () => {
      const { container } = render(
        <TestWrapper>
          <GameCard game={undefined} />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render image with correct src and alt attributes', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const image = screen.getByAltText('Test Game');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test-image.jpg');
    });

    it('should render placeholder image when background_image is missing', () => {
      const gameWithoutImage = { ...mockGame, background_image: null };

      render(
        <TestWrapper>
          <GameCard game={gameWithoutImage} />
        </TestWrapper>
      );

      const image = screen.getByAltText('Test Game');
      expect(image).toHaveAttribute('src', '/placeholder-game.jpg');
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should show Add to Cart button when item is not in cart', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should call addToCart when Add to Cart button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const addButton = screen.getByText('Add to Cart');
      await user.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith(mockGame);
    });

    it('should show quantity controls when item is in cart', () => {
      const cartItems = [{ id: 1, quantity: 2 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      expect(screen.getByText('2')).toBeInTheDocument(); // Quantity display
      expect(screen.getByText('+')).toBeInTheDocument(); // Plus button
      expect(screen.getByText('−')).toBeInTheDocument(); // Minus button
    });

    it('should show trash icon when quantity is 1', () => {
      const cartItems = [{ id: 1, quantity: 1 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      expect(screen.getByText('🗑️')).toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    it('should increase quantity when plus button is clicked', async () => {
      const user = userEvent.setup();
      const cartItems = [{ id: 1, quantity: 2 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const plusButton = screen.getByText('+');
      await user.click(plusButton);

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it('should decrease quantity when minus button is clicked', async () => {
      const user = userEvent.setup();
      const cartItems = [{ id: 1, quantity: 3 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const minusButton = screen.getByText('−');
      await user.click(minusButton);

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 2);
    });

    it('should remove item when trash button is clicked (quantity = 1)', async () => {
      const user = userEvent.setup();
      const cartItems = [{ id: 1, quantity: 1 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const trashButton = screen.getByText('🗑️');
      await user.click(trashButton);

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 0);
    });
  });

  describe('Navigation', () => {
    it('should render as a link to game detail page', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/games/1');
    });

    it('should prevent navigation when cart controls are clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const addButton = screen.getByText('Add to Cart');
      const clickEvent = jest.fn();
      
      addButton.addEventListener('click', clickEvent);
      await user.click(addButton);

      // Event should be prevented from bubbling
      expect(clickEvent).toHaveBeenCalled();
    });
  });

  describe('Styling and Hover Effects', () => {
    it('should have proper CSS classes for styling', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const cardContainer = screen.getByRole('link');
      expect(cardContainer).toHaveClass('block', 'h-full');
    });

    it('should render Add to Cart button with hover effects', () => {
      render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const addButton = screen.getByText('Add to Cart');
      expect(addButton).toHaveClass('hover:text-white');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for quantity controls', () => {
      const cartItems = [{ id: 1, quantity: 2 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const minusButton = screen.getByLabelText('Decrease quantity');
      const plusButton = screen.getByLabelText('Increase quantity');

      expect(minusButton).toBeInTheDocument();
      expect(plusButton).toBeInTheDocument();
    });

    it('should have proper ARIA label for remove button when quantity is 1', () => {
      const cartItems = [{ id: 1, quantity: 1 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const removeButton = screen.getByLabelText('Remove from cart');
      expect(removeButton).toBeInTheDocument();
    });

    it('should have proper title attributes for tooltips', () => {
      const cartItems = [{ id: 1, quantity: 1 }];

      render(
        <TestWrapper cartItems={cartItems}>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const removeButton = screen.getByTitle('Remove from cart');
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle games with no genres', () => {
      const gameWithoutGenres = { ...mockGame, genres: [] };

      render(
        <TestWrapper>
          <GameCard game={gameWithoutGenres} />
        </TestWrapper>
      );

      // Should not crash and should not render genre badge
      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.queryByText('Action')).not.toBeInTheDocument();
    });

    it('should handle games with no platforms', () => {
      const gameWithoutPlatforms = { ...mockGame, platforms: [] };

      render(
        <TestWrapper>
          <GameCard game={gameWithoutPlatforms} />
        </TestWrapper>
      );

      // Should not crash
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should handle games with null or undefined platforms', () => {
      const gameWithNullPlatforms = { ...mockGame, platforms: null };

      render(
        <TestWrapper>
          <GameCard game={gameWithNullPlatforms} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should handle very long game names', () => {
      const gameWithLongName = {
        ...mockGame,
        name: 'This is a very long game name that should be truncated properly with line clamp'
      };

      render(
        <TestWrapper>
          <GameCard game={gameWithLongName} />
        </TestWrapper>
      );

      expect(screen.getByText(gameWithLongName.name)).toBeInTheDocument();
    });

    it('should handle zero price', () => {
      const freeGame = { ...mockGame, price: 0 };

      render(
        <TestWrapper>
          <GameCard game={freeGame} />
        </TestWrapper>
      );

      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('should handle undefined price', () => {
      const gameWithoutPrice = { ...mockGame, price: undefined };

      render(
        <TestWrapper>
          <GameCard game={gameWithoutPrice} />
        </TestWrapper>
      );

      expect(screen.getByText('$29.99')).toBeInTheDocument(); // Default price
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      const { rerender } = render(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      const initialElement = screen.getByText('Test Game');

      // Re-render with same props
      rerender(
        <TestWrapper>
          <GameCard game={mockGame} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Game')).toBe(initialElement);
    });
  });
});
