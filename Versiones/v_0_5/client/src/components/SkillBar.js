import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const SkillBar = ({ skills, onSkillUse, disabled }) => {
  const [skillCooldowns, setSkillCooldowns] = useState({});
  
  useEffect(() => {
    // Limpiar cooldowns expirados
    const interval = setInterval(() => {
      const now = Date.now();
      setSkillCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(skillId => {
          if (updated[skillId] <= now) {
            delete updated[skillId];
          }
        });
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleSkillClick = (skill) => {
    if (disabled || skillCooldowns[skill.id]) return;
    
    // Activar cooldown
    setSkillCooldowns(prev => ({
      ...prev,
      [skill.id]: Date.now() + (skill.cooldown * 1000)
    }));
    
    // Ejecutar habilidad
    onSkillUse(skill);
  };

  const getCooldownPercentage = (skillId, cooldownTime) => {
    const now = Date.now();
    const endTime = skillCooldowns[skillId];
    if (!endTime) return 0;
    
    const remaining = Math.max(0, endTime - now);
    const total = cooldownTime * 1000;
    return (remaining / total) * 100;
  };

  const getCooldownText = (skillId, cooldownTime) => {
    const now = Date.now();
    const endTime = skillCooldowns[skillId];
    if (!endTime) return '';
    
    const remaining = Math.max(0, endTime - now);
    return Math.ceil(remaining / 1000) + 's';
  };

  return (
    <SkillBarContainer>
      <SkillBarTitle>NEURAL ABILITIES</SkillBarTitle>
      <SkillsContainer>
        {skills.map((skill) => (
          <SkillButton
            key={skill.id}
            onClick={() => handleSkillClick(skill)}
            disabled={disabled || skillCooldowns[skill.id]}
            isOnCooldown={!!skillCooldowns[skill.id]}
            skillType={skill.type}
            whileHover={{ scale: skillCooldowns[skill.id] ? 1 : 1.1 }}
            whileTap={{ scale: skillCooldowns[skill.id] ? 1 : 0.95 }}
          >
            <SkillIcon>{skill.icon}</SkillIcon>
            <SkillName>{skill.name}</SkillName>
            <SkillDescription>{skill.description}</SkillDescription>
            
            {/* Cooldown Overlay */}
            {skillCooldowns[skill.id] && (
              <CooldownOverlay>
                <CooldownFill 
                  height={getCooldownPercentage(skill.id, skill.cooldown)}
                  animate={{ height: `${getCooldownPercentage(skill.id, skill.cooldown)}%` }}
                  transition={{ duration: 0.1 }}
                />
                <CooldownText>
                  {getCooldownText(skill.id, skill.cooldown)}
                </CooldownText>
              </CooldownOverlay>
            )}
            
            {/* Charging Effect */}
            {!skillCooldowns[skill.id] && !disabled && (
              <ChargingEffect skillType={skill.type} />
            )}
          </SkillButton>
        ))}
      </SkillsContainer>
    </SkillBarContainer>
  );
};

// Animaciones
const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px currentColor;
  }
  50% { 
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
`;

const chargeEffect = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.3; }
`;

const cooldownSweep = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const SkillBarContainer = styled.div`
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
  border: 2px solid #00FFFF;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
`;

const SkillBarTitle = styled.h3`
  color: #00FFFF;
  font-family: ${props => props.theme.fonts.display};
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #00FFFF;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const SkillsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const SkillButton = styled(motion.button)`
  position: relative;
  width: 80px;
  height: 100px;
  background: ${props => {
    if (props.isOnCooldown) return 'rgba(100, 100, 100, 0.3)';
    switch (props.skillType) {
      case 'attack': return 'linear-gradient(135deg, rgba(255, 0, 64, 0.3), rgba(255, 0, 64, 0.1))';
      case 'defense': return 'linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(0, 255, 255, 0.1))';
      case 'support': return 'linear-gradient(135deg, rgba(0, 255, 0, 0.3), rgba(0, 255, 0, 0.1))';
      case 'ultimate': return 'linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(255, 0, 255, 0.1))';
      default: return 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
    }
  }};
  border: 2px solid ${props => {
    if (props.isOnCooldown) return '#666666';
    switch (props.skillType) {
      case 'attack': return '#FF0040';
      case 'defense': return '#00FFFF';
      case 'support': return '#00FF00';
      case 'ultimate': return '#FF00FF';
      default: return '#FFFFFF';
    }
  }};
  border-radius: 8px;
  cursor: ${props => props.disabled || props.isOnCooldown ? 'not-allowed' : 'pointer'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOnCooldown ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    ${props => !props.isOnCooldown && `animation: ${pulseGlow} 0.5s ease-in-out;`}
  }
`;

const SkillIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const SkillName = styled.div`
  font-size: 0.7rem;
  color: #E0E0E0;
  font-family: ${props => props.theme.fonts.mono};
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const SkillDescription = styled.div`
  font-size: 0.6rem;
  color: #B0B0B0;
  font-family: ${props => props.theme.fonts.mono};
  line-height: 1.2;
`;

const CooldownOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const CooldownFill = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  border-radius: 0 0 6px 6px;
`;

const CooldownText = styled.div`
  font-size: 1.2rem;
  color: #FFFFFF;
  font-family: ${props => props.theme.fonts.display};
  font-weight: bold;
  text-shadow: 0 0 10px #FFFFFF;
  z-index: 11;
`;

const ChargingEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => {
    switch (props.skillType) {
      case 'attack': return 'radial-gradient(circle, rgba(255, 0, 64, 0.2), transparent)';
      case 'defense': return 'radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent)';
      case 'support': return 'radial-gradient(circle, rgba(0, 255, 0, 0.2), transparent)';
      case 'ultimate': return 'radial-gradient(circle, rgba(255, 0, 255, 0.2), transparent)';
      default: return 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)';
    }
  }};
  border-radius: 6px;
  animation: ${chargeEffect} 2s ease-in-out infinite;
  pointer-events: none;
`;

export default SkillBar;