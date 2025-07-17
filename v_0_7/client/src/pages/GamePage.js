import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import EntityPortrait from '../components/EntityPortrait';
import CombatArena from '../components/CombatArena';
import SkillBar from '../components/SkillBar';
import BossManager from '../components/BossManager';
import toast from 'react-hot-toast';

const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playSound } = useSound();
  const { user } = useAuth();
  const {
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
    resetGame,
    getGameStats,
    setTimeRemaining,
    saveProgress,
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  
  // Sistema de combate
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [maxPlayerHP, setMaxPlayerHP] = useState(100);
  const [maxEnemyHP, setMaxEnemyHP] = useState(100);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [combatAction, setCombatAction] = useState(null);
  
  // Sistema de habilidades
  const [activeSkills, setActiveSkills] = useState([]);
  const [skillEffects, setSkillEffects] = useState([]);
  
  // Sistema de jefes
  const [currentBoss, setCurrentBoss] = useState(null);
  const [bossHP, setBossHP] = useState(0);
  const [maxBossHP, setMaxBossHP] = useState(0);
  const [isBossFight, setIsBossFight] = useState(false);
  const [bossesDefeated, setBossesDefeated] = useState(0);

  const searchParams = new URLSearchParams(location.search);
  const componentFilter = searchParams.get('component');

  // Definiciones de personajes y enemigos
  const playerCharacter = {
    name: "NEXUS-7",
    emoji: "🤖",
    description: "Advanced AI architect"
  };

  const enemyTypes = [
    { name: "VIRUS-X", emoji: "👾", hp: 80, description: "Malware entity" },
    { name: "FIREWALL-9", emoji: "🔥", hp: 120, description: "Security barrier" },
    { name: "CRYPTO-GHOST", emoji: "👻", hp: 90, description: "Encryption phantom" },
    { name: "DATA-WORM", emoji: "🐛", hp: 70, description: "Database parasite" },
    { name: "CYBER-SPIDER", emoji: "🕷️", hp: 100, description: "Network crawler" },
    { name: "QUANTUM-BEAST", emoji: "⚡", hp: 150, description: "Processing monster" },
    { name: "SHADOW-PROTOCOL", emoji: "🌑", hp: 110, description: "Dark algorithm" },
    { name: "NEON-SENTINEL", emoji: "🔴", hp: 95, description: "Guardian program" }
  ];

  // Habilidades del jugador
  const playerSkills = [
    {
      id: 'neural_strike',
      name: 'NEURAL STRIKE',
      description: 'Double damage next attack',
      icon: '⚡',
      type: 'attack',
      cooldown: 8,
      effect: 'double_damage'
    },
    {
      id: 'data_shield',
      name: 'DATA SHIELD',
      description: 'Reduce incoming damage',
      icon: '🛡️',
      type: 'defense',
      cooldown: 12,
      effect: 'damage_reduction'
    },
    {
      id: 'system_restore',
      name: 'SYSTEM RESTORE',
      description: 'Restore 30 HP',
      icon: '💚',
      type: 'support',
      cooldown: 15,
      effect: 'heal'
    },
    {
      id: 'neural_override',
      name: 'NEURAL OVERRIDE',
      description: 'Massive damage attack',
      icon: '💥',
      type: 'ultimate',
      cooldown: 20,
      effect: 'ultimate_damage'
    }
  ];

  // Jefes
  const bossTypes = [
    {
      id: 'aws_overlord',
      name: 'AWS OVERLORD',
      title: 'Master of the Cloud',
      emoji: '👑',
      hp: 300,
      description: 'The supreme ruler of all AWS services',
      type: 'aws_overlord',
      abilities: [
        { name: 'Service Integration', icon: '🔗' },
        { name: 'Auto Scaling', icon: '📈' },
        { name: 'Global Infrastructure', icon: '🌍' },
        { name: 'Infinite Resources', icon: '♾️' }
      ]
    },
    {
      id: 'lambda_lord',
      name: 'LAMBDA LORD',
      title: 'Serverless Tyrant',
      emoji: '⚡',
      hp: 250,
      description: 'Controller of all serverless functions',
      type: 'lambda_lord',
      abilities: [
        { name: 'Function Invocation', icon: '🔄' },
        { name: 'Event Triggers', icon: '⚡' },
        { name: 'Memory Allocation', icon: '🧠' },
        { name: 'Timeout Control', icon: '⏰' }
      ]
    },
    {
      id: 'ec2_emperor',
      name: 'EC2 EMPEROR',
      title: 'Instance Overlord',
      emoji: '🏰',
      hp: 350,
      description: 'Master of all compute instances',
      type: 'ec2_emperor',
      abilities: [
        { name: 'Instance Launch', icon: '🚀' },
        { name: 'Load Balancing', icon: '⚖️' },
        { name: 'Auto Scaling', icon: '📊' },
        { name: 'Spot Instances', icon: '💸' }
      ]
    },
    {
      id: 's3_sovereign',
      name: 'S3 SOVEREIGN',
      title: 'Storage Supreme',
      emoji: '🗄️',
      hp: 280,
      description: 'Ruler of all object storage',
      type: 's3_sovereign',
      abilities: [
        { name: 'Bucket Management', icon: '🪣' },
        { name: 'Versioning', icon: '📚' },
        { name: 'Lifecycle Policies', icon: '🔄' },
        { name: 'Cross-Region Replication', icon: '🌐' }
      ]
    }
  ];

  useEffect(() => {
    if (gameState === 'idle' && user && !currentSession) {
      handleStartGame();
    }
  }, [gameState, user, currentSession]);

  useEffect(() => {
    // Generar primer enemigo cuando comience el juego
    if (gameState === 'playing' && !currentEnemy && !isBossFight) {
      generateRandomEnemy();
    }
  }, [gameState, currentEnemy, isBossFight]);

  useEffect(() => {
    // Inicializar habilidades del jugador
    if (gameState === 'playing' && activeSkills.length === 0) {
      setActiveSkills(playerSkills);
    }
  }, [gameState, activeSkills, playerSkills]);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitAnswer(null);
    }
    return () => clearInterval(interval);
  }, [gameState, timeRemaining]);

  const handleStartGame = async () => {
    playSound('button');
    setHasError(false);
    const result = await startGameSession(componentFilter || 'all');
    if (!result.success) {
      setHasError(true);
    }
  };

  const handleSubmitAnswer = async (answer) => {
    if (loading || selectedAnswer !== null) return;
    
    playSound('button');
    setSelectedAnswer(answer);
    setHasError(false);
    
    const result = await submitAnswer(answer);
    if (result.success) {
      setLastResult(result.result);
      setShowExplanation(true);
      
      // Calculate XP and handle streaks
      if (result.result.correct) {
        const baseXP = 10;
        const streakBonus = streakCount * 2;
        const timeBonus = timeRemaining > 60 ? 5 : 0;
        const totalXP = (baseXP + streakBonus + timeBonus) * comboMultiplier;
        
        setXpGained(totalXP);
        setStreakCount(prev => prev + 1);
        
        if (streakCount > 0 && streakCount % 5 === 0) {
          setComboMultiplier(prev => Math.min(prev + 0.5, 3));
        }
        
        // Level up check (mock)
        if (totalXP > 50) {
          setLevelUpAnimation(true);
          setTimeout(() => setLevelUpAnimation(false), 3000);
        }

        // Combate: Jugador ataca
        handleCombatDamage(true);
      } else {
        setStreakCount(0);
        setComboMultiplier(1);
        setXpGained(0);
        
        // Combate: Enemigo ataca
        handleCombatDamage(false);
      }
      
      setTimeout(() => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        setLastResult(null);
        setXpGained(0);
        
        if (currentSession?.questionsAnswered < 65) {
          fetchNextQuestion(currentSession.id, componentFilter ? { category: componentFilter } : {});
        } else {
          endGameSession();
        }
      }, 5000);
    } else {
      setHasError(true);
      setSelectedAnswer(null);
    }
  };

  const handleSaveGame = async () => {
    if (currentSession && currentQuestion) {
      // Save session data locally for quick resume
      const sessionData = {
        session: currentSession,
        question: currentQuestion,
        questionHistory,
        timeRemaining,
        component: componentFilter,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem('neuroArchitectSave', JSON.stringify(sessionData));
      
      // Save progress to backend if user is authenticated
      if (playerProgress) {
        const gameStats = getGameStats();
        const progressData = {
          ...playerProgress,
          totalQuestions: gameStats?.questionsAnswered || playerProgress.totalQuestions,
          correctAnswers: gameStats?.correctAnswers || playerProgress.correctAnswers,
          lastSaveTimestamp: new Date().toISOString(),
          currentSession: {
            domain: currentSession.domain,
            questionsAnswered: currentSession.questionsAnswered,
            correctAnswers: currentSession.correctAnswers,
            startTime: currentSession.startTime
          }
        };
        
        await saveProgress(progressData);
      }
      
      playSound('button');
    }
  };

  const handleReturnToMenu = () => {
    playSound('button');
    if (currentSession && gameState === 'playing') {
      const confirmLeave = window.confirm('Are you sure you want to disconnect from the neural matrix? Progress will be lost unless saved.');
      if (!confirmLeave) return;
    }
    
    resetGame();
    navigate('/');
  };

  const handleRetryAfterError = () => {
    setHasError(false);
    setSelectedAnswer(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Funciones de combate
  const generateRandomEnemy = () => {
    const randomEnemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemy = { ...randomEnemy };
    setCurrentEnemy(enemy);
    setEnemyHP(enemy.hp);
    setMaxEnemyHP(enemy.hp);
    return enemy;
  };

  const handleCombatDamage = (isPlayerCorrect) => {
    if (isPlayerCorrect) {
      // Verificar si hay bonus de doble daño
      const hasDoubleAttack = skillEffects.some(effect => effect.effect === 'double_damage');
      
      // Calcular daño base
      let damage = Math.floor(Math.random() * 25) + 15; // 15-40 damage
      if (hasDoubleAttack) {
        damage *= 2;
        // Remover efecto de doble daño
        setSkillEffects(prev => prev.filter(effect => effect.effect !== 'double_damage'));
      }
      
      if (isBossFight) {
        // Ataque contra jefe
        const newBossHP = Math.max(0, bossHP - damage);
        setBossHP(newBossHP);
        
        setCombatAction({
          type: 'player_attack',
          damage: damage,
          bossHP: newBossHP
        });

        // Si el jefe es derrotado
        if (newBossHP <= 0) {
          setTimeout(() => {
            handleBossDefeat();
          }, 2500);
        }
      } else {
        // Ataque contra enemigo normal
        const newEnemyHP = Math.max(0, enemyHP - damage);
        setEnemyHP(newEnemyHP);
        
        setCombatAction({
          type: 'player_attack',
          damage: damage,
          enemyHP: newEnemyHP
        });

        // Si el enemigo es derrotado
        if (newEnemyHP <= 0) {
          setTimeout(() => {
            checkBossSpawn();
            if (!isBossFight) {
              generateRandomEnemy();
            }
          }, 2500);
        }
      }
    } else {
      // Enemigo/Jefe ataca al jugador
      let damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
      
      // Verificar si hay escudo activo
      const hasShield = skillEffects.some(effect => effect.effect === 'damage_reduction');
      if (hasShield) {
        damage = Math.floor(damage * 0.5); // 50% reducción
        // Remover efecto de escudo
        setSkillEffects(prev => prev.filter(effect => effect.effect !== 'damage_reduction'));
      }
      
      const newPlayerHP = Math.max(0, playerHP - damage);
      setPlayerHP(newPlayerHP);
      
      setCombatAction({
        type: 'enemy_attack',
        damage: damage,
        playerHP: newPlayerHP
      });

      // Si el jugador muere, reiniciar combate
      if (newPlayerHP <= 0) {
        setTimeout(() => {
          setPlayerHP(maxPlayerHP);
          if (isBossFight) {
            setIsBossFight(false);
            setCurrentBoss(null);
          }
          generateRandomEnemy();
        }, 3000);
      }
    }

    // Limpiar acción de combate después de un tiempo
    setTimeout(() => {
      setCombatAction(null);
    }, 2000);
  };

  const handleCombatComplete = (result) => {
    if (result === 'victory') {
      // Bonus XP por derrotar enemigo
      setXpGained(prev => prev + 25);
    } else if (result === 'defeat') {
      // Penalty por perder
      setStreakCount(0);
      setComboMultiplier(1);
    }
  };

  // Funciones de habilidades
  const handleSkillUse = (skill) => {
    setSkillEffects(prev => [...prev, skill]);
    
    // Aplicar efecto inmediatamente
    switch (skill.effect) {
      case 'heal':
        setPlayerHP(prev => Math.min(maxPlayerHP, prev + 30));
        break;
      case 'double_damage':
        // Se aplica en el próximo ataque
        break;
      case 'damage_reduction':
        // Se aplica en el próximo ataque recibido
        break;
      case 'ultimate_damage':
        // Daño masivo inmediato
        if (isBossFight) {
          const damage = Math.floor(Math.random() * 60) + 40; // 40-100 damage
          setBossHP(prev => Math.max(0, prev - damage));
        } else {
          const damage = Math.floor(Math.random() * 50) + 35; // 35-85 damage
          setEnemyHP(prev => Math.max(0, prev - damage));
        }
        break;
    }
    
    // Remover efecto después de un tiempo
    setTimeout(() => {
      setSkillEffects(prev => prev.filter(s => s.id !== skill.id));
    }, 10000);
  };

  // Funciones de jefes
  const spawnBoss = () => {
    const boss = bossTypes[bossesDefeated % bossTypes.length];
    setCurrentBoss(boss);
    setBossHP(boss.hp);
    setMaxBossHP(boss.hp);
    setIsBossFight(true);
    setCurrentEnemy(null); // Limpiar enemigo normal
  };

  const handleBossAttack = (attack) => {
    // El jefe ataca al jugador
    let damage = attack.damage;
    
    // Verificar si hay escudo activo
    const hasShield = skillEffects.some(effect => effect.effect === 'damage_reduction');
    if (hasShield) {
      damage = Math.floor(damage * 0.5); // 50% reducción
    }
    
    setPlayerHP(prev => Math.max(0, prev - damage));
    
    // Aplicar efectos especiales del ataque
    switch (attack.effect) {
      case 'Slow down timer':
        setTimeRemaining(prev => Math.max(0, prev - 10));
        break;
      case 'Disable one skill':
        // Implementar desactivación de habilidad
        break;
      case 'Reduce XP gain':
        setComboMultiplier(prev => Math.max(0.5, prev - 0.5));
        break;
    }
  };

  const handleBossDefeat = () => {
    setBossesDefeated(prev => prev + 1);
    setIsBossFight(false);
    setCurrentBoss(null);
    setXpGained(prev => prev + 100); // Gran bonus por derrotar jefe
    
    // Generar nuevo enemigo normal
    setTimeout(() => {
      generateRandomEnemy();
    }, 2000);
  };

  // Modificar el sistema de combate para incluir jefes
  const checkBossSpawn = () => {
    // Spawn boss cada 10 enemigos derrotados
    if (currentSession && currentSession.correctAnswers > 0 && 
        currentSession.correctAnswers % 10 === 0 && !isBossFight) {
      spawnBoss();
    }
  };

  if (gameState === 'idle' || loading) {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GameCard className="cyberpunk-card">
            <Title className="cyberpunk-title">NEURAL MATRIX INITIALIZING</Title>
            <Subtitle>Uploading training protocols...</Subtitle>
            <LoadingSpinner>
              <div className="spinner"></div>
            </LoadingSpinner>
          </GameCard>
        </motion.div>
      </GameContainer>
    );
  }

  if (gameState === 'ended') {
    const stats = getGameStats();
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GameCard className="cyberpunk-card">
            <Title className="cyberpunk-title">TRAINING PROTOCOL COMPLETE</Title>
            <Subtitle>Neural pathway enhancement achieved! Analysis:</Subtitle>
            
            <StatsContainer>
              <StatItem>
                <StatLabel>Questions Answered:</StatLabel>
                <StatValue>{stats.questionsAnswered}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Correct Answers:</StatLabel>
                <StatValue>{stats.correctAnswers}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Accuracy:</StatLabel>
                <StatValue>{stats.accuracy}%</StatValue>
              </StatItem>
            </StatsContainer>
            
            <ButtonContainer>
              <ActionButton onClick={handleReturnToMenu}>
                Return to Main Menu
              </ActionButton>
              <ActionButton onClick={handleStartGame}>
                Start New Session
              </ActionButton>
            </ButtonContainer>
          </GameCard>
        </motion.div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <GameControls>
          <SaveButton onClick={handleSaveGame}>
            💾 Save Game
          </SaveButton>
          <MenuButton onClick={handleReturnToMenu}>
            🏠 Return to Menu
          </MenuButton>
        </GameControls>
        
        <GameInfo>
          <InfoItem>
            <InfoLabel>Question:</InfoLabel>
            <InfoValue>{currentSession?.questionsAnswered + 1}/65</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Time:</InfoLabel>
            <InfoValue>{formatTime(timeRemaining)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Accuracy:</InfoLabel>
            <InfoValue>
              {currentSession?.questionsAnswered > 0 
                ? ((currentSession.correctAnswers / currentSession.questionsAnswered) * 100).toFixed(1)
                : 0}%
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Streak:</InfoLabel>
            <InfoValue>
              {streakCount}x {comboMultiplier > 1 && `(${comboMultiplier}x boost)`}
            </InfoValue>
          </InfoItem>
        </GameInfo>
      </GameHeader>

      {/* Boss Manager */}
      {gameState === 'playing' && isBossFight && currentBoss && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BossManager
            currentBoss={currentBoss}
            bossHP={bossHP}
            maxBossHP={maxBossHP}
            onBossDefeat={handleBossDefeat}
            onBossAttack={handleBossAttack}
            questionCount={currentSession?.questionsAnswered || 0}
          />
        </motion.div>
      )}

      {/* Arena de Combate */}
      {gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CombatArena
            playerCharacter={playerCharacter}
            enemyCharacter={isBossFight ? currentBoss : currentEnemy}
            playerHP={playerHP}
            enemyHP={isBossFight ? bossHP : enemyHP}
            maxPlayerHP={maxPlayerHP}
            maxEnemyHP={isBossFight ? maxBossHP : maxEnemyHP}
            combatAction={combatAction}
            onCombatComplete={handleCombatComplete}
          />
        </motion.div>
      )}

      {/* Barra de Habilidades */}
      {gameState === 'playing' && activeSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SkillBar
            skills={activeSkills}
            onSkillUse={handleSkillUse}
            disabled={loading || selectedAnswer !== null}
          />
        </motion.div>
      )}

      {currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <QuestionCard className="cyberpunk-card">
            {currentQuestion.cyberpunkContext && (
              <EntitySection>
                <EntityPortrait 
                  entity={{
                    name: currentQuestion.cyberpunkContext.aiName,
                    emoji: currentQuestion.cyberpunkContext.aiEmoji || "🤖",
                    description: currentQuestion.cyberpunkContext.description
                  }}
                  size="medium"
                />
                <EntityFlavor>
                  {currentQuestion.cyberpunkContext.neuralPrompt}
                </EntityFlavor>
              </EntitySection>
            )}
            
            <QuestionText>{currentQuestion.question}</QuestionText>
            
            <OptionsContainer>
              {currentQuestion.options.map((option, index) => (
                <OptionButton
                  key={index}
                  onClick={() => !hasError && handleSubmitAnswer(index)}
                  disabled={loading || selectedAnswer !== null}
                  selected={selectedAnswer === index}
                  className={selectedAnswer === index ? 'selected' : ''}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </OptionButton>
              ))}
            </OptionsContainer>

            {hasError && (
              <ErrorContainer>
                <ErrorMessage>
                  Neural interference detected. Recalibrate your selection.
                </ErrorMessage>
                <RetryButton onClick={handleRetryAfterError}>
                  RETRY NEURAL LINK
                </RetryButton>
              </ErrorContainer>
            )}
          </QuestionCard>
        </motion.div>
      )}

      {levelUpAnimation && (
        <LevelUpOverlay
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.8 }}
        >
          <LevelUpText>⚡ NEURAL UPGRADE ACHIEVED! ⚡</LevelUpText>
          <LevelUpSubtext>Neural pathways enhanced</LevelUpSubtext>
        </LevelUpOverlay>
      )}
      
      {showExplanation && lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ExplanationCard className="cyberpunk-card">
            <ExplanationHeader correct={lastResult.correct}>
              {lastResult.correct ? '⚡ NEURAL SYNC COMPLETE!' : '🔴 NEURAL DESYNC'}
            </ExplanationHeader>
            
            {lastResult.correct && xpGained > 0 && (
              <XPGainContainer>
                <XPText>+{xpGained} XP</XPText>
                {streakCount > 1 && <StreakText>🔥 {streakCount} streak!</StreakText>}
                {comboMultiplier > 1 && <ComboText>💥 {comboMultiplier}x multiplier!</ComboText>}
              </XPGainContainer>
            )}
            
            <ExplanationText>
              {lastResult.explanation}
            </ExplanationText>
            {lastResult.aiResponse && (
              <AIResponse>
                {lastResult.aiResponse}
              </AIResponse>
            )}
          </ExplanationCard>
        </motion.div>
      )}
    </GameContainer>
  );
};

const GameContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const GameControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.info}, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const MenuButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.error}, #DC2626);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const GameInfo = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const GameCard = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
`;

const QuestionCard = styled.div`
  margin-bottom: 2rem;
  text-align: left;
`;

const EntitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundDark};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.secondary};
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const EntityFlavor = styled.p`
  color: ${props => props.theme.colors.accent};
  font-style: italic;
  font-size: 0.9rem;
  margin: 0;
`;

const QuestionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button`
  background: ${props => props.selected 
    ? `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`
    : `linear-gradient(135deg, ${props.theme.colors.backgroundMedium}, ${props.theme.colors.surface})`
  };
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.selected 
    ? props.theme.colors.primary 
    : props.theme.colors.accent
  };
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(116, 0, 184, 0.3);
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  border-radius: 8px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: white;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const RetryButton = styled.button`
  background: white;
  color: #FF6B6B;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
  }
`;

const ExplanationCard = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const ExplanationHeader = styled.h3`
  color: ${props => props.correct ? '#00ff88' : '#ff0066'};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ExplanationText = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const AIResponse = styled.p`
  color: ${props => props.theme.colors.accent};
  font-style: italic;
  font-size: 0.9rem;
  margin: 0;
  border-left: 3px solid ${props => props.theme.colors.primary};
  padding-left: 1rem;
  background: rgba(0, 255, 255, 0.05);
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundMedium};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.accent};
`;

const StatLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const StatValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(116, 0, 184, 0.3);
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${props => props.theme.colors.backgroundMedium};
    border-top: 3px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const XPGainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 0, 0.1));
  border: 2px solid ${props => props.theme.colors.accent};
  border-radius: 12px;
  animation: neonPulse 2s ease-in-out infinite;
`;

const XPText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accent};
  font-family: ${props => props.theme.fonts.display};
  text-shadow: 0 0 10px ${props => props.theme.colors.accent};
`;

const StreakText = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.warning};
  font-family: ${props => props.theme.fonts.cyber};
  margin-top: 0.5rem;
`;

const ComboText = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.fonts.cyber};
  margin-top: 0.25rem;
`;

const LevelUpOverlay = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.9), rgba(0, 255, 0, 0.9));
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  border: 3px solid ${props => props.theme.colors.primary};
  box-shadow: 0 0 50px ${props => props.theme.colors.primary};
`;

const LevelUpText = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  font-family: ${props => props.theme.fonts.display};
  margin-bottom: 1rem;
  animation: pulse 1s ease-in-out infinite;
`;

const LevelUpSubtext = styled.div`
  font-size: 1.2rem;
  color: #000;
  font-family: ${props => props.theme.fonts.cyber};
`;

export default GamePage;