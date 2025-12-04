import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    // Backend returns { success, message, data: { user, token } }
    const { user, token } = response.data;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return response.data;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Backend returns { success, message, data: { user, token } }
    const { user, token } = response.data;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};