import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GamePage = () => {
  return (
    <GameContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GameCard className="cosmic-card">
          <Title className="cosmic-title">The Game Awakens</Title>
          <Subtitle>Your cosmic AWS journey begins here...</Subtitle>
          
          <ComingSoon>
            <h2>🌌 The Cosmic Questions Are Manifesting 🌌</h2>
            <p>
              The ancient entities are preparing your AWS certification challenges.
              Soon you will face questions about:
            </p>
            <FeatureList>
              <li>🏗️ Resilient Architectures</li>
              <li>⚡ High-Performance Systems</li>
              <li>🔒 Secure Implementations</li>
              <li>💰 Cost-Optimized Solutions</li>
            </FeatureList>
            <p>
              Your sanity will be tested, knowledge shards will be earned,
              and the cosmic leaderboard awaits your ascension...
            </p>
          </ComingSoon>
        </GameCard>
      </motion.div>
    </GameContainer>
  );
};

const GameContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const GameCard = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
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

const ComingSoon = styled.div`
  text-align: left;
  
  h2 {
    text-align: center;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  
  li {
    padding: 0.5rem 0;
    color: ${props => props.theme.colors.accent};
    font-size: 1.1rem;
  }
`;

export default GamePage;