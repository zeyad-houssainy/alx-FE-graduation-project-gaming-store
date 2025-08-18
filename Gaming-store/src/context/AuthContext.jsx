import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = localStorage.getItem('gaming-auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      return parsedAuth.isLoggedIn || false;
    }
    return false;
  });

  const [user, setUser] = useState(() => {
    const savedAuth = localStorage.getItem('gaming-auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      return parsedAuth.user || null;
    }
    return null;
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('gaming-orders');
    // Only load real orders, filter out any mock data
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Filter out any orders that don't have proper structure
      return parsedOrders.filter(order => 
        order && 
        order.id && 
        order.items && 
        Array.isArray(order.items) && 
        order.items.length > 0 &&
        order.total !== undefined
      );
    }
    return [];
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    const authData = {
      isLoggedIn,
      user
    };
    localStorage.setItem('gaming-auth', JSON.stringify(authData));
  }, [isLoggedIn, user]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gaming-orders', JSON.stringify(orders));
  }, [orders]);

  // Clean up any existing mock data on mount
  useEffect(() => {
    cleanupMockData();
  }, []); // Only run once on mount

  const login = () => {
    const userData = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      avatar: '/assets/images/profile-avatar.jpg'
    };
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // Clear localStorage on logout
    localStorage.removeItem('gaming-auth');
    localStorage.removeItem('gaming-orders');
  };

  // Clear any mock data and reset orders
  const clearMockData = () => {
    setOrders([]);
    localStorage.removeItem('gaming-orders');
  };

  // Clean up any existing mock data from localStorage
  const cleanupMockData = () => {
    const savedOrders = localStorage.getItem('gaming-orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Filter out any orders that don't have proper structure
        const validOrders = parsedOrders.filter(order => 
          order && 
          order.id && 
          order.items && 
          Array.isArray(order.items) && 
          order.items.length > 0 &&
          order.total !== undefined &&
          order.shippingAddress &&
          order.paymentDetails
        );
        
        if (validOrders.length !== parsedOrders.length) {
          console.log('Cleaned up mock data from localStorage');
          setOrders(validOrders);
          localStorage.setItem('gaming-orders', JSON.stringify(validOrders));
        }
      } catch (error) {
        console.error('Error cleaning up mock data:', error);
        // If there's an error parsing, clear everything
        setOrders([]);
        localStorage.removeItem('gaming-orders');
      }
    }
  };

  // Development helper: Reset all localStorage data
  const resetAllData = () => {
    setIsLoggedIn(false);
    setUser(null);
    setOrders([]);
    localStorage.removeItem('gaming-auth');
    localStorage.removeItem('gaming-orders');
    localStorage.removeItem('gaming-cart');
    console.log('All localStorage data has been reset');
  };

  // Add new order
  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      ...orderData
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  // Get all orders
  const getOrders = () => {
    return orders;
  };

  const value = {
    isLoggedIn,
    user,
    orders,
    login,
    logout,
    addOrder,
    getOrders,
    clearMockData,
    cleanupMockData,
    resetAllData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
