import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gaming-cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'LOAD_CART', payload: parsedCart });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gaming-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (game) => {
    dispatch({ type: 'ADD_TO_CART', payload: game });
  };

  const removeFromCart = (gameId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: gameId });
  };

  const updateQuantity = (gameId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: gameId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
