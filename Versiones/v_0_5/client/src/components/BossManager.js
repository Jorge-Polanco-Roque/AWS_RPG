import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const BossManager = ({ 
  currentBoss, 
  bossHP, 
  maxBossHP, 
  onBossDefeat, 
  onBossAttack,
  questionCount 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPhaseTransition, setIsPhaseTransition] = useState(false);
  const [bossAttackPattern, setBossAttackPattern] = useState(null);
  const [lastAttackTime, setLastAttackTime] = useState(0);

  useEffect(() => {
    if (!currentBoss) return;
    
    // Determinar fase actual basada en HP
    const hpPercentage = (bossHP / maxBossHP) * 100;
    let newPhase = 0;
    
    if (hpPercentage <= 25) newPhase = 3; // Fase final
    else if (hpPercentage <= 50) newPhase = 2; // Fase crítica
    else if (hpPercentage <= 75) newPhase = 1; // Fase media
    else newPhase = 0; // Fase inicial
    
    if (newPhase !== currentPhase) {
      setIsPhaseTransition(true);
      setTimeout(() => {
        setCurrentPhase(newPhase);
        setIsPhaseTransition(false);
      }, 2000);
    }
  }, [bossHP, maxBossHP, currentBoss, currentPhase]);

  useEffect(() => {
    if (!currentBoss) return;
    
    // Patrón de ataque del jefe
    const attackInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastAttack = now - lastAttackTime;
      
      // Frecuencia de ataque aumenta con la fase
      const attackFrequency = Math.max(3000 - (currentPhase * 500), 1000);
      
      if (timeSinceLastAttack > attackFrequency) {
        executeBossAttack();
        setLastAttackTime(now);
      }
    }, 1000);

    return () => clearInterval(attackInterval);
  }, [currentPhase, currentBoss, lastAttackTime]);

  const executeBossAttack = () => {
    if (!currentBoss) return;
    
    const attacks = getBossAttacks(currentBoss.type, currentPhase);
    const selectedAttack = attacks[Math.floor(Math.random() * attacks.length)];
    
    setBossAttackPattern(selectedAttack);
    onBossAttack(selectedAttack);
    
    // Limpiar patrón después de la animación
    setTimeout(() => {
      setBossAttackPattern(null);
    }, 3000);
  };

  const getBossAttacks = (bossType, phase) => {
    const baseAttacks = {
      'aws_overlord': [
        { name: 'Data Corruption', damage: 20, effect: 'Slow down timer' },
        { name: 'Service Outage', damage: 15, effect: 'Disable one skill' },
        { name: 'Security Breach', damage: 25, effect: 'Reduce XP gain' }
      ],
      'lambda_lord': [
        { name: 'Function Timeout', damage: 18, effect: 'Skip next question' },
        { name: 'Memory Overflow', damage: 22, effect: 'Confuse answers' },
        { name: 'Cold Start', damage: 12, effect: 'Delay next ability' }
      ],
      'ec2_emperor': [
        { name: 'Instance Termination', damage: 30, effect: 'High damage' },
        { name: 'Auto Scaling', damage: 10, effect: 'Multiple weak attacks' },
        { name: 'Spot Interruption', damage: 25, effect: 'Random damage' }
      ],
      's3_sovereign': [
        { name: 'Bucket Flood', damage: 16, effect: 'Continuous damage' },
        { name: 'Access Denied', damage: 20, effect: 'Block skill usage' },
        { name: 'Glacier Freeze', damage: 14, effect: 'Slow effects' }
      ]
    };

    const attacks = baseAttacks[bossType] || baseAttacks['aws_overlord'];
    
    // Modificar ataques según la fase
    return attacks.map(attack => ({
      ...attack,
      damage: attack.damage + (phase * 5), // Más daño en fases avanzadas
      phase: phase
    }));
  };

  const getPhaseDescription = (phase) => {
    switch (phase) {
      case 0: return 'ANALYZING TARGET';
      case 1: return 'DEFENSIVE PROTOCOLS ACTIVE';
      case 2: return 'AGGRESSIVE COUNTERMEASURES';
      case 3: return 'CRITICAL SYSTEM FAILURE';
      default: return 'UNKNOWN STATUS';
    }
  };

  const getBossPhaseColor = (phase) => {
    switch (phase) {
      case 0: return '#00FFFF'; // Cyan
      case 1: return '#FFD700'; // Gold
      case 2: return '#FF8C00'; // Orange
      case 3: return '#FF0040'; // Red
      default: return '#FFFFFF';
    }
  };

  if (!currentBoss) return null;

  return (
    <BossContainer>
      {/* Indicador de Fase */}
      <PhaseIndicator>
        <PhaseTitle color={getBossPhaseColor(currentPhase)}>
          PHASE {currentPhase + 1}
        </PhaseTitle>
        <PhaseDescription color={getBossPhaseColor(currentPhase)}>
          {getPhaseDescription(currentPhase)}
        </PhaseDescription>
      </PhaseIndicator>

      {/* Transición de Fase */}
      {isPhaseTransition && (
        <PhaseTransition
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 2 }}
        >
          <TransitionText>
            PHASE {currentPhase + 1} INITIATED
          </TransitionText>
          <TransitionSubtext>
            {getPhaseDescription(currentPhase)}
          </TransitionSubtext>
        </PhaseTransition>
      )}

      {/* Patrón de Ataque del Jefe */}
      {bossAttackPattern && (
        <BossAttackIndicator
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <AttackName>{bossAttackPattern.name}</AttackName>
          <AttackEffect>{bossAttackPattern.effect}</AttackEffect>
          <AttackDamage>-{bossAttackPattern.damage} DMG</AttackDamage>
        </BossAttackIndicator>
      )}

      {/* Barra de Fases */}
      <PhaseBar>
        {[0, 1, 2, 3].map((phase) => (
          <PhaseSegment 
            key={phase}
            active={phase <= currentPhase}
            current={phase === currentPhase}
            color={getBossPhaseColor(phase)}
          >
            {phase + 1}
          </PhaseSegment>
        ))}
      </PhaseBar>

      {/* Información del Jefe */}
      <BossInfo>
        <BossName>{currentBoss.name}</BossName>
        <BossTitle>{currentBoss.title}</BossTitle>
        <BossDescription>{currentBoss.description}</BossDescription>
        
        {/* Habilidades especiales del jefe */}
        <BossAbilities>
          <AbilityTitle>ACTIVE PROTOCOLS:</AbilityTitle>
          {currentBoss.abilities.slice(0, currentPhase + 1).map((ability, index) => (
            <AbilityItem key={index}>
              <AbilityIcon>{ability.icon}</AbilityIcon>
              <AbilityName>{ability.name}</AbilityName>
            </AbilityItem>
          ))}
        </BossAbilities>
      </BossInfo>

      {/* Efectos de Fase */}
      <PhaseEffects phase={currentPhase} />
    </BossContainer>
  );
};

// Animaciones
const phaseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px currentColor;
    text-shadow: 0 0 10px currentColor;
  }
  50% { 
    box-shadow: 0 0 40px currentColor, 0 0 60px currentColor;
    text-shadow: 0 0 20px currentColor;
  }
`;

const phaseTransition = keyframes`
  0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const attackPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const BossContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, rgba(255, 0, 64, 0.1), rgba(139, 0, 139, 0.1));
  border: 3px solid #FF0040;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(255, 0, 64, 0.5);
`;

const PhaseIndicator = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const PhaseTitle = styled.h2`
  color: ${props => props.color};
  font-family: ${props => props.theme.fonts.display};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  animation: ${phaseGlow} 2s ease-in-out infinite;
`;

const PhaseDescription = styled.p`
  color: ${props => props.color};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PhaseTransition = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background: linear-gradient(135deg, rgba(255, 0, 64, 0.9), rgba(255, 0, 255, 0.9));
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  border: 3px solid #FF00FF;
  box-shadow: 0 0 50px rgba(255, 0, 255, 0.8);
`;

const TransitionText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  font-family: ${props => props.theme.fonts.display};
  margin-bottom: 1rem;
`;

const TransitionSubtext = styled.div`
  font-size: 1.2rem;
  color: #000;
  font-family: ${props => props.theme.fonts.cyber};
`;

const BossAttackIndicator = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 64, 0.9);
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #FF0040;
  z-index: 50;
  animation: ${attackPulse} 1s ease-in-out infinite;
`;

const AttackName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #FFF;
  font-family: ${props => props.theme.fonts.display};
  margin-bottom: 0.5rem;
`;

const AttackEffect = styled.div`
  font-size: 0.9rem;
  color: #FFD700;
  font-family: ${props => props.theme.fonts.mono};
  margin-bottom: 0.5rem;
`;

const AttackDamage = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #FF0040;
  font-family: ${props => props.theme.fonts.display};
  text-align: center;
`;

const PhaseBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PhaseSegment = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.display};
  border: 2px solid ${props => props.color};
  background: ${props => props.active 
    ? `linear-gradient(135deg, ${props.color}, ${props.color}80)`
    : 'transparent'
  };
  color: ${props => props.active ? '#000' : props.color};
  box-shadow: ${props => props.current ? `0 0 20px ${props.color}` : 'none'};
  animation: ${props => props.current ? phaseGlow : 'none'} 1s ease-in-out infinite;
`;

const BossInfo = styled.div`
  text-align: center;
`;

const BossName = styled.h3`
  color: #FF0040;
  font-family: ${props => props.theme.fonts.display};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const BossTitle = styled.h4`
  color: #FF00FF;
  font-family: ${props => props.theme.fonts.cyber};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const BossDescription = styled.p`
  color: #E0E0E0;
  font-family: ${props => props.theme.fonts.primary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const BossAbilities = styled.div`
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
`;

const AbilityTitle = styled.div`
  color: #FFD700;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const AbilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const AbilityIcon = styled.span`
  font-size: 1rem;
`;

const AbilityName = styled.span`
  color: #E0E0E0;
  font-family: ${props => props.theme.fonts.primary};
  font-size: 0.8rem;
`;

const PhaseEffects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: ${props => {
    switch (props.phase) {
      case 0: return 'radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.1), transparent)';
      case 1: return 'radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.1), transparent)';
      case 2: return 'radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.15), transparent)';
      case 3: return 'radial-gradient(circle at 60% 40%, rgba(255, 0, 64, 0.2), transparent)';
      default: return 'none';
    }
  }};
  z-index: 1;
`;

export default BossManager;