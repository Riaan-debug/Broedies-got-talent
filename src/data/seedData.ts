import type { Act, Trivia } from '../types';

// Sample acts for testing
export const sampleActs: Omit<Act, 'id' | 'createdAt' | 'updatedAt' | 'submissionDate' | 'lastUpdated'>[] = [
  {
    name: "Grade 1 Singing Stars",
    grade: "Grade 1",
    description: "Beautiful rendition of 'Twinkle Twinkle Little Star'",
    order: 1,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
  {
    name: "Grade 2 Dance Crew",
    grade: "Grade 2", 
    description: "Energetic dance performance to popular music",
    order: 2,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
  {
    name: "Grade 3 Magic Show",
    grade: "Grade 3",
    description: "Amazing magic tricks and illusions",
    order: 3,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
  {
    name: "Grade 4 Poetry Recital",
    grade: "Grade 4",
    description: "Original poems about friendship and school",
    order: 4,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
  {
    name: "Grade 5 Instrumental Ensemble",
    grade: "Grade 5",
    description: "Beautiful piano and violin duet",
    order: 5,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
  {
    name: "Grade 6 Comedy Skit",
    grade: "Grade 6",
    description: "Hilarious school-themed comedy performance",
    order: 6,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
  {
    name: "Grade 7 Acrobatics",
    grade: "Grade 7",
    description: "Impressive gymnastics and acrobatic moves",
    order: 7,
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'approved',
    submittedBy: 'Admin',
  },
];

// Sample trivia questions
export const sampleTrivia: Omit<Trivia, 'id' | 'createdAt'>[] = [
  {
    question: "What is the school motto of Laerskool Broederstroom?",
    options: [
      "Excellence Through Learning",
      "Growing Together",
      "Knowledge is Power",
      "Success Through Hard Work"
    ],
    correctOption: 1,
    isActive: false,
    results: {},
  },
  {
    question: "Which grade has the most students this year?",
    options: [
      "Grade 1",
      "Grade 3", 
      "Grade 5",
      "Grade 7"
    ],
    correctOption: 2,
    isActive: false,
    results: {},
  },
  {
    question: "What is the school's favorite sport?",
    options: [
      "Soccer",
      "Rugby",
      "Cricket",
      "Netball"
    ],
    correctOption: 1,
    isActive: false,
    results: {},
  },
  {
    question: "How many teachers work at the school?",
    options: [
      "15-20",
      "21-25",
      "26-30",
      "31-35"
    ],
    correctOption: 2,
    isActive: false,
    results: {},
  },
  {
    question: "What is the school's main color?",
    options: [
      "Blue",
      "Green",
      "Red",
      "Purple"
    ],
    correctOption: 0,
    isActive: false,
    results: {},
  },
];

// Emoji options for comments
export const emojiOptions = [
  '🎭', '🎪', '🎨', '🎵', '🎶', '🎤', '🎸', '🎹', '🥁', '🎺',
  '🎻', '🎬', '🎯', '🏆', '⭐', '🌟', '💫', '✨', '🎉', '🎊',
  '👏', '🙌', '🤩', '😍', '😊', '😄', '🤗', '💖', '💕', '🔥'
];

