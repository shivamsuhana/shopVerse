import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './SignIn.css';

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate('/products');
      } else {
        setError('Invalid email or password');
      }
    } else {
      const success = register(name, email, password);
      if (success) {
        navigate('/products');
      } else {
        setError('An account with this email already exists');
      }
    }

    setLoading(false);
  };

  return (
    <div className="signin-page">
      <div className="signin-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
      </div>

      <div className="signin-card">
        <div className="signin-header">
          <span className="signin-logo">🛍️</span>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to your account to continue' : 'Join ShopVerse and start shopping'}</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Krishu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="signin-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
