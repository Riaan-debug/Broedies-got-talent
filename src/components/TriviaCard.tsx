import React from 'react';
import { motion } from 'framer-motion';
import type { TriviaCardProps } from '../types';

const TriviaCard: React.FC<TriviaCardProps> = ({
  trivia,
  onAnswer,
  disabled = false,
  showResults = false,
}) => {
  const totalAnswers = Object.values(trivia.results).reduce((sum, count) => sum + count, 0);

  const getPercentage = (optionIndex: number) => {
    if (totalAnswers === 0) return 0;
    return Math.round((trivia.results[optionIndex] || 0) / totalAnswers * 100);
  };

  return (
    <motion.div
      className="card max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <motion.h2
          className="text-2xl font-bold text-primary-600 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎯 Trivia Time!
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {trivia.question}
        </motion.p>
      </div>

      <div className="space-y-3">
        {trivia.options.map((option, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => onAnswer(index)}
            disabled={disabled}
            className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:scale-105 cursor-pointer'
            } ${
              showResults
                ? 'bg-gray-100 border-2 border-gray-200'
                : 'bg-primary-50 hover:bg-primary-100 border-2 border-primary-200 hover:border-primary-300'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">
                {String.fromCharCode(65 + index)}. {option}
              </span>
              
              {showResults && (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getPercentage(index)}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 min-w-[3rem]">
                    {getPercentage(index)}%
                  </span>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {showResults && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-gray-600">
            Total responses: {totalAnswers}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TriviaCard;

