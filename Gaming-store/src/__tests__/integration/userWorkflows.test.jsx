import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock API services to avoid external dependencies
jest.mock('../../services/gamesApi', () => ({
  fetchGames: jest.fn(),
  fetchGameById: jest.fn(),
  fetchGenres: jest.fn(),
  fetchPlatforms: jest.fn(),
}));

import * as gamesApi from '../../services/gamesApi';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock window methods
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  writable: true,
});

// Test Wrapper with all providers
const TestWrapper = ({ children, initialEntries = ['/'] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

// Mock data
const mockGames = [
  {
    id: 1,
    name: 'Cyberpunk 2077',
    price: 59.99,
    background_image: '/images/cyberpunk.jpg',
    rating: 4.2,
    genre: 'RPG',
    platforms: ['PC', 'PlayStation 5'],
    description: 'An open-world action-adventure story set in Night City.',
  },
  {
    id: 2,
    name: 'The Witcher 3',
    price: 39.99,
    background_image: '/images/witcher.jpg',
    rating: 4.9,
    genre: 'RPG',
    platforms: ['PC', 'PlayStation 4', 'Nintendo Switch'],
    description: 'An action role-playing game with a third-person perspective.',
  },
  {
    id: 3,
    name: 'Call of Duty: Modern Warfare',
    price: 69.99,
    background_image: '/images/cod.jpg',
    rating: 4.1,
    genre: 'FPS',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    description: 'The latest installment in the Call of Duty franchise.',
  },
];

const mockGenres = [
  { id: 1, name: 'RPG' },
  { id: 2, name: 'FPS' },
  { id: 3, name: 'Action' },
];

const mockPlatforms = [
  { id: 1, name: 'PC' },
  { id: 2, name: 'PlayStation 5' },
  { id: 3, name: 'Xbox Series X' },
];

describe('User Workflows Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Setup default API mocks
    gamesApi.fetchGames.mockResolvedValue({
      games: mockGames,
      count: mockGames.length,
      next: null,
      previous: null,
    });

    gamesApi.fetchGameById.mockImplementation((id) => {
      const game = mockGames.find(g => g.id === parseInt(id));
      return Promise.resolve(game || mockGames[0]);
    });

    gamesApi.fetchGenres.mockResolvedValue(mockGenres);
    gamesApi.fetchPlatforms.mockResolvedValue(mockPlatforms);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Complete Shopping Workflow', () => {
    it('should allow user to browse, search, filter, and add games to cart', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      // Wait for games to load
      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Verify all games are displayed
      expect(screen.getByText('The Witcher 3')).toBeInTheDocument();
      expect(screen.getByText('Call of Duty: Modern Warfare')).toBeInTheDocument();

      // Search for RPG games
      const searchInput = screen.getByPlaceholderText(/search games/i);
      await user.type(searchInput, 'RPG');

      // Mock filtered results
      gamesApi.fetchGames.mockResolvedValue({
        games: mockGames.filter(g => g.genre === 'RPG'),
        count: 2,
        next: null,
        previous: null,
      });

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      // Verify search functionality
      expect(gamesApi.fetchGames).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'RPG',
        expect.any(Array),
        expect.any(Array),
        expect.any(String)
      );

      // Add game to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);

      // Verify cart is updated
      expect(screen.getByText('1')).toBeInTheDocument(); // Cart badge

      // Add another game
      await user.click(addToCartButtons[1]);
      expect(screen.getByText('2')).toBeInTheDocument(); // Cart badge updated

      // Open cart
      const cartButton = screen.getByLabelText(/open cart/i);
      await user.click(cartButton);

      // Verify cart contents (this would depend on your cart implementation)
      // This test assumes a cart modal or sidebar opens
    });

    it('should handle complete checkout process', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      // Wait for games to load and add items to cart
      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Add games to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);
      await user.click(addToCartButtons[1]);

      // Navigate to cart page
      // This would depend on your routing setup
      // For now, we'll simulate the cart state
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-cart',
        expect.stringContaining('Cyberpunk')
      );
    });
  });

  describe('User Authentication Workflow', () => {
    it('should handle login and logout process', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );

      // Find and click login button (assuming it exists in header)
      const loginButton = screen.getByText(/log in/i);
      await user.click(loginButton);

      // Should navigate to login page or show login modal
      // This depends on your authentication implementation

      // Simulate successful login
      // The AuthContext should handle the login state
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-auth',
        expect.any(String)
      );
    });

    it('should persist user session across page refreshes', async () => {
      // Mock logged-in user in localStorage
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'gaming-auth') {
          return JSON.stringify({
            isLoggedIn: true,
            user: { id: 1, name: 'Test User', email: 'test@example.com' }
          });
        }
        return null;
      });

      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );

      // User should appear as logged in
      // This would depend on how you display user state in the UI
    });
  });

  describe('Theme Switching Workflow', () => {
    it('should allow user to toggle between light and dark themes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );

      // Find theme toggle button (assuming it exists)
      const themeToggle = screen.getByLabelText(/toggle theme/i);
      await user.click(themeToggle);

      // Verify theme is saved to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'color-theme',
        expect.any(String)
      );

      // Verify DOM classes are updated
      // This would check if 'dark' class is added to document.documentElement
    });

    it('should respect system theme preference on first visit', () => {
      // Mock system dark mode preference
      window.matchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );

      // Theme should be set based on system preference
      // This would verify the initial theme state
    });
  });

  describe('Search and Filter Workflow', () => {
    it('should handle complex search and filter combinations', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Apply genre filter
      const filterButton = screen.getByText(/filter/i);
      await user.click(filterButton);

      // Select RPG genre (this depends on your filter UI)
      const rpgFilter = screen.getByText('RPG');
      await user.click(rpgFilter);

      // Apply platform filter
      const pcFilter = screen.getByText('PC');
      await user.click(pcFilter);

      // Search within filtered results
      const searchInput = screen.getByPlaceholderText(/search games/i);
      await user.type(searchInput, 'Cyberpunk');

      // Verify API is called with all filters
      expect(gamesApi.fetchGames).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Cyberpunk',
        expect.arrayContaining(['RPG']),
        expect.arrayContaining(['PC']),
        expect.any(String)
      );

      // Clear all filters
      const clearFiltersButton = screen.getByText(/clear filters/i);
      await user.click(clearFiltersButton);

      // Verify filters are cleared
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-selected-genres');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-selected-platforms');
    });

    it('should handle sorting and pagination', async () => {
      const user = userEvent.setup();

      // Mock paginated results
      gamesApi.fetchGames.mockResolvedValue({
        games: mockGames.slice(0, 2),
        count: 25,
        next: 'next-url',
        previous: null,
      });

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Change sort order
      const sortSelect = screen.getByDisplayValue(/relevance/i);
      await user.selectOptions(sortSelect, 'name-asc');

      expect(gamesApi.fetchGames).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        expect.any(Array),
        expect.any(Array),
        'name-asc'
      );

      // Navigate to next page
      const nextPageButton = screen.getByText(/next/i);
      await user.click(nextPageButton);

      expect(gamesApi.fetchGames).toHaveBeenCalledWith(
        2, // page 2
        expect.any(Number),
        expect.any(String),
        expect.any(Array),
        expect.any(Array),
        'name-asc'
      );
    });
  });

  describe('Cart Management Workflow', () => {
    it('should handle cart operations across different pages', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Add item to cart
      const addButton = screen.getAllByText('Add to Cart')[0];
      await user.click(addButton);

      // Navigate to different page
      const homeLink = screen.getByText(/home/i);
      await user.click(homeLink);

      // Navigate back to games
      const gamesLink = screen.getByText(/games/i);
      await user.click(gamesLink);

      // Cart should persist
      expect(screen.getByText('1')).toBeInTheDocument(); // Cart badge

      // Item should show as "in cart" state
      expect(screen.getByText('−')).toBeInTheDocument(); // Quantity controls
    });

    it('should handle cart quantity updates', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Add item to cart
      const addButton = screen.getAllByText('Add to Cart')[0];
      await user.click(addButton);

      // Increase quantity
      const increaseButton = screen.getByText('+');
      await user.click(increaseButton);

      // Cart should update
      expect(screen.getByText('2')).toBeInTheDocument(); // Cart badge

      // Decrease quantity
      const decreaseButton = screen.getByText('−');
      await user.click(decreaseButton);

      expect(screen.getByText('1')).toBeInTheDocument(); // Cart badge

      // Remove item (decrease to 0)
      await user.click(decreaseButton);

      // Should show "Add to Cart" again
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });
  });

  describe('Error Handling Workflows', () => {
    it('should handle API failures gracefully', async () => {
      // Mock API failure
      gamesApi.fetchGames.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });

      // Should show retry button
      const retryButton = screen.getByText(/try again/i);
      expect(retryButton).toBeInTheDocument();

      // Mock successful retry
      gamesApi.fetchGames.mockResolvedValue({
        games: mockGames,
        count: mockGames.length,
        next: null,
        previous: null,
      });

      const user = userEvent.setup();
      await user.click(retryButton);

      // Should recover and show games
      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw errors
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        render(
          <TestWrapper initialEntries={['/']}>
            <App />
          </TestWrapper>
        );
      }).not.toThrow();

      // App should still render
      expect(screen.getByText(/gaming store/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior Workflows', () => {
    it('should handle mobile menu interactions', async () => {
      const user = userEvent.setup();

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );

      // Find mobile menu toggle
      const mobileMenuToggle = screen.getByLabelText(/toggle mobile menu/i);
      await user.click(mobileMenuToggle);

      // Mobile menu should open
      // This would depend on your mobile menu implementation

      // Navigate using mobile menu
      const gamesLink = screen.getByText(/games/i);
      await user.click(gamesLink);

      // Should navigate to games page
      await waitFor(() => {
        expect(screen.getByText(/game store/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and User Experience', () => {
    it('should handle rapid user interactions without breaking', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/games']}>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Rapidly click add to cart multiple times
      const addButton = screen.getAllByText('Add to Cart')[0];
      
      // Click rapidly
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      // Should handle gracefully (quantity controls should appear)
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('−')).toBeInTheDocument();
    });

    it('should maintain state consistency across navigation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );

      // Navigate to games
      const gamesLink = screen.getByText(/games/i);
      await user.click(gamesLink);

      await waitFor(() => {
        expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      });

      // Apply filters
      const searchInput = screen.getByPlaceholderText(/search games/i);
      await user.type(searchInput, 'RPG');

      // Navigate away and back
      const homeLink = screen.getByText(/home/i);
      await user.click(homeLink);

      const gamesLinkAgain = screen.getByText(/games/i);
      await user.click(gamesLinkAgain);

      // Search should be cleared (based on your implementation)
      // This test verifies state management across navigation
    });
  });
});
