import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;