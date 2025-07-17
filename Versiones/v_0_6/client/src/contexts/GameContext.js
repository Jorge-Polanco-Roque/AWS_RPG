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
  
  // Development mode for testing
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const testModeEnabled = localStorage.getItem('test_mode_enabled') === 'true';
  
  // Mock questions for testing
  const mockQuestions = [
    {
      id: 'test-q1',
      question: 'What is the primary benefit of using AWS Lambda?',
      options: [
        'Serverless computing with automatic scaling',
        'Fixed server capacity',
        'Manual server management',
        'Physical server access'
      ],
      correctAnswer: 0,
      explanation: 'AWS Lambda provides serverless computing with automatic scaling, eliminating the need for server management.',
      cyberpunkContext: {
        aiName: 'LAMBDA-CORE',
        aiEmoji: '⚡',
        description: 'Serverless Processing Entity',
        neuralPrompt: 'The Lambda-Core entity pulses with raw computational power, its serverless tendrils reaching across the digital void...'
      }
    },
    {
      id: 'test-q2',
      question: 'Which AWS service is best for storing static web content?',
      options: [
        'EC2',
        'S3',
        'RDS',
        'Lambda'
      ],
      correctAnswer: 1,
      explanation: 'Amazon S3 is designed for storing and retrieving any amount of data, making it perfect for static web content.',
      cyberpunkContext: {
        aiName: 'S3-VAULT',
        aiEmoji: '🗄️',
        description: 'Data Storage Nexus',
        neuralPrompt: 'The S3-Vault materializes from the data streams, its infinite storage capacity echoing through cyberspace...'
      }
    }
  ];

  const startGameSession = async (domain = 'all') => {
    try {
      setLoading(true);
      
      // Use mock data in test mode
      if (isLocalhost && testModeEnabled) {
        const mockSessionId = 'test-session-' + Date.now();
        setCurrentSession({
          id: mockSessionId,
          domain,
          questionsAnswered: 0,
          correctAnswers: 0,
          startTime: new Date(),
        });
        setGameState('playing');
        setQuestionHistory([]);
        
        toast.success('Neural interface activated! Test mode enabled.', {
          icon: '🤖',
          duration: 4000,
        });
        
        // Fetch first question
        await fetchNextQuestion(mockSessionId);
        
        return { success: true, sessionId: mockSessionId };
      }
      
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
      
      // Use mock data in test mode
      if (isLocalhost && testModeEnabled) {
        const currentQuestionIndex = questionHistory.length;
        const question = mockQuestions[currentQuestionIndex % mockQuestions.length];
        
        setCurrentQuestion({
          ...question,
          startTime: new Date(),
        });
        
        // Set timer for question (2 minutes per question like real exam)
        setTimeRemaining(120);
        
        return { success: true, question };
      }
      
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
      
      // Use mock data in test mode
      if (isLocalhost && testModeEnabled) {
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        const result = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          selectedAnswer,
          correct,
          explanation: currentQuestion.explanation,
          timeTaken,
          aiResponse: correct ? 'Excellent! Your neural pathways are functioning optimally.' : 'Incorrect. Recalibrating neural matrix...',
        };
        
        // Update question history
        setQuestionHistory(prev => [...prev, result]);
        
        // Update session stats
        setCurrentSession(prev => ({
          ...prev,
          questionsAnswered: prev.questionsAnswered + 1,
          correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        }));
        
        // Show response
        const toastType = correct ? 'success' : 'error';
        const toastIcon = correct ? '✨' : '💀';
        
        toast[toastType](result.aiResponse, {
          icon: toastIcon,
          duration: 4000,
        });
        
        return { success: true, result };
      }
      
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