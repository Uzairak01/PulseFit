import type { WorkoutLog, UserStreak } from '../types';
import { IS_FIREBASE_ENABLED, firebaseDB } from '../firebase';
import { auth } from '../firebase';

const LOGS_KEY = 'pulsefit_workout_logs';
const STREAK_KEY = 'pulsefit_user_streak';

// Returns the current authenticated user's UID, or throws if not logged in
const getUserId = (): string => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('No authenticated user found.');
  return uid;
};

// Get local date string 'YYYY-MM-DD'
export const getLocalDateString = (date = new Date()): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

/**
 * Check if any sets are completed in a workout log
 */
export const hasCompletedSet = (log: WorkoutLog): boolean => {
  return log.exercises.some(ex => ex.sets.some(s => s.completed));
};

/**
 * Recalculates and updates the workout streak based on logs history.
 */
export const calculateStreak = (logs: Record<string, WorkoutLog>): UserStreak => {
  const dates = Object.keys(logs)
    .filter(dateStr => hasCompletedSet(logs[dateStr]))
    .sort();

  if (dates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const todayStr = getLocalDateString();
  const yesterdayStr = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  // Process all logs chronologically
  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);

    if (prevDate === null) {
      runningStreak = 1;
    } else {
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak += 1;
      } else if (diffDays > 1) {
        runningStreak = 1; // Gap in workouts, reset running streak
      }
      // If diffDays is 0 (multiple entries for same day - shouldn't happen with our ID structure), runningStreak remains same
    }

    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }

    prevDate = currentDate;
  }

  // Calculate current streak based on last workout date
  const lastWorkoutDateStr = dates[dates.length - 1];
  if (lastWorkoutDateStr === todayStr || lastWorkoutDateStr === yesterdayStr) {
    currentStreak = runningStreak;
  } else {
    currentStreak = 0; // Streak broken
  }

  // Load existing streak to preserve historical best if it was higher
  const cached = localStorage.getItem(STREAK_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as UserStreak;
      if (parsed.bestStreak > bestStreak) {
        bestStreak = parsed.bestStreak;
      }
    } catch (e) {
      console.error('Error parsing streak cache', e);
    }
  }

  return {
    currentStreak,
    bestStreak,
    lastWorkoutDate: lastWorkoutDateStr
  };
};

/**
 * Storage API coordinating LocalStorage and Firebase sync
 */
export const storageService = {
  /**
   * Save a single daily workout log
   */
  saveWorkoutLog: async (log: WorkoutLog): Promise<void> => {
    // 1. Save to local storage first
    const logs = await storageService.getWorkoutLogs();
    logs[log.id] = log;
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));

    // 2. Update streak
    const updatedStreak = calculateStreak(logs);
    await storageService.saveUserStreak(updatedStreak);

    // 3. Sync to Firebase if enabled and authenticated
    if (IS_FIREBASE_ENABLED && auth.currentUser) {
      try {
        await firebaseDB.saveWorkoutLog(getUserId(), log);
      } catch (err) {
        console.error('Firebase save workout log error:', err);
      }
    }
  },

  /**
   * Fetch all workout logs as a record dictionary mapped by date YYYY-MM-DD
   */
  getWorkoutLogs: async (): Promise<Record<string, WorkoutLog>> => {
    let logs: Record<string, WorkoutLog> = {};

    // 1. Fetch from LocalStorage
    const localData = localStorage.getItem(LOGS_KEY);
    if (localData) {
      try {
        logs = JSON.parse(localData);
      } catch (e) {
        console.error('Error parsing local workout logs', e);
      }
    }

    // 2. Sync from Firebase if enabled and authenticated (and merge)
    if (IS_FIREBASE_ENABLED && auth.currentUser) {
      try {
        const fbLogsList = await firebaseDB.getWorkoutLogs(getUserId());
        fbLogsList.forEach(log => {
          logs[log.id] = log;
        });
        // Save merged back to LocalStorage
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      } catch (err) {
        console.error('Firebase load workout logs error:', err);
      }
    }

    return logs;
  },

  /**
   * Fetch a specific day's workout log
   */
  getWorkoutLogByDate: async (dateStr: string): Promise<WorkoutLog | null> => {
    const logs = await storageService.getWorkoutLogs();
    return logs[dateStr] || null;
  },

  /**
   * Save streak information
   */
  saveUserStreak: async (streak: UserStreak): Promise<void> => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    if (IS_FIREBASE_ENABLED && auth.currentUser) {
      try {
        await firebaseDB.saveUserStreak(getUserId(), streak);
      } catch (err) {
        console.error('Firebase save streak error:', err);
      }
    }
  },

  /**
   * Get streak information (calculates fresh if cache is missing)
   */
  getUserStreak: async (): Promise<UserStreak> => {
    let streak: UserStreak = { currentStreak: 0, bestStreak: 0 };

    const localData = localStorage.getItem(STREAK_KEY);
    if (localData) {
      try {
        streak = JSON.parse(localData);
      } catch (e) {
        console.error('Error parsing local streak', e);
      }
    } else {
      const logs = await storageService.getWorkoutLogs();
      streak = calculateStreak(logs);
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    }

    if (IS_FIREBASE_ENABLED && auth.currentUser) {
      try {
        const fbStreak = await firebaseDB.getUserStreak(getUserId());
        if (fbStreak) {
          streak = fbStreak;
          localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
        }
      } catch (err) {
        console.error('Firebase load streak error:', err);
      }
    }

    return streak;
  }
};
