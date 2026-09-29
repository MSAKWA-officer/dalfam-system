import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('dalfam_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('dalfam_token', data.token);
      const userData = { id: data.id, name: data.name, email: data.email, role: data.role };
      localStorage.setItem('dalfam_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', payload);
      // If this was the first-ever user (bootstrap), log them in immediately
      if (data.token) {
        localStorage.setItem('dalfam_token', data.token);
        const userData = { id: data.id, name: data.name, email: data.email, role: data.role };
        localStorage.setItem('dalfam_user', JSON.stringify(userData));
        setUser(userData);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dalfam_token');
    localStorage.removeItem('dalfam_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
