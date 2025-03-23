'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  audio?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  isRecording: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onMicClick: () => void;
  onPlayAudio?: (audioUrl: string) => void;
  onQuickResponse?: (text: string) => void;
  suggestions?: string[];
}

export default function ChatInterface({
  messages,
  inputValue,
  isRecording,
  onInputChange,
  onSendMessage,
  onMicClick,
  onPlayAudio,
  onQuickResponse,
  suggestions = [
    "What is the IDMS ERP system?",
    "Explain the Sales Module",
    "How does IDMS help with GST compliance?"
  ]
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Check if we need to show the scroll button
  useEffect(() => {
    const checkScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp && messages.length > 2);
    };
    
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [messages.length]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="w-full md:w-1/2 bg-gray-900/80 backdrop-blur-md p-4 md:p-8 flex flex-col">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            AI Assistant
            <motion.span 
              className="ml-2 text-xs px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Premium
            </motion.span>
          </h3>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'} mr-2`}></div>
            <span className={`text-xs ${isRecording ? 'text-red-500' : 'text-green-500'}`}>{isRecording ? 'Listening...' : 'Online'}</span>
          </div>
        </div>
      </div>
      
      <div ref={chatContainerRef} className="flex-grow bg-gray-950/90 backdrop-blur-md rounded-xl p-6 mb-6 overflow-hidden flex flex-col border border-gray-800/50 shadow-lg">
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <>
              <motion.div 
                className="flex justify-center mb-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-3">How can I help you today?</h2>
                <p className="text-gray-400 max-w-sm mx-auto">
                  Ask me any questions about the IDMS ERP system. I'm here to assist you!
                </p>
              </motion.div>
              
              <motion.div 
                className="space-y-3 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button 
                    key={suggestion}
                    onClick={() => onQuickResponse && onQuickResponse(suggestion)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-left text-white py-3 px-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div 
                  key={message.id} 
                  className={`${
                    message.isUser 
                      ? 'ml-auto' 
                      : ''
                  }`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`relative p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white max-w-[80%] rounded-tr-none shadow-md' 
                      : 'bg-gray-800 text-gray-100 max-w-[90%] rounded-tl-none shadow-md'
                  }`}>
                    <div className="absolute top-0 right-0 -mr-1 -mt-1">
                      {message.isUser && (
                        <div className="w-2 h-2 rounded-tr-lg bg-indigo-600"></div>
                      )}
                    </div>
                    <div className="absolute top-0 left-0 -ml-1 -mt-1">
                      {!message.isUser && (
                        <div className="w-2 h-2 rounded-tl-lg bg-gray-800"></div>
                      )}
                    </div>
                    
                    {message.text}
                    
                    {/* Audio player for AI messages */}
                    {!message.isUser && message.audio && onPlayAudio && (
                      <div className="mt-2">
                        <motion.button 
                          onClick={() => onPlayAudio(message.audio || '')}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                          </svg>
                          Play Audio
                        </motion.button>
                      </div>
                    )}
                    
                    {/* Timestamp for all messages */}
                    <div className={`absolute bottom-0 ${message.isUser ? 'left-0 -ml-16' : 'right-0 -mr-16'} -mb-6 text-xs text-gray-500`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {/* Playback indicator for AI messages */}
                  {!message.isUser && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1 ml-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                      <span>Spoken</span>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-24 right-8 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        
        <div className="relative mt-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <input
                type="text"
                value={inputValue}
                onChange={onInputChange}
                placeholder={isRecording ? "Listening..." : "Type your message..."}
                className={`w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 pl-4 pr-24 rounded-xl focus:outline-none focus:ring-2 ${
                  isRecording 
                    ? 'focus:ring-red-500 ring-2 ring-red-500 placeholder-red-300' 
                    : 'focus:ring-blue-600'
                } shadow-inner transition-all duration-300`}
              />
              
              {/* Animated microphone/listening indicator */}
              {isRecording && (
                <motion.div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-5 bg-red-500 rounded-full"
                        animate={{
                          height: ["20%", "100%", "20%"]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <motion.button 
                  type="button"
                  onClick={onMicClick}
                  className={`p-2 rounded-full ${
                    isRecording 
                      ? 'bg-red-600 text-white' 
                      : 'text-blue-500 hover:text-blue-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.svg 
                    className={`w-5 h-5 ${isRecording ? '' : ''}`}
                    animate={isRecording ? {
                      scale: [1, 1.2, 1],
                      fill: ['#ef4444', '#f87171', '#ef4444']
                    } : {}}
                    transition={{ duration: 1.5, repeat: isRecording ? Infinity : 0 }}
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                  </motion.svg>
                </motion.button>
                <motion.button 
                  type="submit" 
                  className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-colors"
                  disabled={isRecording}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </form>
          
          {/* Typing indicator when AI is thinking */}
          {messages.length > 0 && !isRecording && (
            <div className="absolute -top-6 left-4 flex items-center space-x-1">
              <span className="text-xs text-gray-500">AI is typing</span>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-1 bg-blue-500 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-1 h-1 bg-blue-500 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-1 h-1 bg-blue-500 rounded-full"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <motion.div 
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/avatar-female.png" 
            alt="AI Avatar" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/100x100/9966CC/ffffff?text=AI';
            }}
          />
        </motion.div>
      </div>
    </div>
  );
} 