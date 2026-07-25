import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Film, Users, ImageOff } from 'lucide-react';
import { useMovieDetails } from '../../viewmodels';
import { Loading, Error, Container } from '../components';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { movie, isLoading, error } = useMovieDetails(id);

  // Poster fallback — same pattern as MovieCard
  const [posterError, setPosterError] = useState(false);
  const showImage = movie?.poster && !posterError;

  return (
    <div className="page details-page">
      <Container>
        {/* Back navigation */}
        <Link to="/" className="details-back-link">
          <ArrowLeft className="details-back-icon" />
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
              {showImage ? (
                <img
                  src={movie.poster!}
                  alt={`${movie.title} poster`}
                  className="details-poster"
                  onError={() => setPosterError(true)}
                />
              ) : (
                <div className="details-poster-placeholder">
                  <ImageOff className="placeholder-icon" />
                  <span>No poster available</span>
                </div>
              )}
            </div>

            {/* Info column */}
            <div className="details-info">
              <h1 className="details-title">{movie.title}</h1>

              {/* Badges row */}
              <div className="details-badges">
                {movie.year && <span className="detail-badge">{movie.year}</span>}
                {movie.type && <span className="detail-badge detail-badge--type">{movie.type}</span>}
                {movie.runtime && (
                  <span className="detail-badge">
                    <Clock className="badge-icon" />
                    {movie.runtime}
                  </span>
                )}
                {movie.imdbRating && (
                  <span className="detail-badge detail-badge--rating">
                    <Star className="badge-icon" />
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
                    <Film className="meta-icon" />
                    <div>
                      <span className="meta-label">Director</span>
                      <span className="meta-value">{movie.director}</span>
                    </div>
                  </div>
                )}
                {movie.actors && (
                  <div className="details-meta-row">
                    <Users className="meta-icon" />
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
