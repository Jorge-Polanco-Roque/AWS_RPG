import React from 'react';
import styled, { keyframes } from 'styled-components';

const CyberpunkBackground = () => {
  return (
    <BackgroundContainer>
      <DataGrid />
      <FloatingNodes />
      <NeuralNebula />
      <ScanLines />
    </BackgroundContainer>
  );
};

const DataGrid = () => {
  return (
    <GridContainer>
      {Array.from({ length: 50 }).map((_, i) => (
        <DataPoint
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </GridContainer>
  );
};

const FloatingNodes = () => {
  return (
    <NodesContainer>
      {Array.from({ length: 15 }).map((_, i) => (
        <Node
          key={i}
          color={i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#FF00FF' : '#00FF00'}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 8}s`
          }}
        />
      ))}
    </NodesContainer>
  );
};

const NeuralNebula = () => {
  return <NebulaContainer />;
};

const ScanLines = () => {
  return <ScanLineContainer />;
};

// Animations
const neonFlicker = keyframes`
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const dataFloat = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-15px) translateX(8px); }
  50% { transform: translateY(8px) translateX(-12px); }
  75% { transform: translateY(-10px) translateX(4px); }
`;

const neuralPulse = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.4; transform: scale(1.2) rotate(180deg); }
`;

const scanlineMove = keyframes`
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
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
    #0A0A0A 0%,
    #1A1A2E 25%,
    #16213E 50%,
    #1A1A2E 75%,
    #0A0A0A 100%
  );
`;

const GridContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const DataPoint = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: #00FFFF;
  border-radius: 50%;
  animation: ${neonFlicker} infinite ease-in-out;
  box-shadow: 0 0 8px #00FFFF, 0 0 12px #00FFFF;
`;

const NodesContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Node = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${dataFloat} infinite ease-in-out;
  box-shadow: 0 0 15px ${props => props.color}, 0 0 25px ${props => props.color};
  opacity: 0.8;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 10px;
    height: 10px;
    border: 1px solid ${props => props.color};
    border-radius: 50%;
    animation: ${neonFlicker} 2s infinite ease-in-out;
  }
`;

const NebulaContainer = styled.div`
  position: absolute;
  top: 15%;
  left: 25%;
  width: 500px;
  height: 400px;
  background: radial-gradient(
    ellipse,
    rgba(0, 255, 255, 0.08) 0%,
    rgba(255, 0, 255, 0.04) 40%,
    rgba(0, 255, 0, 0.02) 70%,
    transparent 80%
  );
  border-radius: 50%;
  animation: ${neuralPulse} 25s infinite ease-in-out;
  filter: blur(3px);
  
  &::before {
    content: '';
    position: absolute;
    top: 60%;
    left: 75%;
    width: 250px;
    height: 200px;
    background: radial-gradient(
      circle,
      rgba(0, 255, 0, 0.06) 0%,
      rgba(255, 0, 255, 0.03) 50%,
      transparent 70%
    );
    border-radius: 50%;
    animation: ${neuralPulse} 18s infinite ease-in-out reverse;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 180px;
    height: 120px;
    background: radial-gradient(
      circle,
      rgba(255, 0, 255, 0.05) 0%,
      transparent 60%
    );
    border-radius: 50%;
    animation: ${neuralPulse} 22s infinite ease-in-out;
  }
`;

const ScanLineContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00FFFF, transparent);
  animation: ${scanlineMove} 4s linear infinite;
  opacity: 0.6;
  box-shadow: 0 0 10px #00FFFF;
`;

export default CyberpunkBackground;