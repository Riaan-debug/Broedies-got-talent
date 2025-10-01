import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveAct, useComments, useTrivia } from '../hooks';

const DisplayScreen: React.FC = () => {
  const { activeAct, loading: actLoading } = useActiveAct();
  const { comments, loading: commentsLoading } = useComments(activeAct?.id || '');
  const { activeTrivia, loading: triviaLoading } = useTrivia();
  const [displayedComments, setDisplayedComments] = useState<string[]>([]);

  // Rotate through comments every 3 seconds
  useEffect(() => {
    if (comments.length === 0) return;

    const interval = setInterval(() => {
      const shuffled = [...comments].sort(() => Math.random() - 0.5);
      setDisplayedComments(shuffled.slice(0, 3));
    }, 3000);

    return () => clearInterval(interval);
  }, [comments]);

  // Show trivia if active
  if (activeTrivia && !triviaLoading) {
    const totalAnswers = Object.values(activeTrivia.results).reduce((sum, count) => sum + count, 0);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-yellow-900 text-white">
        <div className="min-h-screen flex items-center justify-center p-8">
          <motion.div
            className="max-w-6xl w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trivia Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-bold mb-4">🎯</h1>
              <h2 className="text-5xl font-bold mb-6">Trivia Time!</h2>
              <p className="text-2xl text-gray-300">{activeTrivia.question}</p>
            </motion.div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              {activeTrivia.options.map((option, index) => {
                const count = activeTrivia.results[index] || 0;
                const percentage = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0;
                
                return (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-4">
                        {String.fromCharCode(65 + index)}.
                      </div>
                      <p className="text-xl mb-6">{option}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-white/20 rounded-full h-8 mb-4">
                        <motion.div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-8 rounded-full flex items-center justify-center"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        >
                          <span className="text-white font-bold text-lg">
                            {Math.round(percentage)}%
                          </span>
                        </motion.div>
                      </div>
                      
                      <div className="text-lg text-gray-300">
                        {count} votes
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Total Votes */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xl text-gray-300">
                Total responses: {totalAnswers}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // No active act
  if (!activeAct && !actLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 text-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-8xl mb-8">🎭</div>
          <h1 className="text-6xl font-bold mb-6">Broedies Got Talent</h1>
          <p className="text-2xl text-gray-300 mb-8">
            The next performance will begin soon...
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What's Coming Up:</h2>
            <ul className="text-xl text-gray-300 space-y-3 text-left">
              <li>🎵 Amazing musical performances</li>
              <li>💃 Incredible dance routines</li>
              <li>🎪 Spectacular magic shows</li>
              <li>🎭 Creative drama presentations</li>
              <li>🎯 Fun trivia between acts</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  if (actLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 text-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-2xl">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
      {/* Floating Comments */}
      <AnimatePresence>
        {displayedComments.map((comment, index) => (
          <motion.div
            key={`${comment.id}-${index}`}
            className="absolute bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-sm"
            style={{
              left: `${20 + (index * 25)}%`,
              top: `${30 + (index * 20)}%`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -20, 0]
            }}
            exit={{ opacity: 0, scale: 0, rotate: 10 }}
            transition={{ 
              duration: 0.8,
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div className="flex items-center gap-3">
              {comment.emoji && (
                <span className="text-3xl">{comment.emoji}</span>
              )}
              <p className="text-lg font-medium">{comment.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col justify-center items-center p-8">
        <motion.div
          className="text-center max-w-6xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Act Info */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-6 mb-6">
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-2xl font-bold">
                ACT{activeAct.id.slice(-3)}
              </span>
              <span className="bg-yellow-500 px-6 py-3 rounded-full text-2xl font-bold">
                {activeAct.grade}
              </span>
              {activeAct.isVotingOpen && (
                <motion.span
                  className="bg-pink-500 px-6 py-3 rounded-full text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  VOTING OPEN
                </motion.span>
              )}
            </div>
            
            <h1 className="text-7xl font-bold mb-6">{activeAct.name}</h1>
            <p className="text-3xl text-gray-300 mb-8">{activeAct.description}</p>
          </motion.div>

          {/* Voting Status */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {activeAct.isVotingOpen ? (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <h2 className="text-4xl font-bold mb-4">🗳️ Voting is OPEN!</h2>
                <p className="text-2xl text-gray-300">
                  Audience members can vote now!
                </p>
              </div>
            ) : (
              <div className="bg-gray-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <h2 className="text-4xl font-bold mb-4">⏸️ Voting Closed</h2>
                <p className="text-2xl text-gray-300">
                  Thank you for participating!
                </p>
              </div>
            )}
          </motion.div>

          {/* Results */}
          {activeAct.votesCount > 0 && (
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-5xl font-bold mb-8">Results</h2>
              
              <div className="text-center mb-8">
                <motion.div
                  className="text-8xl font-bold text-yellow-400 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                >
                  {activeAct.avgScore.toFixed(1)}
                </motion.div>
                <div className="text-6xl mb-4">⭐</div>
                <p className="text-3xl text-gray-300 mb-6">
                  Average rating from {activeAct.votesCount} votes
                </p>
                
                {/* Progress Bar */}
                <div className="w-full max-w-2xl mx-auto bg-white/20 rounded-full h-8 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-8 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeAct.avgScore / 5) * 100}%` }}
                    transition={{ duration: 2, ease: 'easeOut', delay: 1 }}
                  />
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <motion.div
                    key={rating}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + (5 - rating) * 0.1 }}
                  >
                    <div className="text-3xl mb-2">{rating} ⭐</div>
                    <div className="text-xl text-gray-300">
                      {/* This would need actual vote distribution data */}
                      {Math.round(Math.random() * 20)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DisplayScreen;

