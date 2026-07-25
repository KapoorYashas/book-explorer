import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import type { Movie } from '../../models';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  // Track whether the remote poster image failed to load.
  // Starts false; flips to true on the img onError event.
  const [posterError, setPosterError] = useState(false);

  const showImage = movie.poster && !posterError;

  return (
    <div className="movie-card">
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
              <ImageOff className="placeholder-icon" />
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
