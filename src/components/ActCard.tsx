import React from 'react';
import { motion } from 'framer-motion';
import type { ActCardProps } from '../types';

const ActCard: React.FC<ActCardProps> = ({
  act,
  onActivate,
  onStartVoting,
  onStopVoting,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const isActive = act.isActive;
  const isVotingOpen = act.isVotingOpen;

  return (
    <motion.div
      className={`card transition-all duration-300 ${
        isActive ? 'ring-2 ring-primary-500 bg-primary-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
              ACT{act.id.slice(-3)}
            </span>
            <span className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-semibold">
              {act.grade}
            </span>
            {isActive && (
              <motion.span
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                LIVE
              </motion.span>
            )}
            {isVotingOpen && (
              <motion.span
                className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                VOTING OPEN
              </motion.span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {act.name}
          </h3>
          
          <p className="text-gray-600 mb-3">
            {act.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{act.avgScore.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{act.votesCount} votes</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2 ml-4">
            {!isActive ? (
              <button
                onClick={onActivate}
                className="btn-primary text-sm py-2 px-4"
              >
                Activate
              </button>
            ) : (
              <div className="flex gap-2">
                {!isVotingOpen ? (
                  <button
                    onClick={onStartVoting}
                    className="btn-accent text-sm py-2 px-4"
                  >
                    Start Voting
                  </button>
                ) : (
                  <button
                    onClick={onStopVoting}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                  >
                    Stop Voting
                  </button>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar for average score */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Average Rating</span>
          <span>{act.avgScore.toFixed(1)}/5.0</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-secondary-400 to-secondary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(act.avgScore / 5) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ActCard;

