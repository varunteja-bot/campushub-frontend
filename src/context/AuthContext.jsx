import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campushub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token)
        .then((data) => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('campushub_token');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('campushub_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };
  const signup = async (name, email, password, rollNo, department, semester, phone, address) => {
    const data = await signupUser(
      name,
      email,
      password,
      rollNo,
      department,
      semester,
      phone,
      address
    );

    localStorage.setItem('campushub_token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };
  const logout = () => {
    localStorage.removeItem('campushub_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
