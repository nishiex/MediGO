import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state from localStorage
    try {
      const storedUser = localStorage.getItem('medigo_user');
      const token = localStorage.getItem('medigo_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading stored auth:', e);
      localStorage.removeItem('medigo_user');
      localStorage.removeItem('medigo_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
    return res;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('medigo_user', JSON.stringify(updated));
  };

  // Quick switch for demo testing
  const switchDemoRole = (role) => {
    let mockAccount = null;
    if (role === 'user') {
      mockAccount = {
        id: 'u1',
        name: 'Sairaj Rawool',
        email: 'user@medigo.com',
        role: 'user',
        phone: '+91 98765 43210',
        address: '14/B Green Park, Mumbai'
      };
    } else if (role === 'pharmacy') {
      mockAccount = {
        id: 'u2',
        name: 'Apollo Pharmacy Bandra',
        email: 'pharmacy@medigo.com',
        role: 'pharmacy',
        pharmacyId: 'p1',
        pharmacyName: 'Apollo 24/7 Pharmacy',
        phone: '+91 22 2640 1234',
        address: 'Hill Road, Bandra West, Mumbai'
      };
    } else if (role === 'admin') {
      mockAccount = {
        id: 'u3',
        name: 'MediGo Central Admin',
        email: 'admin@medigo.com',
        role: 'admin',
        phone: '+91 11 4000 9999'
      };
    }

    if (mockAccount) {
      localStorage.setItem('medigo_token', `demo-jwt-token-${mockAccount.role}`);
      localStorage.setItem('medigo_user', JSON.stringify(mockAccount));
      setUser(mockAccount);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || 'guest',
    login,
    register,
    logout,
    updateUser,
    switchDemoRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
