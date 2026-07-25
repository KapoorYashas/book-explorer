import React, { useEffect } from 'react';
import { useMovies } from '../../viewmodels';
import { SearchBar, Container, Loading, Error, MovieCard } from '../components';

export default function SearchPage() {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    searchMovies,
    getFeaturedMovies,
  } = useMovies();

  // Load featured movies on mount if no search is active
  useEffect(() => {
    if (!searchQuery && movies.length === 0) {
      getFeaturedMovies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    searchMovies(searchQuery);
  };

  return (
    <div className="page search-page">
      <Container>
        <header className="page-header">
          <h1>Find your favorite movies</h1>
          <SearchBar
            query={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Search for movies, series, episodes..."
          />
        </header>

        <main className="page-content">
          {/* Loading State */}
          {isLoading && <Loading text="Fetching movies..." />}
          
          {/* Error State */}
          {!isLoading && error && <Error message={error} />}
          
          {/* Empty State */}
          {!isLoading && !error && movies.length === 0 && (
            <div className="empty-state">
              <p>No movies found. Try a different search term!</p>
            </div>
          )}

          {/* Success State: Movie Grid */}
          {!isLoading && !error && movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </main>
      </Container>
    </div>
  );
}
