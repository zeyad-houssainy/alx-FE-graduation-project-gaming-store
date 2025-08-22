import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock matchMedia
const mockMatchMedia = jest.fn();

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  
  Object.defineProperty(window, 'matchMedia', {
    value: mockMatchMedia,
    writable: true,
  });

  // Mock document.documentElement.classList
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
      toggle: jest.fn(),
    },
    writable: true,
  });

  jest.clearAllMocks();
});

// Test component to use the ThemeContext
const TestComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-status">
        {isDark ? 'Dark' : 'Light'}
      </div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with light theme when no localStorage or system preference', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
    });

    it('should initialize with dark theme from localStorage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'dark';
        return null;
      });
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });

    it('should initialize with light theme from localStorage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'light';
        return null;
      });
      mockMatchMedia.mockReturnValue({ matches: true }); // System prefers dark

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // localStorage should override system preference
      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
    });

    it('should initialize with dark theme from system preference when no localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: true });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle from light to dark theme', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');

      await user.click(screen.getByTestId('toggle-theme'));

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });

    it('should toggle from dark to light theme', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'dark';
        return null;
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');

      await user.click(screen.getByTestId('toggle-theme'));

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
    });

    it('should toggle multiple times correctly', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');

      // Toggle to dark
      await user.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');

      // Toggle back to light
      await user.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');

      // Toggle to dark again
      await user.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });
  });

  describe('DOM and LocalStorage Updates', () => {
    it('should add dark class to document when theme is dark', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('toggle-theme'));

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('color-theme', 'dark');
    });

    it('should remove dark class from document when theme is light', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'dark';
        return null;
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('toggle-theme'));

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('color-theme', 'light');
    });

    it('should set correct localStorage value on initialization with dark theme', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'dark';
        return null;
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('color-theme', 'dark');
    });

    it('should set correct localStorage value on initialization with light theme', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('color-theme', 'light');
    });
  });

  describe('System Preference Detection', () => {
    it('should respect system dark mode preference when no localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: true });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });

    it('should respect system light mode preference when no localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
    });

    it('should prioritize localStorage over system preference', () => {
      // System prefers dark
      mockMatchMedia.mockReturnValue({ matches: true });
      // But localStorage says light
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'light';
        return null;
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useTheme is used outside provider', () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      mockMatchMedia.mockReturnValue({ matches: false });

      // Should not crash and fallback to system preference
      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();
    });

    it('should handle matchMedia errors gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockImplementation(() => {
        throw new Error('matchMedia error');
      });

      // Should not crash and fallback to light theme
      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();
    });

    it('should handle document.documentElement errors gracefully', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      // Mock classList methods to throw errors
      document.documentElement.classList.add.mockImplementation(() => {
        throw new Error('DOM error');
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should not crash when trying to update DOM
      expect(() => user.click(screen.getByTestId('toggle-theme'))).not.toThrow();
    });
  });

  describe('Multiple Providers', () => {
    it('should work with nested providers independently', async () => {
      const user = userEvent.setup();
      
      const InnerComponent = () => {
        const { isDark, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="inner-theme">{isDark ? 'Dark' : 'Light'}</div>
            <button onClick={toggleTheme} data-testid="inner-toggle">
              Inner Toggle
            </button>
          </div>
        );
      };

      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
          <ThemeProvider>
            <InnerComponent />
          </ThemeProvider>
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
      expect(screen.getByTestId('inner-theme')).toHaveTextContent('Light');

      // Toggle outer theme
      await user.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
      // Inner theme should still be light (independent provider)
      expect(screen.getByTestId('inner-theme')).toHaveTextContent('Light');
    });
  });

  describe('Accessibility', () => {
    it('should maintain theme preference across renders', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'dark';
        return null;
      });

      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');

      // Rerender should maintain the same theme
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });

    it('should handle rapid theme changes', async () => {
      const user = userEvent.setup();
      
      mockLocalStorage.getItem.mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: false });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Rapidly toggle theme multiple times
      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByTestId('toggle-theme'));
      }

      // Should end up in dark mode (odd number of toggles)
      expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark');
    });
  });
});
