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
  // Start with the user logged out, don't load from localStorage. This ensures a fresh
  // start every time the app loads, requiring users to go through the login/signup forms.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isFreshStart, setIsFreshStart] = useState(true);

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

  // Saved addresses and payment methods
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('gaming-saved-addresses');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedPaymentMethods, setSavedPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('gaming-saved-payment');
    return saved ? JSON.parse(saved) : [];
  });

  // Avatar state
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem('gaming-avatar');
    return savedAvatar || null;
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

  // Save addresses and payment methods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gaming-saved-addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('gaming-saved-payment', JSON.stringify(savedPaymentMethods));
  }, [savedPaymentMethods]);

  // Save avatar to localStorage whenever it changes
  useEffect(() => {
    if (avatar) {
      localStorage.setItem('gaming-avatar', avatar);
    } else {
      localStorage.removeItem('gaming-avatar');
    }
  }, [avatar]);

  // Clean up any existing mock data on mount
  useEffect(() => {
    cleanupMockData();
    // Clear any existing auth data to ensure fresh start
    localStorage.removeItem('gaming-auth');
    // Also clear cart data to ensure completely fresh start
    localStorage.removeItem('gaming-cart');
    setIsFreshStart(false);
  }, []); // Only run once on mount

  // Clean up mock data on first load
  useEffect(() => {
    const hasCleanedUp = localStorage.getItem('gaming-cleanup-done');
    if (!hasCleanedUp) {
      try {
        // Clean up any existing mock data
        localStorage.removeItem('gaming-user');
        localStorage.removeItem('gaming-orders');
        localStorage.setItem('gaming-cleanup-done', 'true');
      } catch {
        // If there's an error parsing, clear everything
        localStorage.clear();
        localStorage.setItem('gaming-cleanup-done', 'true');
      }
    }
  }, []);

  const login = () => {
    const userData = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      // No avatar - will use fallback initials (T) which looks clean and professional
    };
    setIsLoggedIn(true);
    setUser(userData);
    setIsFreshStart(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setIsFreshStart(true);
    // Clear all auth-related localStorage data
    localStorage.removeItem('gaming-auth');
    localStorage.removeItem('gaming-orders');
    localStorage.removeItem('gaming-cart');
    localStorage.removeItem('gaming-saved-addresses');
    localStorage.removeItem('gaming-saved-payment');
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
    setIsFreshStart(true);
    localStorage.removeItem('gaming-auth');
    localStorage.removeItem('gaming-orders');
    localStorage.removeItem('gaming-cart');
  };

  // Reset function for development/testing
  const resetToFreshStart = () => {
    setUser(null);
    setAvatar(null);
    localStorage.clear();
    localStorage.setItem('gaming-cleanup-done', 'true');
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

  // Address management functions
  const addAddress = (addressData) => {
    const newAddress = {
      id: `ADDR-${Date.now()}`,
      ...addressData
    };
    setSavedAddresses(prev => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = (id, addressData) => {
    setSavedAddresses(prev => 
      prev.map(addr => addr.id === id ? { ...addr, ...addressData } : addr)
    );
  };

  const deleteAddress = (id) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const getAddresses = () => {
    return savedAddresses;
  };

  // Payment method management functions
  const addPaymentMethod = (paymentData) => {
    const newPayment = {
      id: `PAY-${Date.now()}`,
      ...paymentData
    };
    setSavedPaymentMethods(prev => [...prev, newPayment]);
    return newPayment;
  };

  const updatePaymentMethod = (id, paymentData) => {
    setSavedPaymentMethods(prev => 
      prev.map(pay => pay.id === id ? { ...pay, ...paymentData } : pay)
    );
  };

  const deletePaymentMethod = (id) => {
    setSavedPaymentMethods(prev => prev.filter(pay => pay.id !== id));
  };

  const getPaymentMethods = () => {
    return savedPaymentMethods;
  };

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
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
    resetAllData,
    resetToFreshStart,
    isFreshStart,
    // Address management
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    // Payment method management
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentMethods,
    // Avatar management
    avatar,
    updateAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
