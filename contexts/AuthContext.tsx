
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '../api-schema';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to fetch user on init:', err);
          // Token might be invalid, clear storage
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: AuthResponse = await authApi.login(email, password);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', data.access);
      storage.setItem('refreshToken', data.refresh);
      
      // If the API returns the full user object, use it. Otherwise fetch it.
      if (data.user) {
        setUser(data.user);
      } else {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      }
      
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
