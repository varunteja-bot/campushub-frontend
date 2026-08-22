import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(
          name,
          email,
          password,
          rollNo,
          department,
          semester
        );
      }
    } catch (err) {
      setError(
        err.message ||
        (mode === 'login'
          ? 'Login failed. Please check your credentials.'
          : 'Sign up failed. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.johnson@campushub.edu');
    setPassword('password123');
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background:
          'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 40%), var(--bg-primary)'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            className="brand-icon"
            style={{
              margin: '0 auto 1rem auto',
              width: '56px',
              height: '56px'
            }}
          >
            <GraduationCap size={32} />
          </div>

          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)'
            }}
          >
            Welcome to{' '}
            <span
              style={{
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              CampusHub
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginTop: '0.35rem'
            }}
          >
            {mode === 'login'
              ? 'Sign in with your student portal credentials'
              : 'Create your new student account'}
          </p>
        </div>

        {/* Login / Signup Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            onClick={() => switchMode('login')}
            style={{
              flex: 1,
              padding: '0.7rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              background:
                mode === 'login'
                  ? 'var(--grad-primary)'
                  : 'rgba(255,255,255,0.06)',
              color: '#fff'
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => switchMode('signup')}
            style={{
              flex: 1,
              padding: '0.7rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              background:
                mode === 'signup'
                  ? 'var(--grad-primary)'
                  : 'rgba(255,255,255,0.06)',
              color: '#fff'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Demo button only for login */}
        {mode === 'login' && (
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
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} /> Auto-fill Demo Student Login
          </button>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
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
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Signup-only fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label>Full Name</label>
                <div className="search-box" style={{ width: '100%' }}>
                  <User size={18} color="#9ca3af" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div>
                <label>Roll Number</label>
                <div className="search-box" style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Enter roll number"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label>University Email</label>
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

          {/* Password */}
          <div>
            <label>Password</label>
            <div className="search-box" style={{ width: '100%' }}>
              <Lock size={18} color="#9ca3af" />
              <input
                type="password"
                required
                minLength="6"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Signup extra fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label>Department</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="search-input"
                />
              </div>

              <div>
                <label>Semester</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  placeholder="Example: 6"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="search-input"
                />
              </div>
            </>
          )}

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
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting
              ? mode === 'login'
                ? 'Signing in...'
                : 'Creating account...'
              : mode === 'login'
                ? 'Sign In to Portal'
                : 'Create Account'}{' '}
            <ArrowRight size={18} />
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          CampusHub Portal v3.0 • Secure JWT Authentication
        </div>
      </div>
    </div>
  );
}