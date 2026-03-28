/**
 * Suggestion Chips Component
 * Displays quick suggestion buttons that auto-send queries
 * Useful for guiding users on what they can ask
 */

import React from 'react';
import { motion } from 'framer-motion';

const SUGGESTION_CHIPS = [
  { id: 1, text: 'Find parking near me', icon: '📍' },
  { id: 2, text: 'Affordable parking', icon: '💰' },
  { id: 3, text: '2 hour parking', icon: '⏱️' },
  { id: 4, text: 'Evening parking', icon: '🌆' },
];

export default function SuggestionChips({ onSelectSuggestion, isLoading }) {
  return (
    <div className="flex flex-col gap-2 px-1">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
        💡 SUGGESTIONS
      </p>
      <motion.div
        className="grid grid-cols-2 gap-2 sm:gap-2.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, staggerChildren: 0.05 }}
      >
        {SUGGESTION_CHIPS.map((chip) => (
          <motion.button
            key={chip.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectSuggestion(chip.text)}
            disabled={isLoading}
            className="relative overflow-hidden text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg
              bg-gradient-to-br from-gray-50 to-gray-100 
              dark:from-gray-700 dark:to-gray-800
              border border-gray-200 dark:border-gray-600
              text-xs font-medium text-gray-700 dark:text-gray-200
              hover:border-blue-400 dark:hover:border-blue-400
              hover:shadow-md transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              group"
          >
            {/* Hover glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 
              group-hover:from-blue-400/10 group-hover:via-blue-400/20 group-hover:to-blue-400/10
              transition-all duration-300 pointer-events-none" />
            
            <div className="relative flex items-center gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-base flex-shrink-0">{chip.icon}</span>
              <span className="line-clamp-2 text-xs sm:text-xs">{chip.text}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
