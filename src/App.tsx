import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load the page components
const SearchPage = lazy(() => import('./views/pages/SearchPage'));
const LoginPage = lazy(() => import('./views/pages/LoginPage'));
const RegisterPage = lazy(() => import('./views/pages/RegisterPage'));
const FavoritesPage = lazy(() => import('./views/pages/FavoritesPage'));
const MovieDetailsPage = lazy(() => import('./views/pages/MovieDetailsPage'));
const NotFoundPage = lazy(() => import('./views/pages/NotFoundPage'));

function App() {
  console.log('API KEY:', import.meta.env.VITE_OMDB_API_KEY);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
console.log('API KEY:', import.meta.env.VITE_OMDB_API_KEY);
