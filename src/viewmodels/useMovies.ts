import { useState, useCallback } from 'react';
import { MovieService } from '../services/MovieService';
import type { Movie } from '../models';

/**
 * useMovies.ts
 * ViewModel managing movie search state, query inputs, and featured list loading.
 * Acts as the presentation logic bridge between Search views and MovieService.
 */
export function useMovies() {
  // Movie search result state
  const [movies, setMovies] = useState<Movie[]>([]);
  
  // Search input query state
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Async status state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search for movies by title
   */
  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await MovieService.searchMovies(query, page);

    if (apiError) {
      setError(apiError);
      setMovies([]);
    } else {
      setMovies(data || []);
    }

    setIsLoading(false);
  }, []);

  /**
   * Load featured movies for the landing page
   */
  const getFeaturedMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await MovieService.getFeaturedMovies();

    if (apiError) {
      setError(apiError);
      setMovies([]);
    } else {
      setMovies(data || []);
    }

    setIsLoading(false);
  }, []);

  /**
   * Utility to manually clear errors from the UI
   */
  const clearError = useCallback(() => setError(null), []);

  return {
    movies,
    searchQuery,
    isLoading,
    error,
    setSearchQuery,
    clearError,
    searchMovies,
    getFeaturedMovies,
  };
}
