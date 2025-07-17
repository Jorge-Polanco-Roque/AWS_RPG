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
  const [token, setToken] = useState(localStorage.getItem('neuro_token'));
  
  // Development mode bypass for testing
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const testModeEnabled = localStorage.getItem('test_mode_enabled') === 'true';

  useEffect(() => {
    // Debug logs
    console.log('AuthProvider Debug:', {
      token,
      isLocalhost,
      testModeEnabled,
      nodeEnv: typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown'
    });
    
    // Auto-enable test mode on localhost for easy access (unless there's a real token)
    if (isLocalhost && !token && !testModeEnabled) {
      console.log('Auto-enabling test mode for localhost access');
      localStorage.setItem('test_mode_enabled', 'true');
      const testUser = {
        id: 'test-user-id',
        username: 'TestUser',
        email: 'test@example.com',
        level: 1,
        experience: 0
      };
      setUser(testUser);
      setLoading(false);
      return;
    }
    
    // Enable test mode for automated testing (works in any environment on localhost)
    if (isLocalhost && testModeEnabled && !token) {
      console.log('Test mode enabled, setting test user');
      const testUser = {
        id: 'test-user-id',
        username: 'TestUser',
        email: 'test@example.com',
        level: 1,
        experience: 0
      };
      setUser(testUser);
      setLoading(false);
      return;
    }
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Validate token by fetching user stats
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [token, isLocalhost, testModeEnabled]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/game/stats');
      if (response.data.success) {
        // If we have a valid token response, create a user object
        setUser(response.data.stats || { username: 'User' });
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
      
      if (response.data && response.data.success) {
        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('neuro_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Neural link established, ${user.username}! Welcome back to the matrix...`, {
          icon: '🤖',
          duration: 4000,
        });
        
        return { success: true };
      } else {
        const message = response.data?.error || 'Neural interface authentication failed';
        toast.error(`Neural interface error: ${message}`, {
          icon: '🔴',
          duration: 4000,
        });
        return { success: false, error: message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || error.message || 'Neural interface connection failed';
      toast.error(`Neural interface error: ${message}`, {
        icon: '🔴',
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
      
      if (response.data && response.data.success) {
        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('neuro_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Neural profile created, ${user.username}! Entering the cyber realm...`, {
          icon: '⚡',
          duration: 4000,
        });
        
        return { success: true };
      } else {
        const message = response.data?.error || 'Neural profile creation failed';
        toast.error(`Neural registration failed: ${message}`, {
          icon: '🔴',
          duration: 4000,
        });
        return { success: false, error: message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.error || error.message || 'Neural registration connection failed';
      toast.error(`Neural registration failed: ${message}`, {
        icon: '🔴',
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
    localStorage.removeItem('neuro_token');
    delete axios.defaults.headers.common['Authorization'];
    
    // If on localhost, automatically re-enable test mode after logout
    if (isLocalhost) {
      setTimeout(() => {
        localStorage.setItem('test_mode_enabled', 'true');
        const testUser = {
          id: 'test-user-id',
          username: 'TestUser',
          email: 'test@example.com',
          level: 1,
          experience: 0
        };
        setUser(testUser);
      }, 100);
    }
    
    toast.success('Neural link terminated. Disconnecting from the matrix...', {
      icon: '🔌',
      duration: 3000,
    });
  };

  const updateUserStats = (newStats) => {
    setUser(prev => prev ? { ...prev, ...newStats } : null);
  };

  const enableTestMode = () => {
    if (isLocalhost) {
      localStorage.setItem('test_mode_enabled', 'true');
      const testUser = {
        id: 'test-user-id',
        username: 'TestUser',
        email: 'test@example.com',
        level: 1,
        experience: 0
      };
      setUser(testUser);
    }
  };

  const disableTestMode = () => {
    localStorage.removeItem('test_mode_enabled');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserStats,
    enableTestMode,
    disableTestMode,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};