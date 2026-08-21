import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.johnson@campushub.edu');
    setPassword('password123');
    setError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 40%), var(--bg-primary)'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem auto', width: '56px', height: '56px' }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Welcome to <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CampusHub</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Sign in with your student portal credentials
          </p>
        </div>

        {/* Demo Credentials Quick Fill Button */}
        <button
          type="button"
          onClick={handleFillDemo}
          style={{
            width: '100%',
            marginBottom: '1.5rem',
            padding: '0.65rem 1rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px dashed var(--accent-indigo)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-indigo-light)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'var(--transition)'
          }}
        >
          <Sparkles size={16} /> Auto-fill Demo Student Login
        </button>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--accent-rose)',
            color: 'var(--accent-rose)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>
              University Email
            </label>
            <div className="search-box" style={{ width: '100%' }}>
              <Mail size={18} color="#9ca3af" />
              <input
                type="email"
                required
                placeholder="student@campushub.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>
              Password
            </label>
            <div className="search-box" style={{ width: '100%' }}>
              <Lock size={18} color="#9ca3af" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              background: 'var(--grad-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-glow)',
              transition: 'var(--transition)'
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In to Portal'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          CampusHub Portal v3.0 • Secure JWT Authentication
        </div>
      </div>
    </div>
  );
}
