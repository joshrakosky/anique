import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateSpeechState } from './AniqueSphere';

interface Message {
  text: string;
  sender: 'user' | 'anique';
  timestamp: Date;
}

// TypeScript declaration for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const predefinedResponses = [
  "I'm Anique, your AI assistant. How can I help you today?",
  "I'm analyzing your data to provide insights. Which specific metrics would you like to review?",
  "I can help automate your workflows. What tasks do you find most repetitive?",
  "I've identified some potential improvements in your current processes.",
  "Based on current trends, I recommend focusing on growth in these areas.",
  "I can schedule that for you. When would you like it to occur?",
  "I've added that task to your priority list.",
  "I'm here to make your business more efficient. What's your biggest challenge right now?",
  "I'm continuously learning from our interactions to better serve your needs.",
  "Let me think about that for a moment...",
];

const ChatInterface: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm Anique. How can I assist you today?",
      sender: 'anique',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => {
          handleSend(transcript);
        }, 500);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
    
    // Initialize available voices when possible
    if ('speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        loadPreferredVoice();
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        if (speechSynthesisRef.current) {
          window.speechSynthesis.cancel();
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Create a preferred voice
  const loadPreferredVoice = () => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a female voice
      const preferredVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Google UK English Female')
      );
      
      // Create utterance with preferred voice
      const utterance = new SpeechSynthesisUtterance();
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Adjust settings for a more human-like speech
      utterance.rate = 1.0;
      utterance.pitch = 1.1;  // Slightly higher pitch for feminine voice
      utterance.volume = 1.0;
      
      speechSynthesisRef.current = utterance;
    }
  };
  
  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // If there's a new message from Anique and voice is enabled, read it aloud
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'anique' && voiceEnabled) {
      speakText(lastMessage.text);
    }
  }, [messages, voiceEnabled]);
  
  // Update speech intensity based on current word being spoken
  useEffect(() => {
    if (isSpeaking) {
      // Create animation frame to update speech intensity
      let intensity = 0;
      let direction = 1;
      let lastTime = 0;
      
      const updateIntensity = (time: number) => {
        if (time - lastTime > 100) { // Update every 100ms
          // Change direction occasionally
          if (Math.random() > 0.9) {
            direction = Math.random() > 0.5 ? 1 : -1;
          }
          
          // Update intensity with some randomness
          intensity += direction * (0.1 + Math.random() * 0.1);
          
          // Keep within bounds
          if (intensity > 1) {
            intensity = 1;
            direction = -1;
          } else if (intensity < 0.2) {
            intensity = 0.2;
            direction = 1;
          }
          
          // Update speech state in the sphere component
          updateSpeechState(true, intensity);
          lastTime = time;
        }
        
        if (isSpeaking) {
          requestAnimationFrame(updateIntensity);
        }
      };
      
      const animationId = requestAnimationFrame(updateIntensity);
      
      return () => {
        cancelAnimationFrame(animationId);
        updateSpeechState(false, 0);
      };
    }
  }, [isSpeaking]);
  
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      if (!speechSynthesisRef.current) {
        loadPreferredVoice();
      }
      
      if (speechSynthesisRef.current) {
        const utterance = speechSynthesisRef.current;
        utterance.text = text;
        
        // Add speech markers for animation
        setIsSpeaking(true);
        updateSpeechState(true, 0.5);
        
        utterance.onend = () => {
          setIsSpeaking(false);
          updateSpeechState(false, 0);
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          updateSpeechState(false, 0);
        };
        
        // Add natural pauses between sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 1) {
          // Speak sentence by sentence with slight pauses
          speakSentences(sentences, 0);
        } else {
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };
  
  // Helper to speak sentences with natural pauses
  const speakSentences = (sentences: string[], index: number) => {
    if (index >= sentences.length) {
      setIsSpeaking(false);
      updateSpeechState(false, 0);
      return;
    }
    
    if (speechSynthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
      if (speechSynthesisRef.current.voice) {
        utterance.voice = speechSynthesisRef.current.voice;
      }
      utterance.rate = speechSynthesisRef.current.rate;
      utterance.pitch = speechSynthesisRef.current.pitch;
      utterance.volume = speechSynthesisRef.current.volume;
      
      utterance.onend = () => {
        // Add a natural pause between sentences
        setTimeout(() => {
          speakSentences(sentences, index + 1);
        }, 300);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Speech recognition error:', error);
        }
      }
    }
  };
  
  const handleSend = (text = input) => {
    if (text.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const randomResponse = predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
      
      const aniqueMessage: Message = {
        text: randomResponse,
        sender: 'anique',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aniqueMessage]);
      setIsThinking(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="chat-container"
      style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        width: '400px',
        height: '500px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 100,
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
        background: 'rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isSpeaking ? '#ff8c00' : '#FFD700',
            boxShadow: `0 0 5px ${isSpeaking ? '#ff8c00' : '#FFD700'}`,
            animation: isSpeaking ? 'pulse 1s infinite' : 'none'
          }} />
          <h3 style={{ 
            margin: 0,
            color: '#FFD700',
            fontFamily: "'Rajdhani', sans-serif"
          }}>
            ANIQUE ASSISTANT
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{
              background: 'transparent',
              border: 'none',
              color: voiceEnabled ? '#FFD700' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            title={voiceEnabled ? "Mute voice" : "Unmute voice"}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div style={{
              background: message.sender === 'user' 
                ? 'rgba(100, 100, 150, 0.3)' 
                : 'rgba(255, 215, 0, 0.1)',
              padding: '0.8rem',
              borderRadius: message.sender === 'user' ? '10px 10px 0 10px' : '10px 10px 10px 0',
              boxShadow: message.sender === 'anique' ? '0 0 5px rgba(255, 215, 0, 0.2)' : 'none',
              border: message.sender === 'anique' ? '1px solid rgba(255, 215, 0, 0.2)' : 'none'
            }}>
              {message.text}
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: message.sender === 'user' ? 'right' : 'left',
              marginTop: '0.2rem'
            }}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '80%'
          }}>
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              padding: '0.8rem',
              borderRadius: '10px 10px 10px 0',
              boxShadow: '0 0 5px rgba(255, 215, 0, 0.2)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              display: 'flex',
              gap: '0.3rem'
            }}>
              <span className="thinking-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FFD700',
                opacity: 0.7,
                animation: 'pulse 1s infinite',
              }}></span>
              <span className="thinking-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FFD700',
                opacity: 0.7,
                animation: 'pulse 1s infinite 0.2s',
              }}></span>
              <span className="thinking-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FFD700',
                opacity: 0.7,
                animation: 'pulse 1s infinite 0.4s',
              }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255, 215, 0, 0.3)',
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(0, 0, 0, 0.5)'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Anique..."
          style={{
            flex: 1,
            padding: '0.7rem',
            borderRadius: '5px',
            background: 'rgba(30, 30, 50, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            resize: 'none',
            height: '40px',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.9rem'
          }}
        />
        <button
          onClick={() => handleSend()}
          style={{
            padding: '0.7rem 1rem',
            background: 'rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '5px',
            color: '#FFD700',
            cursor: 'pointer',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          SEND
        </button>
        <button
          onClick={toggleListening}
          style={{
            padding: '0.7rem',
            background: isListening ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 215, 0, 0.2)',
            border: `1px solid ${isListening ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 215, 0, 0.5)'}`,
            borderRadius: '5px',
            color: isListening ? '#ff6b6b' : '#FFD700',
            cursor: 'pointer',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            animation: isListening ? 'record-pulse 1.5s infinite' : 'none'
          }}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          🎙️
        </button>
      </div>
    </motion.div>
  );
};

export default ChatInterface; 