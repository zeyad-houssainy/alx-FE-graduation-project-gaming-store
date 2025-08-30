import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      isLoggedIn: false,
      user: null,
      isFreshStart: true,
      orders: [],
      savedAddresses: [],
      savedPaymentMethods: [],
      avatar: null,
      favorites: [], // New favorites array
      
      // Actions
      login: (userData) => {
        set({
          isLoggedIn: true,
          user: userData,
          isFreshStart: false,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          isFreshStart: false,
        });
        // Clear cart on logout
        localStorage.removeItem('gaming-cart');
      },

      updateUser: (userData) => {
        set({
          user: { ...get().user, ...userData },
        });
      },

      setFreshStart: (value) => {
        set({ isFreshStart: value });
      },

      // Favorites management
      addToFavorites: (game) => {
        const { favorites } = get();
        const existingIndex = favorites.findIndex(fav => fav.id === game.id);
        if (existingIndex === -1) {
          set({
            favorites: [...favorites, { ...game, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeFromFavorites: (gameId) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter(fav => fav.id !== gameId),
        });
      },

      isFavorite: (gameId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === gameId);
      },

      // Orders management
      addOrder: (order) => {
        const { orders } = get();
        set({
          orders: [...orders, order],
        });
      },

      updateOrder: (orderId, updates) => {
        const { orders } = get();
        set({
          orders: orders.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
          ),
        });
      },

      removeOrder: (orderId) => {
        const { orders } = get();
        set({
          orders: orders.filter(order => order.id !== orderId),
        });
      },

      // Addresses management
      addAddress: (address) => {
        const { savedAddresses } = get();
        set({
          savedAddresses: [...savedAddresses, { ...address, id: Date.now().toString() }],
        });
      },

      updateAddress: (addressId, updates) => {
        const { savedAddresses } = get();
        set({
          savedAddresses: savedAddresses.map(address =>
            address.id === addressId ? { ...address, ...updates } : address
          ),
        });
      },

      removeAddress: (addressId) => {
        const { savedAddresses } = get();
        set({
          savedAddresses: savedAddresses.filter(address => address.id !== addressId),
        });
      },

      // Payment methods management
      addPaymentMethod: (paymentMethod) => {
        const { savedPaymentMethods } = get();
        set({
          savedPaymentMethods: [...savedPaymentMethods, { ...paymentMethod, id: Date.now().toString() }],
        });
      },

      updatePaymentMethod: (paymentMethodId, updates) => {
        const { savedPaymentMethods } = get();
        set({
          savedPaymentMethods: savedPaymentMethods.map(method =>
            method.id === paymentMethodId ? { ...method, ...updates } : method
          ),
        });
      },

      removePaymentMethod: (paymentMethodId) => {
        const { savedPaymentMethods } = get();
        set({
          savedPaymentMethods: savedPaymentMethods.filter(method => method.id !== paymentMethodId),
        });
      },

      // Getter methods
      getAddresses: () => {
        return get().savedAddresses;
      },

      getPaymentMethods: () => {
        return get().savedPaymentMethods;
      },

      // Avatar management
      setAvatar: (avatarData) => {
        set({ avatar: avatarData });
      },

      updateAvatar: (avatarData) => {
        set({ avatar: avatarData });
      },

      removeAvatar: () => {
        set({ avatar: null });
      },

      // Mock data management
      clearMockData: () => {
        set({ orders: [] });
      },

      cleanupMockData: () => {
        // Clear cart data to ensure completely fresh start
        localStorage.removeItem('gaming-cart');
        set({ isFreshStart: false });
      },

      resetAllData: () => {
        set({
          isLoggedIn: false,
          user: null,
          isFreshStart: true,
          orders: [],
          savedAddresses: [],
          savedPaymentMethods: [],
          avatar: null,
          favorites: [],
        });
        localStorage.removeItem('gaming-cart');
        localStorage.removeItem('gaming-auth');
      },

      // Admin functions
      setAdminStatus: (isAdmin) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, isAdmin },
          });
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.isAdmin || false;
      },


    }),
    {
      name: 'gaming-auth', // localStorage key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        orders: state.orders,
        savedAddresses: state.savedAddresses,
        savedPaymentMethods: state.savedPaymentMethods,
        avatar: state.avatar,
        favorites: state.favorites,
      }),
    }
  )
);
