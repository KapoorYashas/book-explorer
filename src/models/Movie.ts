/**
 * Movie.ts
 * Domain model representing a movie in our application.
 * This is a clean, flattened version of the OMDb API response.
 */
export interface Movie {
  id: string; // imdbID
  title: string;
  year: string;
  poster: string | null;
  type: string;
  // Detailed fields (may only be present after getting movie by ID)
  plot?: string;
  director?: string;
  actors?: string;
  runtime?: string;
  genre?: string;
  imdbRating?: string;
}
