import { useState, useEffect } from 'react';
import { fetchGamesWithFilters, fetchGameById, fetchGenres, fetchPlatforms } from '../services/rawgApi';

export const useFetchGames = (page = 1, pageSize = 60, search = '', genre = [], platform = [], sortBy = 'relevance') => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  // Create stable dependency keys for array params
  const genreKey = Array.isArray(genre) ? [...genre].sort().join('|') : String(genre || '');
  const platformKey = Array.isArray(platform) ? [...platform].sort().join('|') : String(platform || '');

  useEffect(() => {
    const getGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchGamesWithFilters({
          page,
          pageSize,
          search,
          selectedGenre: genre,
          selectedPlatform: platform,
          sortBy
        });
        
        setGames(result.games);
        setPagination({
          count: result.count,
          next: result.next,
          previous: result.previous,
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, [page, pageSize, search, genreKey, platformKey, sortBy]);

  return { games, loading, error, pagination };
};

export const useFetchGameById = (id) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGame = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchGameById(id);
        setGame(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching game:', err);
      } finally {
        setLoading(false);
      }
    };

    getGame();
  }, [id]);

  return { game, loading, error };
};

export const useFetchGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchGenres();
        setGenres(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };

    getGenres();
  }, []);

  return { genres, loading, error };
};

export const useFetchPlatforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPlatforms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchPlatforms();
        setPlatforms(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching platforms:', err);
      } finally {
        setLoading(false);
      }
    };

    getPlatforms();
  }, []);

  return { platforms, loading, error };
};
