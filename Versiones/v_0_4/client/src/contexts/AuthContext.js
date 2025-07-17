import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('cosmic_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Validate token by fetching user stats
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/game/stats');
      if (response.data.success) {
        setUser(prev => prev ? { ...prev, ...response.data.stats } : null);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('cosmic_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Welcome back, ${user.username}! The cosmic entities stir...`, {
          icon: '🌌',
          duration: 4000,
        });
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(`The ritual failed: ${message}`, {
        icon: '💀',
        duration: 4000,
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('cosmic_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Welcome, ${user.username}! Your cosmic journey begins...`, {
          icon: '🌟',
          duration: 4000,
        });
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(`The summoning failed: ${message}`, {
        icon: '💀',
        duration: 4000,
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cosmic_token');
    delete axios.defaults.headers.common['Authorization'];
    
    toast.success('You have returned to the mundane realm...', {
      icon: '🌙',
      duration: 3000,
    });
  };

  const updateUserStats = (newStats) => {
    setUser(prev => prev ? { ...prev, ...newStats } : null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserStats,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};