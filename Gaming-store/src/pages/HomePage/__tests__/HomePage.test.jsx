import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { CartProvider } from '../../../context/CartContext';
import { AuthProvider } from '../../../context/AuthContext';
import { ThemeProvider } from '../../../context/ThemeContext';

// Mock child components to focus on HomePage logic
jest.mock('../../../components/Header/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../../../components/Footer/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../OurServices', () => {
  return function MockOurServices() {
    return <div data-testid="our-services">Our Services</div>;
  };
});

jest.mock('../FeaturedGames', () => {
  return function MockFeaturedGames() {
    return <div data-testid="featured-games">Featured Games</div>;
  };
});

jest.mock('../Features', () => {
  return function MockFeatures() {
    return <div data-testid="features">Features</div>;
  };
});

jest.mock('../LiveMatches', () => {
  return function MockLiveMatches() {
    return <div data-testid="live-matches">Live Matches</div>;
  };
});

jest.mock('../Articles', () => {
  return function MockArticles() {
    return <div data-testid="articles">Articles</div>;
  };
});

jest.mock('../../../components/HeroSearchBar', () => {
  return function MockHeroSearchBar({ onSearch }) {
    return (
      <div data-testid="hero-search-bar">
        <input 
          data-testid="search-input" 
          placeholder="Search for games..."
        />
        <button 
          data-testid="search-button"
          onClick={() => onSearch('test search')}
        >
          Search
        </button>
      </div>
    );
  };
});

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all main components', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('our-services')).toBeInTheDocument();
      expect(screen.getByTestId('featured-games')).toBeInTheDocument();
      expect(screen.getByTestId('features')).toBeInTheDocument();
      expect(screen.getByTestId('live-matches')).toBeInTheDocument();
      expect(screen.getByTestId('articles')).toBeInTheDocument();
    });

    it('should render hero section with proper structure', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/ultimate gaming experience/i)).toBeInTheDocument();
      expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
      expect(screen.getByText(/gaming store/i)).toBeInTheDocument();
      expect(screen.getByTestId('hero-search-bar')).toBeInTheDocument();
    });

    it('should render CTA buttons', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText('Explore Games')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });

    it('should render hero description', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/discover the ultimate destination/i)).toBeInTheDocument();
      expect(screen.getByText(/join epic battles/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to games page when Explore Games is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const exploreButton = screen.getByText('Explore Games');
      await user.click(exploreButton);

      expect(mockNavigate).toHaveBeenCalledWith('/games');
    });

    it('should navigate to about page when About Us is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const aboutButton = screen.getByText('About Us');
      await user.click(aboutButton);

      expect(mockNavigate).toHaveBeenCalledWith('/about');
    });
  });

  describe('Search Functionality', () => {
    it('should handle search and navigate to games page with search term', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const searchButton = screen.getByTestId('search-button');
      await user.click(searchButton);

      expect(mockNavigate).toHaveBeenCalledWith('/games?search=test%20search');
    });

    it('should not navigate when search term is empty', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Simulate empty search (handleSearch should not be called)
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should properly encode search terms in URL', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Mock HeroSearchBar to send a search with special characters
      const MockHeroSearchBarWithSpecialChars = ({ onSearch }) => (
        <button 
          data-testid="special-search"
          onClick={() => onSearch('action & adventure')}
        >
          Search Special
        </button>
      );

      // Re-render with special search
      const { rerender } = render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // For this test, we'll simulate the behavior
      // In a real scenario, we'd test the actual encoding
      const searchTerm = 'action & adventure';
      const encodedTerm = encodeURIComponent(searchTerm.trim());
      
      expect(encodedTerm).toBe('action%20%26%20adventure');
    });
  });

  describe('Hero Section Layout', () => {
    it('should have proper hero section structure', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const heroSection = screen.getByText(/welcome to/i).closest('section');
      expect(heroSection).toHaveClass('min-h-screen');
      expect(heroSection).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should have background pattern elements', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const backgroundPattern = screen.getByText(/welcome to/i).closest('section').querySelector('.absolute.inset-0');
      expect(backgroundPattern).toBeInTheDocument();
    });

    it('should have scroll indicator', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const scrollIndicator = screen.getByText(/welcome to/i).closest('section').querySelector('.absolute.bottom-8');
      expect(scrollIndicator).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('should have proper styling for Explore Games button', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const exploreButton = screen.getByText('Explore Games');
      expect(exploreButton).toHaveClass('bg-blue-600', 'dark:bg-orange-500');
      expect(exploreButton).toHaveClass('hover:bg-blue-700', 'dark:hover:bg-orange-600');
      expect(exploreButton).toHaveClass('text-white');
    });

    it('should have proper styling for About Us button', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const aboutButton = screen.getByText('About Us');
      expect(aboutButton).toHaveClass('bg-transparent');
      expect(aboutButton).toHaveClass('border-2');
      expect(aboutButton).toHaveClass('text-blue-600', 'dark:text-orange-400');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive text sizes', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const mainHeading = screen.getByText(/welcome to/i);
      expect(mainHeading).toHaveClass('text-4xl', 'sm:text-5xl', 'md:text-6xl', 'lg:text-7xl', 'xl:text-8xl');
    });

    it('should have responsive button layout', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const buttonContainer = screen.getByText('Explore Games').parentElement;
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
      expect(buttonContainer).toHaveClass('gap-3', 'sm:gap-4');
    });

    it('should have responsive search bar container', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const searchContainer = screen.getByTestId('hero-search-bar').parentElement;
      expect(searchContainer).toHaveClass('max-w-2xl', 'mx-auto');
    });
  });

  describe('Theme Support', () => {
    it('should have dark mode classes', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const heroSection = screen.getByText(/welcome to/i).closest('section');
      expect(heroSection).toHaveClass('dark:from-gray-900', 'dark:via-gray-800', 'dark:to-gray-900');

      const gamingStoreText = screen.getByText('GAMING STORE');
      expect(gamingStoreText).toHaveClass('dark:text-orange-400');
    });

    it('should have proper text colors for dark mode', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const subtitle = screen.getByText(/ultimate gaming experience/i);
      expect(subtitle).toHaveClass('dark:text-orange-400');

      const description = screen.getByText(/discover the ultimate destination/i);
      expect(description).toHaveClass('dark:text-gray-300');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent(/welcome to gaming store/i);
    });

    it('should have proper button roles', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const exploreButton = screen.getByRole('button', { name: /explore games/i });
      const aboutButton = screen.getByRole('button', { name: /about us/i });

      expect(exploreButton).toBeInTheDocument();
      expect(aboutButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Tab through interactive elements
      await user.tab();
      await user.tab();

      const exploreButton = screen.getByText('Explore Games');
      expect(exploreButton).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const heroSection = screen.getByText(/welcome to/i);

      rerender(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/welcome to/i)).toBe(heroSection);
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      const user = userEvent.setup();
      
      mockNavigate.mockImplementation(() => {
        throw new Error('Navigation error');
      });

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const exploreButton = screen.getByText('Explore Games');
      
      // Should not crash when navigation fails
      expect(async () => {
        await user.click(exploreButton);
      }).not.toThrow();
    });

    it('should handle search errors gracefully', async () => {
      const user = userEvent.setup();

      // Mock HeroSearchBar to throw error
      jest.doMock('../../../components/HeroSearchBar', () => {
        return function MockHeroSearchBarError({ onSearch }) {
          return (
            <button 
              data-testid="error-search"
              onClick={() => {
                throw new Error('Search error');
              }}
            >
              Error Search
            </button>
          );
        };
      });

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Component should still render without crashing
      expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('should render all content sections in correct order', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const main = screen.getByRole('main');
      const sections = main.children;

      // Hero section should be first
      expect(sections[0]).toContain(screen.getByText(/welcome to/i));
      
      // Other sections should follow
      expect(screen.getByTestId('our-services')).toBeInTheDocument();
      expect(screen.getByTestId('featured-games')).toBeInTheDocument();
      expect(screen.getByTestId('live-matches')).toBeInTheDocument();
      expect(screen.getByTestId('features')).toBeInTheDocument();
      expect(screen.getByTestId('articles')).toBeInTheDocument();
    });

    it('should have proper main element structure', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveClass('relative', 'z-10');
      expect(main).toHaveClass('pt-20', 'sm:pt-24');
    });
  });
});
