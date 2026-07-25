import { useState, useEffect } from 'react';
import { MovieService } from '../services/MovieService';
import type { Movie } from '../models';

/**
 * useMovieDetails.ts
 * ViewModel responsible for fetching and exposing a single movie's full details.
 * Automatically fetches when the imdbID changes; handles loading and error states.
 * No UI/JSX lives here.
 */
export function useMovieDetails(imdbID: string | undefined) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: if no ID is present in the route, report it gracefully
    if (!imdbID) {
      setError('No movie ID was provided.');
      return;
    }

    let cancelled = false; // prevents state updates after unmount / fast navigation

    async function fetchDetails() {
      setIsLoading(true);
      setError(null);
      setMovie(null);

      const { data, error: apiError } = await MovieService.getMovieById(imdbID!);

      if (cancelled) return;

      if (apiError) {
        setError(apiError);
      } else {
        setMovie(data);
      }

      setIsLoading(false);
    }

    fetchDetails();

    return () => { cancelled = true; };
  }, [imdbID]);

  return { movie, isLoading, error };
}
