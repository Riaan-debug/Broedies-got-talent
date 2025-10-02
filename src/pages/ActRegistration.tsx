import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerAct } from '../utils/firestore';

const ActRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    description: '',
    submittedBy: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [actId, setActId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const id = await registerAct({
        name: formData.name,
        grade: formData.grade,
        description: formData.description,
        submittedBy: formData.submittedBy,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
      });
      
      setActId(id);
      setSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Failed to register act');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card text-center">
            <motion.div
              className="text-6xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              ✅
            </motion.div>
            
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Registration Successful!
            </h1>
            
            <div className="bg-green-100 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold mb-2">Your Act ID:</p>
              <p className="text-2xl font-bold text-green-900">ACT{actId.slice(-3)}</p>
            </div>
            
            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your act has been submitted for review</li>
                <li>• Admin will approve or contact you for changes</li>
                <li>• You'll receive updates via email</li>
                <li>• Check back later for status updates</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    grade: '',
                    description: '',
                    submittedBy: '',
                    contactEmail: '',
                    contactPhone: '',
                  });
                }}
                className="btn-primary w-full"
              >
                Register Another Act
              </button>
              
              <a
                href="/vote"
                className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
              >
                Go to Voting Page
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🎭 Register Your Act
          </h1>
          <p className="text-lg text-gray-600">
            Sign up for Broedies Got Talent Show!
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Act Information
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Act Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., The Flying Dutchmen"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade *
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Grade 5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field resize-none h-24"
                placeholder="Describe your performance (singing, dancing, magic, etc.)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Parent/Guardian) *
              </label>
              <input
                type="text"
                name="submittedBy"
                value={formData.submittedBy}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="082 123 4567"
                />
              </div>
            </div>

            {error && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  'Register Act'
                )}
              </button>
              
              <a
                href="/vote"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
              >
                Cancel
              </a>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Important Notes:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All acts will be reviewed before approval</li>
              <li>• You'll receive an Act ID for reference</li>
              <li>• Contact information helps us reach you if needed</li>
              <li>• Performance order will be determined by admin</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActRegistration;

