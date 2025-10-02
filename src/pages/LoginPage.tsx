import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theatrical flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-theatrical spotlight">
          <div className="text-center mb-8">
            <motion.div
              className="text-8xl mb-6 animate-sparkle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              🎭
            </motion.div>
            <h1 className="text-4xl font-bold text-primary-600 text-curtain mb-3">
              BROEDIES GOT TALENT
            </h1>
            <p className="text-secondary-600 text-lg font-semibold">✨ ADMIN LOGIN ✨</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2 font-semibold">
                📧 Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@broederstroom.co.za"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2 font-semibold">
                🔐 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <motion.div
                className="bg-primary-100 border-2 border-primary-400 text-primary-800 px-4 py-3 rounded-lg font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-spotlight w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  🎭 Signing in...
                </div>
              ) : (
                '🎭 Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-accent-600 mb-4 font-semibold">🎫 Demo Credentials:</p>
            <div className="bg-secondary-100 border-2 border-secondary-300 rounded-lg p-4 text-sm font-semibold">
              <p><strong>📧 Email:</strong> admin@demo.com</p>
              <p><strong>🔐 Password:</strong> password123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/vote"
              className="text-secondary-600 hover:text-secondary-700 font-semibold text-lg transition-colors duration-300"
            >
              👥 Go to Audience View →
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

