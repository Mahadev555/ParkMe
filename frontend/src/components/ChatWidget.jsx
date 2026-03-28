/**
 * Chat Widget Component (Main)
 * Premium floating AI chatbot assistant for ParkMe
 * 
 * Features:
 * - Floating button in bottom-left
 * - Glassmorphism chat window
 * - API integration with backend
 * - Message persistence (localStorage)
 * - Dark mode support
 * - Smooth animations
 * - Auto-scroll to latest message
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';

// AI message formatter for parking results
function formatAIResponse(data) {
  if (!data || typeof data !== 'object') {
    return "I didn't understand that. Try: 'Find parking near Baner under 50 rupees for 2 hours'";
  }

  const { location, maxPrice, duration, time } = data;

  // Build human-readable response
  let response = '✨ I found: ';
  let parts = [];

  if (location) {
    parts.push(`parking near ${location}`);
  }

  if (duration) {
    parts.push(`for ${duration} hour${duration > 1 ? 's' : ''}`);
  }

  if (maxPrice) {
    parts.push(`under ₹${maxPrice}/hour`);
  }

  if (time) {
    parts.push(`in the ${time}`);
  }

  if (parts.length === 0) {
    return "Let me know what type of parking you need - area, price, duration, or time of day!";
  }

  response += parts.join(' ') + '.';
  response += ' 🎯 Try searching now!';

  return response;
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex gap-1 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            repeat: Infinity,
          }}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // API configuration (Vite environment variable)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('parkme_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }

    // Detect dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('parkme_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI
  const handleSendMessage = async (userMessage) => {
    // Add user message
    const newUserMessage = { id: Date.now(), text: userMessage, isUser: true };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Call backend API
      const response = await axios.post(`${API_URL}/ai/search`, {
        query: userMessage,
      });

      const data = response.data.data;

      // If parkings are returned, display them as cards
      if (data.parkings && data.parkings.length > 0) {
        const parkingMessage = {
          id: Date.now() + 1,
          text: data.hasFilters 
            ? `Found ${data.count} parking${data.count > 1 ? 's' : ''} matching your criteria:`
            : `Here are the top-rated parkings:`,
          isUser: false,
          isParkingResult: true,
          parkings: data.parkings,
        };
        setMessages((prev) => [...prev, parkingMessage]);
      } else {
        // No parkings found
        const noResultMessage = {
          id: Date.now() + 1,
          text: "Sorry, no parkings found matching your criteria. Try adjusting your filters!",
          isUser: false,
        };
        setMessages((prev) => [...prev, noResultMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '❌ Oops! Could not process your request. Try again!',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parking card click - navigate to parking details
  const handleParkingSelect = (parkingId) => {
    setIsOpen(false); // Close chat
    // Navigate to parking details page
    window.location.href = `/parking/${parkingId}`;
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('parkme_chat_history');
  };

  // Floating button styles
  const floatingButtonVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
    hover: {
      scale: 1.1,
      boxShadow: '0 0 30px 0 rgba(59, 130, 246, 0.6)',
    },
    tap: { scale: 0.95 },
  };

  // Chat window variants
  const chatWindowVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  // Show suggestions if no messages
  const showSuggestions = messages.length === 0;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Floating Button */}
      <motion.button
        variants={floatingButtonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 w-12 h-12 sm:w-14 sm:h-14 z-40
          bg-gradient-to-br from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white rounded-full shadow-xl
          flex items-center justify-center
          cursor-pointer transition-all duration-200
          border border-blue-400/30"
      >
        {/* Animated gradient glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 
          blur-lg -z-10 animate-pulse" />

        {/* Icon with scale animation */}
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
        </motion.div>

        {/* Message indicator dot */}
        {messages.length > 0 && !isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border border-white"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-20 sm:bottom-24 left-4 right-4 sm:left-6 sm:right-auto z-40 
              w-full sm:w-80 lg:w-96 max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)]
              bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl
              border border-white/20 dark:border-gray-700/30
              rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden
              flex flex-col h-[50vh] sm:h-[60vh] md:h-[65vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 sm:px-6 py-3 sm:py-4
              flex items-center justify-between flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm sm:text-lg truncate">ParkMe Assistant</h3>
                <p className="text-blue-100 text-xs hidden sm:block">AI-powered parking helper</p>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Messages Body */}
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4
                  bg-gradient-to-b from-gray-50/50 to-gray-100/50
                  dark:from-gray-700/30 dark:to-gray-800/30
                  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                  scrollbar-track-transparent"
              >
                {/* Empty State with Suggestions */}
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col justify-center gap-4 sm:gap-6"
                  >
                    <div className="text-center">
                      <div className="mb-2 sm:mb-3 text-3xl sm:text-4xl">🅿️</div>
                      <h4 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white mb-1">
                        Find Your Perfect Spot
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Ask me about parking!
                      </p>
                    </div>
                    <SuggestionChips
                      onSelectSuggestion={handleSendMessage}
                      isLoading={isLoading}
                    />
                  </motion.div>
                )}

                {/* Chat Messages */}
                {messages.map((message) => {
                  if (message.isParkingResult) {
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        {/* Header text */}
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium px-2">
                          {message.text}
                        </p>
                        
                        {/* Parking Cards */}
                        <div className="space-y-2">
                          {message.parkings.map((parking) => (
                            <motion.div
                              key={parking._id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleParkingSelect(parking._id)}
                              className="p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 
                                dark:from-gray-700 dark:to-gray-600
                                border border-blue-200 dark:border-gray-500
                                rounded-lg cursor-pointer hover:shadow-md transition-all"
                            >
                              {/* Title */}
                              <h4 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                                {parking.title}
                              </h4>

                              {/* Address */}
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 mt-0.5">
                                📍 {parking.address}
                              </p>

                              {/* Price & Rating Row */}
                              <div className="flex items-center justify-between mt-1.5 text-xs">
                                <span className="font-bold text-green-600">
                                  ₹{parking.pricePerHour}/hr
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <span>⭐</span>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {parking.ratings?.average?.toFixed(1) || '0'}
                                  </span>
                                </div>
                              </div>

                              {/* Click Hint */}
                              <p className="text-xs text-blue-600 dark:text-blue-300 font-medium mt-1">
                                Click to view details →
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  }
                  return (
                    <ChatMessage
                      key={message.id}
                      message={message.text}
                      isUser={message.isUser}
                    />
                  );
                })}

                {/* Typing Indicator */}
                {isLoading && <TypingIndicator />}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </motion.div>
            )}

            {/* Input Area */}
            {!isMinimized && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-4
                bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm space-y-2 sm:space-y-3 flex-shrink-0">
                {/* Clear button (shown only if messages exist) */}
                {messages.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleClearChat}
                    className="w-full text-xs text-gray-500 dark:text-gray-400
                      hover:text-gray-700 dark:hover:text-gray-200 py-1 transition-colors"
                  >
                    Clear chat ✕
                  </motion.button>
                )}
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
