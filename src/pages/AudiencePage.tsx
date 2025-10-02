import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveAct, useVoting, useComments, useTrivia } from '../hooks';
import VoteStars from '../components/VoteStars';
import CommentBox from '../components/CommentBox';
import Timer from '../components/Timer';
import TriviaCard from '../components/TriviaCard';
import type { Comment } from '../types';

const AudiencePage: React.FC = () => {
  const { activeAct, loading: actLoading } = useActiveAct();
  const { hasVoted, userVote, vote, loading: voteLoading } = useVoting(activeAct?.id || '');
  const { comments, submitComment } = useComments(activeAct?.id || '');
  const { activeTrivia, answerTrivia, loading: triviaLoading } = useTrivia();
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'vote' | 'program' | 'comments'>('vote');

  // Rotate through comments every 3 seconds
  useEffect(() => {
    if (comments.length === 0) return;

    const interval = setInterval(() => {
      const shuffled = [...comments].sort(() => Math.random() - 0.5);
      setDisplayedComments(shuffled.slice(0, 3));
    }, 3000);

    return () => clearInterval(interval);
  }, [comments]);

  const handleVote = async (rating: number) => {
    await vote(rating);
  };

  const handleComment = async (text: string, emoji?: string) => {
    await submitComment(text, emoji);
  };

  const handleTriviaAnswer = async (optionIndex: number) => {
    await answerTrivia(optionIndex);
  };

  // Show trivia if active
  if (activeTrivia && !triviaLoading) {
    return (
      <div className="min-h-screen bg-theatrical py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-secondary-200 text-glow mb-4">
              🎪 TRIVIA TIME! 🎪
            </h1>
            <p className="text-lg text-secondary-300 font-semibold">
              Test your knowledge and win prizes!
            </p>
          </motion.div>
          
          <TriviaCard 
            trivia={activeTrivia} 
            onAnswer={handleTriviaAnswer}
            loading={triviaLoading}
          />
        </div>
      </div>
    );
  }

  // Loading state
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

  // No active act - show program/waiting
  if (!activeAct) {
    return (
      <div className="min-h-screen bg-theatrical py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-6 animate-sparkle">🎭</div>
            <h1 className="text-4xl font-bold text-secondary-200 text-glow mb-4">
              BROEDIES GOT TALENT
            </h1>
            <p className="text-lg text-secondary-300 font-semibold mb-8">
              Welcome to our talent show! The next performance will begin soon.
            </p>
          </motion.div>

          {/* Program Information */}
          <motion.div
            className="card-theatrical spotlight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-accent-800 mb-6 text-center text-curtain">
              🎪 Program Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary-100 border-2 border-secondary-300 rounded-lg p-4">
                <h3 className="font-bold text-secondary-800 mb-3">📅 Show Schedule</h3>
                <ul className="text-secondary-700 space-y-2 font-semibold">
                  <li>• Opening Ceremony</li>
                  <li>• Act Performances</li>
                  <li>• Intermission Trivia</li>
                  <li>• Finale & Awards</li>
                </ul>
              </div>
              
              <div className="bg-secondary-100 border-2 border-secondary-300 rounded-lg p-4">
                <h3 className="font-bold text-secondary-800 mb-3">🎯 How to Participate</h3>
                <ul className="text-secondary-700 space-y-2 font-semibold">
                  <li>• Vote for your favorite acts</li>
                  <li>• Leave encouraging comments</li>
                  <li>• Participate in trivia games</li>
                  <li>• Enjoy the show!</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active act - show voting interface
  return (
    <div className="min-h-screen bg-theatrical py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {hasVoted ? (
                  <div className="bg-secondary-100 border-2 border-secondary-300 rounded-lg p-4">
                    <p className="text-secondary-800 font-semibold mb-2">
                      ✅ Thank you for voting! You rated this act {userVote?.rating} stars
                    </p>
                    <p className="text-secondary-700 text-sm">
                      Your vote has been recorded. You can still leave comments below!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-accent-700 font-semibold mb-4">
                      Rate this performance (1-5 stars):
                    </p>
                    <VoteStars
                      rating={userVote?.rating || 0}
                      onRatingChange={handleVote}
                      disabled={voteLoading}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-accent-100 border-2 border-accent-300 rounded-lg p-4 mb-6">
                <p className="text-accent-800 font-semibold">
                  ⏳ Voting will open soon for this act
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex space-x-1 bg-curtain-800 p-1 rounded-lg w-fit mx-auto border-2 border-secondary-400">
            <button
              onClick={() => setActiveTab('vote')}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                activeTab === 'vote'
                  ? 'bg-secondary-500 text-white shadow-lg transform scale-105'
                  : 'text-secondary-200 hover:text-white hover:bg-curtain-700'
              }`}
            >
              ⭐ Vote & Rate
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                activeTab === 'comments'
                  ? 'bg-secondary-500 text-white shadow-lg transform scale-105'
                  : 'text-secondary-200 hover:text-white hover:bg-curtain-700'
              }`}
            >
              💬 Comments
            </button>
            <button
              onClick={() => setActiveTab('program')}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                activeTab === 'program'
                  ? 'bg-secondary-500 text-white shadow-lg transform scale-105'
                  : 'text-secondary-200 hover:text-white hover:bg-curtain-700'
              }`}
            >
              📋 Program
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'vote' && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-theatrical">
                <h3 className="text-xl font-bold text-accent-800 mb-4 text-center text-curtain">
                  ⭐ Rate This Performance
                </h3>
                <div className="text-center">
                  <VoteStars
                    rating={userVote?.rating || 0}
                    onRatingChange={handleVote}
                    disabled={voteLoading || !activeAct.isVotingOpen}
                  />
                  <p className="text-accent-700 mt-4 font-semibold">
                    {activeAct.isVotingOpen 
                      ? "Tap the stars to rate this performance"
                      : "Voting is currently closed for this act"
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comments' && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-theatrical">
                <h3 className="text-xl font-bold text-accent-800 mb-4 text-center text-curtain">
                  💬 Leave a Comment
                </h3>
                <CommentBox onSubmit={handleComment} />
                
                {/* Recent Comments */}
                {displayedComments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-accent-800 mb-3">Recent Comments:</h4>
                    <div className="space-y-2">
                      {displayedComments.map((comment, index) => (
                        <motion.div
                          key={`${comment.id}-${index}`}
                          className="bg-secondary-100 border border-secondary-300 rounded-lg p-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-2">
                            {comment.emoji && <span className="text-lg">{comment.emoji}</span>}
                            <p className="text-secondary-800 font-semibold">{comment.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'program' && (
            <motion.div
              key="program"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-theatrical">
                <h3 className="text-xl font-bold text-accent-800 mb-4 text-center text-curtain">
                  📋 Show Program
                </h3>
                <div className="text-center">
                  <div className="bg-secondary-100 border-2 border-secondary-300 rounded-lg p-6 mb-4">
                    <h4 className="text-lg font-bold text-secondary-800 mb-2">Current Performance</h4>
                    <p className="text-secondary-700 font-semibold">{activeAct.name}</p>
                    <p className="text-secondary-600 text-sm">Grade {activeAct.grade}</p>
                  </div>
                  
                  <div className="bg-accent-100 border-2 border-accent-300 rounded-lg p-4">
                    <h4 className="font-bold text-accent-800 mb-2">🎪 Show Information</h4>
                    <ul className="text-accent-700 space-y-1 font-semibold text-sm">
                      <li>• Vote for your favorite acts</li>
                      <li>• Leave encouraging comments</li>
                      <li>• Participate in trivia between acts</li>
                      <li>• Results will be announced at the end</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AudiencePage;
