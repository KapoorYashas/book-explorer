/**
 * useAuth.ts
 * ViewModel hook managing authentication state, form validation,
 * loading states, user-friendly error messages, and auth actions.
 */
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { AuthService } from '../services/AuthService';

export function useAuth() {
  const { currentUser, loading: isAuthLoading, logout } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !pass) {
      setError('Please fill in all fields.');
      return false;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    setIsSubmitting(true);
    try {
      await AuthService.login(trimmedEmail, pass);
      return true;
    } catch (err: unknown) {
      setError(AuthService.formatAuthError(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (email: string, pass: string, confirmPass: string): Promise<boolean> => {
    setError(null);
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !pass || !confirmPass) {
      setError('Please fill in all fields.');
      return false;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (pass.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (pass !== confirmPass) {
      setError('Passwords do not match.');
      return false;
    }

    setIsSubmitting(true);
    try {
      await AuthService.register(trimmedEmail, pass);
      return true;
    } catch (err: unknown) {
      setError(AuthService.formatAuthError(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isAuthLoading,
    isSubmitting,
    error,
    setError,
    login,
    register,
    logout,
  };
}

