import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar, Footer, Loading } from './views/components';

// Lazy load the page components
const SearchPage = lazy(() => import('./views/pages/SearchPage'));
const LoginPage = lazy(() => import('./views/pages/LoginPage'));
const RegisterPage = lazy(() => import('./views/pages/RegisterPage'));
const FavoritesPage = lazy(() => import('./views/pages/FavoritesPage'));
const MovieDetailsPage = lazy(() => import('./views/pages/MovieDetailsPage'));
const NotFoundPage = lazy(() => import('./views/pages/NotFoundPage'));

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Suspense fallback={<Loading text="Loading application..." />}>
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}


export default App;

