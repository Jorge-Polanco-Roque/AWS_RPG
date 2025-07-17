export const cyberpunkTheme = {
  colors: {
    primary: '#00FFFF',       // Cyan neon
    secondary: '#FF00FF',     // Magenta neon
    accent: '#00FF00',        // Green neon
    background: '#0A0A0A',    // Deep black
    backgroundLight: '#1A1A2E', // Dark purple
    backgroundMedium: '#16213E', // Dark blue
    backgroundDark: '#0F0F0F',   // Pure black
    surface: '#1A1A2E',       // Dark purple surface
    surfaceHover: '#16213E',  // Dark blue hover
    text: '#E0E0E0',         // Light gray
    textSecondary: '#00FFFF', // Cyan text
    textMuted: '#808080',     // Gray muted
    textNeon: '#FF00FF',      // Magenta neon text
    success: '#00FF00',       // Green neon
    error: '#FF0040',         // Red neon
    warning: '#FFD700',       // Gold neon
    info: '#00FFFF',          // Cyan info
    border: '#00FFFF',        // Cyan border
    borderLight: '#FF00FF',   // Magenta border
    neonBlue: '#0080FF',      // Neon blue
    neonPink: '#FF1493',      // Deep pink
    neonPurple: '#8A2BE2',    // Blue violet
    neonOrange: '#FF4500',    // Orange red
    hologram: 'rgba(0, 255, 255, 0.1)', // Cyan with transparency
  },
  fonts: {
    primary: "'Orbitron', 'Courier New', monospace",
    title: "'Exo 2', 'Orbitron', sans-serif",
    display: "'Audiowide', 'Orbitron', cursive",
    mono: "'Source Code Pro', 'Courier New', monospace",
    button: "'Rajdhani', 'Orbitron', sans-serif",
    cyber: "'Electrolize', 'Orbitron', sans-serif",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  shadows: {
    xs: '0 0 5px rgba(0, 255, 255, 0.2)',
    sm: '0 0 10px rgba(0, 255, 255, 0.3)',
    md: '0 0 15px rgba(0, 255, 255, 0.4)',
    lg: '0 0 25px rgba(0, 255, 255, 0.5)',
    xl: '0 0 35px rgba(0, 255, 255, 0.6)',
    '2xl': '0 0 50px rgba(0, 255, 255, 0.8)',
    inner: 'inset 0 0 10px rgba(0, 255, 255, 0.3)',
    neonCyan: '0 0 20px #00FFFF, 0 0 40px #00FFFF, 0 0 60px #00FFFF',
    neonMagenta: '0 0 20px #FF00FF, 0 0 40px #FF00FF, 0 0 60px #FF00FF',
    neonGreen: '0 0 20px #00FF00, 0 0 40px #00FF00, 0 0 60px #00FF00',
    neonOrange: '0 0 20px #FF4500, 0 0 40px #FF4500, 0 0 60px #FF4500',
    hologram: '0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.1)',
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-out',
    slideUp: 'slideUp 0.4s ease-out',
    slideDown: 'slideDown 0.4s ease-out',
    scaleIn: 'scaleIn 0.3s ease-out',
    spin: 'spin 2s linear infinite',
    pulse: 'neonPulse 2s ease-in-out infinite',
    bounce: 'cyberbounce 1.5s infinite',
    glitch: 'glitch 0.3s ease-in-out infinite alternate',
    flicker: 'flicker 0.15s infinite linear',
    typewriter: 'typewriter 3s steps(40, end)',
    scanline: 'scanline 2s linear infinite',
  },
  zIndex: {
    background: -1,
    base: 0,
    dropdown: 1000,
    modal: 1100,
    notification: 1200,
    tooltip: 1300,
  },
};