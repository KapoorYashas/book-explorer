/**
 * FavoriteService.ts
 * Data/Service layer handling Firestore calls for per-user favorites.
 * Movies are stored in Firestore under users/{uid}/favorites/{movieId}.
 */
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Movie } from '../models/Movie';

export const FavoriteService = {
  /**
   * Adds a movie to the user's favorites subcollection in Firestore.
   */
  async addFavorite(uid: string, movie: Movie): Promise<void> {
    const docRef = doc(db, 'users', uid, 'favorites', movie.id);
    await setDoc(docRef, {
      id: movie.id,
      title: movie.title,
      year: movie.year || '',
      type: movie.type || 'movie',
      poster: movie.poster || '',
      addedAt: serverTimestamp(),
    });
  },

  /**
   * Removes a movie from the user's favorites subcollection in Firestore.
   */
  async removeFavorite(uid: string, movieId: string): Promise<void> {
    const docRef = doc(db, 'users', uid, 'favorites', movieId);
    await deleteDoc(docRef);
  },

  /**
   * Fetches all favorite movies for a specific user UID.
   */
  async getFavorites(uid: string): Promise<Movie[]> {
    const favsRef = collection(db, 'users', uid, 'favorites');
    const snapshot = await getDocs(favsRef);
    const movies: Movie[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: data.id || docSnap.id,
        title: data.title || 'Untitled',
        year: data.year || '',
        type: data.type || 'movie',
        poster: data.poster || '',
      };
    });
    return movies;
  },

  /**
   * Listens for real-time updates to a user's favorites subcollection.
   */
  subscribeToFavorites(
    uid: string,
    onSuccess: (movies: Movie[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const favsRef = collection(db, 'users', uid, 'favorites');

    return onSnapshot(
      favsRef,
      (snapshot) => {
        const movies: Movie[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: data.id || docSnap.id,
            title: data.title || 'Untitled',
            year: data.year || '',
            type: data.type || 'movie',
            poster: data.poster || '',
          };
        });
        onSuccess(movies);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  },
};
