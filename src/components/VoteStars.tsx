import React from 'react';
import { motion } from 'framer-motion';
import type { VoteStarsProps } from '../types';

const VoteStars: React.FC<VoteStarsProps> = ({
  rating,
  onRatingChange,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const handleStarClick = (starRating: number) => {
    if (!disabled) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className={`${sizeClasses[size]} transition-colors duration-200 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
          }`}
          onClick={() => handleStarClick(star)}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.svg
            className={`w-full h-full ${
              star <= rating ? 'text-secondary-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: star * 0.1 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        </motion.button>
      ))}
    </div>
  );
};

export default VoteStars;

