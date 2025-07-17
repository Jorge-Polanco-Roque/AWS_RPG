import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import CyberParticles from '../components/CyberParticles';
import EntityPortrait from '../components/EntityPortrait';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, login, register, logout } = useAuth();
  const { playSound } = useSound();
  const [currentEntity, setCurrentEntity] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Cyberpunk RPG Characters
  const cyberpunkCharacters = [
    {
      name: "NEXUS-7",
      title: "Main Character - Player",
      description: "Advanced AI architect specialized in cloud infrastructure optimization",
      emoji: "🤖",
      level: playerLevel,
      xp: playerXP,
      isPlayer: true
    },
    {
      name: "CIPHER",
      title: "Security Specialist",
      description: "Elite hacker focusing on IAM and security protocols",
      emoji: "🔐",
      level: Math.floor(Math.random() * 5) + 8,
      xp: Math.floor(Math.random() * 1000) + 2000
    },
    {
      name: "MATRIX",
      title: "Database Oracle",
      description: "Data architect managing vast digital databases and storage systems",
      emoji: "🗄️",
      level: Math.floor(Math.random() * 4) + 6,
      xp: Math.floor(Math.random() * 800) + 1500
    },
    {
      name: "VOID",
      title: "Network Ghost",
      description: "Phantom specialist in VPC configurations and network architecture",
      emoji: "👻",
      level: Math.floor(Math.random() * 6) + 5,
      xp: Math.floor(Math.random() * 1200) + 1200
    },
    {
      name: "QUANTUM",
      title: "Processing Unit",
      description: "High-performance computing specialist managing EC2 and Lambda functions",
      emoji: "⚡",
      level: Math.floor(Math.random() * 3) + 7,
      xp: Math.floor(Math.random() * 900) + 1800
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEntity((prev) => (prev + 1) % cyberpunkCharacters.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate player level based on user stats (mock for now)
    if (user) {
      const mockXP = Math.floor(Math.random() * 500) + 100;
      const calculatedLevel = Math.floor(mockXP / 100) + 1;
      setPlayerXP(mockXP);
      setPlayerLevel(calculatedLevel);
    }
  }, [user]);

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

  const handleComponentStudy = (component) => {
    playSound('button');
    if (user) {
      navigate(`/game?component=${component}`);
    } else {
      setShowAuthForm(true);
      setAuthMode('login');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    playSound('button');

    try {
      if (authMode === 'register') {
        if (authData.password !== authData.confirmPassword) {
          setAuthError('Passwords do not match');
          setAuthLoading(false);
          return;
        }
        
        const result = await register({
          username: authData.username,
          email: authData.email,
          password: authData.password
        });
        
        if (result.success) {
          playSound('correct');
          setShowAuthForm(false);
          navigate('/game');
        } else {
          setAuthError(result.error || 'Registration failed');
          playSound('incorrect');
        }
      } else {
        const result = await login({
          email: authData.email,
          password: authData.password
        });
        
        if (result.success) {
          playSound('correct');
          setShowAuthForm(false);
          navigate('/game');
        } else {
          setAuthError(result.error || 'Login failed');
          playSound('incorrect');
        }
      }
    } catch (error) {
      setAuthError('Connection error. Please try again.');
      playSound('incorrect');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthInputChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value
    });
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthError('');
    setAuthData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const isTestUser = user && user.id === 'test-user-id';

  return (
    <HomeContainer>
      <CyberParticles />
      
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <MainTitle className="cyberpunk-title" data-text="NEURO-ARCHITECT">
            NEURO-ARCHITECT
          </MainTitle>
          <Subtitle>
            Cyberpunk AWS Cloud Infrastructure Training Protocol
          </Subtitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <CharacterShowcase>
            <CharacterPortrait>
              <CharacterAvatar>{cyberpunkCharacters[currentEntity].emoji}</CharacterAvatar>
              <CharacterLevel isPlayer={cyberpunkCharacters[currentEntity].isPlayer}>
                LVL {cyberpunkCharacters[currentEntity].level}
              </CharacterLevel>
              {cyberpunkCharacters[currentEntity].isPlayer && (
                <XPBar>
                  <XPFill width={(cyberpunkCharacters[currentEntity].xp % 100)}>
                    {cyberpunkCharacters[currentEntity].xp} XP
                  </XPFill>
                </XPBar>
              )}
            </CharacterPortrait>
            <CharacterInfo>
              <CharacterName isPlayer={cyberpunkCharacters[currentEntity].isPlayer}>
                {cyberpunkCharacters[currentEntity].name}
              </CharacterName>
              <CharacterTitle>{cyberpunkCharacters[currentEntity].title}</CharacterTitle>
              <CharacterText>{cyberpunkCharacters[currentEntity].description}</CharacterText>
              {!cyberpunkCharacters[currentEntity].isPlayer && (
                <CharacterStats>
                  XP: {cyberpunkCharacters[currentEntity].xp.toLocaleString()}
                </CharacterStats>
              )}
            </CharacterInfo>
          </CharacterShowcase>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <GameDescription className="cyberpunk-card">
            <h2>INITIATE TRAINING PROTOCOL</h2>
            <p>
              Jack into the neural network and master AWS cloud architecture through advanced AI-assisted learning. 
              Execute scenario-based training missions, upgrade your neural pathways, 
              and compete against other cyber-architects in the digital realm.
            </p>
            
            <FeatureList>
              <FeatureItem>
                <span className="feature-icon">⚡</span>
                <strong>Neural Training Modules:</strong> 65 high-intensity scenarios simulating real cloud architecture challenges
              </FeatureItem>
              <FeatureItem>
                <span className="feature-icon">🔧</span>
                <strong>Component Specialization:</strong> Master individual system modules through targeted neural pathways
              </FeatureItem>
              <FeatureItem>
                <span className="feature-icon">📈</span>
                <strong>XP & Level System:</strong> Gain experience points and level up your cyber-architect abilities
              </FeatureItem>
              <FeatureItem>
                <span className="feature-icon">🏅</span>
                <strong>Digital Leaderboard:</strong> Compete against other AI entities in the neural matrix
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
              className="cyberpunk-button primary" 
              onClick={handleStartGame}
            >
              {user ? 'RESUME TRAINING' : 'JACK IN'}
            </ActionButton>
            
            {(!user || isTestUser) && (
              <ActionButton 
                className="cyberpunk-button secondary" 
                onClick={() => setShowAuthForm(true)}
              >
                NEURAL INTERFACE ACCESS
              </ActionButton>
            )}

            {user && !isTestUser && (
              <ActionButton 
                className="cyberpunk-button secondary" 
                onClick={() => {
                  playSound('button');
                  logout();
                }}
              >
                DISCONNECT NEURAL LINK
              </ActionButton>
            )}
            
            <ActionButton 
              className="cyberpunk-button secondary" 
              onClick={handleLeaderboard}
            >
              NEURAL RANKINGS
            </ActionButton>
          </ButtonContainer>

          <ComponentsMenu className="cyberpunk-card">
            <h2>NEURAL PATHWAY SPECIALIZATION</h2>
            <ComponentGrid>
              <ComponentCard onClick={() => handleComponentStudy('storage')}>
                <ComponentIcon>🗃️</ComponentIcon>
                <ComponentTitle>DATA STORAGE</ComponentTitle>
                <ComponentDesc>S3 // EBS // EFS // FSx</ComponentDesc>
              </ComponentCard>
              <ComponentCard onClick={() => handleComponentStudy('processing')}>
                <ComponentIcon>⚡</ComponentIcon>
                <ComponentTitle>PROCESSING CORES</ComponentTitle>
                <ComponentDesc>EC2 // Lambda // ECS // Batch</ComponentDesc>
              </ComponentCard>
              <ComponentCard onClick={() => handleComponentStudy('pipelines')}>
                <ComponentIcon>🔗</ComponentIcon>
                <ComponentTitle>DEPLOY CHAINS</ComponentTitle>
                <ComponentDesc>CodePipeline // CodeBuild // CodeDeploy</ComponentDesc>
              </ComponentCard>
              <ComponentCard onClick={() => handleComponentStudy('roles')}>
                <ComponentIcon>🛡️</ComponentIcon>
                <ComponentTitle>ACCESS MATRIX</ComponentTitle>
                <ComponentDesc>IAM // Security Groups // NACLs</ComponentDesc>
              </ComponentCard>
              <ComponentCard onClick={() => handleComponentStudy('networking')}>
                <ComponentIcon>🌐</ComponentIcon>
                <ComponentTitle>NET PROTOCOLS</ComponentTitle>
                <ComponentDesc>VPC // Route 53 // CloudFront</ComponentDesc>
              </ComponentCard>
              <ComponentCard onClick={() => handleComponentStudy('database')}>
                <ComponentIcon>🗄️</ComponentIcon>
                <ComponentTitle>DATA NODES</ComponentTitle>
                <ComponentDesc>RDS // DynamoDB // ElastiCache</ComponentDesc>
              </ComponentCard>
            </ComponentGrid>
          </ComponentsMenu>
        </motion.div>

        {user && !isTestUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <WelcomeMessage className="cyberpunk-card">
              NEURAL LINK ESTABLISHED {'//'} Welcome back, {user?.username?.toUpperCase() || 'UNKNOWN USER'} {'//'} Ready to resume training protocol?
            </WelcomeMessage>
          </motion.div>
        )}

        {isTestUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <TestModeMessage className="cyberpunk-card">
              ⚡ TEST MODE ACTIVE {'//'} For persistent progress, use "NEURAL INTERFACE ACCESS" {'//'} Current session: temporary
            </TestModeMessage>
          </motion.div>
        )}
      </ContentWrapper>

      {showAuthForm && (
        <AuthModal>
          <AuthOverlay onClick={() => setShowAuthForm(false)} />
          <AuthForm className="cyberpunk-card">
            <AuthHeader>
              <AuthTitle>
                {authMode === 'login' ? 'NEURAL INTERFACE ACCESS' : 'CREATE NEURAL PROFILE'}
              </AuthTitle>
              <CloseButton onClick={() => setShowAuthForm(false)}>×</CloseButton>
            </AuthHeader>

            {authError && <ErrorMessage>{authError}</ErrorMessage>}

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <InputGroup>
                  <InputLabel>Username</InputLabel>
                  <AuthInput
                    type="text"
                    name="username"
                    value={authData.username}
                    onChange={handleAuthInputChange}
                    placeholder="Choose your neural identity..."
                    required
                    className="cyberpunk-input"
                  />
                </InputGroup>
              )}

              <InputGroup>
                <InputLabel>Email</InputLabel>
                <AuthInput
                  type="email"
                  name="email"
                  value={authData.email}
                  onChange={handleAuthInputChange}
                  placeholder="Neural communication channel..."
                  required
                  className="cyberpunk-input"
                />
              </InputGroup>

              <InputGroup>
                <InputLabel>Password</InputLabel>
                <AuthInput
                  type="password"
                  name="password"
                  value={authData.password}
                  onChange={handleAuthInputChange}
                  placeholder="Access encryption key..."
                  required
                  className="cyberpunk-input"
                />
              </InputGroup>

              {authMode === 'register' && (
                <InputGroup>
                  <InputLabel>Confirm Password</InputLabel>
                  <AuthInput
                    type="password"
                    name="confirmPassword"
                    value={authData.confirmPassword}
                    onChange={handleAuthInputChange}
                    placeholder="Verify encryption key..."
                    required
                    className="cyberpunk-input"
                  />
                </InputGroup>
              )}

              <AuthButtonContainer>
                <AuthButton 
                  type="submit" 
                  disabled={authLoading}
                  className="cyberpunk-button primary"
                >
                  {authLoading ? 'CONNECTING...' : 
                   authMode === 'login' ? 'JACK IN' : 'CREATE PROFILE'}
                </AuthButton>
              </AuthButtonContainer>
            </form>

            <AuthSwitchContainer>
              <AuthSwitchText>
                {authMode === 'login' 
                  ? "New to the neural network?" 
                  : "Already have neural access?"}
              </AuthSwitchText>
              <AuthSwitchButton onClick={switchAuthMode}>
                {authMode === 'login' ? 'Create Neural Profile' : 'Access Existing Profile'}
              </AuthSwitchButton>
            </AuthSwitchContainer>
          </AuthForm>
        </AuthModal>
      )}
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

const CharacterShowcase = styled.div`
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

const CharacterPortrait = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterAvatar = styled.div`
  font-size: 4rem;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #00FFFF;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  animation: neonPulse 3s ease-in-out infinite;
`;

const CharacterLevel = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${props => props.isPlayer ? 
    'linear-gradient(135deg, #00FF00, #00CC00)' : 
    'linear-gradient(135deg, #FF00FF, #CC00CC)'
  };
  color: black;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.mono};
  text-shadow: none;
`;

const XPBar = styled.div`
  width: 120px;
  height: 8px;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00FFFF;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
`;

const XPFill = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  background: linear-gradient(90deg, #00FFFF, #00FF00);
  transition: width 0.5s ease;
  position: relative;
  
  &::before {
    content: '${props => props.children}';
    position: absolute;
    top: -20px;
    right: 0;
    font-size: 0.7rem;
    color: #00FFFF;
    font-family: ${props => props.theme.fonts.mono};
  }
`;

const CharacterInfo = styled.div`
  text-align: center;
  max-width: 400px;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const CharacterName = styled.h3`
  font-size: 2rem;
  color: ${props => props.isPlayer ? '#00FF00' : '#00FFFF'};
  margin-bottom: 0.5rem;
  font-family: ${props => props.theme.fonts.display};
  text-shadow: 0 0 10px currentColor;
  letter-spacing: 0.1em;
`;

const CharacterTitle = styled.h4`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fonts.cyber};
  text-transform: uppercase;
`;

const CharacterText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  font-family: ${props => props.theme.fonts.primary};
`;

const CharacterStats = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00FFFF;
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  color: #00FFFF;
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

const ComponentsMenu = styled.div`
  margin: 3rem 0;
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ComponentCard = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.surface}, ${props => props.theme.colors.surfaceHover});
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary};
    background: linear-gradient(135deg, ${props => props.theme.colors.surfaceHover}, ${props => props.theme.colors.backgroundMedium});
  }
`;

const ComponentIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ComponentTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ComponentDesc = styled.p`
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const TestModeMessage = styled.div`
  margin-top: 2rem;
  font-size: 1rem;
  color: #FFD700;
  text-align: center;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid #FFD700;
`;

const AuthModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AuthOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
`;

const AuthForm = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
`;

const AuthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AuthTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-size: 1.5rem;
  font-family: ${props => props.theme.fonts.display};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 102, 0.1);
  border: 1px solid #ff0066;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #ff0066;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.accent};
  font-weight: bold;
  font-family: ${props => props.theme.fonts.cyber};
`;

const AuthInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.primary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const AuthButtonContainer = styled.div`
  margin: 2rem 0 1.5rem 0;
`;

const AuthButton = styled.button`
  width: 100%;
  font-size: 1.1rem;
  padding: 1rem;
`;

const AuthSwitchContainer = styled.div`
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
`;

const AuthSwitchText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const AuthSwitchButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
  font-family: ${props => props.theme.fonts.primary};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

export default HomePage;