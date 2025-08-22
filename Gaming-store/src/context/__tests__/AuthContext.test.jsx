import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  jest.clearAllMocks();
});

// Test component to use the AuthContext
const TestComponent = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="login-status">
        {auth.isLoggedIn ? 'Logged In' : 'Logged Out'}
      </div>
      <div data-testid="user-name">
        {auth.user?.name || 'No User'}
      </div>
      <div data-testid="fresh-start">
        {auth.isFreshStart ? 'Fresh Start' : 'Not Fresh'}
      </div>
      <div data-testid="orders-count">
        {auth.orders.length}
      </div>
      <div data-testid="addresses-count">
        {auth.getAddresses().length}
      </div>
      <div data-testid="payment-methods-count">
        {auth.getPaymentMethods().length}
      </div>
      <button onClick={auth.login} data-testid="login-btn">
        Login
      </button>
      <button onClick={auth.logout} data-testid="logout-btn">
        Logout
      </button>
      <button onClick={() => auth.addOrder({
        items: [{ id: 1, name: 'Test Game', price: 29.99 }],
        total: 29.99,
        shippingAddress: { street: '123 Test St' },
        paymentDetails: { method: 'card' }
      })} data-testid="add-order-btn">
        Add Order
      </button>
      <button onClick={() => auth.addAddress({
        street: '123 Test St',
        city: 'Test City',
        zip: '12345'
      })} data-testid="add-address-btn">
        Add Address
      </button>
      <button onClick={() => auth.addPaymentMethod({
        type: 'card',
        last4: '1234',
        expiry: '12/25'
      })} data-testid="add-payment-btn">
        Add Payment
      </button>
      <button onClick={auth.resetAllData} data-testid="reset-btn">
        Reset All
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should provide initial auth state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('login-status')).toHaveTextContent('Logged Out');
      expect(screen.getByTestId('user-name')).toHaveTextContent('No User');
      expect(screen.getByTestId('fresh-start')).toHaveTextContent('Fresh Start');
      expect(screen.getByTestId('orders-count')).toHaveTextContent('0');
      expect(screen.getByTestId('addresses-count')).toHaveTextContent('0');
      expect(screen.getByTestId('payment-methods-count')).toHaveTextContent('0');
    });

    it('should clear localStorage on mount', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-auth');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-cart');
    });
  });

  describe('Authentication', () => {
    it('should login user successfully', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('login-btn'));

      expect(screen.getByTestId('login-status')).toHaveTextContent('Logged In');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
      expect(screen.getByTestId('fresh-start')).toHaveTextContent('Not Fresh');
    });

    it('should logout user successfully', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // First login
      await user.click(screen.getByTestId('login-btn'));
      expect(screen.getByTestId('login-status')).toHaveTextContent('Logged In');

      // Then logout
      await user.click(screen.getByTestId('logout-btn'));
      
      expect(screen.getByTestId('login-status')).toHaveTextContent('Logged Out');
      expect(screen.getByTestId('user-name')).toHaveTextContent('No User');
      expect(screen.getByTestId('fresh-start')).toHaveTextContent('Fresh Start');
    });

    it('should clear all data on logout', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('login-btn'));
      await user.click(screen.getByTestId('logout-btn'));

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-auth');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-orders');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-cart');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-saved-addresses');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('gaming-saved-payment');
    });
  });

  describe('Order Management', () => {
    it('should add order successfully', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('orders-count')).toHaveTextContent('0');

      await user.click(screen.getByTestId('add-order-btn'));

      expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
    });

    it('should save orders to localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('add-order-btn'));

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-orders',
        expect.stringContaining('Test Game')
      );
    });

    it('should filter invalid orders on initialization', () => {
      // Mock localStorage with invalid orders
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'gaming-orders') {
          return JSON.stringify([
            { id: 'valid', items: [{ id: 1 }], total: 29.99 },
            { id: 'invalid' }, // Missing required fields
            null, // Null order
          ]);
        }
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should only have the valid order
      expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
    });
  });

  describe('Address Management', () => {
    it('should add address successfully', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('addresses-count')).toHaveTextContent('0');

      await user.click(screen.getByTestId('add-address-btn'));

      expect(screen.getByTestId('addresses-count')).toHaveTextContent('1');
    });

    it('should save addresses to localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('add-address-btn'));

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-saved-addresses',
        expect.stringContaining('Test City')
      );
    });
  });

  describe('Payment Method Management', () => {
    it('should add payment method successfully', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('payment-methods-count')).toHaveTextContent('0');

      await user.click(screen.getByTestId('add-payment-btn'));

      expect(screen.getByTestId('payment-methods-count')).toHaveTextContent('1');
    });

    it('should save payment methods to localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('add-payment-btn'));

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gaming-saved-payment',
        expect.stringContaining('card')
      );
    });
  });

  describe('Data Reset', () => {
    it('should reset all data successfully', async () => {
      const user = userEvent.setup();
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Add some data
      await user.click(screen.getByTestId('login-btn'));
      await user.click(screen.getByTestId('add-order-btn'));
      await user.click(screen.getByTestId('add-address-btn'));

      // Reset all data
      await user.click(screen.getByTestId('reset-btn'));

      expect(screen.getByTestId('login-status')).toHaveTextContent('Logged Out');
      expect(screen.getByTestId('orders-count')).toHaveTextContent('0');
      expect(screen.getByTestId('addresses-count')).toHaveTextContent('0');
      expect(screen.getByTestId('fresh-start')).toHaveTextContent('Fresh Start');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useAuth is used outside provider', () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw an error
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // Should not crash
      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      }).not.toThrow();
    });
  });

  describe('LocalStorage Integration', () => {
    it('should load saved addresses from localStorage', () => {
      const savedAddresses = [
        { id: 'ADDR-1', street: '123 Main St', city: 'Test City' }
      ];
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'gaming-saved-addresses') {
          return JSON.stringify(savedAddresses);
        }
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('addresses-count')).toHaveTextContent('1');
    });

    it('should load saved payment methods from localStorage', () => {
      const savedPayments = [
        { id: 'PAY-1', type: 'card', last4: '1234' }
      ];
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'gaming-saved-payment') {
          return JSON.stringify(savedPayments);
        }
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('payment-methods-count')).toHaveTextContent('1');
    });
  });
});
