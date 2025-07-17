import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { updateUserStats } = useAuth();
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, ended
  const [questionHistory, setQuestionHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);

  const startGameSession = async (domain = 'all') => {
    try {
      setLoading(true);
      const response = await axios.post('/api/game/start-session', { domain });
      
      if (response.data.success) {
        setCurrentSession({
          id: response.data.sessionId,
          domain,
          questionsAnswered: 0,
          correctAnswers: 0,
          startTime: new Date(),
        });
        setGameState('playing');
        setQuestionHistory([]);
        
        toast.success(response.data.message, {
          icon: '🌌',
          duration: 4000,
        });
        
        // Fetch first question
        await fetchNextQuestion(response.data.sessionId);
        
        return { success: true, sessionId: response.data.sessionId };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to start game session';
      toast.error(`The ritual failed to begin: ${message}`, {
        icon: '💀',
        duration: 4000,
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async (sessionId, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/game/question/${sessionId}?${params}`);
      
      if (response.data.success) {
        setCurrentQuestion({
          ...response.data.question,
          cosmicContext: response.data.cosmicContext,
          startTime: new Date(),
        });
        
        // Set timer for question (2 minutes per question like real exam)
        setTimeRemaining(120);
        
        return { success: true, question: response.data.question };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch question';
      toast.error(`The cosmic knowledge eludes us: ${message}`, {
        icon: '🌀',
        duration: 4000,
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (selectedAnswer) => {
    if (!currentSession || !currentQuestion) return;
    
    try {
      setLoading(true);
      const timeTaken = Math.floor((new Date() - currentQuestion.startTime) / 1000);
      
      const response = await axios.post('/api/game/answer', {
        sessionId: currentSession.id,
        questionId: currentQuestion.id,
        selectedAnswer,
        timeTaken,
      });
      
      if (response.data.success) {
        const result = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          selectedAnswer,
          correct: response.data.correct,
          explanation: response.data.explanation,
          timeTaken,
          cosmicResponse: response.data.cosmicResponse,
        };
        
        // Update question history
        setQuestionHistory(prev => [...prev, result]);
        
        // Update session stats
        setCurrentSession(prev => ({
          ...prev,
          questionsAnswered: prev.questionsAnswered + 1,
          correctAnswers: prev.correctAnswers + (response.data.correct ? 1 : 0),
        }));
        
        // Update user stats
        updateUserStats({
          sanityLevel: (prev) => prev + response.data.sanityChange,
          knowledgeShards: (prev) => prev + response.data.shardsChange,
        });
        
        // Show cosmic response
        const toastType = response.data.correct ? 'success' : 'error';
        const toastIcon = response.data.correct ? '✨' : '💀';
        
        toast[toastType](response.data.cosmicResponse, {
          icon: toastIcon,
          duration: 4000,
        });
        
        return { success: true, result };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to submit answer';
      toast.error(`The cosmic judgment failed: ${message}`, {
        icon: '💀',
        duration: 4000,
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const endGameSession = useCallback(() => {
    if (currentSession) {
      const endTime = new Date();
      const duration = Math.floor((endTime - currentSession.startTime) / 1000);
      
      setCurrentSession(prev => ({
        ...prev,
        endTime,
        duration,
      }));
      
      setGameState('ended');
      setCurrentQuestion(null);
      setTimeRemaining(null);
      
      const accuracy = currentSession.questionsAnswered > 0 
        ? (currentSession.correctAnswers / currentSession.questionsAnswered * 100).toFixed(1)
        : 0;
      
      toast.success(`Ritual complete! Accuracy: ${accuracy}%`, {
        icon: '🌟',
        duration: 5000,
      });
    }
  }, [currentSession]);

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const resetGame = () => {
    setCurrentSession(null);
    setCurrentQuestion(null);
    setGameState('idle');
    setQuestionHistory([]);
    setTimeRemaining(null);
  };

  const getGameStats = () => {
    if (!currentSession) return null;
    
    const accuracy = currentSession.questionsAnswered > 0 
      ? (currentSession.correctAnswers / currentSession.questionsAnswered * 100).toFixed(1)
      : 0;
    
    return {
      questionsAnswered: currentSession.questionsAnswered,
      correctAnswers: currentSession.correctAnswers,
      accuracy,
      duration: currentSession.duration,
      domain: currentSession.domain,
    };
  };

  const value = {
    currentSession,
    currentQuestion,
    gameState,
    questionHistory,
    timeRemaining,
    loading,
    startGameSession,
    fetchNextQuestion,
    submitAnswer,
    endGameSession,
    pauseGame,
    resumeGame,
    resetGame,
    getGameStats,
    setTimeRemaining,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};