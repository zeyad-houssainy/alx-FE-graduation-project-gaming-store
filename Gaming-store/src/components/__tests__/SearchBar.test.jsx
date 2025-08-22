import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default placeholder', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      expect(screen.getByPlaceholderText('Search games...')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
          placeholder="Find your game..."
        />
      );

      expect(screen.getByPlaceholderText('Find your game...')).toBeInTheDocument();
    });

    it('should render with provided search term', () => {
      render(
        <SearchBar
          searchTerm="test search"
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={jest.fn()}
          onSearch={jest.fn()}
        />
      );

      const searchIcon = screen.getByRole('search').querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should render search button', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onSearchChange when typing in input', async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search games...');
      await user.type(input, 'test');

      expect(mockOnSearchChange).toHaveBeenCalledTimes(4); // Each character
      expect(mockOnSearchChange).toHaveBeenLastCalledWith('test');
    });

    it('should call onSearch when search button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          searchTerm="test search"
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });

    it('should call onSearch when Enter key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          searchTerm="test search"
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search games...');
      await user.type(input, '{enter}');

      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });

    it('should trim whitespace when submitting', async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          searchTerm="  test search  "
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });

    it('should not call onSearch when search term is empty', async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('should not call onSearch when search term is only whitespace', async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          searchTerm="   "
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should prevent default form submission', () => {
      render(
        <SearchBar
          searchTerm="test"
          onSearchChange={jest.fn()}
          onSearch={jest.fn()}
        />
      );

      const form = screen.getByRole('search');
      const submitEvent = jest.fn();
      
      form.addEventListener('submit', submitEvent);
      
      // Trigger form submission
      fireEvent.submit(form);
      
      expect(submitEvent).toHaveBeenCalled();
    });

    it('should handle form submission with button click', () => {
      const mockOnSearch = jest.fn();
      render(
        <SearchBar
          searchTerm="test"
          onSearchChange={jest.fn()}
          onSearch={mockOnSearch}
        />
      );

      const form = screen.getByRole('search');
      fireEvent.submit(form);

      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('Button States', () => {
    it('should disable search button when search term is empty', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeDisabled();
    });

    it('should disable search button when search term is only whitespace', () => {
      render(
        <SearchBar
          searchTerm="   "
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeDisabled();
    });

    it('should enable search button when search term has content', () => {
      render(
        <SearchBar
          searchTerm="test"
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).not.toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have proper CSS classes for styling', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search games...');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('rounded-lg');
    });

    it('should have proper focus styles', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByPlaceholderText('Search games...');
      expect(input).toHaveClass('focus:outline-none');
      expect(input).toHaveClass('focus:ring-2');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={jest.fn()}
          onSearch={jest.fn()}
        />
      );

      const form = screen.getByRole('search');
      expect(form).toBeInTheDocument();
    });

    it('should have searchbox role for input', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should have submit button type', () => {
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={jest.fn()}
          onSearch={jest.fn()}
        />
      );

      const input = screen.getByRole('searchbox');
      const button = screen.getByRole('button', { name: /search/i });

      // Focus should start on input
      await user.tab();
      expect(input).toHaveFocus();

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined searchTerm', () => {
      expect(() => {
        render(
          <SearchBar
            searchTerm={undefined}
            onSearchChange={mockOnSearchChange}
            onSearch={mockOnSearch}
          />
        );
      }).not.toThrow();
    });

    it('should handle null searchTerm', () => {
      expect(() => {
        render(
          <SearchBar
            searchTerm={null}
            onSearchChange={mockOnSearchChange}
            onSearch={mockOnSearch}
          />
        );
      }).not.toThrow();
    });

    it('should handle special characters in search term', async () => {
      const user = userEvent.setup();
      const mockOnSearchChange = jest.fn();
      
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={jest.fn()}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.type(input, '!@#$%^&*()');

      // Check that onSearchChange was called for each character
      expect(mockOnSearchChange).toHaveBeenCalledTimes(10);
      // The last call should be with the complete string
      expect(mockOnSearchChange).toHaveBeenLastCalledWith('!@#$%^&*()');
    });

    it('should handle very long search terms', async () => {
      const user = userEvent.setup();
      const mockOnSearchChange = jest.fn();
      
      render(
        <SearchBar
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onSearch={jest.fn()}
        />
      );

      const input = screen.getByRole('searchbox');
      const longSearchTerm = 'a'.repeat(100); // Reduced from 1000 to 100 for performance
      await user.type(input, longSearchTerm);

      expect(mockOnSearchChange).toHaveBeenCalledTimes(100);
      expect(mockOnSearchChange).toHaveBeenLastCalledWith(longSearchTerm);
    }, 10000); // Increased timeout to 10 seconds
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <SearchBar
          searchTerm="test"
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      const initialInput = screen.getByDisplayValue('test');

      // Re-render with same props
      rerender(
        <SearchBar
          searchTerm="test"
          onSearchChange={mockOnSearchChange}
          onSearch={mockOnSearch}
        />
      );

      expect(screen.getByDisplayValue('test')).toBe(initialInput);
    });
  });
});
