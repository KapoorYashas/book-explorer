/**
 * useFavorites.ts
 * ViewModel hook providing favorite state and actions.
 * Decoupled from router side-effects; returns a boolean indicating success or auth requirement.
 */
import { useFavoritesContext } from '../context/FavoritesContext';
import type { Movie } from '../models/Movie';

export function useFavorites() {
  const { favorites, favoriteIds, isLoading, error, isFavorite, toggleFavorite } =
    useFavoritesContext();

  /**
   * Toggles favorite status for a movie.
   * Returns true if operation succeeded, false if user is unauthenticated (requires login).
   */
  const handleToggle = async (movie: Movie): Promise<boolean> => {
    return await toggleFavorite(movie);
  };

  return {
    favorites,
    favoriteIds,
    isLoading,
    error,
    isFavorite,
    toggleFavorite: handleToggle,
  };
}
