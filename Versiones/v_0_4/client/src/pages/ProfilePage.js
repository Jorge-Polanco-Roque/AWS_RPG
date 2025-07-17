import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  return (
    <ProfileContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ProfileCard className="cosmic-card">
          <Title className="cosmic-title">Your Cosmic Profile</Title>
          <Subtitle>Your journey through the AWS dimensions</Subtitle>
          
          <ComingSoon>
            <h2>📊 Your Digital Manifestation 📊</h2>
            <p>
              Here you will monitor your progress through the cosmic AWS realms.
              Track your evolution as an architect of digital dimensions.
            </p>
            <p>
              Your profile will display:
            </p>
            <ProfileList>
              <li>🧠 Current Sanity Level</li>
              <li>✨ Knowledge Shards Collected</li>
              <li>📈 Progress Through Domains</li>
              <li>🎯 Accuracy Statistics</li>
              <li>🏆 Achievements Unlocked</li>
              <li>📅 Study History</li>
            </ProfileList>
          </ComingSoon>
        </ProfileCard>
      </motion.div>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ProfileCard = styled.div`
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

const ProfileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  
  li {
    padding: 0.5rem 0;
    color: ${props => props.theme.colors.accent};
    font-size: 1.1rem;
  }
`;

export default ProfilePage;