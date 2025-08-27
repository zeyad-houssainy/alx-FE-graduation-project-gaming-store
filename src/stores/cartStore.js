import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      
      // Actions
      addToCart: (game) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === game.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === game.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...game, quantity: 1 }],
          });
        }
      },

      removeFromCart: (gameId) => {
        const { items } = get();
        set({
          items: items.filter(item => item.id !== gameId),
        });
      },

      updateQuantity: (gameId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeFromCart(gameId);
        } else {
          set({
            items: items.map(item =>
              item.id === gameId
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Computed values
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      // Check if item is in cart
      isInCart: (gameId) => {
        const { items } = get();
        return items.some(item => item.id === gameId);
      },

      // Get item quantity
      getItemQuantity: (gameId) => {
        const { items } = get();
        const item = items.find(item => item.id === gameId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'gaming-cart', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
