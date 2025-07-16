import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import CosmicParticles from '../components/CosmicParticles';
import EntityPortrait from '../components/EntityPortrait';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSound } = useSound();
  const [currentEntity, setCurrentEntity] = useState(0);

  const cosmicEntities = [
    {
      name: "Azathoth",
      title: "The Blind Idiot God of Scaling",
      description: "Master of Auto Scaling and Load Balancing nightmares",
      emoji: "🌀"
    },
    {
      name: "Cthulhu",
      title: "The Dreaming Database",
      description: "Sleeps in the depths of RDS until queries awaken it",
      emoji: "🐙"
    },
    {
      name: "Nyarlathotep",
      title: "The Crawling Chaos of Networks",
      description: "Weaves the dark networks connecting all digital realms",
      emoji: "🕷️"
    },
    {
      name: "Shub-Niggurath",
      title: "The Black Goat of Storage",
      description: "Mother of all S3 buckets and infinite storage spawn",
      emoji: "🐐"
    },
    {
      name: "Yog-Sothoth",
      title: "The Key and the Gate",
      description: "Guardian of all IAM permissions and security gates",
      emoji: "🗝️"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEntity((prev) => (prev + 1) % cosmicEntities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    playSound('button');
    if (user) {
      navigate('/game');
    } else {
      navigate('/login');
    }
  };

  const handleLeaderboard = () => {
    playSound('button');
    navigate('/leaderboard');
  };

  return (
    <HomeContainer>
      <CosmicParticles />
      
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <MainTitle className="cosmic-title">
            The Architect's Codex
          </MainTitle>
          <Subtitle>
            Cosmic Horror AWS Certification Study Experience
          </Subtitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <EntityShowcase>
            <EntityPortrait 
              entity={cosmicEntities[currentEntity]} 
              size="large"
            />
            <EntityDescription>
              <EntityName>{cosmicEntities[currentEntity].name}</EntityName>
              <EntityTitle>{cosmicEntities[currentEntity].title}</EntityTitle>
              <EntityText>{cosmicEntities[currentEntity].description}</EntityText>
            </EntityDescription>
          </EntityShowcase>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <GameDescription className="cosmic-card">
            <h2>Enter the Cosmic Realm</h2>
            <p>
              Face the eldritch horrors of AWS while mastering the Solutions Architect Associate certification. 
              Each correct answer banishes dark forces and increases your cosmic knowledge, while mistakes 
              drain your sanity and awaken ancient evils.
            </p>
            
            <FeatureList>
              <FeatureItem>
                <span className="feature-icon">🌌</span>
                <strong>Realistic Exam Questions:</strong> 65 scenario-based questions matching real AWS certification difficulty
              </FeatureItem>
              <FeatureItem>
                <span className="feature-icon">🎮</span>
                <strong>Immersive Horror Theme:</strong> Study AWS in a uniquely engaging cosmic horror atmosphere
              </FeatureItem>
              <FeatureItem>
                <span className="feature-icon">📊</span>
                <strong>Progress Tracking:</strong> Monitor your sanity, knowledge shards, and certification readiness
              </FeatureItem>
              <FeatureItem>
                <span className="feature-icon">🏆</span>
                <strong>Competitive Leaderboard:</strong> Compete with other architects ascending to cosmic mastery
              </FeatureItem>
            </FeatureList>
          </GameDescription>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <ButtonContainer>
            <ActionButton 
              className="eldritch-button primary" 
              onClick={handleStartGame}
            >
              {user ? 'Continue Your Journey' : 'Begin the Ritual'}
            </ActionButton>
            <ActionButton 
              className="eldritch-button secondary" 
              onClick={handleLeaderboard}
            >
              Cosmic Leaderboard
            </ActionButton>
          </ButtonContainer>
        </motion.div>

        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <WelcomeMessage className="cosmic-card">
              Welcome back, {user.username}. The cosmic entities await your return...
            </WelcomeMessage>
          </motion.div>
        )}
      </ContentWrapper>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const MainTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 3rem;
  font-family: ${props => props.theme.fonts.button};
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const EntityShowcase = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3rem 0;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }
`;

const EntityDescription = styled.div`
  text-align: center;
  max-width: 400px;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const EntityName = styled.h3`
  font-size: 2rem;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 0.5rem;
  font-family: ${props => props.theme.fonts.horror};
`;

const EntityTitle = styled.h4`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fonts.button};
`;

const EntityText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const GameDescription = styled.div`
  margin: 3rem 0;
  text-align: left;
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  .feature-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  strong {
    color: ${props => props.theme.colors.accent};
    margin-right: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ActionButton = styled.button`
  font-size: 1.2rem;
  padding: 1rem 2rem;
  
  &.primary {
    background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  }
  
  &.secondary {
    background: linear-gradient(45deg, ${props => props.theme.colors.backgroundMedium}, ${props => props.theme.colors.surface});
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }
`;

const WelcomeMessage = styled.div`
  margin-top: 2rem;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.accent};
  text-align: center;
`;

export default HomePage;