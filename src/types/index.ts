// Data model types for Broedies Got Talent

export interface Act {
  id: string;
  name: string;
  grade: string;
  description: string;
  order: number;
  isActive: boolean;
  isVotingOpen: boolean;
  avgScore: number;
  votesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  actId: string;
  rating: number; // 1-5 stars
  userId?: string; // Optional for anonymous voting
  createdAt: Date;
}

export interface Comment {
  id: string;
  actId: string;
  text?: string;
  emoji?: string;
  approved: boolean;
  createdAt: Date;
}

export interface Trivia {
  id: string;
  question: string;
  options: string[];
  correctOption: number; // Index of correct option
  isActive: boolean;
  results: Record<number, number>; // optionIndex: count
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'audience';
}

// UI State types
export interface VotingState {
  currentAct: Act | null;
  hasVoted: boolean;
  userVote: Vote | null;
}

export interface TriviaState {
  currentQuestion: Trivia | null;
  hasAnswered: boolean;
  userAnswer: number | null;
}

// Component props
export interface VoteStarsProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  className?: string;
}

export interface CommentBoxProps {
  onSubmit: (text: string, emoji?: string) => void;
  disabled?: boolean;
}

export interface TriviaCardProps {
  trivia: Trivia;
  onAnswer: (optionIndex: number) => void;
  disabled?: boolean;
  showResults?: boolean;
}

export interface ActCardProps {
  act: Act;
  onActivate?: () => void;
  onStartVoting?: () => void;
  onStopVoting?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

