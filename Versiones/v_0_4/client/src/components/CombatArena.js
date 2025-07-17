import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const CombatArena = ({ 
  playerCharacter, 
  enemyCharacter, 
  playerHP, 
  enemyHP, 
  maxPlayerHP, 
  maxEnemyHP,
  combatAction,
  onCombatComplete 
}) => {
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [battlePhase, setBattlePhase] = useState('idle'); // idle, player_attack, enemy_attack, victory, defeat

  useEffect(() => {
    if (combatAction) {
      handleCombatAction(combatAction);
    }
  }, [combatAction]);

  const handleCombatAction = async (action) => {
    if (action.type === 'player_attack') {
      setBattlePhase('player_attack');
      setIsPlayerAttacking(true);
      
      // Mostrar daño después de un delay para sincronizar con animación
      setTimeout(() => {
        if (action.damage > 0) {
          showDamageNumber(action.damage, 'enemy');
        }
        setIsPlayerAttacking(false);
        
        // Verificar si el enemigo fue derrotado
        if (action.enemyHP <= 0) {
          setBattlePhase('victory');
          setTimeout(() => {
            onCombatComplete && onCombatComplete('victory');
          }, 2000);
        } else {
          setBattlePhase('idle');
        }
      }, 800);
      
    } else if (action.type === 'enemy_attack') {
      setBattlePhase('enemy_attack');
      setIsEnemyAttacking(true);
      
      setTimeout(() => {
        if (action.damage > 0) {
          showDamageNumber(action.damage, 'player');
        }
        setIsEnemyAttacking(false);
        
        // Verificar si el jugador fue derrotado
        if (action.playerHP <= 0) {
          setBattlePhase('defeat');
          setTimeout(() => {
            onCombatComplete && onCombatComplete('defeat');
          }, 2000);
        } else {
          setBattlePhase('idle');
        }
      }, 800);
    }
  };

  const showDamageNumber = (damage, target) => {
    const id = Date.now();
    const newDamage = {
      id,
      damage,
      target,
      x: Math.random() * 100 + 50, // Posición aleatoria
      y: Math.random() * 50 + 100
    };
    
    setDamageNumbers(prev => [...prev, newDamage]);
    
    // Remover después de la animación
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 2000);
  };

  const getPlayerHPPercentage = () => (playerHP / maxPlayerHP) * 100;
  const getEnemyHPPercentage = () => (enemyHP / maxEnemyHP) * 100;

  return (
    <ArenaContainer>
      <BattlefieldBackground />
      
      {/* Efectos de fondo según la fase de batalla */}
      {battlePhase === 'player_attack' && <AttackEffect side="left" />}
      {battlePhase === 'enemy_attack' && <AttackEffect side="right" />}
      {battlePhase === 'victory' && <VictoryEffect />}
      {battlePhase === 'defeat' && <DefeatEffect />}
      
      {/* Lado del Jugador */}
      <PlayerSide>
        <CharacterContainer>
          <PlayerCharacter
            animate={isPlayerAttacking ? { x: [0, 30, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.8 }}
          >
            {playerCharacter?.emoji || '🤖'}
          </PlayerCharacter>
          <CharacterName>{playerCharacter?.name || 'NEXUS-7'}</CharacterName>
        </CharacterContainer>
        
        <HPContainer>
          <HPLabel>NEURAL INTEGRITY</HPLabel>
          <HPBarOuter>
            <HPBarInner 
              width={getPlayerHPPercentage()} 
              color="player"
              animate={{ width: `${getPlayerHPPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </HPBarOuter>
          <HPText>{playerHP} / {maxPlayerHP}</HPText>
        </HPContainer>
      </PlayerSide>

      {/* Centro - VS */}
      <CenterArea>
        <VSText>VS</VSText>
        <BattleStatus>
          {battlePhase === 'idle' && '⚡ NEURAL LINK ACTIVE'}
          {battlePhase === 'player_attack' && '💥 EXECUTING PROTOCOL'}
          {battlePhase === 'enemy_attack' && '🔥 UNDER CYBER ATTACK'}
          {battlePhase === 'victory' && '🏆 NEURAL VICTORY'}
          {battlePhase === 'defeat' && '💀 SYSTEM FAILURE'}
        </BattleStatus>
      </CenterArea>

      {/* Lado del Enemigo */}
      <EnemySide>
        <CharacterContainer>
          <EnemyCharacter
            animate={isEnemyAttacking ? { x: [0, -30, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.8 }}
          >
            {enemyCharacter?.emoji || '👾'}
          </EnemyCharacter>
          <CharacterName>{enemyCharacter?.name || 'CYBER-ENTITY'}</CharacterName>
        </CharacterContainer>
        
        <HPContainer>
          <HPLabel>FIREWALL STATUS</HPLabel>
          <HPBarOuter>
            <HPBarInner 
              width={getEnemyHPPercentage()} 
              color="enemy"
              animate={{ width: `${getEnemyHPPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </HPBarOuter>
          <HPText>{enemyHP} / {maxEnemyHP}</HPText>
        </HPContainer>
      </EnemySide>

      {/* Números de daño flotantes */}
      {damageNumbers.map(damage => (
        <DamageNumber
          key={damage.id}
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -50, scale: 1.5 }}
          transition={{ duration: 2 }}
          style={{ 
            left: `${damage.x}%`, 
            top: `${damage.y}px`,
            color: damage.target === 'enemy' ? '#00FF00' : '#FF0040'
          }}
        >
          -{damage.damage}
        </DamageNumber>
      ))}
    </ArenaContainer>
  );
};

// Animaciones
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px currentColor; }
  50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
`;

const dataStream = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`;

const victoryPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const defeatFlicker = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.2; }
`;

// Styled Components
const ArenaContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #0A0A0A, #1A1A2E);
  border: 2px solid #00FFFF;
  border-radius: 16px;
  margin-bottom: 2rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
`;

const BattlefieldBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 50px,
      rgba(0, 255, 255, 0.05) 50px,
      rgba(0, 255, 255, 0.05) 52px
    );
  z-index: 0;
`;

const AttackEffect = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.side === 'left' ? '0' : '50%'};
  width: 50%;
  height: 100%;
  background: ${props => props.side === 'left' 
    ? 'linear-gradient(90deg, rgba(0, 255, 0, 0.3), transparent)'
    : 'linear-gradient(-90deg, rgba(255, 0, 64, 0.3), transparent)'
  };
  z-index: 1;
  animation: ${pulseGlow} 0.8s ease-in-out;
`;

const VictoryEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.4), transparent);
  z-index: 1;
  animation: ${victoryPulse} 1s ease-in-out infinite;
`;

const DefeatEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 0, 64, 0.4), transparent);
  z-index: 1;
  animation: ${defeatFlicker} 0.5s ease-in-out infinite;
`;

const PlayerSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
  flex: 1;
`;

const EnemySide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 2;
  flex: 1;
`;

const CenterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  flex: 0.5;
`;

const CharacterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const PlayerCharacter = styled(motion.div)`
  font-size: 3rem;
  filter: drop-shadow(0 0 10px #00FFFF);
  cursor: default;
`;

const EnemyCharacter = styled(motion.div)`
  font-size: 3rem;
  filter: drop-shadow(0 0 10px #FF00FF);
  cursor: default;
`;

const CharacterName = styled.div`
  color: #00FFFF;
  font-family: ${props => props.theme.fonts.cyber};
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.5rem;
  text-shadow: 0 0 5px currentColor;
`;

const VSText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #FF00FF;
  font-family: ${props => props.theme.fonts.display};
  text-shadow: 0 0 15px #FF00FF;
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

const BattleStatus = styled.div`
  color: #00FF00;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
  text-shadow: 0 0 5px currentColor;
`;

const HPContainer = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HPLabel = styled.div`
  font-size: 0.7rem;
  color: #00FFFF;
  font-family: ${props => props.theme.fonts.mono};
  text-align: center;
`;

const HPBarOuter = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00FFFF;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const HPBarInner = styled(motion.div)`
  height: 100%;
  background: ${props => {
    const percentage = props.width;
    if (props.color === 'player') {
      return percentage > 60 ? 'linear-gradient(90deg, #00FF00, #00FFFF)' :
             percentage > 30 ? 'linear-gradient(90deg, #FFD700, #FF8C00)' :
             'linear-gradient(90deg, #FF0040, #FF1493)';
    } else {
      return percentage > 60 ? 'linear-gradient(90deg, #FF00FF, #8A2BE2)' :
             percentage > 30 ? 'linear-gradient(90deg, #FF8C00, #FF0040)' :
             'linear-gradient(90deg, #FF0040, #8B0000)';
    }
  }};
  position: relative;
  box-shadow: 0 0 10px currentColor;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${dataStream} 2s linear infinite;
  }
`;

const HPText = styled.div`
  font-size: 0.7rem;
  color: #E0E0E0;
  font-family: ${props => props.theme.fonts.mono};
  text-align: center;
`;

const DamageNumber = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.display};
  text-shadow: 0 0 10px currentColor;
  z-index: 10;
  pointer-events: none;
`;

export default CombatArena;