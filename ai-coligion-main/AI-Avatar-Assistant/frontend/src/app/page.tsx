'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';
import AvatarPlayer from '../components/AvatarPlayer';
import BackgroundEffects from '../components/BackgroundEffects';

// Import components
import MessageBubble from '../components/MessageBubble';
import VoiceInput from '../components/VoiceInput';

// Import animation variants
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';

// Custom types
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Add DID SDK type definition
declare global {
  interface Window {
    DID?: any;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Check D-ID SDK availability
if (typeof window !== 'undefined') {
  console.log('Checking D-ID SDK availability');
  // Log when the DID global object is set
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (prop === 'DID' && obj === window) {
      console.log('D-ID SDK being set on window object');
    }
    return originalDefineProperty(obj, prop, descriptor);
  };
  
  // Check if DID is already available
  setTimeout(() => {
    console.log('D-ID SDK after timeout:', window.DID ? 'Available' : 'Not available');
    if (window.DID) {
      console.log('D-ID SDK properties:', Object.keys(window.DID));
    }
  }, 5000);
}

export default function Home() {
  // State management
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [agentContainerVisible, setAgentContainerVisible] = useState(true);
  const [isProcessingVoiceInput, setIsProcessingVoiceInput] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing');
  const [avatarMood, setAvatarMood] = useState('neutral');
  const [isMuted, setIsMuted] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const didAgentRef = useRef<HTMLDivElement>(null);

  // Initialize mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize D-ID Agent 
  useEffect(() => {
    if (!mounted) return;
    
    // Set initial loading stage
    setLoadingStage('Initializing systems');
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        
        // Update loading stage based on progress
        if (prev === 10) setLoadingStage('Loading neural pathways');
        if (prev === 30) setLoadingStage('Connecting to backend services');
        if (prev === 50) setLoadingStage('Activating avatar systems');
        if (prev === 70) setLoadingStage('Synchronizing voice patterns');
        if (prev === 90) setLoadingStage('Finalizing connection');
        
        return prev + 1;
      });
    }, 100);
    
    // Hide loading overlay when D-ID agent is loaded
    const hideLoadingOverlay = () => {
      const loadingOverlay = document.getElementById('agent-loading-overlay');
      const didAgent = document.querySelector('[data-component="did-agent"]');
      
      if (loadingOverlay && didAgent) {
        // Check if D-ID agent has loaded
        if (typeof window !== 'undefined' && window.DID && window.DID.isLoaded) {
          // Set progress to 100% when loaded
          setLoadingProgress(100);
          setLoadingStage('Connection established');
          
          // Fade out the overlay after a short delay
          setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
              loadingOverlay.style.display = 'none';
            }, 500);
          }, 1000);
          
          console.log('D-ID agent loaded successfully');
        } else {
          // Try again in 1 second
          setTimeout(hideLoadingOverlay, 1000);
        }
      }
    };
    
    // Check initially and start checking for agent load
    hideLoadingOverlay();
    
    // Handle D-ID specific errors in Vercel
    const checkVercelDIDIssues = () => {
      if (typeof window !== 'undefined') {
        // Check for Vercel-specific issues
        const isVercel = window.location.hostname.includes('vercel.app');
        if (isVercel) {
          console.log('Running on Vercel deployment, checking for D-ID agent');
          
          // Check if D-ID agent script loaded
          const didScript = document.querySelector('script[src*="d-id.com"]');
          if (!didScript) {
            console.error('D-ID script tag not found in document');
            const errorEl = document.getElementById('did-error');
            if (errorEl) errorEl.textContent = 'D-ID script tag not found';
          }
          
          // Add extra debugging info
          window.addEventListener('error', (event) => {
            console.error('Caught error:', event.message);
            const errorEl = document.getElementById('did-error');
            if (errorEl) errorEl.textContent = event.message;
          });
        }
      }
    };
    
    checkVercelDIDIssues();
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [mounted]);

  // Setup theme detection
  useEffect(() => {
    if (!mounted) return;
    
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);

    // Listen for changes in theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  // Connect to Socket.io server
  useEffect(() => {
    if (!mounted) return;
    
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
      setError(`Connection error: ${err.message}`);
    });

    // Handle AI responses
    newSocket.on('ai-response', (data) => {
      console.log('Received AI response:', data);
      setIsLoading(false);

      // Extract text from response
      let responseText = '';
      if (typeof data === 'string') {
        responseText = data;
      } else if (data && typeof data === 'object') {
        responseText = data.text || data.answer || data.response || data.content || '';
      }

      if (responseText) {
        addMessage(responseText, false);
      }
    });

    // Handle errors
    newSocket.on('error', (error) => {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Unknown error';
      console.error('Server error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    });

    // Add this inside the bot-message handler:
    // Trigger D-ID agent to speak if SDK is loaded and message has content
    newSocket.on('bot-message', (data) => {
      if (typeof window !== 'undefined' && window.DID && window.DID.speak && data.message) {
        try {
          window.DID.speak({
            text: data.message,
            provider: { type: 'microsoft' },
            config: { 
              fluent: true,
              pad_audio: 0,
              stitch: true
            }
          });
        } catch (error) {
          console.error('Error making D-ID agent speak:', error);
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [mounted]);

  // Add a message to the chat
  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setTimeout(() => scrollToBottom(), 100);
  }, []);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message to server
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    addMessage(text, true);
    setInputValue('');
    setIsLoading(true);

    // Send to server if connected
    if (socket && socket.connected) {
      socket.emit('user-message', {
        message: text,
        // Disable built-in avatar since we're using D-ID
        avatar: false
      });
    } else {
      setError('Server connection not available. Please try again later.');
      setIsLoading(false);
    }
  }, [socket, addMessage]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Handle voice input - improve this function to ensure messages are sent
  const handleVoiceInput = (text: string) => {
    console.log("Voice input received:", text); // Debug log
    
    if (!text.trim()) {
      console.log("Empty text, not sending"); 
      return;
    }
    
    // Remove filler words and clean up text
    const cleanedText = text.trim()
      .replace(/^(um|uh|like|so|well|you know|basically)\s+/gi, '')
      .replace(/\s+(um|uh)\s+/gi, ' ')
      .replace(/[.!?]$/g, '');
    
    console.log("Cleaned text:", cleanedText); // Debug log
    
    // Only process if we have meaningful text after cleaning
    if (cleanedText && cleanedText.length > 1) {
      // Force UI update before sending
      setIsProcessingVoiceInput(true);
      
      // Small delay to ensure the UI is updated
      setTimeout(() => {
        // Use the existing sendMessage function with force parameter
        sendMessage(cleanedText);
        
        // Clear processing state after sending
        setTimeout(() => {
          setIsProcessingVoiceInput(false);
        }, 500);
      }, 100);
    } else {
      console.log("Text too short after cleaning, not sending");
      setIsProcessingVoiceInput(false);
    }
  };

  // Add this function to handle listening state changes 
  const handleVoiceListeningChange = (isListening: boolean) => {
    setIsListening(isListening);
    
    // Trigger D-ID agent speaking animation on listening
    if (typeof window !== 'undefined' && window.DID) {
      try {
        // When user starts listening, show agent is attentive
        if (isListening) {
          // Trigger a subtle "listening" animation if DID SDK supports it
          if (window.DID.setIntent) {
            window.DID.setIntent('listening');
          }
        } else {
          // When user stops listening, reset agent intent
          if (window.DID.setIntent) {
            window.DID.setIntent('neutral');
          }
        }
      } catch (error) {
        console.error('Error communicating with D-ID agent:', error);
      }
    }
  };

  // Toggle agent container visibility (mobile-friendly)
  const toggleAgentContainer = () => {
    setAgentContainerVisible(prev => !prev);
  };

  // Toggle debug panel
  const toggleDebugPanel = () => {
    setIsDebugExpanded(prev => !prev);
  };

  // Suggested queries
  const suggestedQueries = [
    "What is the IDMS ERP system?",
    "Explain the Sales Module",
    "How does IDMS help with GST compliance?",
  ];

  // Check for D-ID element existence
  useEffect(() => {
    if (!mounted) return;
    
    // Update D-ID element status
    const updateDIDElementStatus = () => {
      const statusElement = document.getElementById('did-element-status');
      const didElement = document.querySelector('did-agent');
      
      if (statusElement) {
        if (didElement) {
          statusElement.textContent = 'Found';
          statusElement.className = 'text-green-400';
          console.log('D-ID agent element found in DOM');
        } else {
          statusElement.textContent = 'Not found';
          statusElement.className = 'text-red-400';
          console.log('D-ID agent element NOT found in DOM');
        }
      }
    };

    // Check initially and then periodically
    updateDIDElementStatus();
    const checkInterval = setInterval(updateDIDElementStatus, 5000);
    
    // Special handling for Vercel environment
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      console.log('Vercel environment detected, applying special D-ID handling');
      
      // Ensure did-agent element exists
      setTimeout(() => {
        const didContainer = document.getElementById('did-container');
        if (didContainer && !document.querySelector('did-agent')) {
          console.log('Forcing creation of did-agent element on Vercel');
          didContainer.innerHTML = '<did-agent></did-agent>';
        }
      }, 3000);
    }
    
    return () => clearInterval(checkInterval);
  }, [mounted]);

  // Add useEffect for sound wave animation
  useEffect(() => {
    if (!mounted || !isListening) return;
    
    // Update the sound wave heights based on volume
    const updateSoundWaves = () => {
      const waves = document.querySelectorAll('.sound-wave-bar');
      
      waves.forEach((wave, i) => {
        const element = wave as HTMLElement;
        const height = Math.max(15, Math.min(80, 
          20 + Math.sin(Date.now() / (500 + i * 50)) * 20 + (volume * 60)
        ));
        
        if (element) {
          element.style.height = `${height}%`;
        }
      });
      
      if (isListening) {
        requestAnimationFrame(updateSoundWaves);
      }
    };
    
    // Start the animation
    const animationId = requestAnimationFrame(updateSoundWaves);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [mounted, isListening, volume]);

  // Function to change avatar mood
  const changeAvatarMood = (mood: string) => {
    setAvatarMood(mood);
    
    // Update D-ID agent mood if SDK available
    if (typeof window !== 'undefined' && window.DID && window.DID.setIntent) {
      try {
        window.DID.setIntent(mood);
      } catch (error) {
        console.error('Error setting D-ID mood:', error);
      }
    }
  };

  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Update D-ID agent if SDK available
    if (typeof window !== 'undefined' && window.DID) {
      try {
        if (!isMuted) {
          // Mute
          if (window.DID.setVolume) window.DID.setVolume(0);
        } else {
          // Unmute
          if (window.DID.setVolume) window.DID.setVolume(1);
        }
      } catch (error) {
        console.error('Error toggling mute:', error);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background with blur and translucent effect like navbar */}
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md z-0"></div>
      
      <BackgroundEffects />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-16 pb-10">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AI Avatar</span> Experience
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Interact with our cutting-edge AI avatar assistant powered by next-generation natural language processing and realistic 3D rendering.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/demo">
                <motion.button 
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  Try Demo
                </motion.button>
              </Link>
              <Link href="/features">
                <motion.button 
                  className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-white font-medium rounded-full flex items-center hover:bg-gray-700/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                  </svg>
                  Features
                </motion.button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="mt-10 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full h-80 relative">
              <AvatarPlayer />
            </div>
          </motion.div>
        </div>
        
        {/* Feature Cards Section */}
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Why Choose AI Avatar Assistant?
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 150 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1 w-[150px] bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Natural Conversations',
                description: 'Engage in fluid, context-aware conversations with an AI that understands nuance and adapts to your communication style.',
                icon: '👄',
                color: 'from-blue-500/20 to-blue-600/20',
                delay: 0.1
              },
              {
                title: 'Expressive Avatars',
                description: 'Interact with lifelike avatars displaying realistic expressions and emotions for enhanced understanding.',
                icon: '😊',
                color: 'from-purple-500/20 to-purple-600/20',
                delay: 0.2
              },
              {
                title: 'Multilingual Support',
                description: 'Communicate in over 40 languages with real-time translation and natural, accent-aware speech synthesis.',
                icon: '🌎',
                color: 'from-green-500/20 to-green-600/20',
                delay: 0.3
              },
              {
                title: 'Enterprise Integration',
                description: 'Seamlessly connect with your existing systems through our comprehensive API and custom integration options.',
                icon: '🔄',
                color: 'from-yellow-500/20 to-yellow-600/20',
                delay: 0.4
              },
              {
                title: 'Privacy Focused',
                description: 'Your data stays secure with end-to-end encryption and configurable data retention policies.',
                icon: '🔒',
                color: 'from-red-500/20 to-red-600/20',
                delay: 0.5
              },
              {
                title: 'Continuous Learning',
                description: 'Our AI improves with each interaction, becoming more personalized and helpful over time.',
                icon: '📈',
                color: 'from-indigo-500/20 to-indigo-600/20',
                delay: 0.6
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-lg`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to experience the future of AI interaction?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Join thousands of users already transforming their digital experience with AI Avatar Assistant.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link 
                href="/contact"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-full shadow-lg inline-flex items-center transition-all duration-300 transform hover:scale-105"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 