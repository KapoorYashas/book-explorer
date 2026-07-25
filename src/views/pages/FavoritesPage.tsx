import { Link } from 'react-router-dom';
import { Heart, Search, LogIn } from 'lucide-react';
import { useFavorites, useAuth } from '../../viewmodels';
import { Container, MovieCard, Loading, Error, Button } from '../components';

export default function FavoritesPage() {
  const { favorites, isLoading, error } = useFavorites();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page favorites-page">
        <Container>
          <div className="empty-state auth-required-state">
            <div className="empty-icon-wrapper">
              <LogIn className="empty-icon" />
            </div>
            <h2>Sign in to view your favorites</h2>
            <p>You must be signed in to save and manage your favorite movies.</p>
            <Link to="/login" style={{ marginTop: '1rem' }}>
              <Button variant="primary">Go to Login</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page favorites-page">
      <Container>
        <header className="page-header">
          <div className="favorites-header-title">
            <Heart className="favorites-header-icon" fill="currentColor" />
            <h1>Your Favorite Movies</h1>
          </div>
          <p className="favorites-subtitle">
            {favorites.length === 1
              ? '1 movie saved to your collection'
              : `${favorites.length} movies saved to your collection`}
          </p>
        </header>

        <main className="page-content">
          {/* Loading State */}
          {isLoading && <Loading text="Loading your favorites..." />}

          {/* Error State */}
          {!isLoading && error && <Error message={error} />}

          {/* Empty State */}
          {!isLoading && !error && favorites.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <Heart className="empty-icon" />
              </div>
              <h2>No favorites added yet</h2>
              <p>Explore movies and click the heart icon to save them here.</p>
              <Link to="/" style={{ marginTop: '1rem' }}>
                <Button variant="primary">
                  <Search className="btn-icon" />
                  Explore Movies
                </Button>
              </Link>
            </div>
          )}

          {/* Movie Grid */}
          {!isLoading && !error && favorites.length > 0 && (
            <div className="movie-grid">
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </main>
      </Container>
    </div>
  );
}

