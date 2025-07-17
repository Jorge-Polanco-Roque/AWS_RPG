import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Check for test mode bypass
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const testModeEnabled = localStorage.getItem('test_mode_enabled') === 'true';

  // Debug logs
  console.log('ProtectedRoute Debug:', {
    isAuthenticated,
    loading,
    isLocalhost,
    testModeEnabled,
    nodeEnv: typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown'
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading-tentacles">
          <div className="tentacle"></div>
          <div className="tentacle"></div>
          <div className="tentacle"></div>
          <div className="tentacle"></div>
          <div className="tentacle"></div>
        </div>
        <p style={{ color: '#00FFFF', marginTop: '1rem' }}>
          Initializing neural interface...
        </p>
      </div>
    );
  }

  // Allow access if authenticated OR in test mode
  const hasAccess = isAuthenticated || (isLocalhost && testModeEnabled);
  
  return hasAccess ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;