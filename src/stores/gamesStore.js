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
        pageSize: 60, // Increased from 50 to 60 games per page
      },
      filters: {
        search: '',
        genres: [],
        platforms: [],
        sortBy: 'relevance',
        priceRange: { min: '', max: '' },
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
        console.log('Store: setGenres called with:', genres);
        set((state) => ({
          filters: { ...state.filters, genres },
        }));
        get().applyFilters();
      },

      setPlatforms: (platforms) => {
        console.log('Store: setPlatforms called with:', platforms);
        set((state) => ({
          filters: { ...state.filters, platforms },
        }));
        get().applyFilters();
      },

      setSortBy: (sortBy) => {
        console.log('Store: setSortBy called with:', sortBy);
        set((state) => ({
          filters: { ...state.filters, sortBy },
        }));
        get().applyFilters();
      },

      setPriceRange: (priceRange) => {
        console.log('Store: setPriceRange called with:', priceRange);
        set((state) => ({
          filters: { ...state.filters, priceRange },
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
        console.log('Store: applyFilters called with:', { 
          gamesCount: games.length, 
          filters: filters,
          sortBy: filters.sortBy 
        });
        
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
          console.log('Store: Applying platform filter for:', filters.platforms);
          filtered = filtered.filter(game => {
            if (!game.platforms || !Array.isArray(game.platforms)) {
              console.log('Store: Game has no platforms:', game.name);
              return false;
            }
            
            const hasMatchingPlatform = game.platforms.some(platform => {
              const platformName = typeof platform === 'string' ? platform : platform?.platform?.name;
              if (!platformName) return false;
              
              const matches = filters.platforms.some(selected =>
                platformName.toLowerCase().includes(selected.toLowerCase()) ||
                selected.toLowerCase().includes(platformName.toLowerCase())
              );
              
              if (matches) {
                console.log('Store: Game', game.name, 'matches platform', selected, 'via', platformName);
              }
              
              return matches;
            });
            
            if (!hasMatchingPlatform) {
              console.log('Store: Game', game.name, 'does not match any platform filter');
            }
            
            return hasMatchingPlatform;
          });
          console.log('Store: After platform filtering, games count:', filtered.length);
        }

        // Apply price range filter
        if (filters.priceRange && (filters.priceRange.min || filters.priceRange.max)) {
          filtered = filtered.filter(game => {
            const gamePrice = game.price || 0;
            const minPrice = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
            const maxPrice = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
            
            return gamePrice >= minPrice && gamePrice <= maxPrice;
          });
          console.log('Store: Applied price range filter:', filters.priceRange);
        }

        console.log('Store: Before sorting, filtered count:', filtered.length);

        // Apply sorting
        switch (filters.sortBy) {
          case 'name-asc':
            console.log('Store: Sorting by name ascending');
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            console.log('Store: Sorting by name descending');
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating':
            console.log('Store: Sorting by rating');
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'released':
            console.log('Store: Sorting by release date');
            filtered.sort((a, b) => new Date(b.released || 0) - new Date(a.released || 0));
            break;
          case 'price-low':
            console.log('Store: Sorting by price low to high');
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case 'price-high':
            console.log('Store: Sorting by price high to low');
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          default:
            console.log('Store: No sorting applied (relevance)');
            break;
        }

        console.log('Store: After sorting, first few games:', filtered.slice(0, 3).map(g => g.name));
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
                pageSize: result.pageSize || 60,
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
          pageSize: 60,
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
            priceRange: { min: '', max: '' },
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
            pageSize: 60,
          },
          filters: {
            search: '',
            genres: [],
            platforms: [],
            sortBy: 'relevance',
            priceRange: { min: '', max: '' },
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
          hasActiveFilters: filters.search || filters.genres.length > 0 || filters.platforms.length > 0 || (filters.priceRange && (filters.priceRange.min || filters.priceRange.max))
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
            priceRange: { min: '', max: '' },
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
              'Nintendo Switch', 'Linux', 'macOS'
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
          // Platform-based quick filters for all stores
          const platformFilters = {
            pc: { name: 'PC', filter: { platform: 'PC' } },
            ps5: { name: 'PlayStation 5', filter: { platform: 'PlayStation 5' } },
            ps4: { name: 'PlayStation 4', filter: { platform: 'PlayStation 4' } },
            xboxSeriesX: { name: 'Xbox Series X', filter: { platform: 'Xbox Series X' } },
            xboxOne: { name: 'Xbox One', filter: { platform: 'Xbox One' } },
            nintendoSwitch: { name: 'Nintendo Switch', filter: { platform: 'Nintendo Switch' } }
          };
          
          return platformFilters;
        },

      // Apply quick filter
      applyQuickFilter: (filterKey) => {
        const { activeStore } = get();
        const quickFilters = get().getQuickFilters();
        const filter = quickFilters[filterKey];
        
        if (!filter) return;
        
        console.log('Applying platform quick filter:', filter.name, filter.filter);
        
        // Apply platform filter by updating the filters.platforms
        if (filter.filter.platform) {
          const platform = filter.filter.platform;
          
          // Update the platform filter in the store
          set((state) => ({
            filters: { ...state.filters, platforms: [platform] }
          }));
          
          // Apply filters to update the filtered games
          get().applyFilters();
        }
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
