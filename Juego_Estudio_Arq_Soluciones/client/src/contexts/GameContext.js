import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
  const { updateUserStats, user, isAuthenticated } = useAuth();
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, ended
  const [questionHistory, setQuestionHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(null);
  
  // Development mode for testing
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const testModeEnabled = localStorage.getItem('test_mode_enabled') === 'true';

  const getGameStats = useCallback(() => {
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
  }, [currentSession]);

  // Save progress to backend
  const saveProgress = useCallback(async (progressData = {}) => {
    // Skip saving in test mode
    if (isLocalhost && testModeEnabled) {
      console.log('Test mode: Skipping save to backend');
      return { success: true };
    }

    try {
      const gameStats = getGameStats();
      const dataToSave = {
        level: progressData.level || 1,
        experience: progressData.experience || 0,
        totalScore: progressData.totalScore || 0,
        maxCombo: progressData.maxCombo || 0,
        gamesPlayed: (progressData.gamesPlayed || 0) + 1,
        totalQuestions: gameStats?.questionsAnswered || 0,
        correctAnswers: gameStats?.correctAnswers || 0,
        levelsCompleted: progressData.levelsCompleted || [],
        achievements: progressData.achievements || [],
        specialAbilities: progressData.specialAbilities || {
          fireball: { unlocked: true, level: 1 },
          heal: { unlocked: true, level: 1 },
          shield: { unlocked: false, level: 0 }
        },
        inventory: progressData.inventory || [],
        settings: progressData.settings || { sound: true, music: true, difficulty: 'normal' },
        ...progressData
      };

      const response = await axios.post('/api/game/save-progress', dataToSave);
      
      if (response.data.success) {
        toast.success('Progress saved to neural cloud!', {
          icon: '💾',
          duration: 2000,
        });
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save progress error:', error);
      toast.error('Failed to save progress to neural cloud', {
        icon: '⚠️',
        duration: 3000,
      });
      return { success: false, error: error.message };
    }
  }, [isLocalhost, testModeEnabled, getGameStats]);

  // Load progress from backend
  const loadProgress = useCallback(async () => {
    // Skip loading in test mode
    if (isLocalhost && testModeEnabled) {
      console.log('Test mode: Using local progress');
      return {
        success: true,
        progress: {
          level: 1,
          experience: 0,
          totalScore: 0,
          maxCombo: 0,
          gamesPlayed: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          levelsCompleted: [],
          achievements: [],
          specialAbilities: {
            fireball: { unlocked: true, level: 1 },
            heal: { unlocked: true, level: 1 },
            shield: { unlocked: false, level: 0 }
          },
          inventory: [],
          settings: { sound: true, music: true, difficulty: 'normal' }
        }
      };
    }

    try {
      const response = await axios.get('/api/game/load-progress');
      
      if (response.data.success) {
        toast.success('Progress loaded from neural cloud!', {
          icon: '📥',
          duration: 2000,
        });
        return { success: true, progress: response.data.progress };
      } else {
        throw new Error(response.data.error || 'Load failed');
      }
    } catch (error) {
      console.error('Load progress error:', error);
      // If it's a 404, it means no progress exists yet
      if (error.response?.status === 404) {
        return {
          success: true,
          progress: {
            level: 1,
            experience: 0,
            totalScore: 0,
            maxCombo: 0,
            gamesPlayed: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            levelsCompleted: [],
            achievements: [],
            specialAbilities: {
              fireball: { unlocked: true, level: 1 },
              heal: { unlocked: true, level: 1 },
              shield: { unlocked: false, level: 0 }
            },
            inventory: [],
            settings: { sound: true, music: true, difficulty: 'normal' }
          }
        };
      }
      toast.error('Failed to load progress from neural cloud', {
        icon: '⚠️',
        duration: 3000,
      });
      return { success: false, error: error.message };
    }
  }, [isLocalhost, testModeEnabled]);

  // Load player progress when user authenticates
  useEffect(() => {
    const loadUserProgress = async () => {
      if (isAuthenticated && user && !playerProgress) {
        console.log('Loading user progress for:', user.username);
        const result = await loadProgress();
        if (result.success) {
          setPlayerProgress(result.progress);
        }
      }
    };

    loadUserProgress();
  }, [isAuthenticated, user, playerProgress, loadProgress]);
  
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

  const endGameSession = useCallback(async () => {
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

      // Calculate experience and score
      const experienceGained = currentSession.correctAnswers * 10;
      const scoreGained = Math.floor(currentSession.correctAnswers * 100 * (accuracy / 100));
      
      // Update player progress
      if (playerProgress) {
        const updatedProgress = {
          ...playerProgress,
          experience: playerProgress.experience + experienceGained,
          totalScore: playerProgress.totalScore + scoreGained,
          gamesPlayed: playerProgress.gamesPlayed + 1,
          totalQuestions: playerProgress.totalQuestions + currentSession.questionsAnswered,
          correctAnswers: playerProgress.correctAnswers + currentSession.correctAnswers,
        };
        
        setPlayerProgress(updatedProgress);
        
        // Save to backend
        await saveProgress(updatedProgress);
      }
      
      toast.success(`Training session complete! Accuracy: ${accuracy}%`, {
        icon: '🌟',
        duration: 5000,
      });

      if (experienceGained > 0) {
        toast.success(`+${experienceGained} Neural Experience`, {
          icon: '⚡',
          duration: 3000,
        });
      }
    }
  }, [currentSession, playerProgress, saveProgress]);

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



  const value = {
    currentSession,
    currentQuestion,
    gameState,
    questionHistory,
    timeRemaining,
    loading,
    playerProgress,
    startGameSession,
    fetchNextQuestion,
    submitAnswer,
    endGameSession,
    pauseGame,
    resumeGame,
    resetGame,
    getGameStats,
    setTimeRemaining,
    saveProgress,
    loadProgress,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};