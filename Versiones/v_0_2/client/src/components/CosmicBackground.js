import React from 'react';
import styled, { keyframes } from 'styled-components';

const CosmicBackground = () => {
  return (
    <BackgroundContainer>
      <StarField />
      <FloatingOrbs />
      <CosmicNebula />
    </BackgroundContainer>
  );
};

const StarField = () => {
  return (
    <StarsContainer>
      {Array.from({ length: 100 }).map((_, i) => (
        <Star
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </StarsContainer>
  );
};

const FloatingOrbs = () => {
  return (
    <OrbsContainer>
      {Array.from({ length: 20 }).map((_, i) => (
        <Orb
          key={i}
          color={i % 3 === 0 ? '#8a2be2' : i % 3 === 1 ? '#ff0066' : '#00ff88'}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}
    </OrbsContainer>
  );
};

const CosmicNebula = () => {
  return <NebulaContainer />;
};

// Animations
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(10px) translateX(-15px); }
  75% { transform: translateY(-15px) translateX(5px); }
`;

const nebulaPulse = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.3; transform: scale(1.1) rotate(180deg); }
`;

// Styled Components
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #1a0d26 25%,
    #2d1b36 50%,
    #1a0d26 75%,
    #0a0a0a 100%
  );
`;

const StarsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: ${twinkle} infinite ease-in-out;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
`;

const OrbsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Orb = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${float} infinite ease-in-out;
  box-shadow: 0 0 20px ${props => props.color};
  opacity: 0.7;
`;

const NebulaContainer = styled.div`
  position: absolute;
  top: 20%;
  left: 30%;
  width: 400px;
  height: 300px;
  background: radial-gradient(
    ellipse,
    rgba(138, 43, 226, 0.1) 0%,
    rgba(255, 0, 102, 0.05) 50%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${nebulaPulse} 20s infinite ease-in-out;
  filter: blur(2px);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 70%;
    width: 200px;
    height: 150px;
    background: radial-gradient(
      circle,
      rgba(0, 255, 136, 0.08) 0%,
      transparent 60%
    );
    border-radius: 50%;
    animation: ${nebulaPulse} 15s infinite ease-in-out reverse;
  }
`;

export default CosmicBackground;