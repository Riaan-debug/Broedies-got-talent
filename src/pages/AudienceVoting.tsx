import React from 'react';
import { motion } from 'framer-motion';
import { useActiveAct, useVoting, useComments, useTrivia } from '../hooks';
import VoteStars from '../components/VoteStars';
import CommentBox from '../components/CommentBox';
import Timer from '../components/Timer';
import TriviaCard from '../components/TriviaCard';

const AudienceVoting: React.FC = () => {
  const { activeAct, loading: actLoading } = useActiveAct();
  const { hasVoted, userVote, vote, loading: voteLoading } = useVoting(activeAct?.id || '');
  const { comments, submitComment } = useComments(activeAct?.id || '');
  const { activeTrivia, answerTrivia, loading: triviaLoading } = useTrivia();

  const handleVote = async (rating: number) => {
    await vote(rating);
  };

  const handleComment = async (text: string, emoji?: string) => {
    await submitComment(text, emoji);
  };

  const handleTriviaAnswer = async (optionIndex: number) => {
    await answerTrivia(optionIndex);
  };

  if (actLoading) {
    return (
      <div className="min-h-screen bg-theatrical flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-secondary-200 font-semibold">🎭 Loading the show...</p>
        </motion.div>
      </div>
    );
  }

  // Show trivia if active
  if (activeTrivia && !triviaLoading) {
    return (
      <div className="min-h-screen bg-theatrical py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-secondary-200 text-glow mb-2">
              🎪 TRIVIA TIME! 🎪
            </h1>
            <p className="text-lg text-secondary-300 font-semibold">
              Answer the question below to participate
            </p>
          </motion.div>

          <TriviaCard
            trivia={activeTrivia}
            onAnswer={handleTriviaAnswer}
            showResults={false}
          />

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-600">
              Waiting for the next act to begin...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // No active act
  if (!activeAct) {
    return (
      <div className="min-h-screen bg-theatrical flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-8xl mb-6 animate-sparkle">🎭</div>
          <h1 className="text-4xl font-bold text-secondary-200 text-glow mb-4">
            BROEDIES GOT TALENT
          </h1>
          <p className="text-lg text-secondary-300 mb-6 font-semibold">
            Welcome to our talent show! The next performance will begin soon.
          </p>
          <div className="card-theatrical">
            <h2 className="text-xl font-semibold text-accent-800 mb-2">
              🎪 What to expect:
            </h2>
            <ul className="text-left text-accent-700 space-y-2 font-semibold">
              <li>⭐ Rate performances 1-5 stars</li>
              <li>💬 Leave comments and emojis</li>
              <li>🎯 Participate in trivia between acts</li>
              <li>📱 Real-time updates and results</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theatrical py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-secondary-200 text-glow mb-2">
            🎭 BROEDIES GOT TALENT
          </h1>
          <p className="text-lg text-secondary-300 font-semibold">
            Vote for your favorite performance!
          </p>
        </motion.div>

        {/* Current Act */}
        <motion.div
          className="card-theatrical mb-8 spotlight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="bg-primary-200 text-primary-800 px-4 py-2 rounded-full font-bold border border-primary-400">
                🎭 ACT{activeAct.id.slice(-3)}
              </span>
              <span className="bg-secondary-200 text-secondary-800 px-4 py-2 rounded-full font-bold border border-secondary-400">
                📚 {activeAct.grade}
              </span>
              {activeAct.isActive && (
                <motion.span
                  className="bg-accent-200 text-accent-800 px-4 py-2 rounded-full font-bold border border-accent-400 animate-sparkle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  🎪 LIVE
                </motion.span>
              )}
              {activeAct.isVotingOpen && (
                <motion.span
                  className="bg-curtain-200 text-curtain-800 px-4 py-2 rounded-full font-bold border border-curtain-400 animate-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                >
                  ⭐ VOTING OPEN
                </motion.span>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-accent-800 mb-4 text-curtain">
              {activeAct.name}
            </h2>
            
            <p className="text-lg text-accent-700 mb-6 font-semibold">
              {activeAct.description}
            </p>

            {/* Voting Status */}
            {activeAct.isVotingOpen ? (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold mb-4 inline-block">
                  🗳️ Voting is OPEN!
                </div>
                <Timer duration={60} className="mb-4" />
              </motion.div>
            ) : (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold">
                  ⏸️ Voting is closed
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Voting Section */}
        {activeAct.isVotingOpen && (
          <motion.div
            className="card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Rate this performance
            </h3>
            
            {hasVoted ? (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-6xl mb-4">✅</div>
                <h4 className="text-xl font-semibold text-green-600 mb-2">
                  Thank you for voting!
                </h4>
                <p className="text-gray-600 mb-4">
                  You rated this performance: {userVote?.rating} stars
                </p>
                <VoteStars
                  rating={userVote?.rating || 0}
                  onRatingChange={() => {}}
                  disabled={true}
                  size="lg"
                />
              </motion.div>
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <VoteStars
                  rating={0}
                  onRatingChange={handleVote}
                  disabled={voteLoading}
                  size="lg"
                />
                <p className="text-gray-600 mt-4">
                  Tap the stars to rate (1-5 stars)
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Share your thoughts
          </h3>
          
          <CommentBox
            onSubmit={handleComment}
            disabled={!activeAct.isVotingOpen}
          />

          {/* Display approved comments */}
          {comments.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Recent comments:
              </h4>
              <div className="space-y-3">
                {comments.slice(0, 5).map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    className="bg-gray-50 p-4 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      {comment.emoji && (
                        <span className="text-2xl">{comment.emoji}</span>
                      )}
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Preview */}
        {!activeAct.isVotingOpen && activeAct.votesCount > 0 && (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Results
            </h3>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {activeAct.avgScore.toFixed(1)} ⭐
              </div>
              <p className="text-gray-600 mb-4">
                Average rating from {activeAct.votesCount} votes
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeAct.avgScore / 5) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AudienceVoting;