export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: Difficulty;
  targetMuscles: string[];
  instructions: string[];
  commonMistakes: string[];
  cues: string[];
  primaryColor: string; // Neon accent color representing this exercise card (e.g., cyan, purple, lime)
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  weight?: number;      // in kg/lbs
  duration?: number;    // in seconds (for plank, etc.)
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface WorkoutLog {
  id: string;          // Format: YYYY-MM-DD
  date: string;        // Format: YYYY-MM-DD
  exercises: ExerciseLog[];
  notes?: string;
}

export interface UserStreak {
  currentStreak: number;
  bestStreak: number;
  lastWorkoutDate?: string; // Format: YYYY-MM-DD
}
