import React from 'react';
import { motion } from 'framer-motion';
import type { TimerProps } from '../types';

const Timer: React.FC<TimerProps> = ({ duration, onComplete, className = '' }) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        className="relative inline-block"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white shadow-lg">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: timeLeft <= 10 ? '#ef4444' : '#10b981',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="text-2xl font-bold text-gray-800 z-10"
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </motion.div>
      
      {timeLeft <= 10 && timeLeft > 0 && (
        <motion.div
          className="mt-2 text-red-500 font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Hurry up! ⏰
        </motion.div>
      )}
      
      {timeLeft === 0 && (
        <motion.div
          className="mt-2 text-red-600 font-bold text-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Time's Up! 🏁
        </motion.div>
      )}
    </div>
  );
};

export default Timer;

