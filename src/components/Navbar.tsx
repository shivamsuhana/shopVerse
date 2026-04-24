import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore, computeItemCount } from '../store/cartStore';
import CartSidebar from './CartSidebar';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((s) => computeItemCount(s.items));
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/signin');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/products" className="navbar-brand">
            <span className="brand-icon">🛍️</span>
            <span className="brand-text">ShopVerse</span>
          </Link>

          <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {isAuthenticated ? (
              <div className="user-menu">
                <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user?.name}</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      My Orders
                    </Link>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="signin-btn">
                Sign In
              </Link>
            )}

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
