import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button onClick={mockOnClick}>Click Me</Button>);
      
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('should render button with custom className', () => {
      render(
        <Button onClick={mockOnClick} className="custom-class">
          Test Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should render disabled button', () => {
      render(
        <Button onClick={mockOnClick} disabled>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should render with different button types', () => {
      render(
        <Button onClick={mockOnClick} type="submit">
          Submit Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      render(<Button onClick={mockOnClick}>Primary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should render secondary variant', () => {
      render(
        <Button onClick={mockOnClick} variant="secondary">
          Secondary
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-600');
    });

    it('should render outline variant', () => {
      render(
        <Button onClick={mockOnClick} variant="outline">
          Outline
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2');
      expect(button).toHaveClass('bg-transparent');
    });

    it('should render danger variant', () => {
      render(
        <Button onClick={mockOnClick} variant="danger">
          Danger
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Button onClick={mockOnClick}>Medium</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should render small size', () => {
      render(
        <Button onClick={mockOnClick} size="sm">
          Small
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render large size', () => {
      render(
        <Button onClick={mockOnClick} size="lg">
          Large
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when button is clicked', async () => {
      const user = userEvent.setup();
      
      render(<Button onClick={mockOnClick}>Click Me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when button is disabled', async () => {
      const user = userEvent.setup();
      
      render(
        <Button onClick={mockOnClick} disabled>
          Disabled
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should be focusable with keyboard', async () => {
      const user = userEvent.setup();
      
      render(<Button onClick={mockOnClick}>Focus Me</Button>);
      
      await user.tab();
      
      const button = screen.getByRole('button');
      expect(button).toHaveFocus();
    });

    it('should be activated with Enter key', async () => {
      const user = userEvent.setup();
      
      render(<Button onClick={mockOnClick}>Enter Me</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should be activated with Space key', async () => {
      const user = userEvent.setup();
      
      render(<Button onClick={mockOnClick}>Space Me</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('should render loading state', () => {
      render(
        <Button onClick={mockOnClick} loading>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      
      render(
        <Button onClick={mockOnClick} loading>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should show loading spinner', () => {
      render(
        <Button onClick={mockOnClick} loading>
          Loading Button
        </Button>
      );
      
      const spinner = screen.getByRole('button').querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('should render with left icon', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      
      render(
        <Button onClick={mockOnClick} leftIcon={<LeftIcon />}>
          With Left Icon
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render with right icon', () => {
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      
      render(
        <Button onClick={mockOnClick} rightIcon={<RightIcon />}>
          With Right Icon
        </Button>
      );
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should render with both icons', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      
      render(
        <Button 
          onClick={mockOnClick} 
          leftIcon={<LeftIcon />}
          rightIcon={<RightIcon />}
        >
          With Both Icons
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Full Width', () => {
    it('should render full width button', () => {
      render(
        <Button onClick={mockOnClick} fullWidth>
          Full Width
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('should not be full width by default', () => {
      render(<Button onClick={mockOnClick}>Normal Width</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes when disabled', () => {
      render(
        <Button onClick={mockOnClick} disabled>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have proper ARIA attributes when loading', () => {
      render(
        <Button onClick={mockOnClick} loading>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support custom ARIA labels', () => {
      render(
        <Button onClick={mockOnClick} aria-label="Custom Label">
          Button
        </Button>
      );
      
      const button = screen.getByLabelText('Custom Label');
      expect(button).toBeInTheDocument();
    });

    it('should support custom ARIA describedby', () => {
      render(
        <div>
          <Button onClick={mockOnClick} aria-describedby="description">
            Button
          </Button>
          <div id="description">Button description</div>
        </div>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Theme Support', () => {
    it('should have dark mode classes', () => {
      render(<Button onClick={mockOnClick}>Dark Mode</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:bg-orange-500');
    });

    it('should have dark mode hover classes', () => {
      render(<Button onClick={mockOnClick}>Dark Hover</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:hover:bg-orange-600');
    });
  });

  describe('Custom Props', () => {
    it('should pass through HTML button props', () => {
      render(
        <Button 
          onClick={mockOnClick}
          id="custom-id"
          data-testid="custom-button"
          title="Custom Title"
        >
          Custom Props
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'custom-id');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Custom Title');
    });

    it('should merge className prop with default classes', () => {
      render(
        <Button onClick={mockOnClick} className="custom-class">
          Custom Class
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('font-medium'); // Default class
    });
  });

  describe('Edge Cases', () => {
    it('should handle children as function', () => {
      render(
        <Button onClick={mockOnClick}>
          {({ loading }) => loading ? 'Loading...' : 'Click Me'}
        </Button>
      );
      
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(<Button onClick={mockOnClick}>{null}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle undefined onClick', () => {
      expect(() => {
        render(<Button>No onClick</Button>);
      }).not.toThrow();
    });

    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      
      render(<Button onClick={mockOnClick}>Rapid Click</Button>);
      
      const button = screen.getByRole('button');
      
      // Click rapidly
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <Button onClick={mockOnClick}>Stable Button</Button>
      );
      
      const initialButton = screen.getByRole('button');
      
      // Re-render with same props
      rerender(
        <Button onClick={mockOnClick}>Stable Button</Button>
      );
      
      expect(screen.getByRole('button')).toBe(initialButton);
    });
  });
});
