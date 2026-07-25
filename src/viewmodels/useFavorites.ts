/**
 * useFavorites.ts
 * ViewModel hook providing favorite state and actions.
 * Redirects unauthenticated users to /login when attempting to favorite a movie.
 */
import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import type { Movie } from '../models/Movie';

export function useFavorites() {
  const { favorites, favoriteIds, isLoading, error, isFavorite, toggleFavorite } =
    useFavoritesContext();
  const navigate = useNavigate();

  const handleToggleFavorite = async (movie: Movie) => {
    const success = await toggleFavorite(movie);
    if (!success) {
      // User is not logged in -> redirect to login page
      navigate('/login');
    }
  };

  return {
    favorites,
    favoriteIds,
    isLoading,
    error,
    isFavorite,
    toggleFavorite: handleToggleFavorite,
  };
}
