import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Games from '../Games';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock child components
jest.mock('../../components/Header/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../../components/Footer/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../../components/GameCard', () => {
  return function MockGameCard({ game }) {
    return (
      <div data-testid={`game-card-${game.id}`}>
        <h3>{game.name}</h3>
        <p>${game.price}</p>
      </div>
    );
  };
});

jest.mock('../../components/SearchBar', () => {
  return function MockSearchBar({ searchTerm, onSearchChange, onSearch }) {
    return (
      <div data-testid="search-bar">
        <input
          data-testid="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search games..."
        />
        <button onClick={() => onSearch(searchTerm)} data-testid="search-button">
          Search
        </button>
      </div>
    );
  };
});

jest.mock('../../components/FilterMenu', () => {
  return function MockFilterMenu({ 
    genres, 
    platforms, 
    selectedGenre, 
    selectedPlatform, 
    onGenreChange, 
    onPlatformChange, 
    onClearFilters 
  }) {
    return (
      <div data-testid="filter-menu">
        <button onClick={() => onGenreChange(['Action'])} data-testid="genre-filter">
          Filter Genre
        </button>
        <button onClick={() => onPlatformChange(['PC'])} data-testid="platform-filter">
          Filter Platform
        </button>
        <button onClick={onClearFilters} data-testid="clear-filters">
          Clear Filters
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Pagination', () => {
  return function MockPagination({ currentPage, totalPages, onPageChange }) {
    return (
      <div data-testid="pagination">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          data-testid="prev-page"
        >
          Previous
        </button>
        <span data-testid="page-info">{currentPage} of {totalPages}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          data-testid="next-page"
        >
          Next
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Loader', () => {
  return function MockLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

// Mock hooks
const mockGames = [
  { id: 1, name: 'Test Game 1', price: 29.99, genre: 'Action' },
  { id: 2, name: 'Test Game 2', price: 39.99, genre: 'RPG' },
];

const mockUseFetchGames = jest.fn();
const mockUseFetchGenres = jest.fn();
const mockUseFetchPlatforms = jest.fn();

jest.mock('../../hooks/useFetchGames', () => ({
  useFetchGames: (...args) => mockUseFetchGames(...args),
  useFetchGenres: () => mockUseFetchGenres(),
  useFetchPlatforms: () => mockUseFetchPlatforms(),
}));

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

// Mock console methods
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Wrapper component with all necessary providers
const TestWrapper = ({ children, initialEntries = ['/games'] }) => {
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

describe('Games', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Default mock returns
    mockUseFetchGames.mockReturnValue({
      games: mockGames,
      loading: false,
      error: null,
      pagination: { count: 2, next: null, previous: null }
    });
    
    mockUseFetchGenres.mockReturnValue({
      genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'RPG' }]
    });
    
    mockUseFetchPlatforms.mockReturnValue({
      platforms: [{ id: 1, name: 'PC' }, { id: 2, name: 'PlayStation 5' }]
    });
  });

  describe('Rendering', () => {
    it('should render all main components', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('filter-menu')).toBeInTheDocument();
    });

    it('should render page title and description', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByText(/game store/i)).toBeInTheDocument();
      expect(screen.getByText(/discover thousands of games/i)).toBeInTheDocument();
    });

    it('should render games grid when games are loaded', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('game-card-2')).toBeInTheDocument();
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
      expect(screen.getByText('Test Game 2')).toBeInTheDocument();
    });

    it('should render results count', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByText(/showing 2 of 2 games/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loader when loading', () => {
      mockUseFetchGames.mockReturnValue({
        games: [],
        loading: true,
        error: null,
        pagination: { count: 0, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should hide games grid when loading', () => {
      mockUseFetchGames.mockReturnValue({
        games: [],
        loading: true,
        error: null,
        pagination: { count: 0, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.queryByTestId('game-card-1')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when there is an error', () => {
      mockUseFetchGames.mockReturnValue({
        games: [],
        loading: false,
        error: 'Failed to fetch games',
        pagination: { count: 0, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch games')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should reload page when Try Again is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock window.location.reload
      Object.defineProperty(window, 'location', {
        value: { reload: jest.fn() },
        writable: true,
      });

      mockUseFetchGames.mockReturnValue({
        games: [],
        loading: false,
        error: 'Failed to fetch games',
        pagination: { count: 0, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const tryAgainButton = screen.getByText('Try Again');
      await user.click(tryAgainButton);

      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('should show no games message when no games found', () => {
      mockUseFetchGames.mockReturnValue({
        games: [],
        loading: false,
        error: null,
        pagination: { count: 0, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByText('No games found')).toBeInTheDocument();
      expect(screen.getByText(/try adjusting your search terms/i)).toBeInTheDocument();
      expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
    });

    it('should clear filters when Clear All Filters is clicked in empty state', async () => {
      const user = userEvent.setup();
      
      mockUseFetchGames.mockReturnValue({
        games: [],
        loading: false,
        error: null,
        pagination: { count: 0, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const clearButton = screen.getByText('Clear All Filters');
      await user.click(clearButton);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-selected-genres');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-selected-platforms');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-sort-by');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-search-term');
    });
  });

  describe('Search Functionality', () => {
    it('should update search term when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'action');

      expect(searchInput).toHaveValue('action');
    });

    it('should trigger search when search button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'action');
      await user.click(searchButton);

      // Should call useFetchGames with search term
      expect(mockUseFetchGames).toHaveBeenCalledWith(
        expect.any(Number), // page
        expect.any(Number), // pageSize
        'action', // search term
        expect.any(Array), // genre
        expect.any(Array), // platform
        expect.any(String) // sortBy
      );
    });

    it('should save search term to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('gaming-search-term', 'test');
    });

    it('should clear search parameters on mount', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-search-term');
      expect(console.log).toHaveBeenCalledWith('🎮 Games page loaded with clean search state');
    });
  });

  describe('Filtering', () => {
    it('should handle genre filter changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const genreFilter = screen.getByTestId('genre-filter');
      await user.click(genreFilter);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-selected-genres', 
        JSON.stringify(['Action'])
      );
    });

    it('should handle platform filter changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const platformFilter = screen.getByTestId('platform-filter');
      await user.click(platformFilter);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-selected-platforms', 
        JSON.stringify(['PC'])
      );
    });

    it('should clear all filters when clear button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const clearButton = screen.getByTestId('clear-filters');
      await user.click(clearButton);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-selected-genres');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-selected-platforms');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-sort-by');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-search-term');
    });
  });

  describe('Sorting', () => {
    it('should handle sort changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const sortSelect = screen.getByDisplayValue('Relevance');
      await user.selectOptions(sortSelect, 'name-asc');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('gaming-sort-by', 'name-asc');
    });

    it('should render all sort options', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByText('Relevance')).toBeInTheDocument();
      expect(screen.getByText('Name A-Z')).toBeInTheDocument();
      expect(screen.getByText('Name Z-A')).toBeInTheDocument();
      expect(screen.getByText('Price: Low to High')).toBeInTheDocument();
      expect(screen.getByText('Price: High to Low')).toBeInTheDocument();
      expect(screen.getByText('Highest Rated')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should render pagination when there are multiple pages', () => {
      mockUseFetchGames.mockReturnValue({
        games: mockGames,
        loading: false,
        error: null,
        pagination: { count: 25, next: 'next-url', previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByTestId('page-info')).toHaveTextContent('1 of 3'); // 25 games / 12 per page = 3 pages
    });

    it('should not render pagination when there is only one page', () => {
      mockUseFetchGames.mockReturnValue({
        games: mockGames,
        loading: false,
        error: null,
        pagination: { count: 5, next: null, previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('should handle page changes', async () => {
      const user = userEvent.setup();
      
      mockUseFetchGames.mockReturnValue({
        games: mockGames,
        loading: false,
        error: null,
        pagination: { count: 25, next: 'next-url', previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const nextButton = screen.getByTestId('next-page');
      await user.click(nextButton);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('gaming-current-page', '2');
    });

    it('should scroll to top when page changes', async () => {
      const user = userEvent.setup();
      
      // Mock window.scrollTo
      Object.defineProperty(window, 'scrollTo', {
        value: jest.fn(),
        writable: true,
      });

      mockUseFetchGames.mockReturnValue({
        games: mockGames,
        loading: false,
        error: null,
        pagination: { count: 25, next: 'next-url', previous: null }
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const nextButton = screen.getByTestId('next-page');
      await user.click(nextButton);

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('URL Parameters', () => {
    it('should clear URL search parameters on mount', () => {
      render(
        <TestWrapper initialEntries={['/games?search=rpg']}>
          <Games />
        </TestWrapper>
      );

      expect(console.log).toHaveBeenCalledWith('🧹 Clearing URL search params on Games page load');
    });
  });

  describe('LocalStorage Integration', () => {
    it('should load current page from localStorage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'gaming-current-page') return '2';
        return null;
      });

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      // Should initialize with page 2 from localStorage
      expect(mockUseFetchGames).toHaveBeenCalledWith(
        2, // page from localStorage
        expect.any(Number),
        expect.any(String),
        expect.any(Array),
        expect.any(Array),
        expect.any(String)
      );
    });

    it('should save all state changes to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      // Change various filters
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');

      const genreFilter = screen.getByTestId('genre-filter');
      await user.click(genreFilter);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('gaming-search-term', 'test');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('gaming-selected-genres', JSON.stringify(['Action']));
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const gamesGrid = screen.getByTestId('game-card-1').parentElement;
      expect(gamesGrid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
    });

    it('should have responsive spacing', () => {
      render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const container = screen.getByText(/game store/i).closest('.container');
      expect(container).toHaveClass('px-4', 'sm:px-6');
      expect(container).toHaveClass('py-8', 'sm:py-12');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      const gamesContainer = screen.getByTestId('game-card-1').parentElement;

      rerender(
        <TestWrapper>
          <Games />
        </TestWrapper>
      );

      expect(screen.getByTestId('game-card-1').parentElement).toBe(gamesContainer);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        render(
          <TestWrapper>
            <Games />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle hook errors gracefully', () => {
      mockUseFetchGames.mockImplementation(() => {
        throw new Error('Hook error');
      });

      expect(() => {
        render(
          <TestWrapper>
            <Games />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
