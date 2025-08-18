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
  // Initialize state from sessionStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = sessionStorage.getItem('gaming-auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      return parsedAuth.isLoggedIn || false;
    }
    return false;
  });

  const [user, setUser] = useState(() => {
    const savedAuth = sessionStorage.getItem('gaming-auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      return parsedAuth.user || null;
    }
    return null;
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = sessionStorage.getItem('gaming-orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save auth state to sessionStorage whenever it changes
  useEffect(() => {
    const authData = {
      isLoggedIn,
      user
    };
    sessionStorage.setItem('gaming-auth', JSON.stringify(authData));
  }, [isLoggedIn, user]);

  // Save orders to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('gaming-orders', JSON.stringify(orders));
  }, [orders]);

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
    // Clear session storage on logout
    sessionStorage.removeItem('gaming-auth');
    sessionStorage.removeItem('gaming-orders');
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
    getOrders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
