import React from 'react';
import styled, { keyframes } from 'styled-components';

const CosmicParticles = () => {
  return (
    <ParticlesContainer>
      {Array.from({ length: 50 }).map((_, i) => (
        <Particle
          key={i}
          color={getRandomColor(i)}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 20}s`
          }}
        />
      ))}
    </ParticlesContainer>
  );
};

const getRandomColor = (index) => {
  const colors = ['#8a2be2', '#ff0066', '#00ff88', '#4a0e4e', '#e6d7ff'];
  return colors[index % colors.length];
};

const float = keyframes`
  0% { 
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-100px) translateX(50px) scale(0.8);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-50px) translateX(-75px) scale(1.2);
    opacity: 0.5;
  }
  75% { 
    transform: translateY(-150px) translateX(25px) scale(0.9);
    opacity: 0.8;
  }
  100% { 
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.3;
  }
`;

const ParticlesContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const Particle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${float} infinite linear;
  box-shadow: 
    0 0 10px ${props => props.color},
    0 0 20px ${props => props.color}40,
    0 0 30px ${props => props.color}20;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 5px;
    height: 5px;
    background: radial-gradient(circle, ${props => props.color}60, transparent);
    border-radius: 50%;
  }
`;

export default CosmicParticles;