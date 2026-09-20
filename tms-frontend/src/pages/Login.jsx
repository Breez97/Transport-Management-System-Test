import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTruck, FiLock, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/axios';
import '../styles/forms.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [oauthProviders, setOauthProviders] = useState([]);

  useEffect(() => {
    api.get('/auth/oauth2/providers')
      .then(res => setOauthProviders(res.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
  const backendBase = apiBaseUrl.replace('/api/v1', '');

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <FiTruck className="login-logo" />
          <h1>TMS</h1>
          <p>Transport Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label">Username</label>
            <div className="input-icon-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="form-error-banner">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {oauthProviders.length > 0 && (
          <div className="oauth-section">
            <div className="oauth-divider"><span>or continue with</span></div>
            <div className="oauth-buttons">
              {oauthProviders.map(p => (
                <a key={p.name} href={`${backendBase}${p.url}`} className={`btn btn-oauth btn-oauth-${p.name}`}>
                  {p.name === 'google' && <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
                  {p.name === 'microsoft' && <svg width="18" height="18" viewBox="0 0 23 23"><rect x="1" y="1" width="10" height="10" fill="#f25022"/><rect x="12" y="1" width="10" height="10" fill="#7fba00"/><rect x="1" y="12" width="10" height="10" fill="#00a4ef"/><rect x="12" y="12" width="10" height="10" fill="#ffb900"/></svg>}
                  <span>{p.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Create Account</Link></p>
          <p className="login-demo-hint">Demo: <strong>admin</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

