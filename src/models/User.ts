/**
 * User.ts
 * Domain model representing an authenticated user.
 */
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

