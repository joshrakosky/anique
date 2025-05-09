import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AniqueSphere from '../../components/AniqueSphere';
import { updateSpeechState } from '../../components/AniqueSphere';

// Solar Flare component that creates animated particles
const SolarFlares: React.FC = () => {
  useEffect(() => {
    // Node position type definition
    interface NodePosition {
      x: number;
      y: number;
      element: HTMLElement;
      size: number;
    }

    // Create a container for the flares
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '0';
    document.body.appendChild(container);

    // Create CSS for the flares and neural particles
    const style = document.createElement('style');
    style.innerHTML = `
      .solar-flare {
        position: absolute;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 140, 0, 0.4) 40%, rgba(255, 69, 0, 0) 70%);
        border-radius: 50%;
        opacity: 0;
        filter: blur(8px);
        animation: flareAnimation 10s infinite linear;
        transform-origin: center center;
        z-index: 0;
      }
      
      .neural-node {
        position: absolute;
        background: rgba(255, 215, 0, 0.7);
        border-radius: 50%;
        opacity: 0;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        animation: nodeAnimation var(--duration) infinite ease-in-out;
        transform-origin: center center;
        z-index: 0;
      }
      
      .neural-connection {
        position: absolute;
        background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.3), rgba(255, 215, 0, 0.1));
        height: 2px;
        transform-origin: left center;
        opacity: 0;
        animation: connectionAnimation var(--duration) infinite ease-in-out;
        z-index: 0;
      }
      
      .data-packet {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        opacity: 0;
        animation: packetAnimation var(--duration) infinite linear;
        z-index: 0;
        box-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
      }
      
      .digital-symbol {
        position: absolute;
        color: rgba(255, 215, 0, 0.7);
        font-family: monospace;
        font-size: 12px;
        opacity: 0;
        animation: symbolAnimation var(--duration) infinite ease-in-out;
        z-index: 0;
      }
      
      @keyframes flareAnimation {
        0% {
          opacity: 0;
          transform: scale(0.3) translate(0, 0);
        }
        20% {
          opacity: 0.7;
        }
        80% {
          opacity: 0.5;
        }
        100% {
          opacity: 0;
          transform: scale(2.5) translate(var(--random-x), var(--random-y));
        }
      }
      
      @keyframes nodeAnimation {
        0% {
          opacity: 0;
          transform: scale(0) translate(0, 0);
        }
        10% {
          opacity: 0.8;
          transform: scale(1);
        }
        70% {
          opacity: 0.6;
        }
        100% {
          opacity: 0;
          transform: scale(0.8) translate(var(--random-x), var(--random-y));
        }
      }
      
      @keyframes connectionAnimation {
        0% {
          opacity: 0;
          transform: scaleX(0) rotate(var(--angle));
        }
        15% {
          opacity: 0.5;
          transform: scaleX(1) rotate(var(--angle));
        }
        85% {
          opacity: 0.5;
          transform: scaleX(1) rotate(var(--angle));
        }
        100% {
          opacity: 0;
          transform: scaleX(0.9) rotate(var(--angle));
        }
      }
      
      @keyframes packetAnimation {
        0% {
          opacity: 0;
          transform: translate(var(--start-x), var(--start-y));
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translate(var(--end-x), var(--end-y));
        }
      }
      
      @keyframes symbolAnimation {
        0% {
          opacity: 0;
          transform: translateY(0) scale(0.8);
        }
        30% {
          opacity: 0.8;
          transform: translateY(-15px) scale(1);
        }
        70% {
          opacity: 0.6;
        }
        100% {
          opacity: 0;
          transform: translateY(-30px) scale(0.9);
        }
      }
    `;
    document.head.appendChild(style);

    // Function to create traditional flares
    const createFlare = () => {
      const flare = document.createElement('div');
      flare.classList.add('solar-flare');
      
      // Random size between 50px and 200px
      const size = 50 + Math.random() * 150;
      flare.style.width = `${size}px`;
      flare.style.height = `${size}px`;
      
      // Position around the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (Math.random() - 0.5) * 200;
      const offsetY = (Math.random() - 0.5) * 200;
      
      flare.style.left = `${centerX + offsetX - size/2}px`;
      flare.style.top = `${centerY + offsetY - size/2}px`;
      
      // Random direction variables
      const randomX = (Math.random() - 0.5) * 300;
      const randomY = (Math.random() - 0.5) * 300;
      flare.style.setProperty('--random-x', `${randomX}px`);
      flare.style.setProperty('--random-y', `${randomY}px`);
      
      // Random animation duration and delay
      const duration = 5 + Math.random() * 8;
      flare.style.animationDuration = `${duration}s`;
      flare.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(flare);
      
      // Remove flare after animation completes
      setTimeout(() => {
        flare.remove();
      }, duration * 1000 + 2000);
    };
    
    // Function to create neural nodes (small connection points)
    const createNeuralNode = (): NodePosition => {
      const node = document.createElement('div');
      node.classList.add('neural-node');
      
      // Random small size
      const size = 3 + Math.random() * 8;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      
      // Position spread across the screen
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      node.style.left = `${posX}px`;
      node.style.top = `${posY}px`;
      
      // Random movement
      const randomX = (Math.random() - 0.5) * 100;
      const randomY = (Math.random() - 0.5) * 100;
      node.style.setProperty('--random-x', `${randomX}px`);
      node.style.setProperty('--random-y', `${randomY}px`);
      
      // Animation duration
      const duration = 3 + Math.random() * 5;
      node.style.setProperty('--duration', `${duration}s`);
      
      container.appendChild(node);
      
      // Store position for potential connections
      const nodePosition: NodePosition = { x: posX, y: posY, element: node, size: size };
      
      // Remove node after animation completes
      setTimeout(() => {
        node.remove();
      }, duration * 1000 + 1000);
      
      return nodePosition;
    };
    
    // Function to create connection between nodes
    const createConnection = (start: NodePosition, end: NodePosition): void => {
      const connection = document.createElement('div');
      connection.classList.add('neural-connection');
      
      // Position and size based on start and end nodes
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      connection.style.width = `${distance}px`;
      connection.style.left = `${start.x + start.size/2}px`;
      connection.style.top = `${start.y + start.size/2}px`;
      connection.style.setProperty('--angle', `${angle}deg`);
      
      // Animation duration - slightly faster than nodes
      const duration = 2 + Math.random() * 3;
      connection.style.setProperty('--duration', `${duration}s`);
      
      container.appendChild(connection);
      
      // Create data packet that travels along connection
      if (Math.random() > 0.3) {
        createDataPacket(start, end, duration);
      }
      
      // Remove connection after animation completes
      setTimeout(() => {
        connection.remove();
      }, duration * 1000 + 500);
    };
    
    // Function to create data packets that move along connections
    const createDataPacket = (start: NodePosition, end: NodePosition, duration: number): void => {
      const packet = document.createElement('div');
      packet.classList.add('data-packet');
      
      // Set start and end positions for animation
      packet.style.setProperty('--start-x', `${start.x + start.size/2}px`);
      packet.style.setProperty('--start-y', `${start.y + start.size/2}px`);
      packet.style.setProperty('--end-x', `${end.x + end.size/2}px`);
      packet.style.setProperty('--end-y', `${end.y + end.size/2}px`);
      packet.style.setProperty('--duration', `${duration}s`);
      
      // Initial position
      packet.style.left = '0';
      packet.style.top = '0';
      
      container.appendChild(packet);
      
      // Remove packet after animation completes
      setTimeout(() => {
        packet.remove();
      }, duration * 1000 + 500);
    };
    
    // Function to create digital symbols (1s and 0s floating up)
    const createDigitalSymbol = () => {
      const symbol = document.createElement('div');
      symbol.classList.add('digital-symbol');
      
      // Choose a random symbol
      const symbols = ['1', '0', '{', '}', '[', ']', '<', '>', '|', '/', '$', '#', '@'];
      symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      
      // Position
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      symbol.style.left = `${posX}px`;
      symbol.style.top = `${posY}px`;
      
      // Animation duration
      const duration = 3 + Math.random() * 4;
      symbol.style.setProperty('--duration', `${duration}s`);
      
      container.appendChild(symbol);
      
      // Remove symbol after animation completes
      setTimeout(() => {
        symbol.remove();
      }, duration * 1000 + 500);
    };
    
    // Store active nodes for connections
    const activeNodes: NodePosition[] = [];
    
    // Create initial elements
    for (let i = 0; i < 5; i++) {
      createFlare();
    }
    
    for (let i = 0; i < 10; i++) {
      const node = createNeuralNode();
      activeNodes.push(node);
    }
    
    for (let i = 0; i < 5; i++) {
      createDigitalSymbol();
    }
    
    // Initialize connections between some random nodes
    for (let i = 0; i < 5; i++) {
      if (activeNodes.length >= 2) {
        const startIndex = Math.floor(Math.random() * activeNodes.length);
        let endIndex;
        do {
          endIndex = Math.floor(Math.random() * activeNodes.length);
        } while (endIndex === startIndex);
        
        createConnection(activeNodes[startIndex], activeNodes[endIndex]);
      }
    }
    
    // Create new elements periodically
    const flareInterval = setInterval(() => {
      if (Math.random() > 0.5) createFlare();
    }, 2000);
    
    const nodeInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const newNode = createNeuralNode();
        if (Math.random() > 0.6 && activeNodes.length >= 2) {
          // Choose random nodes to connect
          const startIndex = Math.floor(Math.random() * activeNodes.length);
          let endIndex;
          do {
            endIndex = Math.floor(Math.random() * activeNodes.length);
          } while (endIndex === startIndex);
          
          createConnection(activeNodes[startIndex], activeNodes[endIndex]);
        }
      }
    }, 300);
    
    const symbolInterval = setInterval(() => {
      if (Math.random() > 0.8) createDigitalSymbol();
    }, 800);
    
    // Use sphere thinking state for a dynamic effect
    const thinkingInterval = setInterval(() => {
      const isThinking = Math.random() > 0.7;
      updateSpeechState(false, 0, isThinking);
      
      // Create more elements when "thinking"
      if (isThinking) {
        for (let i = 0; i < 3; i++) {
          createNeuralNode();
          if (Math.random() > 0.5) createDigitalSymbol();
        }
      }
    }, 3000);
    
    return () => {
      clearInterval(flareInterval);
      clearInterval(nodeInterval);
      clearInterval(symbolInterval);
      clearInterval(thinkingInterval);
      if (container) container.remove();
      if (style) style.remove();
      updateSpeechState(false, 0, false);
    };
  }, []);
  
  return null;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'black',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background sphere animation */}
      <div style={{ 
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0 
      }}>
        {/* Add gradient overlay for depth */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'radial-gradient(circle at center, rgba(30, 20, 60, 0.3), rgba(10, 5, 20, 0.8))',
          zIndex: 1 
        }} />
        
        <Suspense fallback={null}>
          <AniqueSphere />
        </Suspense>
        
        {/* Solar flares animation */}
        <SolarFlares />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(20, 20, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '450px',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 50px rgba(255, 215, 0, 0.15)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontFamily: "'Rajdhani', sans-serif",
              background: 'linear-gradient(to right, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ANIQUE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Sign in to your account
          </motion.p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem'
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <label 
                htmlFor="password" 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.875rem'
                }}
              >
                Password
              </label>
              <motion.a 
                href="#"
                whileHover={{ color: 'rgba(255, 215, 0, 0.9)' }}
                style={{ 
                  color: 'rgba(255, 215, 0, 0.7)', 
                  fontSize: '0.875rem',
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </motion.a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'rgba(30, 30, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { 
              scale: 1.02, 
              backgroundColor: 'rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' 
            } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 215, 0, 0.2)',
              border: '1px solid rgba(255, 215, 0, 0.5)',
              color: 'white',
              cursor: isLoading ? 'default' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: "'Rajdhani', sans-serif",
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="thinking-dot"></span>
                <span className="thinking-dot"></span>
                <span className="thinking-dot"></span>
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.875rem'
        }}>
          <span>Don't have an account? </span>
          <motion.a 
            href="#"
            whileHover={{ color: 'rgba(255, 215, 0, 0.9)' }}
            style={{ 
              color: 'rgba(255, 215, 0, 0.7)', 
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Create an account
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 