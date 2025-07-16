import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { GlobalStyles } from './styles/GlobalStyles';
import { cosmicTheme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { SoundProvider } from './contexts/SoundContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import CosmicBackground from './components/CosmicBackground';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={cosmicTheme}>
        <AuthProvider>
          <SoundProvider>
            <GameProvider>
              <Router>
                <GlobalStyles />
                <CosmicBackground />
                <div className="App">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                      path="/game" 
                      element={
                        <ProtectedRoute>
                          <GamePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/leaderboard" 
                      element={
                        <ProtectedRoute>
                          <LeaderboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </div>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: '#1a0d26',
                      color: '#e6d7ff',
                      border: '1px solid #4a0e4e',
                    },
                    success: {
                      iconTheme: {
                        primary: '#00ff88',
                        secondary: '#1a0d26',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ff0066',
                        secondary: '#1a0d26',
                      },
                    },
                  }}
                />
              </Router>
            </GameProvider>
          </SoundProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;