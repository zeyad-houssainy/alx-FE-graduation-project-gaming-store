import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

// API Configuration
const API_CONFIG = {
  RAWG_BASE_URL: 'https://api.rawg.io/api',
  RAWG_API_KEY: '28849ae8cd824c84ae3af5da501b0d67',
  CHEAPSHARK_BASE_URL: 'https://www.cheapshark.com/api/1.0',
  TIMEOUT: 30000,
};

// Create axios instances
const rawgApi = axios.create({
  baseURL: API_CONFIG.RAWG_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  params: {
    key: API_CONFIG.RAWG_API_KEY,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const cheapsharkApi = axios.create({
  baseURL: API_CONFIG.CHEAPSHARK_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Accept': 'application/json',
  },
});

export const useGamesStore = create(
  devtools(
    (set, get) => ({
      // State
      games: [],
      filteredGames: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        pageSize: 20,
      },
      filters: {
        search: '',
        genres: [],
        platforms: [],
        sortBy: 'relevance',
      },
      activeStore: 'rawg', // 'rawg', 'cheapshark', 'mock'
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setGames: (games) => set({ games }),
      setFilteredGames: (filteredGames) => set({ filteredGames }),
      setActiveStore: (store) => set({ activeStore: store }),
      
      // Filter actions
      setSearch: (search) => {
        set((state) => ({
          filters: { ...state.filters, search },
        }));
        get().applyFilters();
      },

      setGenres: (genres) => {
        set((state) => ({
          filters: { ...state.filters, genres },
        }));
        get().applyFilters();
      },

      setPlatforms: (platforms) => {
        set((state) => ({
          filters: { ...state.filters, platforms },
        }));
        get().applyFilters();
      },

      setSortBy: (sortBy) => {
        set((state) => ({
          filters: { ...state.filters, sortBy },
        }));
        get().applyFilters();
      },

      // Pagination actions
      setPage: (page) => {
        set((state) => ({
          pagination: { ...state.pagination, currentPage: page },
        }));
        get().fetchGames();
      },

      setPageSize: (pageSize) => {
        set((state) => ({
          pagination: { ...state.pagination, pageSize },
        }));
        get().fetchGames();
      },

      // Filter application
      applyFilters: () => {
        const { games, filters } = get();
        let filtered = [...games];

        // Apply search filter
        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(game =>
            game.name.toLowerCase().includes(searchLower) ||
            (game.description && game.description.toLowerCase().includes(searchLower)) ||
            (game.genres && game.genres.some(genre =>
              genre.toLowerCase().includes(searchLower)
            ))
          );
        }

        // Apply genre filter
        if (filters.genres.length > 0) {
          filtered = filtered.filter(game =>
            game.genres && game.genres.some(genre =>
              filters.genres.some(selected =>
                genre.toLowerCase().includes(selected.toLowerCase())
              )
            )
          );
        }

        // Apply platform filter
        if (filters.platforms.length > 0) {
          filtered = filtered.filter(game =>
            game.platforms && game.platforms.some(platform =>
              filters.platforms.some(selected =>
                platform.toLowerCase().includes(selected.toLowerCase())
              )
            )
          );
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'released':
            filtered.sort((a, b) => new Date(b.released || 0) - new Date(a.released || 0));
            break;
          case 'price-low':
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case 'price-high':
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          default:
            break;
        }

        set({ filteredGames: filtered });
      },

      // API calls
      fetchGames: async () => {
        const { activeStore, filters, pagination } = get();
        
        try {
          set({ loading: true, error: null });
          
          let result;
          
          switch (activeStore) {
            case 'rawg':
              result = await get().fetchRAWGGames();
              break;
            case 'cheapshark':
              result = await get().fetchCheapSharkGames();
              break;
            case 'mock':
              result = await get().fetchMockGames();
              break;
            default:
              result = await get().fetchRAWGGames();
          }
          
          if (result && result.games) {
            set({
              games: result.games,
              pagination: {
                currentPage: result.currentPage || 1,
                totalPages: result.totalPages || 1,
                totalResults: result.count || result.games.length,
                pageSize: result.pageSize || 20,
              },
            });
            get().applyFilters();
          }
        } catch (error) {
          console.error('Error fetching games:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // RAWG API
      fetchRAWGGames: async () => {
        const { filters, pagination } = get();
        
        try {
          const params = {
            page: pagination.currentPage,
            page_size: pagination.pageSize,
            ordering: filters.sortBy === 'rating' ? '-rating' : 
                     filters.sortBy === 'released' ? '-released' : 
                     filters.sortBy === 'name-asc' ? 'name' : 
                     filters.sortBy === 'name-desc' ? '-name' : '-rating',
          };
          
          if (filters.search) params.search = filters.search;
          if (filters.genres.length > 0) params.genres = filters.genres.join(',');
          if (filters.platforms.length > 0) params.platforms = filters.platforms.join(',');
          
          const response = await rawgApi.get('/games', { params });
          
          if (response.data && response.data.results) {
            const transformedGames = response.data.results.map(game => ({
              id: game.id,
              name: game.name,
              background_image: game.background_image || '/assets/images/featured-game-1.jpg',
              rating: game.rating || 0,
              metacritic: game.metacritic || null,
              released: game.released,
              platforms: game.platforms?.map(p => p.platform.name) || [],
              genres: game.genres?.map(g => g.name) || [],
              description: game.description || `Explore ${game.name}`,
              price: Math.floor(Math.random() * 60) + 20,
              originalPrice: Math.floor(Math.random() * 60) + 20,
              cheapestPrice: Math.floor(Math.random() * 60) + 20,
            }));
            
            return {
              games: transformedGames,
              count: response.data.count,
              currentPage: pagination.currentPage,
              pageSize: pagination.pageSize,
              totalPages: Math.ceil(response.data.count / pagination.pageSize),
            };
          }
        } catch (error) {
          console.error('RAWG API error:', error);
          throw error;
        }
      },

      // CheapShark API
      fetchCheapSharkGames: async () => {
        const { filters, pagination } = get();
        
        try {
          const params = {
            limit: pagination.pageSize,
            page: pagination.currentPage - 1,
          };
          
          if (filters.search) params.title = filters.search;
          
          const response = await cheapsharkApi.get('/games', { params });
          
          if (response.data) {
            const transformedGames = response.data.map(game => ({
              id: game.gameID,
              name: game.external,
              background_image: game.thumb || '/assets/images/featured-game-1.jpg',
              rating: 0,
              metacritic: null,
              released: null,
              platforms: [],
              genres: [],
              description: `Find the best deals for ${game.external}`,
              price: parseFloat(game.cheapest) || 0,
              originalPrice: parseFloat(game.cheapest) || 0,
              cheapestPrice: parseFloat(game.cheapest) || 0,
            }));
            
            return {
              games: transformedGames,
              count: transformedGames.length,
              currentPage: pagination.currentPage,
              pageSize: pagination.pageSize,
              totalPages: 1,
            };
          }
        } catch (error) {
          console.error('CheapShark API error:', error);
          throw error;
        }
      },

      // Mock games (fallback)
      fetchMockGames: async () => {
        const mockGames = [
          {
            id: 1,
            name: "Cyberpunk 2077",
            background_image: "/assets/images/featured-game-1.jpg",
            rating: 4.2,
            price: 59.99,
            platforms: ["PC", "PS5", "Xbox Series X"],
            genres: ["RPG"],
            description: "An open-world action-adventure story set in Night City.",
            originalPrice: 59.99,
            cheapestPrice: 59.99,
          },
          {
            id: 2,
            name: "Elden Ring",
            background_image: "/assets/images/featured-game-2.jpg",
            rating: 4.8,
            price: 69.99,
            platforms: ["PC", "PS5", "Xbox Series X"],
            genres: ["Action RPG"],
            description: "An action role-playing game developed by FromSoftware.",
            originalPrice: 69.99,
            cheapestPrice: 69.99,
          },
        ];
        
        return {
          games: mockGames,
          count: mockGames.length,
          currentPage: 1,
          pageSize: 20,
          totalPages: 1,
        };
      },

      // Clear filters
      clearFilters: () => {
        set({
          filters: {
            search: '',
            genres: [],
            platforms: [],
            sortBy: 'relevance',
          },
        });
        get().applyFilters();
      },

      // Reset store
      reset: () => {
        set({
          games: [],
          filteredGames: [],
          loading: false,
          error: null,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalResults: 0,
            pageSize: 20,
          },
          filters: {
            search: '',
            genres: [],
            platforms: [],
            sortBy: 'relevance',
          },
        });
      },
    }),
    {
      name: 'games-store',
    }
  )
);
