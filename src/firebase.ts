// firebase.ts - Firebase configuration and Firestore/Auth exports

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { WorkoutLog, UserStreak } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Feature Flag - Firebase is now active
export const IS_FIREBASE_ENABLED = true;

/**
 * Firebase Firestore adapter implementations.
 */
export const firebaseDB = {
  /**
   * Save or update a daily log in Firestore.
   * Collection: 'users/{userId}/workoutLogs/{dateString}'
   */
  saveWorkoutLog: async (userId: string, log: WorkoutLog): Promise<void> => {
    await setDoc(doc(db, `users/${userId}/workoutLogs`, log.id), log);
  },

  /**
   * Fetch all workout logs for a user from Firestore.
   */
  getWorkoutLogs: async (userId: string): Promise<WorkoutLog[]> => {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/workoutLogs`));
    const logs: WorkoutLog[] = [];
    querySnapshot.forEach((docSnap) => {
      logs.push(docSnap.data() as WorkoutLog);
    });
    return logs;
  },

  /**
   * Save user streak data to Firestore.
   */
  saveUserStreak: async (userId: string, streak: UserStreak): Promise<void> => {
    await setDoc(doc(db, 'users', userId), { streak }, { merge: true });
  },

  /**
   * Fetch user streak from Firestore.
   */
  getUserStreak: async (userId: string): Promise<UserStreak | null> => {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data?.streak as UserStreak) || null;
    }
    return null;
  }
};
