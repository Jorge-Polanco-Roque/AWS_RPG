import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { playSound } = useSound();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    playSound('button');

    try {
      const result = await login(formData);
      if (result.success) {
        playSound('correct');
        navigate('/game');
      }
    } catch (error) {
      playSound('incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LoginCard className="cosmic-card">
          <Title className="cosmic-title">Enter the Cosmic Realm</Title>
          <Subtitle>Authenticate your digital essence</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Username or Email</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your cosmic identifier..."
                required
                className="cosmic-input"
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your secret incantation..."
                required
                className="cosmic-input"
              />
            </InputGroup>
            
            <SubmitButton
              type="submit"
              disabled={loading}
              className="eldritch-button"
            >
              {loading ? 'Connecting to the Void...' : 'Begin the Ritual'}
            </SubmitButton>
          </Form>
          
          <LinkContainer>
            <p>New to the cosmic realm?</p>
            <StyledLink to="/register">Create Your Digital Avatar</StyledLink>
          </LinkContainer>
        </LoginCard>
      </motion.div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.accent};
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
`;

const SubmitButton = styled.button`
  width: 100%;
  font-size: 1.1rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const LinkContainer = styled.div`
  margin-top: 2rem;
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.5rem;
  }
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
    text-decoration: underline;
  }
`;

export default LoginPage;