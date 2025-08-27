import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      isDark: false,
      
      // Actions
      toggleTheme: () => {
        const { isDark } = get();
        const newTheme = !isDark;
        
        set({ isDark: newTheme });
        
        // Update document class and localStorage
        if (newTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setTheme: (isDark) => {
        set({ isDark });
        
        // Update document class
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Initialize theme on mount
      initTheme: () => {
        const { isDark } = get();
        
        // Check system preference if no theme is set
        if (!localStorage.getItem('color-theme')) {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ isDark: systemPrefersDark });
          
          if (systemPrefersDark) {
            document.documentElement.classList.add('dark');
          }
        } else {
          // Apply saved theme
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      // Get theme as string
      getThemeString: () => {
        const { isDark } = get();
        return isDark ? 'dark' : 'light';
      },

      // Check if theme is system preference
      isSystemTheme: () => {
        return !localStorage.getItem('color-theme');
      },
    }),
    {
      name: 'color-theme', // localStorage key
      partialize: (state) => ({ isDark: state.isDark }),
    }
  )
);
