import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import axiosRaw from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Check if API is available, otherwise use saved user
          try {
            const response = await axios.get('/user');
            setUser(response.data);
            setIsAuthenticated(true);
          } catch (apiErr) {
            console.warn('Could not verify with API, using stored credentials');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
              setIsAuthenticated(true);
            } else {
              throw apiErr; // No saved user to fall back on
            }
          }
        } else if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear any invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthStatus();
  }, []);

  const login = async (phone, password, remember = false) => {
    try {
      setError(null);
      await axiosRaw.get('http://192.168.0.158:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
      
      const response = await axios.post('/login', {
        phone,
        password,
        remember
      });

      // Store user data
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Store token if present in response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setIsAuthenticated(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      // Get CSRF cookie for Laravel Sanctum
      await axiosRaw.get('http://192.168.0.158:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
      
      const response = await axios.post('/register', userData);

      // Store user data
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Store token if present in response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setIsAuthenticated(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated) {
        await axios.post('/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user data regardless of server response
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}