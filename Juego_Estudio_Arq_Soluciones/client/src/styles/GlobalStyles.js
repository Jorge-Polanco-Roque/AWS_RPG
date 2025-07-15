import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&family=Butcherman&family=Eater&family=Griffy&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Griffy', cursive;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0d26 25%, #2d1b36 50%, #1a0d26 75%, #0a0a0a 100%);
    color: #e6d7ff;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(75, 0, 130, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(25, 25, 112, 0.05) 0%, transparent 50%);
    z-index: -1;
    pointer-events: none;
  }
  
  .App {
    position: relative;
    z-index: 1;
    min-height: 100vh;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Creepster', cursive;
    text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
  }
  
  .cosmic-title {
    font-family: 'Nosifer', cursive;
    color: #ff0066;
    text-shadow: 
      0 0 5px #ff0066,
      0 0 10px #ff0066,
      0 0 20px #ff0066,
      0 0 40px #ff0066;
    animation: pulse 2s ease-in-out infinite alternate;
  }
  
  @keyframes pulse {
    from {
      text-shadow: 
        0 0 5px #ff0066,
        0 0 10px #ff0066,
        0 0 20px #ff0066,
        0 0 40px #ff0066;
    }
    to {
      text-shadow: 
        0 0 2px #ff0066,
        0 0 5px #ff0066,
        0 0 10px #ff0066,
        0 0 20px #ff0066;
    }
  }
  
  .eldritch-button {
    font-family: 'Butcherman', cursive;
    background: linear-gradient(45deg, #4a0e4e, #2d1b36);
    border: 2px solid #8a2be2;
    color: #e6d7ff;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.3), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(138, 43, 226, 0.3);
      border-color: #ff0066;
      
      &::before {
        left: 100%;
      }
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
  
  .cosmic-card {
    background: rgba(26, 13, 38, 0.8);
    border: 1px solid #4a0e4e;
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #8a2be2, transparent);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #ff0066, transparent);
    }
  }
  
  .sanity-bar {
    width: 100%;
    height: 20px;
    background: #1a0d26;
    border: 1px solid #4a0e4e;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    
    .sanity-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff0066, #8a2be2, #00ff88);
      transition: width 0.5s ease;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmer 2s infinite;
      }
    }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .knowledge-shard {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, #00ff88, #8a2be2);
    border-radius: 50%;
    margin: 0 2px;
    animation: float 3s ease-in-out infinite;
    
    &:nth-child(odd) {
      animation-delay: -1s;
    }
    
    &:nth-child(even) {
      animation-delay: -2s;
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .cosmic-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(26, 13, 38, 0.8);
    border: 1px solid #4a0e4e;
    border-radius: 8px;
    color: #e6d7ff;
    font-family: 'Griffy', cursive;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #8a2be2;
      box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
    }
    
    &::placeholder {
      color: #666;
    }
  }
  
  .loading-tentacles {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    
    .tentacle {
      width: 8px;
      height: 40px;
      background: linear-gradient(0deg, #8a2be2, #ff0066);
      margin: 0 4px;
      border-radius: 4px;
      animation: writhe 1s ease-in-out infinite;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.1s; }
      &:nth-child(3) { animation-delay: 0.2s; }
      &:nth-child(4) { animation-delay: 0.3s; }
      &:nth-child(5) { animation-delay: 0.4s; }
    }
  }
  
  @keyframes writhe {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.5); }
  }
  
  .cosmic-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }
  
  .question-card {
    background: linear-gradient(135deg, rgba(26, 13, 38, 0.9), rgba(45, 27, 54, 0.9));
    border: 2px solid #4a0e4e;
    border-radius: 16px;
    padding: 32px;
    margin: 20px 0;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, #8a2be2, transparent);
      animation: rotate 8s linear infinite;
      opacity: 0.1;
    }
    
    .question-content {
      position: relative;
      z-index: 1;
    }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .option-button {
    width: 100%;
    padding: 16px;
    margin: 8px 0;
    background: rgba(26, 13, 38, 0.6);
    border: 1px solid #4a0e4e;
    border-radius: 8px;
    color: #e6d7ff;
    font-family: 'Griffy', cursive;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.2), transparent);
      transition: left 0.3s;
    }
    
    &:hover {
      border-color: #8a2be2;
      background: rgba(138, 43, 226, 0.1);
      
      &::before {
        left: 100%;
      }
    }
    
    &.selected {
      border-color: #ff0066;
      background: rgba(255, 0, 102, 0.1);
    }
    
    &.correct {
      border-color: #00ff88;
      background: rgba(0, 255, 136, 0.1);
    }
    
    &.incorrect {
      border-color: #ff0066;
      background: rgba(255, 0, 102, 0.1);
    }
  }
  
  .cosmic-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #1a0d26, #2d1b36);
    border: 1px solid #4a0e4e;
    border-radius: 8px;
    padding: 16px;
    color: #e6d7ff;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    
    &.success {
      border-color: #00ff88;
    }
    
    &.error {
      border-color: #ff0066;
    }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .entity-portrait {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: radial-gradient(circle, #1a0d26, #4a0e4e);
    border: 3px solid #8a2be2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    margin: 20px auto;
    animation: breathe 4s ease-in-out infinite;
    
    &::before {
      content: '👁️';
      animation: blink 3s ease-in-out infinite;
    }
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes blink {
    0%, 90%, 100% { opacity: 1; }
    95% { opacity: 0; }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  
  .stat-card {
    background: rgba(26, 13, 38, 0.8);
    border: 1px solid #4a0e4e;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    position: relative;
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #8a2be2;
      display: block;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #e6d7ff;
      margin-top: 4px;
    }
  }
  
  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #4a0e4e;
    }
    
    th {
      background: rgba(138, 43, 226, 0.2);
      color: #e6d7ff;
      font-family: 'Butcherman', cursive;
    }
    
    tbody tr:hover {
      background: rgba(138, 43, 226, 0.1);
    }
    
    .rank-cell {
      font-weight: bold;
      color: #ff0066;
    }
    
    .username-cell {
      font-family: 'Butcherman', cursive;
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .question-card {
      padding: 20px;
      margin: 10px 0;
    }
    
    .cosmic-card {
      padding: 16px;
    }
  }
`;