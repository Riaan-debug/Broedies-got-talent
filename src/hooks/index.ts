import { useState, useEffect } from 'react';
import type { Act, Vote, Comment, Trivia } from '../types';
import {
  subscribeToActs,
  subscribeToActiveAct,
  subscribeToApprovedComments,
  subscribeToActiveTrivia,
  getUserVote,
  submitVote,
  submitComment,
  submitTriviaAnswer,
  updateActScore,
} from '../utils/firestore';
import { useAuth } from '../context/AuthContext';

// Hook for managing acts
export const useActs = () => {
  const [acts, setActs] = useState<Act[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActs((newActs) => {
      setActs(newActs);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { acts, loading };
};

// Hook for managing active act
export const useActiveAct = () => {
  const [activeAct, setActiveAct] = useState<Act | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActiveAct((act) => {
      setActiveAct(act);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { activeAct, loading };
};

// Hook for managing voting
export const useVoting = (actId: string) => {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const checkVote = async () => {
      const vote = await getUserVote(actId, user.uid);
      setUserVote(vote);
      setHasVoted(!!vote);
      setLoading(false);
    };

    checkVote();
  }, [actId, user?.uid]);

  const vote = async (rating: number) => {
    if (!user?.uid || hasVoted) return;

    try {
      const voteData = {
        actId,
        rating,
        userId: user.uid,
      };

      await submitVote(voteData);
      await updateActScore(actId, rating);
      
      setHasVoted(true);
      setUserVote({ ...voteData, id: '', createdAt: new Date() });
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return { hasVoted, userVote, vote, loading };
};

// Hook for managing comments
export const useComments = (actId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToApprovedComments(actId, (newComments) => {
      setComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [actId]);

  const handleSubmitComment = async (text: string, emoji?: string) => {
    try {
      await submitComment({
        actId,
        text,
        emoji,
        approved: false, // Comments need admin approval
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return { comments, submitComment: handleSubmitComment, loading };
};

// Hook for managing trivia
export const useTrivia = () => {
  const [activeTrivia, setActiveTrivia] = useState<Trivia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActiveTrivia((trivia) => {
      setActiveTrivia(trivia);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const answerTrivia = async (optionIndex: number) => {
    if (!activeTrivia) return;

    try {
      await submitTriviaAnswer(activeTrivia.id, optionIndex);
    } catch (error) {
      console.error('Error submitting trivia answer:', error);
    }
  };

  return { activeTrivia, answerTrivia, loading };
};

// Hook for timer functionality
export const useTimer = (duration: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number;

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

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isRunning,
    start,
    stop,
    reset,
    formatTime,
  };
};

