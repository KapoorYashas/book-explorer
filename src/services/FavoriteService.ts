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
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Movie } from '../models/Movie';
import { FIRESTORE_COLLECTIONS } from '../config/constants';

/**
 * Helper to map a Firestore document snapshot to a Movie domain model.
 */
function mapDocToMovie(docSnap: QueryDocumentSnapshot): Movie {
  const data = docSnap.data();
  return {
    id: data.id || docSnap.id,
    title: data.title || 'Untitled',
    year: data.year || '',
    type: data.type || 'movie',
    poster: data.poster || '',
  };
}

export const FavoriteService = {
  /**
   * Adds a movie to the user's favorites subcollection in Firestore.
   */
  async addFavorite(uid: string, movie: Movie): Promise<void> {
    const docRef = doc(
      db,
      FIRESTORE_COLLECTIONS.USERS,
      uid,
      FIRESTORE_COLLECTIONS.FAVORITES,
      movie.id
    );
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
    const docRef = doc(
      db,
      FIRESTORE_COLLECTIONS.USERS,
      uid,
      FIRESTORE_COLLECTIONS.FAVORITES,
      movieId
    );
    await deleteDoc(docRef);
  },

  /**
   * Fetches all favorite movies for a specific user UID.
   */
  async getFavorites(uid: string): Promise<Movie[]> {
    const favsRef = collection(db, FIRESTORE_COLLECTIONS.USERS, uid, FIRESTORE_COLLECTIONS.FAVORITES);
    const snapshot = await getDocs(favsRef);
    return snapshot.docs.map(mapDocToMovie);
  },

  /**
   * Listens for real-time updates to a user's favorites subcollection.
   */
  subscribeToFavorites(
    uid: string,
    onSuccess: (movies: Movie[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const favsRef = collection(db, FIRESTORE_COLLECTIONS.USERS, uid, FIRESTORE_COLLECTIONS.FAVORITES);

    return onSnapshot(
      favsRef,
      (snapshot) => {
        const movies: Movie[] = snapshot.docs.map(mapDocToMovie);
        onSuccess(movies);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  },
};
