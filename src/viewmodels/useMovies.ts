import { useState, useCallback } from 'react';
import { MovieService } from '../services/MovieService';
import { Movie } from '../models';

/**
 * useMovies.ts
 * ViewModel managing search state, movie details, and interactions.
 * It encapsulates presentation logic and acts as the bridge between UI and Services.
 */
export function useMovies() {
  // State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Async State
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
   * Fetch detailed information for a single movie
   */
  const getMovieById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedMovie(null); // Clear previous selection while loading

    const { data, error: apiError } = await MovieService.getMovieById(id);

    if (apiError) {
      setError(apiError);
    } else {
      setSelectedMovie(data);
    }

    setIsLoading(false);
  }, []);

  /**
   * Utility to manually clear errors from the UI
   */
  const clearError = useCallback(() => setError(null), []);

  return {
    // State Exports
    movies,
    selectedMovie,
    searchQuery,
    isLoading,
    error,
    
    // State Setters
    setSearchQuery,
    clearError,

    // Action Exports
    searchMovies,
    getFeaturedMovies,
    getMovieById
  };
}
