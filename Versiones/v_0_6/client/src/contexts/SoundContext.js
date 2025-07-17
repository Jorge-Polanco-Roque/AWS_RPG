import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('cosmic_sound_enabled') !== 'false';
  });
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('cosmic_volume')) || 0.5;
  });

  useEffect(() => {
    localStorage.setItem('cosmic_sound_enabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('cosmic_volume', volume.toString());
  }, [volume]);

  // Simple sound implementation using Web Audio API
  const playSound = (soundName, options = {}) => {
    if (!soundEnabled) return;
    
    try {
      // Create a simple beep sound for now
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sounds
      const frequencies = {
        button: 800,
        correct: 600,
        incorrect: 300,
        ambient: 200,
        levelUp: 1000,
        sanityLoss: 150,
        cosmicHorror: 100
      };
      
      oscillator.frequency.setValueAtTime(frequencies[soundName] || 400, audioContext.currentTime);
      oscillator.type = soundName === 'cosmicHorror' ? 'sawtooth' : 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      if (options.onEnd) {
        setTimeout(options.onEnd, 100);
      }
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error);
    }
  };

  const stopSound = (soundName) => {
    // Simple implementation - sounds auto-stop
  };

  const playBackgroundMusic = () => {
    if (!soundEnabled) return;
    // Could implement continuous ambient sound here
  };

  const stopBackgroundMusic = () => {
    // Stop ambient sound
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const stopAllSounds = () => {
    // Stop all sounds
  };

  const setGlobalVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const value = {
    soundEnabled,
    volume,
    playSound,
    stopSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    toggleSound,
    stopAllSounds,
    setGlobalVolume,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};