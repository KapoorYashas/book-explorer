import { useState, memo, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageOff, Heart } from 'lucide-react';
import type { Movie } from '../../models';
import { useFavorites } from '../../viewmodels';

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  // Track whether the remote poster image failed to load.
  // Starts false; flips to true on the img onError event.
  const [posterError, setPosterError] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorited = isFavorite(movie.id);
  const showImage = movie.poster && !posterError;

  const handleFavoriteClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await toggleFavorite(movie);
    if (!success) {
      navigate('/login');
    }
  };

  return (
    <div className="movie-card">
      <button
        type="button"
        className={`favorite-card-btn ${favorited ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className="favorite-card-icon" fill={favorited ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>

      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-poster-wrapper">
          {showImage ? (
            <img
              src={movie.poster!}
              alt={`${movie.title} poster`}
              className="movie-poster"
              loading="lazy"
              onError={() => setPosterError(true)}
            />
          ) : (
            <div className="movie-poster-placeholder">
              <ImageOff className="placeholder-icon" aria-hidden="true" />
              <span>No poster available</span>
            </div>
          )}
        </div>
        <div className="movie-info">
          <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
          <div className="movie-metadata">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-type">{movie.type}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default memo(MovieCard);


