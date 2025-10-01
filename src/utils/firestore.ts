import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
// Define types locally to avoid import issues
interface Act {
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
  // New fields for self-registration
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string; // Email or contact info
  contactEmail?: string;
  contactPhone?: string;
  submissionDate: Date;
  lastUpdated: Date;
}

interface Vote {
  id: string;
  actId: string;
  rating: number;
  userId?: string;
  createdAt: Date;
}

interface Comment {
  id: string;
  actId: string;
  text?: string;
  emoji?: string;
  approved: boolean;
  createdAt: Date;
}

interface Trivia {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  isActive: boolean;
  results: Record<number, number>;
  createdAt: Date;
}

// Acts collection
export const actsCollection = collection(db, 'acts');
export const votesCollection = collection(db, 'votes');
export const commentsCollection = collection(db, 'comments');
export const triviaCollection = collection(db, 'trivia');

// Act operations
export const createAct = async (actData: Omit<Act, 'id' | 'createdAt' | 'updatedAt' | 'submissionDate' | 'lastUpdated'>) => {
  const docRef = await addDoc(actsCollection, {
    ...actData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submissionDate: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  });
  return docRef.id;
};

// New function for act registration
export const registerAct = async (actData: {
  name: string;
  grade: string;
  description: string;
  submittedBy: string;
  contactEmail?: string;
  contactPhone?: string;
}) => {
  const docRef = await addDoc(actsCollection, {
    ...actData,
    order: 0, // Will be set by admin
    isActive: false,
    isVotingOpen: false,
    avgScore: 0,
    votesCount: 0,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submissionDate: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  });
  return docRef.id;
};

export const updateAct = async (actId: string, updates: Partial<Act>) => {
  const actRef = doc(db, 'acts', actId);
  await updateDoc(actRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteAct = async (actId: string) => {
  const actRef = doc(db, 'acts', actId);
  await deleteDoc(actRef);
};

export const getActs = async (): Promise<Act[]> => {
  const q = query(actsCollection, orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Act[];
};

export const getActiveAct = async (): Promise<Act | null> => {
  const q = query(actsCollection, where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    submissionDate: doc.data().submissionDate?.toDate() || new Date(),
    lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
  } as Act;
};

// Get acts by status
export const getActsByStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<Act[]> => {
  const q = query(actsCollection, where('status', '==', status), orderBy('submissionDate', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    submissionDate: doc.data().submissionDate?.toDate() || new Date(),
    lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
  })) as Act[];
};

// Approve or reject an act
export const updateActStatus = async (actId: string, status: 'approved' | 'rejected', order?: number) => {
  const actRef = doc(db, 'acts', actId);
  const updates: any = {
    status,
    lastUpdated: serverTimestamp(),
  };
  
  if (status === 'approved' && order !== undefined) {
    updates.order = order;
  }
  
  await updateDoc(actRef, updates);
};

// Vote operations
export const submitVote = async (voteData: Omit<Vote, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(votesCollection, {
    ...voteData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserVote = async (actId: string, userId?: string): Promise<Vote | null> => {
  if (!userId) return null;
  
  const q = query(votesCollection, where('actId', '==', actId), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  } as Vote;
};

export const updateActScore = async (actId: string, newRating: number) => {
  const actRef = doc(db, 'acts', actId);
  await updateDoc(actRef, {
    votesCount: increment(1),
    avgScore: increment(newRating),
    updatedAt: serverTimestamp(),
  });
};

// Comment operations
export const submitComment = async (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(commentsCollection, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getApprovedComments = async (actId: string): Promise<Comment[]> => {
  const q = query(
    commentsCollection,
    where('actId', '==', actId),
    where('approved', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Comment[];
};

export const approveComment = async (commentId: string) => {
  const commentRef = doc(db, 'comments', commentId);
  await updateDoc(commentRef, { approved: true });
};

export const deleteComment = async (commentId: string) => {
  const commentRef = doc(db, 'comments', commentId);
  await deleteDoc(commentRef);
};

// Trivia operations
export const createTrivia = async (triviaData: Omit<Trivia, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(triviaCollection, {
    ...triviaData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTrivia = async (triviaId: string, updates: Partial<Trivia>) => {
  const triviaRef = doc(db, 'trivia', triviaId);
  await updateDoc(triviaRef, updates);
};

export const getActiveTrivia = async (): Promise<Trivia | null> => {
  const q = query(triviaCollection, where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  } as Trivia;
};

export const submitTriviaAnswer = async (triviaId: string, optionIndex: number) => {
  const triviaRef = doc(db, 'trivia', triviaId);
  const fieldName = `results.${optionIndex}`;
  await updateDoc(triviaRef, {
    [fieldName]: increment(1),
  });
};

// Real-time listeners
export const subscribeToActs = (callback: (acts: Act[]) => void) => {
  const q = query(actsCollection, orderBy('order', 'asc'));
  return onSnapshot(q, (querySnapshot) => {
    const acts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Act[];
    callback(acts);
  });
};

export const subscribeToActiveAct = (callback: (act: Act | null) => void) => {
  const q = query(actsCollection, where('isActive', '==', true));
  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      callback(null);
      return;
    }
    
    const doc = querySnapshot.docs[0];
    const act = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Act;
    callback(act);
  });
};

export const subscribeToApprovedComments = (actId: string, callback: (comments: Comment[]) => void) => {
  const q = query(
    commentsCollection,
    where('actId', '==', actId),
    where('approved', '==', true),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Comment[];
    callback(comments);
  });
};

export const subscribeToActiveTrivia = (callback: (trivia: Trivia | null) => void) => {
  const q = query(triviaCollection, where('isActive', '==', true));
  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      callback(null);
      return;
    }
    
    const doc = querySnapshot.docs[0];
    const trivia = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Trivia;
    callback(trivia);
  });
};

