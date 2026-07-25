import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import { FavoriteService } from '../services/FavoriteService';
import type { Movie } from '../models/Movie';

interface FavoritesContextType {
  favorites: Movie[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  isFavorite: (movieId: string) => boolean;
  toggleFavorite: (movie: Movie) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuthContext();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      setFavoriteIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = FavoriteService.subscribeToFavorites(
      currentUser.uid,
      (updatedFavorites) => {
        setFavorites(updatedFavorites);
        setFavoriteIds(new Set(updatedFavorites.map((m) => m.id)));
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching favorites:', err);
        setError('Failed to sync favorites with database.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const isFavorite = (movieId: string): boolean => {
    return favoriteIds.has(movieId);
  };

  const toggleFavorite = async (movie: Movie): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    const alreadyFav = isFavorite(movie.id);

    // Optimistically update local favorite status for instantaneous UI response
    const nextIds = new Set(favoriteIds);
    if (alreadyFav) {
      nextIds.delete(movie.id);
    } else {
      nextIds.add(movie.id);
    }
    setFavoriteIds(nextIds);

    try {
      if (alreadyFav) {
        await FavoriteService.removeFavorite(currentUser.uid, movie.id);
      } else {
        await FavoriteService.addFavorite(currentUser.uid, movie);
      }
      return true;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on failure
      setFavoriteIds(favoriteIds);
      setError('Failed to update favorite status. Please try again.');
      return true;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isLoading,
        error,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}
