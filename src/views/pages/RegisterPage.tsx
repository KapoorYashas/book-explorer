import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../viewmodels';
import { Container, Button } from '../components';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isSubmitting, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await register(email, password, confirmPassword);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="page auth-page">
      <Container>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon-wrapper">
              <UserPlus className="auth-icon" />
            </div>
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Join Movie Explorer to save your favorite movies</p>
          </div>

          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle className="auth-error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="register-email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  id="register-email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="register-password"
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="register-confirm-password"
                  type="password"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

