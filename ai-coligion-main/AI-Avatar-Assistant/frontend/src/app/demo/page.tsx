'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';
import ChatInterface from '@/components/ChatInterface';

// Custom AI status indicator component
const StatusIndicator = ({ isActive, label, icon, pulse = false }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-indigo-900/40'} 
      text-blue-200 text-sm px-4 py-2 rounded-full flex items-center transition-all duration-300`}
  >
    <motion.span 
      className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-300' : 'bg-blue-500'} mr-1.5`}
      animate={pulse && isActive ? { scale: [1, 1.5, 1], opacity: [1, 0.7, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <span className="mr-1.5">{label}</span>
    {icon}
  </motion.button>
);

// Real-time metrics component
const MetricCard = ({ title, value, unit, color, showGraph = false }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-indigo-900/40 p-4 rounded-xl hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300"
  >
    <div className="text-gray-400 text-xs mb-1">{title}</div>
    <div className="flex items-baseline">
      <motion.span 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-2xl font-bold text-white"
      >
        {value}
      </motion.span>
      <span className="text-sm text-gray-400 ml-1">{unit}</span>
    </div>
    {showGraph && (
      <div className="w-full h-2 mt-2">
        <div className="h-full bg-indigo-800/50 flex space-x-0.5">
          {[...Array(15)].map((_, i) => (
            <motion.div 
              key={i} 
              className={`w-1 ${color || 'bg-indigo-500'}`} 
              initial={{ height: '40%' }}
              animate={{ 
                height: `${Math.max(30, Math.min(100, 40 + Math.sin(i * 0.5 + Date.now() * 0.001) * 30))}%` 
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.1,
                repeatType: 'mirror'
              }}
            />
          ))}
        </div>
      </div>
    )}
  </motion.div>
);

export default function Demo() {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [processingPercent, setProcessingPercent] = useState(45);
  const [messages, setMessages] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // New AI status states
  const [activeModules, setActiveModules] = useState({
    vision: true,
    voice: false,
    chat: true,
    memory: true
  });
  
  // Update AI module states randomly for demo
  useEffect(() => {
    const moduleIntervals = {
      vision: setInterval(() => {
        setActiveModules(prev => ({ ...prev, vision: Math.random() > 0.2 }));
      }, 8000),
      voice: setInterval(() => {
        if (!isRecording) {
          setActiveModules(prev => ({ ...prev, voice: Math.random() > 0.6 }));
        }
      }, 5000),
      chat: setInterval(() => {
        setActiveModules(prev => ({ ...prev, chat: Math.random() > 0.1 }));
      }, 10000),
      memory: setInterval(() => {
        setActiveModules(prev => ({ ...prev, memory: Math.random() > 0.3 }));
      }, 15000)
    };
    
    return () => {
      Object.values(moduleIntervals).forEach(interval => clearInterval(interval));
    };
  }, [isRecording]);
  
  // Initialization
  useEffect(() => {
    setMounted(true);
    
    // Create audio element for playing audio
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }
    
    // More realistic processing animation
    const interval = setInterval(() => {
      setProcessingPercent(prev => {
        // Create more variation in the processing percentage
        const changeAmount = Math.random() * 10 - 4;
        const directionFactor = prev < 40 ? 1.5 : prev > 70 ? 0.5 : 1;
        const newValue = prev + changeAmount * directionFactor;
        return Math.min(Math.max(newValue, 25), 95);
      });
    }, 1500);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  // Simulate AI response
  const getAIResponse = (userMessage: string) => {
    // Simulate AI thinking
    setTimeout(() => {
      let aiResponse = "I'm not sure how to help with that. Could you provide more details?";
      
      // Check for specific keywords in the user message
      const normalizedMessage = userMessage.toLowerCase();
      
      if (normalizedMessage.includes('idms')) {
        aiResponse = "IDMS is our Integrated Document Management System. It helps businesses digitize, organize, and automate their document workflows. It features secure storage, advanced search, and seamless integration with existing business systems.";
      } else if (normalizedMessage.includes('sales module') || normalizedMessage.includes('sales')) {
        aiResponse = "The Sales Module in IDMS streamlines the entire sales process from lead generation to closing deals. It includes contact management, pipeline tracking, quotation generation, and sales analytics to help your team meet and exceed targets.";
      } else if (normalizedMessage.includes('gst') || normalizedMessage.includes('compliance')) {
        aiResponse = "IDMS ensures GST compliance by automating tax calculations, generating GST-compliant invoices, and producing ready-to-file returns. It keeps track of input and output taxes, helping you avoid penalties and ensuring timely submissions.";
      } else if (normalizedMessage.includes('how') || normalizedMessage.includes('what') || normalizedMessage.includes('?')) {
        aiResponse = "That's a great question! The IDMS system provides comprehensive solutions for document management, business process automation, and regulatory compliance. Would you like me to explain a specific feature in more detail?";
      }
      
      // Generate a unique ID for the message
      const id = Date.now().toString();
      
      // Add AI response to messages
      setMessages(prev => [...prev, { 
        id, 
        text: aiResponse, 
        isUser: false,
        timestamp: new Date()
      }]);
      
      // Use text-to-speech to speak the response
      speakText(aiResponse);
      
    }, 1000);
  };
  
  // Function to handle speech synthesis
  const speakText = (text: string) => {
    // Try to use D-ID agent to speak if available
    const didAgent = (window as any).didAgent;
    
    if (didAgent) {
      try {
        didAgent.speak(text);
        return;
      } catch (error) {
        console.error('Error using D-ID agent:', error);
      }
    }
    
    // Fallback to browser's speech synthesis
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle sending message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Generate a unique ID for the message
    const id = Date.now().toString();
    
    // Add user message to messages
    setMessages(prev => [...prev, { 
      id, 
      text: inputValue, 
      isUser: true,
      timestamp: new Date()
    }]);
    
    // Get AI response
    getAIResponse(inputValue);
    
    // Clear input
    setInputValue('');
  };
  
  // Handle microphone click
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Simulate voice recognition (in a real app, you would send the audio to a speech-to-text service)
        simulateVoiceRecognition();
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      
      // Show error message to user
      alert('Could not access the microphone. Please check your browser permissions.');
      
      setIsRecording(false);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Simulate voice recognition (in a real app, you would process the audio and extract the text)
  const simulateVoiceRecognition = () => {
    // For the demo, just use some predefined phrases
    const recognizedTexts = [
      "Tell me about IDMS",
      "Explain the sales module features",
      "How does IDMS help with GST compliance?",
      "What are the benefits of IDMS?"
    ];
    
    // Randomly select a recognized text
    const recognizedText = recognizedTexts[Math.floor(Math.random() * recognizedTexts.length)];
    
    // Generate a unique ID for the message
    const id = Date.now().toString();
    
    // Add recognized text as user message
    setMessages(prev => [...prev, { 
      id, 
      text: recognizedText, 
      isUser: true,
      timestamp: new Date()
    }]);
    
    // Get AI response
    getAIResponse(recognizedText);
  };
  
  const handlePlayAudio = (audioUrl: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch(err => console.error('Error playing audio:', err));
    }
  };
  
  const handleQuickResponse = (text: string) => {
    // Set the input value to the suggestion
    setInputValue(text);
    
    // Automatically send after a short delay
    setTimeout(() => {
      // Generate a unique ID for the message
      const id = Date.now().toString();
      
      // Add user message to messages
      setMessages(prev => [...prev, { 
        id, 
        text, 
        isUser: true,
        timestamp: new Date()
      }]);
      
      // Get AI response
      getAIResponse(text);
      
      // Clear input
      setInputValue('');
    }, 500);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-indigo-950/70">
      <main className="flex-grow py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: AI Avatar Assistant */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md bg-gradient-to-br from-purple-900/80 to-indigo-900/90 rounded-3xl overflow-hidden shadow-2xl border border-indigo-800/30 mb-8"
            >
              <div className="p-5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">AI Avatar <span className="text-blue-400">Assistant</span></h2>
                <div className="flex items-center bg-indigo-950/50 px-3 py-1 rounded-full">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'} mr-2`}
                    animate={isRecording ? { 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.7, 1] 
                    } : {}}
                    transition={{ duration: 0.7, repeat: isRecording ? Infinity : 0 }}
                  />
                  <span className="text-sm text-white">{isRecording ? 'Listening...' : 'Ready'}</span>
                </div>
              </div>
              
              <div className="bg-indigo-950 p-8 rounded-t-xl border-t border-indigo-800/30">
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <StatusIndicator 
                    isActive={activeModules.vision}
                    label="Vision"
                    icon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                      </svg>
                    }
                  />
                  <StatusIndicator 
                    isActive={isRecording || activeModules.voice}
                    label="Voice"
                    pulse={isRecording}
                    icon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                      </svg>
                    }
                  />
                  <StatusIndicator 
                    isActive={activeModules.chat} 
                    label="Chat"
                    icon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                      </svg>
                    }
                  />
                  <StatusIndicator 
                    isActive={activeModules.memory} 
                    label="Memory"
                    icon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                      </svg>
                    }
                  />
                </div>
                
                <div className="mb-10">
                  <motion.div 
                    className="flex justify-between text-gray-400 text-sm mb-2"
                    animate={{
                      x: [0, 2, 0, -2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                  >
                    <span>Processing:</span>
                    <motion.span
                      key={processingPercent}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {processingPercent.toFixed()}%
                    </motion.span>
                  </motion.div>
                  <div className="h-1.5 w-full bg-indigo-900/50 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: `${processingPercent}%` }}
                      animate={{ 
                        width: `${processingPercent}%`,
                        background: isRecording ? 
                          ['linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)', 
                           'linear-gradient(90deg, #ef4444 0%, #f87171 100%)', 
                           'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)'] : 
                          'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)'
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: isRecording ? Infinity : 0,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                </div>
                
                {/* D-ID Agent Container */}
                <motion.div 
                  className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-indigo-900/40 flex items-center justify-center border border-indigo-800/30 shadow-inner" 
                  id="did-container"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* This is where the D-ID agent will appear */}
                  <AnimatePresence>
                    {activeModules.vision && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 left-4 bg-black/40 px-2 py-1 rounded-md text-xs text-white backdrop-blur-sm flex items-center"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                        <span>Live</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-indigo-900/30"
                    animate={{
                      background: [
                        'rgba(49, 46, 129, 0.3)',
                        'rgba(67, 56, 202, 0.3)',
                        'rgba(49, 46, 129, 0.3)'
                      ]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-white opacity-50" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7zm9-2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
                    </svg>
                  </motion.div>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <MetricCard
                    title="Response Time"
                    value="81"
                    unit="ms"
                    color="bg-blue-500"
                  />
                  <MetricCard
                    title="Accuracy"
                    value="97"
                    unit="%"
                    color="bg-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    title="Memory Usage"
                    value="198"
                    unit="MB"
                    showGraph={true}
                    color="bg-indigo-500"
                  />
                  <MetricCard
                    title="Tasks"
                    value="3"
                    unit=""
                    color="bg-purple-500"
                  />
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-xl border border-indigo-900/30">
                <div className="text-gray-300 text-xs mb-2">Assistant Mode</div>
                <div className="flex space-x-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-md text-sm"
                  >
                    Professional
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent text-gray-400 hover:text-white px-4 py-1.5 rounded-md text-sm transition-colors"
                  >
                    Creative
                  </motion.button>
                </div>
              </div>
              <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-xl border border-indigo-900/30">
                <div className="text-gray-300 text-xs mb-2">Microphone</div>
                <div className="flex space-x-2">
                  <div className={`flex items-center bg-indigo-900/40 px-3 py-1.5 rounded-md ${isRecording ? 'ring-2 ring-red-500' : ''}`}>
                    <motion.span 
                      className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-400'} mr-2`}
                      animate={isRecording ? { 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.7, 1] 
                      } : {}}
                      transition={{ duration: 0.7, repeat: isRecording ? Infinity : 0 }}
                    />
                    <span className="text-gray-300 text-sm">{isRecording ? 'Active' : 'Standby'}</span>
                  </div>
                  <motion.button 
                    onClick={() => window.speechSynthesis?.cancel()} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-800 to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                  >
                    Mute
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Chat Interface */}
          <ChatInterface 
            messages={messages}
            inputValue={inputValue}
            isRecording={isRecording}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onMicClick={handleMicClick}
            onPlayAudio={handlePlayAudio}
            onQuickResponse={handleQuickResponse}
          />
        </div>
      </main>
      
      {/* Script for D-ID Agent */}
      <Script
        src="https://service.digitalhumans.com/stream.js"
        data-name="did-agent"
        data-mode="fabio"
        data-client-key={process.env.NEXT_PUBLIC_DID_CLIENT_KEY || "Z29vZ2xlLW9hdXRoMnwxMDQ0MjQzNzIyMTExMDExMjkwMDA6SHhPcG9ibG10a0tVODRLYTVhNTBZ"}
        data-agent-id={process.env.NEXT_PUBLIC_DID_AGENT_ID || "agt_0hWQiLqG"}
        data-monitor="true"
        strategy="afterInteractive"
      />
    </div>
  );
} 