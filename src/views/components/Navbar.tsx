import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import Button from './Button';
import Container from './Container';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Navbar({ isAuthenticated, onLogout }: NavbarProps) {
  return (
    <nav className="navbar">
      <Container className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Film className="logo-icon" />
          <span>Movie Explorer</span>
        </Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="nav-link">Favorites</Link>
              <Button variant="secondary" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register"><Button variant="primary">Sign Up</Button></Link>
            </>
          )}
        </div>
      </Container>
    </nav>
  );
}
