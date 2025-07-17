import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const EntityPortrait = ({ entity, size = 'medium' }) => {
  const sizeMap = {
    small: '80px',
    medium: '120px',
    large: '180px'
  };

  return (
    <PortraitContainer
      size={sizeMap[size]}
      as={motion.div}
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 1, -1, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <EntityEmoji>{entity.emoji}</EntityEmoji>
      <CosmicAura />
    </PortraitContainer>
  );
};

const PortraitContainer = styled.div`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background: radial-gradient(circle, #1a0d26, #4a0e4e);
  border: 3px solid #8a2be2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 20px rgba(138, 43, 226, 0.5),
    inset 0 0 20px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: conic-gradient(from 0deg, transparent, #8a2be2, transparent);
    animation: rotate 8s linear infinite;
    opacity: 0.2;
  }
`;

const EntityEmoji = styled.div`
  font-size: ${props => {
    const size = props.theme?.size || '120px';
    return `calc(${size} * 0.4)`;
  }};
  z-index: 2;
  position: relative;
  filter: drop-shadow(0 0 10px rgba(138, 43, 226, 0.8));
`;

const CosmicAura = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent);
  animation: pulse 3s ease-in-out infinite alternate;
  
  @keyframes pulse {
    from { opacity: 0.1; transform: scale(0.8); }
    to { opacity: 0.3; transform: scale(1.2); }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default EntityPortrait;