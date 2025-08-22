import { renderHook, waitFor } from '@testing-library/react';
import { useFetchGames, useFetchGameById, useFetchGenres, useFetchPlatforms } from '../useFetchGames';
import * as gamesApi from '../../services/gamesApi';

// Mock the gamesApi module
jest.mock('../../services/gamesApi');

describe('useFetchGames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useFetchGames Hook', () => {
    const mockGamesResponse = {
      games: [
        { id: 1, name: 'Test Game 1', price: 29.99 },
        { id: 2, name: 'Test Game 2', price: 39.99 },
      ],
      count: 2,
      next: null,
      previous: null,
    };

    it('should return initial loading state', () => {
      gamesApi.fetchGames.mockResolvedValue(mockGamesResponse);

      const { result } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.games).toEqual([]);
      expect(result.current.error).toBe(null);
      expect(result.current.pagination).toEqual({
        count: 0,
        next: null,
        previous: null,
      });
    });

    it('should fetch games successfully', async () => {
      gamesApi.fetchGames.mockResolvedValue(mockGamesResponse);

      const { result } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.games).toEqual(mockGamesResponse.games);
      expect(result.current.error).toBe(null);
      expect(result.current.pagination).toEqual({
        count: mockGamesResponse.count,
        next: mockGamesResponse.next,
        previous: mockGamesResponse.previous,
      });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch games';
      gamesApi.fetchGames.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.games).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.pagination).toEqual({
        count: 0,
        next: null,
        previous: null,
      });
    });

    it('should refetch when parameters change', async () => {
      gamesApi.fetchGames.mockResolvedValue(mockGamesResponse);

      const { result, rerender } = renderHook(
        ({ page, pageSize, search }) => useFetchGames(page, pageSize, search, [], [], 'relevance'),
        {
          initialProps: { page: 1, pageSize: 20, search: '' }
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(gamesApi.fetchGames).toHaveBeenCalledTimes(1);

      // Change parameters
      rerender({ page: 2, pageSize: 20, search: 'action' });

      await waitFor(() => {
        expect(gamesApi.fetchGames).toHaveBeenCalledTimes(2);
      });

      expect(gamesApi.fetchGames).toHaveBeenLastCalledWith(
        2, 20, 'action', [], [], 'relevance'
      );
    });

    it('should handle genre and platform filters', async () => {
      gamesApi.fetchGames.mockResolvedValue(mockGamesResponse);

      const genres = ['Action', 'RPG'];
      const platforms = ['PC', 'PlayStation 5'];

      renderHook(() => 
        useFetchGames(1, 20, '', genres, platforms, 'relevance')
      );

      await waitFor(() => {
        expect(gamesApi.fetchGames).toHaveBeenCalledWith(
          1, 20, '', genres, platforms, 'relevance'
        );
      });
    });

    it('should handle different sort options', async () => {
      gamesApi.fetchGames.mockResolvedValue(mockGamesResponse);

      const sortOptions = ['relevance', 'name-asc', 'name-desc', 'price-low', 'price-high', 'rating'];

      for (const sortBy of sortOptions) {
        renderHook(() => 
          useFetchGames(1, 20, '', [], [], sortBy)
        );

        await waitFor(() => {
          expect(gamesApi.fetchGames).toHaveBeenCalledWith(
            1, 20, '', [], [], sortBy
          );
        });

        jest.clearAllMocks();
      }
    });

    it('should handle array parameters correctly', async () => {
      gamesApi.fetchGames.mockResolvedValue(mockGamesResponse);

      const { rerender } = renderHook(
        ({ genres, platforms }) => useFetchGames(1, 20, '', genres, platforms, 'relevance'),
        {
          initialProps: { genres: ['Action'], platforms: ['PC'] }
        }
      );

      await waitFor(() => {
        expect(gamesApi.fetchGames).toHaveBeenCalledWith(
          1, 20, '', ['Action'], ['PC'], 'relevance'
        );
      });

      // Change array order (should trigger refetch due to different key)
      rerender({ genres: ['RPG', 'Action'], platforms: ['PlayStation 5', 'PC'] });

      await waitFor(() => {
        expect(gamesApi.fetchGames).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useFetchGameById Hook', () => {
    const mockGame = {
      id: 1,
      name: 'Test Game',
      price: 29.99,
      description: 'A test game',
    };

    it('should return initial loading state', () => {
      gamesApi.fetchGameById.mockResolvedValue(mockGame);

      const { result } = renderHook(() => useFetchGameById(1));

      expect(result.current.loading).toBe(true);
      expect(result.current.game).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('should fetch game by ID successfully', async () => {
      gamesApi.fetchGameById.mockResolvedValue(mockGame);

      const { result } = renderHook(() => useFetchGameById(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.game).toEqual(mockGame);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Game not found';
      gamesApi.fetchGameById.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useFetchGameById(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.game).toBe(null);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should not fetch when ID is not provided', () => {
      const { result } = renderHook(() => useFetchGameById(null));

      expect(result.current.loading).toBe(true);
      expect(gamesApi.fetchGameById).not.toHaveBeenCalled();
    });

    it('should refetch when ID changes', async () => {
      gamesApi.fetchGameById.mockResolvedValue(mockGame);

      const { rerender } = renderHook(
        ({ id }) => useFetchGameById(id),
        { initialProps: { id: 1 } }
      );

      await waitFor(() => {
        expect(gamesApi.fetchGameById).toHaveBeenCalledWith(1);
      });

      // Change ID
      rerender({ id: 2 });

      await waitFor(() => {
        expect(gamesApi.fetchGameById).toHaveBeenCalledWith(2);
        expect(gamesApi.fetchGameById).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useFetchGenres Hook', () => {
    const mockGenres = [
      { id: 1, name: 'Action' },
      { id: 2, name: 'RPG' },
      { id: 3, name: 'Strategy' },
    ];

    it('should return initial loading state', () => {
      gamesApi.fetchGenres.mockResolvedValue(mockGenres);

      const { result } = renderHook(() => useFetchGenres());

      expect(result.current.loading).toBe(true);
      expect(result.current.genres).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it('should fetch genres successfully', async () => {
      gamesApi.fetchGenres.mockResolvedValue(mockGenres);

      const { result } = renderHook(() => useFetchGenres());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.genres).toEqual(mockGenres);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch genres';
      gamesApi.fetchGenres.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useFetchGenres());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.genres).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should fetch genres only once', async () => {
      gamesApi.fetchGenres.mockResolvedValue(mockGenres);

      const { result, rerender } = renderHook(() => useFetchGenres());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Re-render should not trigger another fetch
      rerender();

      expect(gamesApi.fetchGenres).toHaveBeenCalledTimes(1);
    });
  });

  describe('useFetchPlatforms Hook', () => {
    const mockPlatforms = [
      { id: 1, name: 'PC' },
      { id: 2, name: 'PlayStation 5' },
      { id: 3, name: 'Xbox Series X' },
    ];

    it('should return initial loading state', () => {
      gamesApi.fetchPlatforms.mockResolvedValue(mockPlatforms);

      const { result } = renderHook(() => useFetchPlatforms());

      expect(result.current.loading).toBe(true);
      expect(result.current.platforms).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it('should fetch platforms successfully', async () => {
      gamesApi.fetchPlatforms.mockResolvedValue(mockPlatforms);

      const { result } = renderHook(() => useFetchPlatforms());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.platforms).toEqual(mockPlatforms);
      expect(result.current.error).toBe(null);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch platforms';
      gamesApi.fetchPlatforms.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useFetchPlatforms());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.platforms).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should fetch platforms only once', async () => {
      gamesApi.fetchPlatforms.mockResolvedValue(mockPlatforms);

      const { rerender } = renderHook(() => useFetchPlatforms());

      await waitFor(() => {
        expect(gamesApi.fetchPlatforms).toHaveBeenCalledTimes(1);
      });

      // Re-render should not trigger another fetch
      rerender();

      expect(gamesApi.fetchPlatforms).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      networkError.code = 'NETWORK_ERROR';
      
      gamesApi.fetchGames.mockRejectedValue(networkError);

      const { result } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(console.error).toHaveBeenCalledWith('Error fetching games:', networkError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      
      gamesApi.fetchGames.mockRejectedValue(timeoutError);

      const { result } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Request timeout');
    });

    it('should handle malformed response errors', async () => {
      gamesApi.fetchGames.mockResolvedValue(null);

      const { result } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should handle null response gracefully
      expect(result.current.games).toEqual([]);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      gamesApi.fetchGames.mockResolvedValue({
        games: [],
        count: 0,
        next: null,
        previous: null,
      });

      const { result, rerender } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialResult = result.current;

      // Re-render with same props
      rerender();

      // Result should be the same object (referential equality)
      expect(result.current).toBe(initialResult);
    });

    it('should handle rapid parameter changes', async () => {
      gamesApi.fetchGames.mockResolvedValue({
        games: [],
        count: 0,
        next: null,
        previous: null,
      });

      const { rerender } = renderHook(
        ({ search }) => useFetchGames(1, 20, search, [], [], 'relevance'),
        { initialProps: { search: '' } }
      );

      // Rapidly change search terms
      rerender({ search: 'a' });
      rerender({ search: 'ac' });
      rerender({ search: 'act' });
      rerender({ search: 'action' });

      await waitFor(() => {
        expect(gamesApi.fetchGames).toHaveBeenCalledTimes(5); // Initial + 4 changes
      });

      expect(gamesApi.fetchGames).toHaveBeenLastCalledWith(
        1, 20, 'action', [], [], 'relevance'
      );
    });
  });

  describe('Memory Management', () => {
    it('should cleanup on unmount', async () => {
      gamesApi.fetchGames.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ games: [], count: 0 }), 100))
      );

      const { unmount } = renderHook(() => 
        useFetchGames(1, 20, '', [], [], 'relevance')
      );

      // Unmount before request completes
      unmount();

      // Should not cause memory leaks or state updates after unmount
      await new Promise(resolve => setTimeout(resolve, 150));
    });
  });
});
