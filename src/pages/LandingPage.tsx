import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-theatrical flex items-center justify-center p-4">
      <motion.div
        className="max-w-4xl w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="text-9xl mb-6 animate-sparkle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            🎭
          </motion.div>
          <h1 className="text-6xl font-bold text-secondary-200 text-glow mb-4">
            BROEDIES GOT TALENT
          </h1>
          <p className="text-2xl text-secondary-300 font-semibold mb-8">
            Welcome to our spectacular talent show!
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Audience Voting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/vote" className="block">
              <div className="card-theatrical spotlight hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-2xl font-bold text-accent-800 mb-3 text-curtain">
                  Audience Voting
                </h2>
                <p className="text-accent-700 font-semibold mb-4">
                  Vote for your favorite acts, leave comments, and participate in trivia!
                </p>
                <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-3">
                  <p className="text-secondary-800 font-bold">
                    ⭐ Rate performances<br/>
                    💬 Leave comments<br/>
                    🎯 Play trivia
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Act Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/register" className="block">
              <div className="card-theatrical spotlight hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-accent-800 mb-3 text-curtain">
                  Register Your Act
                </h2>
                <p className="text-accent-700 font-semibold mb-4">
                  Sign up to perform in our talent show!
                </p>
                <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-3">
                  <p className="text-secondary-800 font-bold">
                    🎪 Submit your act<br/>
                    📋 Fill out details<br/>
                    ⏳ Wait for approval
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Display Screen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link to="/display" className="block">
              <div className="card-theatrical spotlight hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-6xl mb-4">📺</div>
                <h2 className="text-2xl font-bold text-accent-800 mb-3 text-curtain">
                  Display Screen
                </h2>
                <p className="text-accent-700 font-semibold mb-4">
                  Projector view for the main stage display
                </p>
                <div className="bg-secondary-100 border border-secondary-300 rounded-lg p-3">
                  <p className="text-secondary-800 font-bold">
                    🎬 Full screen mode<br/>
                    📱 Live comments<br/>
                    🎯 Trivia display
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          className="card-theatrical max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-xl font-bold text-accent-800 mb-4 text-curtain">
            🎪 How to Participate
          </h3>
          <div className="text-left space-y-3 text-accent-700 font-semibold">
            <div className="flex items-start gap-3">
              <span className="text-secondary-600 font-bold">1.</span>
              <p>Choose your experience above</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-secondary-600 font-bold">2.</span>
              <p>Follow the on-screen instructions</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-secondary-600 font-bold">3.</span>
              <p>Enjoy the show and participate!</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-secondary-400 font-semibold">
            🎭 Laerskool Broederstroom Talent Show 🎭
          </p>
          <p className="text-secondary-500 text-sm mt-2">
            Powered by modern technology for an amazing experience
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
