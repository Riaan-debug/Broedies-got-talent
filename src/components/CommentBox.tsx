import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CommentBoxProps } from '../types';
import { emojiOptions } from '../data/seedData';

const CommentBox: React.FC<CommentBoxProps> = ({ onSubmit, disabled = false }) => {
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || selectedEmoji) {
      onSubmit(text.trim(), selectedEmoji || undefined);
      setText('');
      setSelectedEmoji(null);
      setShowEmojis(false);
    }
  };

  return (
    <motion.div
      className="card max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Share Your Thoughts! 💭
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment about this performance..."
            className="input-field resize-none h-20"
            disabled={disabled}
            maxLength={200}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {text.length}/200
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="btn-secondary text-sm py-2 px-4"
            disabled={disabled}
          >
            {selectedEmoji ? selectedEmoji : '😊'} Choose Emoji
          </button>

          <button
            type="submit"
            disabled={disabled || (!text.trim() && !selectedEmoji)}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>

        {showEmojis && (
          <motion.div
            className="grid grid-cols-10 gap-2 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {emojiOptions.map((emoji) => (
              <motion.button
                key={emoji}
                type="button"
                onClick={() => {
                  setSelectedEmoji(emoji);
                  setShowEmojis(false);
                }}
                className={`text-2xl p-2 rounded-lg transition-colors duration-200 ${
                  selectedEmoji === emoji
                    ? 'bg-primary-100 ring-2 ring-primary-500'
                    : 'hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default CommentBox;

