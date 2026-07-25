/**
 * AuthService.ts
 * Data/Service layer handling Firebase Authentication calls
 * and error code translation for user-friendly error messages.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from '../models/User';

function mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}

export const AuthService = {
  /**
   * Registers a new user with email and password.
   */
  async register(email: string, pass: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return mapFirebaseUser(userCredential.user)!;
  },

  /**
   * Signs in an existing user with email and password.
   */
  async login(email: string, pass: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return mapFirebaseUser(userCredential.user)!;
  },

  /**
   * Signs out the current user.
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Subscribes to authentication state changes.
   * Returns an unsubscribe function.
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      callback(mapFirebaseUser(firebaseUser));
    });
  },

  /**
   * Translates raw Firebase auth error objects / codes into user-friendly error messages.
   */
  formatAuthError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/email-already-in-use':
          return 'An account with this email address already exists.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Invalid email or password. Please check your credentials.';
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please try again later.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection.';
        case 'auth/user-disabled':
          return 'This account has been disabled.';
        default:
          return (error as { message?: string }).message || 'Authentication failed. Please try again.';
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  },
};

