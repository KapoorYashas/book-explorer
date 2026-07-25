import { Link } from 'react-router-dom';
import { Film, User as UserIcon } from 'lucide-react';
import Button from './Button';
import Container from './Container';
import { useAuthContext } from '../../context/AuthContext';

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated: propsAuth, onLogout: propsLogout }: NavbarProps) {
  const { currentUser, logout } = useAuthContext();

  const isAuth = propsAuth ?? (currentUser !== null);
  const handleLogout = propsLogout ?? logout;

  return (
    <nav className="navbar">
      <Container className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Film className="logo-icon" aria-hidden="true" />
          <span>Movie Explorer</span>
        </Link>
        <div className="navbar-links">
          {isAuth ? (
            <>
              <Link to="/favorites" className="nav-link">Favorites</Link>
              {currentUser?.email && (
                <span className="navbar-user-email">
                  <UserIcon className="user-icon" aria-hidden="true" />
                  <span>{currentUser.email}</span>
                </span>
              )}
              <Button variant="secondary" onClick={handleLogout}>Logout</Button>
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

