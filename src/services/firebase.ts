/**
 * firebase.ts
 * Initializes the Firebase app and exports the auth and Firestore
 * instances for use across the application.
 *
 * All config values are read exclusively from Vite environment variables
 * (prefixed VITE_) so no secrets are ever hardcoded in source code.
 *
 * Required .env.local keys:
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth }      from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate that all required env vars are present at startup.
// Vite replaces import.meta.env.VITE_* at build time, so any
// missing key will be undefined and caught here immediately.
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

for (const key of requiredVars) {
  if (!import.meta.env[key]) {
    throw new Error(
      `[firebase.ts] Missing required environment variable: ${key}\n` +
      `Add it to your .env.local file and restart the dev server.`
    );
  }
}

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against double-initialization in HMR / Strict Mode environments.
// getApps() returns the list of already-initialized apps; reuse the first
// one if it exists instead of calling initializeApp() a second time.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/** Firebase Authentication instance */
export const auth = getAuth(app);

/** Cloud Firestore instance */
export const db = getFirestore(app);
