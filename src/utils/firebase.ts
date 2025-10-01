// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUpqcB3QhUk7oSspPRnCSxwHbr1r-pAtU",
  authDomain: "broedies-got-talent.firebaseapp.com",
  projectId: "broedies-got-talent",
  storageBucket: "broedies-got-talent.firebasestorage.app",
  messagingSenderId: "163044042733",
  appId: "1:163044042733:web:53e3368c4147a77146a9e4",
  measurementId: "G-2PFTZ7HNW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;

