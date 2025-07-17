import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { playSound } = useSound();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    playSound('button');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      playSound('incorrect');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
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
    <RegisterContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <RegisterCard className="cosmic-card">
          <Title className="cosmic-title">Join the Cosmic Order</Title>
          <Subtitle>Create your digital manifestation</Subtitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Username</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose your cosmic identity..."
                required
                className="cosmic-input"
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your ethereal communication channel..."
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
            
            <InputGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat the incantation..."
                required
                className="cosmic-input"
              />
            </InputGroup>
            
            <SubmitButton
              type="submit"
              disabled={loading}
              className="eldritch-button"
            >
              {loading ? 'Summoning Your Avatar...' : 'Complete the Summoning'}
            </SubmitButton>
          </Form>
          
          <LinkContainer>
            <p>Already part of the cosmic order?</p>
            <StyledLink to="/login">Enter Your Existing Realm</StyledLink>
          </LinkContainer>
        </RegisterCard>
      </motion.div>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled.div`
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

const ErrorMessage = styled.div`
  background: rgba(255, 0, 102, 0.1);
  border: 1px solid #ff0066;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #ff0066;
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

export default RegisterPage;