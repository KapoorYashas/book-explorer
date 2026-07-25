import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Film, Users, ImageOff, Heart } from 'lucide-react';
import { useMovieDetails, useFavorites } from '../../viewmodels';
import { Loading, Error, Container, Button } from '../components';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { movie, isLoading, error } = useMovieDetails(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  // Poster fallback — same pattern as MovieCard
  const [posterError, setPosterError] = useState(false);
  const posterUrl = movie?.poster || undefined;
  const showImage = Boolean(posterUrl && !posterError);
  const favorited = movie ? isFavorite(movie.id) : false;

  const handleFavToggle = async () => {
    if (movie) {
      const success = await toggleFavorite(movie);
      if (!success) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="page details-page">
      <Container>
        {/* Back navigation */}
        <Link to="/" className="details-back-link">
          <ArrowLeft className="details-back-icon" aria-hidden="true" />
          Back to search
        </Link>

        {/* Loading state */}
        {isLoading && <Loading text="Loading movie details..." />}

        {/* Error / not-found state */}
        {!isLoading && error && <Error message={error} />}

        {/* Details layout */}
        {!isLoading && !error && movie && (
          <div className="details-layout">
            {/* Poster column */}
            <div className="details-poster-wrapper">
              {showImage && posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  className="details-poster"
                  onError={() => setPosterError(true)}
                />
              ) : (
                <div className="details-poster-placeholder">
                  <ImageOff className="placeholder-icon" aria-hidden="true" />
                  <span>No poster available</span>
                </div>
              )}
            </div>

            {/* Info column */}
            <div className="details-info">
              <div className="details-header-top">
                <h1 className="details-title">{movie.title}</h1>
                <Button
                  variant={favorited ? 'secondary' : 'primary'}
                  className={`details-fav-btn ${favorited ? 'active' : ''}`}
                  onClick={handleFavToggle}
                >
                  <Heart className="details-fav-icon" fill={favorited ? 'currentColor' : 'none'} aria-hidden="true" />
                  <span>{favorited ? 'Favorited' : 'Add to Favorites'}</span>
                </Button>
              </div>

              {/* Badges row */}
              <div className="details-badges">
                {movie.year && <span className="detail-badge">{movie.year}</span>}
                {movie.type && <span className="detail-badge detail-badge--type">{movie.type}</span>}
                {movie.runtime && (
                  <span className="detail-badge">
                    <Clock className="badge-icon" aria-hidden="true" />
                    {movie.runtime}
                  </span>
                )}
                {movie.imdbRating && (
                  <span className="detail-badge detail-badge--rating">
                    <Star className="badge-icon" aria-hidden="true" />
                    {movie.imdbRating} / 10
                  </span>
                )}
              </div>

              {/* Genre pills */}
              {movie.genre && (
                <div className="details-genres">
                  {movie.genre.split(',').map((g) => (
                    <span key={g.trim()} className="genre-pill">{g.trim()}</span>
                  ))}
                </div>
              )}

              {/* Plot */}
              {movie.plot && (
                <div className="details-section">
                  <p className="details-plot">{movie.plot}</p>
                </div>
              )}

              {/* Crew / cast meta */}
              <div className="details-meta">
                {movie.director && (
                  <div className="details-meta-row">
                    <Film className="meta-icon" aria-hidden="true" />
                    <div>
                      <span className="meta-label">Director</span>
                      <span className="meta-value">{movie.director}</span>
                    </div>
                  </div>
                )}
                {movie.actors && (
                  <div className="details-meta-row">
                    <Users className="meta-icon" aria-hidden="true" />
                    <div>
                      <span className="meta-label">Cast</span>
                      <span className="meta-value">{movie.actors}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
