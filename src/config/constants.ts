/**
 * constants.ts
 * Application-wide configuration constants.
 */

/** Base URL for OMDb REST API */
export const OMDB_API_BASE_URL = 'https://www.omdbapi.com/';

/** Firestore collection names */
export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  FAVORITES: 'favorites',
} as const;
