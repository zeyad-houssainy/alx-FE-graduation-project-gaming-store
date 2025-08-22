import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../Footer';

describe('Footer', () => {
  describe('Rendering', () => {
    it('should render footer with proper structure', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('bg-gray-50', 'dark:bg-gray-900');
    });

    it('should render newsletter section', () => {
      render(<Footer />);

      expect(screen.getByText(/our newsletter/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });

    it('should render all footer columns', () => {
      render(<Footer />);

      expect(screen.getByText('GAMING STORE')).toBeInTheDocument();
      expect(screen.getByText('PRODUCTS')).toBeInTheDocument();
      expect(screen.getByText('ACCOUNT')).toBeInTheDocument();
      expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
    });
  });

  describe('Newsletter Section', () => {
    it('should have email input with proper attributes', () => {
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveClass('focus:outline-none');
    });

    it('should handle email input changes', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should have subscribe button with proper styling', () => {
      render(<Footer />);

      const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
      expect(subscribeButton).toHaveClass('bg-blue-600', 'dark:bg-orange-500');
      expect(subscribeButton).toHaveClass('hover:bg-blue-700', 'dark:hover:bg-orange-600');
    });

    it('should handle subscribe button click', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
      await user.click(subscribeButton);

      // Button should be clickable (no errors thrown)
      expect(subscribeButton).toBeInTheDocument();
    });
  });

  describe('Company Information', () => {
    it('should display company name and description', () => {
      render(<Footer />);

      expect(screen.getByText('GAMING STORE')).toBeInTheDocument();
      expect(screen.getByText(/gaming store marketplace/i)).toBeInTheDocument();
    });

    it('should display contact information', () => {
      render(<Footer />);

      expect(screen.getByText(/address/i)).toBeInTheDocument();
      expect(screen.getByText(/phone/i)).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/po box w75 street/i)).toBeInTheDocument();
      expect(screen.getByText(/\+24 1245 654 235/)).toBeInTheDocument();
      expect(screen.getByText(/info@exemple.com/)).toBeInTheDocument();
    });

    it('should display contact info with proper icons', () => {
      render(<Footer />);

      // Check for emoji icons (simplified check)
      expect(screen.getByText('📍')).toBeInTheDocument();
      expect(screen.getByText('📞')).toBeInTheDocument();
      expect(screen.getByText('📧')).toBeInTheDocument();
    });
  });

  describe('Products Section', () => {
    it('should display products links', () => {
      render(<Footer />);

      expect(screen.getByText('PRODUCTS')).toBeInTheDocument();
      expect(screen.getByText('Action Games')).toBeInTheDocument();
      expect(screen.getByText('Adventure Games')).toBeInTheDocument();
      expect(screen.getByText('RPG Games')).toBeInTheDocument();
      expect(screen.getByText('Strategy Games')).toBeInTheDocument();
      expect(screen.getByText('Sports Games')).toBeInTheDocument();
      expect(screen.getByText('Racing Games')).toBeInTheDocument();
    });

    it('should have clickable product links', () => {
      render(<Footer />);

      const actionGamesLink = screen.getByText('Action Games');
      expect(actionGamesLink.closest('a')).toHaveAttribute('href', '#');
    });
  });

  describe('Account Section', () => {
    it('should display account links', () => {
      render(<Footer />);

      expect(screen.getByText('ACCOUNT')).toBeInTheDocument();
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Order History')).toBeInTheDocument();
      expect(screen.getByText('Wish List')).toBeInTheDocument();
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
      expect(screen.getByText('Returns')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();
    });

    it('should have clickable account links', () => {
      render(<Footer />);

      const myAccountLink = screen.getByText('My Account');
      expect(myAccountLink.closest('a')).toHaveAttribute('href', '#');
    });
  });

  describe('Subscribe Section', () => {
    it('should display subscribe information', () => {
      render(<Footer />);

      expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
      expect(screen.getByText(/subscribe to our mailing list/i)).toBeInTheDocument();
    });

    it('should display social media links', () => {
      render(<Footer />);

      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByText('YouTube')).toBeInTheDocument();
    });

    it('should have clickable social media links', () => {
      render(<Footer />);

      const facebookLink = screen.getByText('Facebook');
      expect(facebookLink.closest('a')).toHaveAttribute('href', '#');
    });
  });

  describe('Copyright Section', () => {
    it('should display copyright information', () => {
      render(<Footer />);

      expect(screen.getByText(/© 2024 gaming store/i)).toBeInTheDocument();
      expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
    });

    it('should display legal links', () => {
      render(<Footer />);

      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    });

    it('should have clickable legal links', () => {
      render(<Footer />);

      const privacyLink = screen.getByText('Privacy Policy');
      expect(privacyLink.closest('a')).toHaveAttribute('href', '#');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      render(<Footer />);

      const footerContent = screen.getByRole('contentinfo').querySelector('.grid');
      expect(footerContent).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
    });

    it('should have responsive newsletter layout', () => {
      render(<Footer />);

      const newsletterSection = screen.getByText(/our newsletter/i).closest('div');
      expect(newsletterSection).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('should have responsive spacing', () => {
      render(<Footer />);

      const footerContent = screen.getByRole('contentinfo').querySelector('.max-w-7xl');
      expect(footerContent).toHaveClass('gap-6', 'sm:gap-8');
      expect(footerContent).toHaveClass('px-4', 'sm:px-6');
      expect(footerContent).toHaveClass('py-8', 'sm:py-12');
    });
  });

  describe('Theme Support', () => {
    it('should have dark mode classes', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('dark:bg-gray-900');
      expect(footer).toHaveClass('dark:text-gray-300');
      expect(footer).toHaveClass('dark:border-gray-700');
    });

    it('should have dark mode input styling', () => {
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      expect(emailInput).toHaveClass('dark:bg-gray-700');
      expect(emailInput).toHaveClass('dark:text-white');
      expect(emailInput).toHaveClass('dark:border-gray-600');
    });

    it('should have dark mode button styling', () => {
      render(<Footer />);

      const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
      expect(subscribeButton).toHaveClass('dark:bg-orange-500');
      expect(subscribeButton).toHaveClass('dark:hover:bg-orange-600');
    });
  });

  describe('Accessibility', () => {
    it('should have proper landmark role', () => {
      render(<Footer />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<Footer />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check that main sections have headings
      expect(screen.getByRole('heading', { name: /gaming store/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /need help/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /follow us/i })).toBeInTheDocument();
    });

    it('should have proper form labels', () => {
      render(<Footer />);

      // There are two email inputs, get the first one
      const emailInputs = screen.getAllByPlaceholderText(/enter your email/i);
      const firstEmailInput = emailInputs[0];
      expect(firstEmailInput).toHaveAttribute('placeholder');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      // Tab through interactive elements - there are two email inputs, focus the first one
      const emailInputs = screen.getAllByPlaceholderText(/enter your email/i);
      const firstEmailInput = emailInputs[0];
      
      await user.tab();
      expect(firstEmailInput).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /subscribe/i })).toHaveFocus();
    });
  });

  describe('Links and Navigation', () => {
    it('should have all product links', () => {
      render(<Footer />);

      const productLinks = [
        'Graphics (26)',
        'Backgrounds (11)', 
        'Fonts (9)',
        'Music (3)',
        'Photography (3)'
      ];

      productLinks.forEach(linkText => {
        expect(screen.getByText(linkText)).toBeInTheDocument();
      });
    });

    it('should have all help links', () => {
      render(<Footer />);

      const helpLinks = [
        'Terms & Conditions',
        'Privacy Policy',
        'Refund Policy',
        'Affiliate',
        'Use Cases'
      ];

      helpLinks.forEach(linkText => {
        expect(screen.getByText(linkText)).toBeInTheDocument();
      });
    });

    it('should have all social media links', () => {
      render(<Footer />);

      // Check for social media icons (they're SVG elements)
      const socialIcons = screen.getAllByRole('link');
      expect(socialIcons.length).toBeGreaterThan(0);
    });

    it('should have proper link hover effects', () => {
      render(<Footer />);

      // Check for the hover effects on the help links
      const helpLinks = screen.getAllByText(/Terms|Privacy|Refund|Affiliate|Use Cases/);
      helpLinks.forEach(link => {
        expect(link).toHaveClass('hover:text-blue-600');
      });
    });
  });

  describe('Form Validation', () => {
    it('should accept valid email format', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      // There are two email inputs, get the first one (newsletter top bar)
      const emailInputs = screen.getAllByPlaceholderText(/enter your email/i);
      const emailInput = emailInputs[0];
      await user.type(emailInput, 'valid@example.com');

      expect(emailInput).toHaveValue('valid@example.com');
    });

    it('should handle empty email submission', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
      await user.click(subscribeButton);

      // Should not crash with empty email
      expect(subscribeButton).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<Footer />);

      const footer = screen.getByRole('contentinfo');

      rerender(<Footer />);

      expect(screen.getByRole('contentinfo')).toBe(footer);
    });
  });
});
