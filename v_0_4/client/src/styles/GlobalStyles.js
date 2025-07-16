import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Exo+2:wght@300;400;500;600;700&family=Audiowide&family=Source+Code+Pro:wght@400;500;600&family=Rajdhani:wght@300;400;500;600;700&family=Electrolize:wght@400&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${props => props.theme?.fonts?.primary || "'Orbitron', 'Courier New', monospace"};
    background: 
      linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 25%, #16213E 50%, #1A1A2E 75%, #0A0A0A 100%),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 100px,
        rgba(0, 255, 255, 0.03) 100px,
        rgba(0, 255, 255, 0.03) 101px
      );
    color: #E0E0E0;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.05) 0%, transparent 50%);
    z-index: -1;
    pointer-events: none;
    animation: scanline 4s linear infinite;
  }
  
  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 255, 0.02) 2px,
      rgba(0, 255, 255, 0.02) 4px
    );
    z-index: -1;
    pointer-events: none;
  }
  
  .App {
    position: relative;
    z-index: 1;
    min-height: 100vh;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme?.fonts?.title || "'Exo 2', sans-serif"};
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  .cyberpunk-title {
    font-family: ${props => props.theme?.fonts?.display || "'Audiowide', cursive"};
    font-weight: 700;
    background: linear-gradient(135deg, #00FFFF, #FF00FF, #00FF00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.1em;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    animation: neonPulse 2s ease-in-out infinite;
    position: relative;
  }
  
  .cyberpunk-title::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #00FFFF, #FF00FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: -1;
    animation: glitch 0.3s ease-in-out infinite alternate;
  }
  
  /* Support for legacy class names */
  .modern-title {
    font-family: ${props => props.theme?.fonts?.display || "'Audiowide', cursive"};
    font-weight: 700;
    background: linear-gradient(135deg, #00FFFF, #FF00FF, #00FF00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.1em;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    animation: neonPulse 2s ease-in-out infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes neonPulse {
    0%, 100% { 
      text-shadow: 
        0 0 5px currentColor,
        0 0 10px currentColor,
        0 0 15px currentColor,
        0 0 20px #00FFFF;
    }
    50% { 
      text-shadow: 
        0 0 2px currentColor,
        0 0 5px currentColor,
        0 0 8px currentColor,
        0 0 12px #00FFFF;
    }
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  @keyframes flicker {
    0%, 98% { opacity: 1; }
    99% { opacity: 0.8; }
    100% { opacity: 1; }
  }

  @keyframes scanline {
    0% { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
  }

  @keyframes cyberbounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0, -15px, 0); }
    70% { transform: translate3d(0, -7px, 0); }
    90% { transform: translate3d(0, -2px, 0); }
  }

  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .cyberpunk-button, .modern-button {
    font-family: ${props => props.theme?.fonts?.button || "'Rajdhani', sans-serif"};
    font-weight: 600;
    background: linear-gradient(135deg, transparent, rgba(0, 255, 255, 0.1));
    border: 2px solid #00FFFF;
    color: #00FFFF;
    padding: 12px 24px;
    border-radius: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.4), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
      text-shadow: 0 0 10px #00FFFF;
      
      &::before {
        opacity: 1;
      }
      
      &::after {
        left: 100%;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    &.secondary {
      border-color: #FF00FF;
      color: #FF00FF;
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.2);
      
      &:hover {
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
        text-shadow: 0 0 10px #FF00FF;
      }
    }

    &.accent {
      border-color: #00FF00;
      color: #00FF00;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
      
      &:hover {
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
        text-shadow: 0 0 10px #00FF00;
      }
    }
  }
  
  .cyberpunk-card, .modern-card {
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.8));
    border: 2px solid;
    border-image: linear-gradient(45deg, #00FFFF, #FF00FF, #00FF00, #00FFFF) 1;
    padding: 24px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.1),
      inset 0 0 20px rgba(0, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00FFFF, transparent);
      animation: scanline 3s linear infinite;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 100px,
        rgba(0, 255, 255, 0.02) 100px,
        rgba(0, 255, 255, 0.02) 102px
      );
      pointer-events: none;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 0 30px rgba(0, 255, 255, 0.2),
        inset 0 0 30px rgba(0, 255, 255, 0.1);
    }
  }

  /* Legacy support */
  .cosmic-card {
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.8));
    border: 2px solid;
    border-image: linear-gradient(45deg, #00FFFF, #FF00FF, #00FF00, #00FFFF) 1;
    padding: 24px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.1),
      inset 0 0 20px rgba(0, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00FFFF, transparent);
      animation: scanline 3s linear infinite;
    }
  }

  .eldritch-button {
    font-family: ${props => props.theme?.fonts?.button || "'Inter', sans-serif"};
    font-weight: 500;
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 14px;
    letter-spacing: 0.025em;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    
    &.primary {
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    }
    
    &.secondary {
      background: linear-gradient(135deg, #10B981, #059669);
    }
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  .modern-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid #374151;
    border-radius: 12px;
    color: #F8FAFC;
    font-family: ${props => props.theme?.fonts?.primary || "'Inter', sans-serif"};
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
      color: #64748B;
    }
  }

  /* Legacy input support */
  .cosmic-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid #374151;
    border-radius: 12px;
    color: #F8FAFC;
    font-family: ${props => props.theme?.fonts?.primary || "'Inter', sans-serif"};
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
      color: #64748B;
    }
  }
  
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #334155;
      border-top: 3px solid #3B82F6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  /* Legacy loading support */
  .loading-tentacles {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    
    .spinner, .tentacle {
      width: 8px;
      height: 40px;
      background: linear-gradient(0deg, #3B82F6, #8B5CF6);
      margin: 0 4px;
      border-radius: 4px;
      animation: pulse 1s ease-in-out infinite;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.1s; }
      &:nth-child(3) { animation-delay: 0.2s; }
      &:nth-child(4) { animation-delay: 0.3s; }
      &:nth-child(5) { animation-delay: 0.4s; }
    }
  }
  
  @media (max-width: 768px) {
    .modern-card, .cosmic-card {
      padding: 16px;
      margin: 12px 0;
    }
    
    body {
      font-size: 14px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
  }
`;