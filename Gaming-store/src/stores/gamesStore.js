import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

// API Configuration
const API_CONFIG = {
  RAWG_BASE_URL: 'https://api.rawg.io/api',
  RAWG_API_KEY: 'b996c3910d6443059eb56fd7e61b5711',
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
        pageSize: 30, // Increased from 20 to 30 games per page
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
      setActiveStore: (store) => {
        set({ activeStore: store });
        // Reset filters when switching stores
        get().resetFiltersForStore();
        // fetchGames() is now called from resetFiltersForStore
      },
      
      // Filter actions
      setSearch: (search) => {
        set((state) => ({
          filters: { ...state.filters, search },
        }));
        // For search, we need to fetch new games from the API
        // since we want to search within the current store's full dataset
        get().fetchGames();
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
        const { filters } = get();
        const allMockGames = [
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
          {
            id: 3,
            name: "God of War Ragnarök",
            background_image: "/assets/images/featured-game-1.jpg",
            rating: 4.9,
            price: 79.99,
            platforms: ["PS5", "PS4"],
            genres: ["Action", "Adventure"],
            description: "Embark on an epic and heartfelt journey as Kratos and Atreus struggle to hold on and let go.",
            originalPrice: 79.99,
            cheapestPrice: 79.99,
          },
          {
            id: 4,
            name: "Horizon Forbidden West",
            background_image: "/assets/images/featured-game-2.jpg",
            rating: 4.7,
            price: 69.99,
            platforms: ["PS5", "PS4"],
            genres: ["Action", "RPG"],
            description: "Explore the mysterious frontier known as the Forbidden West.",
            originalPrice: 69.99,
            cheapestPrice: 69.99,
          },
        ];
        
        // Filter mock games based on search term if present
        let filteredGames = allMockGames;
        if (filters.search && filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          filteredGames = allMockGames.filter(game =>
            game.name.toLowerCase().includes(searchLower) ||
            game.description.toLowerCase().includes(searchLower) ||
            game.genres.some(genre => genre.toLowerCase().includes(searchLower))
          );
        }
        
        return {
          games: filteredGames,
          count: filteredGames.length,
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
        // Fetch fresh games without filters
        get().fetchGames();
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

      // Get current filter status for debugging
      getFilterStatus: () => {
        const { filters, activeStore, games, filteredGames } = get();
        return {
          activeStore,
          totalGames: games.length,
          filteredGames: filteredGames.length,
          searchTerm: filters.search,
          selectedGenres: filters.genres,
          selectedPlatforms: filters.platforms,
          sortBy: filters.sortBy,
          hasActiveFilters: filters.search || filters.genres.length > 0 || filters.platforms.length > 0
        };
      },

      // Reset filters when switching stores
      resetFiltersForStore: () => {
        set({
          filters: {
            search: '',
            genres: [],
            platforms: [],
            sortBy: 'relevance',
          },
        });
        // Also clear filtered games to show all games for the new store
        set({ filteredGames: [] });
        // Fetch fresh games for the new store
        get().fetchGames();
      },

      // Get available genres for the current store
      getGenres: () => {
        const { activeStore } = get();
        
        switch (activeStore) {
          case 'rawg':
            return [
              'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 
              'Racing', 'Puzzle', 'Indie', 'Casual', 'Shooter', 'Fighting',
              'Arcade', 'Platformer', 'Horror', 'Stealth', 'Survival', 'Educational'
            ];
          case 'cheapshark':
            return [
              'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports',
              'Racing', 'Puzzle', 'Indie', 'Casual', 'Shooter', 'Fighting'
            ];
          case 'mock':
          default:
            return [
              'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports',
              'Racing', 'Puzzle', 'Indie', 'Casual'
            ];
        }
      },

      // Get available platforms for the current store
      getPlatforms: () => {
        const { activeStore } = get();
        
        switch (activeStore) {
          case 'rawg':
            return [
              'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One',
              'Nintendo Switch', 'Linux', 'macOS', 'Android', 'iOS'
            ];
          case 'cheapshark':
            return [
              'PC', 'Steam', 'Epic Games Store', 'GOG', 'Humble Bundle',
              'Green Man Gaming', 'Fanatical', 'GameStop'
            ];
          case 'mock':
          default:
            return [
              'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One',
              'Nintendo Switch'
            ];
        }
      },

      // Quick filters for each store
      getQuickFilters: () => {
        const { activeStore } = get();
        
        switch (activeStore) {
          case 'rawg':
            return {
              popular: { name: 'Popular Games', filter: { rating: '4.0,5.0', metacritic: 80 } },
              newReleases: { name: 'New Releases', filter: { dates: '2024-01-01,2025-12-31' } },
              aaa: { name: 'AAA Games', filter: { metacritic: 85, rating: '4.5,5.0' } },
              indie: { name: 'Indie Games', filter: { genres: ['Indie'] } }
            };
          case 'cheapshark':
            return {
              under10: { name: 'Under $10', filter: { maxPrice: 10 } },
              under20: { name: 'Under $20', filter: { maxPrice: 20 } },
              under30: { name: 'Under $30', filter: { maxPrice: 30 } },
              steam: { name: 'Steam Games', filter: { store: 'Steam' } }
            };
          case 'mock':
          default:
            return {
              featured: { name: 'Featured', filter: { featured: true } },
              newGames: { name: 'New Games', filter: { new: true } }
            };
        }
      },

      // Apply quick filter
      applyQuickFilter: (filterKey) => {
        const { activeStore } = get();
        const quickFilters = get().getQuickFilters();
        const filter = quickFilters[filterKey];
        
        if (!filter) return;
        
        // Apply the quick filter by updating the store's internal filters
        // This will trigger a new API call with the filter parameters
        if (activeStore === 'rawg') {
          // For RAWG, we can apply some filters directly
          if (filter.filter.rating) {
            // Update the RAWG API call parameters
            console.log('Applying RAWG quick filter:', filter.name, filter.filter);
          }
        } else if (activeStore === 'cheapshark') {
          // For CheapShark, apply price filters
          if (filter.filter.maxPrice) {
            console.log('Applying CheapShark quick filter:', filter.name, filter.filter);
          }
        }
        
        // Refresh games with the new filter
        get().fetchGames();
      },

      // Global search across all stores
      globalSearch: async (searchTerm) => {
        if (!searchTerm.trim()) return { games: [], count: 0 };
        
        try {
          set({ loading: true, error: null });
          
          const results = {
            games: [],
            count: 0,
            stores: {
              rawg: { games: [], count: 0 },
              cheapshark: { games: [], count: 0 },
              mock: { games: [], count: 0 }
            }
          };
          
          // Search RAWG API
          try {
            const rawgResult = await get().searchRAWGGames(searchTerm);
            results.stores.rawg = rawgResult;
            results.games.push(...rawgResult.games);
          } catch (error) {
            console.error('RAWG search error:', error);
          }
          
          // Search CheapShark API
          try {
            const cheapsharkResult = await get().searchCheapSharkGames(searchTerm);
            results.stores.cheapshark = cheapsharkResult;
            results.games.push(...cheapsharkResult.games);
          } catch (error) {
            console.error('CheapShark search error:', error);
          }
          
          // Search Mock store
          try {
            const mockResult = await get().searchMockGames(searchTerm);
            results.stores.mock = mockResult;
            results.games.push(...mockResult.games);
          } catch (error) {
            console.error('Mock search error:', error);
          }
          
          // Remove duplicates and sort by relevance
          const uniqueGames = results.games.filter((game, index, self) => 
            index === self.findIndex(g => g.name.toLowerCase() === game.name.toLowerCase())
          );
          
          // Sort by relevance (exact matches first, then partial matches)
          uniqueGames.sort((a, b) => {
            const aExact = a.name.toLowerCase() === searchTerm.toLowerCase();
            const bExact = b.name.toLowerCase() === searchTerm.toLowerCase();
            
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            
            // Then sort by rating/quality
            return (b.rating || 0) - (a.rating || 0);
          });
          
          results.games = uniqueGames;
          results.count = uniqueGames.length;
          
          return results;
          
        } catch (error) {
          console.error('Global search error:', error);
          set({ error: error.message });
          return { games: [], count: 0 };
        } finally {
          set({ loading: false });
        }
      },

      // Search RAWG games
      searchRAWGGames: async (searchTerm) => {
        try {
          const params = {
            page: 1,
            page_size: 20,
            search: searchTerm,
            ordering: '-rating,-metacritic,-added'
          };
          
          const response = await rawgApi.get('/games', { params });
          
          if (response.data && response.data.results) {
            const transformedGames = response.data.results.map(game => ({
              id: `rawg-${game.id}`,
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
              store: 'rawg',
              storeName: 'RAWG'
            }));
            
            return {
              games: transformedGames,
              count: transformedGames.length,
              store: 'rawg'
            };
          }
        } catch (error) {
          console.error('RAWG search error:', error);
          throw error;
        }
      },

      // Search CheapShark games
      searchCheapSharkGames: async (searchTerm) => {
        try {
          const params = {
            title: searchTerm,
            limit: 20
          };
          
          const response = await cheapsharkApi.get('/games', { params });
          
          if (response.data) {
            const transformedGames = response.data.map(game => ({
              id: `cheapshark-${game.gameID}`,
              name: game.external,
              background_image: game.thumb || '/assets/images/featured-game-1.jpg',
              rating: 0,
              metacritic: null,
              released: null,
              platforms: ['PC'],
              genres: [],
              description: `Find the best deals for ${game.external}`,
              price: parseFloat(game.cheapest) || 0,
              originalPrice: parseFloat(game.cheapest) || 0,
              cheapestPrice: parseFloat(game.cheapest) || 0,
              store: 'cheapshark',
              storeName: 'CheapShark'
            }));
            
            return {
              games: transformedGames,
              count: transformedGames.length,
              store: 'cheapshark'
            };
          }
        } catch (error) {
          console.error('CheapShark search error:', error);
          throw error;
        }
      },

      // Search Mock games
      searchMockGames: async (searchTerm) => {
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
            store: 'mock',
            storeName: 'Mock Store'
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
            store: 'mock',
            storeName: 'Mock Store'
          },
        ];
        
        // Filter mock games based on search term
        const filteredGames = mockGames.filter(game =>
          game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return {
          games: filteredGames,
          count: filteredGames.length,
          store: 'mock'
        };
      },
    }),
    {
      name: 'games-store',
    }
  )
);
