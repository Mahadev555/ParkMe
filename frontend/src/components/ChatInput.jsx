/**
 * Chat Input Component
 * Handles user text input and message submission
 * Features: Enter key support, auto-clear, send button animation
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle message submission
  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      {/* Text Input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about parking..."
          disabled={isLoading}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl
            bg-gray-100 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            text-gray-800 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            focus:border-transparent transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            text-xs sm:text-sm"
        />
      </div>

      {/* Send Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="relative overflow-hidden p-2 sm:p-2.5 rounded-xl
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white shadow-lg hover:shadow-xl
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center flex-shrink-0"
      >
        {/* Animated glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </motion.button>
    </div>
  );
}
