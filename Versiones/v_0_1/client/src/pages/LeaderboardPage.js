import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LeaderboardPage = () => {
  return (
    <LeaderboardContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LeaderboardCard className="cosmic-card">
          <Title className="cosmic-title">Cosmic Leaderboard</Title>
          <Subtitle>The most enlightened architects across the digital cosmos</Subtitle>
          
          <ComingSoon>
            <h2>🏆 The Hall of Cosmic Mastery 🏆</h2>
            <p>
              Here will appear the brave souls who have conquered the AWS realms
              and accumulated the most knowledge shards while maintaining their sanity.
            </p>
            <p>
              Rankings will be based on:
            </p>
            <RankingList>
              <li>✨ Knowledge Shards Collected</li>
              <li>🧠 Sanity Level Maintained</li>
              <li>📊 Answer Accuracy</li>
              <li>⚡ Response Speed</li>
            </RankingList>
          </ComingSoon>
        </LeaderboardCard>
      </motion.div>
    </LeaderboardContainer>
  );
};

const LeaderboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LeaderboardCard = styled.div`
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

const RankingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  
  li {
    padding: 0.5rem 0;
    color: ${props => props.theme.colors.accent};
    font-size: 1.1rem;
  }
`;

export default LeaderboardPage;