import { Movie, OMDbSearchResponse, OMDbMovieResponse } from '../models';

const API_BASE_URL = 'https://www.omdbapi.com/';
const DEFAULT_TIMEOUT_MS = 10000;

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Helper to execute a fetch request with a timeout.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

function getApiKey(): string {
  const key = import.meta.env.VITE_OMDB_API_KEY;
  if (!key) {
    throw new Error("OMDb API key is missing. Please set VITE_OMDB_API_KEY in your .env file.");
  }
  return key;
}

export const MovieService = {
  /**
   * Searches for movies based on a title query.
   */
  async searchMovies(title: string, page: number = 1): Promise<ServiceResponse<Movie[]>> {
    if (!title.trim()) {
      return { data: [], error: null };
    }

    try {
      const apiKey = getApiKey();
      const url = `${API_BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(title)}&page=${page}&type=movie`;
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: OMDbSearchResponse = await response.json();
      
      // OMDb returns 200 OK even for "Movie not found!" errors
      if (data.Response === "False") {
        return { data: null, error: data.Error || 'Search failed.' };
      }

      const movies: Movie[] = (data.Search || []).map(item => ({
        id: item.imdbID,
        title: item.Title,
        year: item.Year,
        poster: item.Poster !== "N/A" ? item.Poster : null,
        type: item.Type,
      }));
      
      return { data: movies, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while searching movies.';
      return { data: null, error: errorMessage };
    }
  },

  /**
   * Retrieves a single movie by its IMDb ID.
   */
  async getMovieById(imdbID: string): Promise<ServiceResponse<Movie>> {
    try {
      const apiKey = getApiKey();
      const url = `${API_BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(imdbID)}&plot=full`;
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: OMDbMovieResponse = await response.json();

      if (data.Response === "False") {
        return { data: null, error: data.Error || 'Movie not found.' };
      }

      const movie: Movie = {
        id: data.imdbID,
        title: data.Title,
        year: data.Year,
        poster: data.Poster !== "N/A" ? data.Poster : null,
        type: data.Type,
        plot: data.Plot !== "N/A" ? data.Plot : undefined,
        director: data.Director !== "N/A" ? data.Director : undefined,
        actors: data.Actors !== "N/A" ? data.Actors : undefined,
        runtime: data.Runtime !== "N/A" ? data.Runtime : undefined,
        genre: data.Genre !== "N/A" ? data.Genre : undefined,
        imdbRating: data.imdbRating !== "N/A" ? data.imdbRating : undefined,
      };

      return { data: movie, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching movie details.';
      return { data: null, error: errorMessage };
    }
  },

  /**
   * Retrieves a list of featured movies (using a generic search).
   */
  async getFeaturedMovies(): Promise<ServiceResponse<Movie[]>> {
    // OMDb doesn't have a "featured" endpoint, so we search for a popular keyword or year.
    return this.searchMovies("Batman");
  }
};
