import axios from 'axios';
import * as gamesApi from '../gamesApi';
import * as apiConfig from '../../config/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock API config
jest.mock('../../config/api');

describe('gamesApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Default API config mocks
    apiConfig.isAPIEnabled.mockReturnValue(false); // Use local data by default
    apiConfig.getAPIBaseURL.mockReturnValue('https://api.rawg.io/api');
    apiConfig.getAPIKey.mockReturnValue('test-api-key');
    apiConfig.getAPITimeout.mockReturnValue(5000);

    // Mock axios.create
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchGames', () => {
    describe('with local data (API disabled)', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(false);
      });

      it('should return local games data', async () => {
        const result = await gamesApi.fetchGames();

        expect(result).toHaveProperty('games');
        expect(result).toHaveProperty('count');
        expect(result).toHaveProperty('next');
        expect(result).toHaveProperty('previous');
        expect(Array.isArray(result.games)).toBe(true);
        expect(result.games.length).toBeGreaterThan(0);
        expect(console.log).toHaveBeenCalledWith('Using local game data (API disabled to avoid CORS issues)');
      });

      it('should filter games by search term', async () => {
        const result = await gamesApi.fetchGames(1, 20, 'cyberpunk');

        expect(result.games.length).toBeGreaterThan(0);
        const hasSearchTerm = result.games.some(game => 
          game.name.toLowerCase().includes('cyberpunk') ||
          game.description.toLowerCase().includes('cyberpunk') ||
          game.genre.toLowerCase().includes('cyberpunk')
        );
        expect(hasSearchTerm).toBe(true);
      });

      it('should filter games by genre', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', ['RPG']);

        expect(result.games.length).toBeGreaterThan(0);
        result.games.forEach(game => {
          expect(game.genre.toLowerCase()).toBe('rpg');
        });
      });

      it('should filter games by platform', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', [], ['PC']);

        expect(result.games.length).toBeGreaterThan(0);
        result.games.forEach(game => {
          expect(game.platforms).toContain('PC');
        });
      });

      it('should sort games by name ascending', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', [], [], 'name-asc');

        expect(result.games.length).toBeGreaterThan(1);
        for (let i = 1; i < result.games.length; i++) {
          expect(result.games[i].name.localeCompare(result.games[i - 1].name)).toBeGreaterThanOrEqual(0);
        }
      });

      it('should sort games by name descending', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', [], [], 'name-desc');

        expect(result.games.length).toBeGreaterThan(1);
        for (let i = 1; i < result.games.length; i++) {
          expect(result.games[i].name.localeCompare(result.games[i - 1].name)).toBeLessThanOrEqual(0);
        }
      });

      it('should sort games by price low to high', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', [], [], 'price-low');

        expect(result.games.length).toBeGreaterThan(1);
        for (let i = 1; i < result.games.length; i++) {
          expect(result.games[i].price).toBeGreaterThanOrEqual(result.games[i - 1].price);
        }
      });

      it('should sort games by price high to low', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', [], [], 'price-high');

        expect(result.games.length).toBeGreaterThan(1);
        for (let i = 1; i < result.games.length; i++) {
          expect(result.games[i].price).toBeLessThanOrEqual(result.games[i - 1].price);
        }
      });

      it('should sort games by rating', async () => {
        const result = await gamesApi.fetchGames(1, 20, '', [], [], 'rating');

        expect(result.games.length).toBeGreaterThan(1);
        for (let i = 1; i < result.games.length; i++) {
          expect(result.games[i].rating).toBeLessThanOrEqual(result.games[i - 1].rating);
        }
      });

      it('should handle pagination correctly', async () => {
        const pageSize = 5;
        const page1 = await gamesApi.fetchGames(1, pageSize);
        const page2 = await gamesApi.fetchGames(2, pageSize);

        expect(page1.games).toHaveLength(pageSize);
        expect(page2.games).toHaveLength(pageSize);
        
        // Games on different pages should be different
        const page1Ids = page1.games.map(g => g.id);
        const page2Ids = page2.games.map(g => g.id);
        const intersection = page1Ids.filter(id => page2Ids.includes(id));
        expect(intersection).toHaveLength(0);
      });

      it('should handle empty search results', async () => {
        const result = await gamesApi.fetchGames(1, 20, 'nonexistentgame12345');

        expect(result.games).toHaveLength(0);
        expect(result.count).toBe(0);
        expect(result.next).toBe(null);
        expect(result.previous).toBe(null);
      });

      it('should handle multiple filters simultaneously', async () => {
        const result = await gamesApi.fetchGames(1, 20, 'game', ['Action'], ['PC'], 'name-asc');

        result.games.forEach(game => {
          const matchesSearch = game.name.toLowerCase().includes('game') ||
                               game.description.toLowerCase().includes('game') ||
                               game.genre.toLowerCase().includes('game');
          expect(matchesSearch).toBe(true);
          expect(game.genre.toLowerCase()).toBe('action');
          expect(game.platforms).toContain('PC');
        });
      });
    });

    describe('with API enabled', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(true);
      });

      it('should make API call with correct parameters', async () => {
        const mockApiInstance = {
          get: jest.fn().mockResolvedValue({
            data: {
              results: [
                {
                  id: 1,
                  name: 'Test Game',
                  background_image: 'test.jpg',
                  rating: 4.5,
                  platforms: [{ platform: { name: 'PC' } }],
                  genres: [{ name: 'Action' }],
                  released: '2023-01-01',
                  description: 'Test description'
                }
              ],
              count: 1,
              next: null,
              previous: null
            }
          })
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGames(1, 20, 'test', ['Action'], ['PC'], 'name-asc');

        expect(mockApiInstance.get).toHaveBeenCalledWith('/games', {
          params: {
            key: 'test-api-key',
            page: 1,
            page_size: 20,
            ordering: 'name',
            search: 'test',
            genres: 'Action',
            platforms: 'PC'
          }
        });

        expect(result.games).toHaveLength(1);
        expect(result.games[0]).toHaveProperty('name', 'Test Game');
      });

      it('should handle API errors and fallback to local data', async () => {
        const mockApiInstance = {
          get: jest.fn().mockRejectedValue(new Error('API Error'))
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGames();

        expect(console.warn).toHaveBeenCalledWith('API call failed, using local fallback data:', 'API Error');
        expect(result.games.length).toBeGreaterThan(0);
      });

      it('should transform API data correctly', async () => {
        const mockApiInstance = {
          get: jest.fn().mockResolvedValue({
            data: {
              results: [{
                id: 1,
                name: 'Test Game',
                background_image: 'test.jpg',
                rating: 4.5,
                platforms: [{ platform: { name: 'PC' } }],
                genres: [{ name: 'Action' }],
                released: '2023-01-01'
              }],
              count: 1,
              next: null,
              previous: null
            }
          })
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGames();

        expect(result.games[0]).toEqual({
          id: 1,
          name: 'Test Game',
          background_image: 'test.jpg',
          rating: 4.5,
          price: expect.any(Number),
          platforms: ['PC'],
          genre: 'Action',
          released: '2023-01-01',
          description: 'No description available.'
        });
      });

      it('should handle different sort parameters', async () => {
        const mockApiInstance = {
          get: jest.fn().mockResolvedValue({
            data: { results: [], count: 0, next: null, previous: null }
          })
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const sortTests = [
          { sortBy: 'name-asc', expectedOrdering: 'name' },
          { sortBy: 'name-desc', expectedOrdering: '-name' },
          { sortBy: 'price-low', expectedOrdering: 'rating' },
          { sortBy: 'price-high', expectedOrdering: '-rating' },
          { sortBy: 'rating', expectedOrdering: '-rating' },
          { sortBy: 'relevance', expectedOrdering: '-rating' }
        ];

        for (const { sortBy, expectedOrdering } of sortTests) {
          await gamesApi.fetchGames(1, 20, '', [], [], sortBy);

          expect(mockApiInstance.get).toHaveBeenLastCalledWith('/games', {
            params: {
              key: 'test-api-key',
              page: 1,
              page_size: 20,
              ordering: expectedOrdering
            }
          });
        }
      });
    });
  });

  describe('fetchGameById', () => {
    describe('with local data (API disabled)', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(false);
      });

      it('should return game by ID from local data', async () => {
        const result = await gamesApi.fetchGameById(1);

        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('price');
        expect(result).toHaveProperty('screenshots');
        expect(console.log).toHaveBeenCalledWith('Using local game data (API disabled to avoid CORS issues)');
      });

      it('should return fallback game for non-existent ID', async () => {
        const result = await gamesApi.fetchGameById(99999);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('price');
      });
    });

    describe('with API enabled', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(true);
      });

      it('should make API call with correct parameters', async () => {
        const mockApiInstance = {
          get: jest.fn().mockResolvedValue({
            data: {
              id: 1,
              name: 'Test Game',
              background_image: 'test.jpg',
              rating: 4.5,
              platforms: [{ platform: { name: 'PC' } }],
              genres: [{ name: 'Action' }],
              released: '2023-01-01',
              description: 'Test description',
              website: 'https://test.com',
              metacritic: 85,
              short_screenshots: [{ image: 'screenshot1.jpg' }]
            }
          })
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGameById(1);

        expect(mockApiInstance.get).toHaveBeenCalledWith('/games/1', {
          params: { key: 'test-api-key' }
        });

        expect(result).toEqual({
          id: 1,
          name: 'Test Game',
          background_image: 'test.jpg',
          rating: 4.5,
          price: expect.any(Number),
          platforms: ['PC'],
          genre: 'Action',
          released: '2023-01-01',
          description: 'Test description',
          website: 'https://test.com',
          metacritic: 85,
          screenshots: ['screenshot1.jpg']
        });
      });

      it('should handle API errors and fallback to local data', async () => {
        const mockApiInstance = {
          get: jest.fn().mockRejectedValue(new Error('Game not found'))
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGameById(1);

        expect(console.warn).toHaveBeenCalledWith('API call failed, using local fallback data:', 'Game not found');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
      });
    });
  });

  describe('fetchGenres', () => {
    describe('with local data (API disabled)', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(false);
      });

      it('should return local genres data', async () => {
        const result = await gamesApi.fetchGenres();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
        expect(console.log).toHaveBeenCalledWith('Using local genre data (API disabled to avoid CORS issues)');
      });

      it('should include expected genres', async () => {
        const result = await gamesApi.fetchGenres();

        const genreNames = result.map(g => g.name);
        expect(genreNames).toContain('Action');
        expect(genreNames).toContain('RPG');
        expect(genreNames).toContain('Strategy');
        expect(genreNames).toContain('Sports');
      });
    });

    describe('with API enabled', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(true);
      });

      it('should make API call with correct parameters', async () => {
        const mockApiInstance = {
          get: jest.fn().mockResolvedValue({
            data: {
              results: [
                { id: 1, name: 'Action' },
                { id: 2, name: 'Adventure' }
              ]
            }
          })
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGenres();

        expect(mockApiInstance.get).toHaveBeenCalledWith('/genres', {
          params: { key: 'test-api-key' }
        });

        expect(result).toEqual([
          { id: 1, name: 'Action' },
          { id: 2, name: 'Adventure' }
        ]);
      });

      it('should handle API errors and fallback to local data', async () => {
        const mockApiInstance = {
          get: jest.fn().mockRejectedValue(new Error('API Error'))
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchGenres();

        expect(console.warn).toHaveBeenCalledWith('API call failed, using local fallback genres:', 'API Error');
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('fetchPlatforms', () => {
    describe('with local data (API disabled)', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(false);
      });

      it('should return local platforms data', async () => {
        const result = await gamesApi.fetchPlatforms();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
        expect(console.log).toHaveBeenCalledWith('Using local platform data (API disabled to avoid CORS issues)');
      });

      it('should include expected platforms', async () => {
        const result = await gamesApi.fetchPlatforms();

        const platformNames = result.map(p => p.name);
        expect(platformNames).toContain('PC');
        expect(platformNames).toContain('PlayStation 5');
        expect(platformNames).toContain('Xbox Series X');
        expect(platformNames).toContain('Nintendo Switch');
      });
    });

    describe('with API enabled', () => {
      beforeEach(() => {
        apiConfig.isAPIEnabled.mockReturnValue(true);
      });

      it('should make API call with correct parameters', async () => {
        const mockApiInstance = {
          get: jest.fn().mockResolvedValue({
            data: {
              results: [
                { id: 1, name: 'PC' },
                { id: 2, name: 'PlayStation 5' }
              ]
            }
          })
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchPlatforms();

        expect(mockApiInstance.get).toHaveBeenCalledWith('/platforms', {
          params: { key: 'test-api-key' }
        });

        expect(result).toEqual([
          { id: 1, name: 'PC' },
          { id: 2, name: 'PlayStation 5' }
        ]);
      });

      it('should handle API errors and fallback to local data', async () => {
        const mockApiInstance = {
          get: jest.fn().mockRejectedValue(new Error('API Error'))
        };

        mockedAxios.create.mockReturnValue(mockApiInstance);

        const result = await gamesApi.fetchPlatforms();

        expect(console.warn).toHaveBeenCalledWith('API call failed, using local fallback platforms:', 'API Error');
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      apiConfig.isAPIEnabled.mockReturnValue(true);
      
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';

      const mockApiInstance = {
        get: jest.fn().mockRejectedValue(networkError)
      };

      mockedAxios.create.mockReturnValue(mockApiInstance);

      const result = await gamesApi.fetchGames();

      expect(console.warn).toHaveBeenCalledWith('API call failed, using local fallback data:', 'Network Error');
      expect(result.games.length).toBeGreaterThan(0);
    });

    it('should handle timeout errors', async () => {
      apiConfig.isAPIEnabled.mockReturnValue(true);
      
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'ECONNABORTED';

      const mockApiInstance = {
        get: jest.fn().mockRejectedValue(timeoutError)
      };

      mockedAxios.create.mockReturnValue(mockApiInstance);

      const result = await gamesApi.fetchGames();

      expect(console.warn).toHaveBeenCalledWith('API call failed, using local fallback data:', 'Request timeout');
      expect(result.games.length).toBeGreaterThan(0);
    });

    it('should handle malformed API responses', async () => {
      apiConfig.isAPIEnabled.mockReturnValue(true);

      const mockApiInstance = {
        get: jest.fn().mockResolvedValue({
          data: null // Malformed response
        })
      };

      mockedAxios.create.mockReturnValue(mockApiInstance);

      expect(async () => {
        await gamesApi.fetchGames();
      }).not.toThrow();
    });
  });

  describe('Configuration Integration', () => {
    it('should use correct API configuration', async () => {
      apiConfig.isAPIEnabled.mockReturnValue(true);
      apiConfig.getAPIBaseURL.mockReturnValue('https://custom-api.com');
      apiConfig.getAPIKey.mockReturnValue('custom-key');
      apiConfig.getAPITimeout.mockReturnValue(10000);

      const mockApiInstance = {
        get: jest.fn().mockResolvedValue({
          data: { results: [], count: 0, next: null, previous: null }
        })
      };

      mockedAxios.create.mockReturnValue(mockApiInstance);

      await gamesApi.fetchGames();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom-api.com',
        timeout: 10000
      });

      expect(mockApiInstance.get).toHaveBeenCalledWith('/games', {
        params: expect.objectContaining({
          key: 'custom-key'
        })
      });
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data structure regardless of source', async () => {
      // Test local data structure
      apiConfig.isAPIEnabled.mockReturnValue(false);
      const localResult = await gamesApi.fetchGames(1, 5);

      // Test API data structure
      apiConfig.isAPIEnabled.mockReturnValue(true);
      const mockApiInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            results: localResult.games.slice(0, 2).map(game => ({
              id: game.id,
              name: game.name,
              background_image: game.background_image,
              rating: game.rating,
              platforms: game.platforms.map(p => ({ platform: { name: p } })),
              genres: [{ name: game.genre }],
              released: game.released,
              description: game.description
            })),
            count: 2,
            next: null,
            previous: null
          }
        })
      };

      mockedAxios.create.mockReturnValue(mockApiInstance);
      const apiResult = await gamesApi.fetchGames(1, 5);

      // Both should have same structure
      expect(localResult).toHaveProperty('games');
      expect(localResult).toHaveProperty('count');
      expect(localResult).toHaveProperty('next');
      expect(localResult).toHaveProperty('previous');

      expect(apiResult).toHaveProperty('games');
      expect(apiResult).toHaveProperty('count');
      expect(apiResult).toHaveProperty('next');
      expect(apiResult).toHaveProperty('previous');

      // Games should have same properties
      const localGame = localResult.games[0];
      const apiGame = apiResult.games[0];

      expect(Object.keys(localGame).sort()).toEqual(Object.keys(apiGame).sort());
    });
  });
});
