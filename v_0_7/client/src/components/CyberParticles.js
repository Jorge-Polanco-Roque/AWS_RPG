import React from 'react';
import styled, { keyframes } from 'styled-components';

const CyberParticles = () => {
  return (
    <ParticlesContainer>
      {Array.from({ length: 40 }).map((_, i) => (
        <Particle
          key={i}
          color={getCyberColor(i)}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${12 + Math.random() * 16}s`
          }}
        />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <DataStream
          key={`stream-${i}`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 10}s`
          }}
        />
      ))}
    </ParticlesContainer>
  );
};

const getCyberColor = (index) => {
  const cyberColors = ['#00FFFF', '#FF00FF', '#00FF00', '#0080FF', '#FF1493'];
  return cyberColors[index % cyberColors.length];
};

const float = keyframes`
  0% { 
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.4;
  }
  25% { 
    transform: translateY(-80px) translateX(40px) scale(0.7);
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-40px) translateX(-60px) scale(1.1);
    opacity: 0.6;
  }
  75% { 
    transform: translateY(-120px) translateX(20px) scale(0.9);
    opacity: 0.9;
  }
  100% { 
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.4;
  }
`;

const dataFlow = keyframes`
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

const neonGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor;
  }
  50% {
    box-shadow: 
      0 0 10px currentColor,
      0 0 20px currentColor,
      0 0 30px currentColor;
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
  width: 4px;
  height: 4px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${float} infinite linear, ${neonGlow} 2s infinite ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, ${props => props.color}40, transparent);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 6px;
    height: 6px;
    border: 1px solid ${props => props.color};
    border-radius: 50%;
    opacity: 0.6;
  }
`;

const DataStream = styled.div`
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, #00FFFF, transparent);
  animation: ${dataFlow} infinite linear;
  opacity: 0.7;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -1px;
    width: 4px;
    height: 4px;
    background: #00FFFF;
    border-radius: 50%;
    box-shadow: 0 0 8px #00FFFF;
  }
`;

export default CyberParticles;