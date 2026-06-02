import type { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    category: 'legs',
    difficulty: 'beginner',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    instructions: [
      'Stand with your feet shoulder-width apart, toes pointed slightly outward (about 15-30 degrees).',
      'Brace your core, pull your shoulders back, and keep your chest proud and eyes looking straight ahead.',
      'Initiate the movement by pushing your hips back as if you are sitting down on an imaginary low chair.',
      'Lower your hips down while keeping your weight centered on your heels. Lower until your thighs are parallel or below parallel to the floor.',
      'Ensure your knees push outwards, tracking in the same direction as your toes. Do not let them cave inward.',
      'Press through your midfoot and heels to drive yourself back up to the starting position. Squeeze your glutes at the top.'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse) - this places stress on the knee joints.',
      'Heels lifting off the ground - shifts load onto the toes and knees.',
      'Lower back rounding ("butt wink") at the bottom of the squat.',
      'Chest collapsing forward - makes the lift less stable and stresses the lower spine.',
      'Shallow squatting - stopping well short of parallel depth, minimizing glute recruitment.'
    ],
    cues: [
      'Spread the floor with your feet.',
      'Sit back, don\'t just bend down.',
      'Push your knees outward.',
      'Keep your chest proud and tall.'
    ],
    primaryColor: '#10b981' // Neon Emerald
  },
  {
    id: 'pushup',
    name: 'Classic Push-Up',
    category: 'chest',
    difficulty: 'beginner',
    targetMuscles: ['Pectorals (Chest)', 'Anterior Deltoids (Shoulders)', 'Triceps', 'Core'],
    instructions: [
      'Position yourself in a plank position with hands slightly wider than shoulder-width apart, fingers pointed slightly out.',
      'Form a straight line from your head to your heels. Squeeze your glutes, thighs, and brace your core tightly.',
      'Look slightly forward (about a foot in front of your hands) to keep a neutral neck.',
      'Lower your body by bending your elbows. Keep your elbows tucked in at roughly a 45-degree angle to your body, not flared out.',
      'Lower yourself until your chest is about an inch from the floor or lightly touches it.',
      'Push hard through your hands to press your body back up to the starting plank, maintaining a rigid core.'
    ],
    commonMistakes: [
      'Flaring elbows out to 90 degrees - placing excessive torque and stress on the rotator cuffs.',
      'Sagging hips or arched lower back - indicates a loose, inactive core.',
      'Dipping the chin or looking down - creates neck strain and cuts range of motion short.',
      'Partial range of motion - only doing the top half of the push-up.'
    ],
    cues: [
      'Keep your body rigid like a steel bar.',
      'Tuck your elbows at a 45-degree angle.',
      'Push the floor away from you.',
      'Squeeze your glutes throughout the movement.'
    ],
    primaryColor: '#06b6d4' // Electric Cyan
  },
  {
    id: 'deadlift',
    name: 'Barbell Deadlift',
    category: 'back',
    difficulty: 'intermediate',
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae (Lower Back)', 'Trapezius', 'Forearms'],
    instructions: [
      'Stand with your feet hip-width apart. The barbell should be over the middle of your feet (about 1 inch from shins).',
      'Hinge at your hips and bend your knees slightly to grab the bar with a shoulder-width grip.',
      'Flatten your back completely. Pull your shoulder blades down and back ("pack your armpits") to engage your latissimus dorsi muscles.',
      'Take a deep breath, brace your core, and lower your hips slightly while keeping your shins vertical or near-vertical.',
      'Drive your feet hard into the floor to lift the bar straight up. Keep the bar extremely close to your shins and thighs as it rises.',
      'Stand tall, locking out your knees and hips. Squeeze your glutes at the top. Do not lean backward.',
      'Return the bar to the ground by hinging at your hips first, then bending knees once the bar clears them.'
    ],
    commonMistakes: [
      'Rounding the lower back - the most dangerous deadlift mistake, risking spinal injury.',
      'Letting the bar drift forward - increases leverage and load on the lower back.',
      'Squatting the deadlift - dropping hips too low and pushing the shins forward into the bar.',
      'Hyperextending the back at the top - leaning backward instead of just standing straight.'
    ],
    cues: [
      'Pack your armpits (engage lats).',
      'Push the floor away with your feet.',
      'Keep the bar scraping your shins.',
      'Stand tall, lock out with your glutes.'
    ],
    primaryColor: '#f59e0b' // Amber/Gold
  },
  {
    id: 'plank',
    name: 'Forearm Plank',
    category: 'core',
    difficulty: 'beginner',
    targetMuscles: ['Rectus Abdominis (Abs)', 'Transverse Abdominis', 'Obliques', 'Shoulders', 'Glutes'],
    instructions: [
      'Place your forearms on the floor, parallel to each other, with elbows aligned directly beneath your shoulders.',
      'Extend both legs straight behind you, resting your weight on your toes.',
      'Create a flat line from your head down to your heels. Do not let your hips sag toward the ground or push up into the air.',
      'Squeeze your glutes, quadriceps, and pull your navel up toward your spine to brace your core.',
      'Press your forearms actively into the ground to push your upper back away from the floor (protracting shoulder blades).',
      'Maintain a neutral neck by looking down at the space between your hands. Breathe steadily.'
    ],
    commonMistakes: [
      'Sagging hips - straining the lower back due to lack of core and glute engagement.',
      'Hips too high - shifting the load from the abdominals to the shoulders.',
      'Dropping the head - causing neck fatigue and improper cervical alignment.',
      'Holding the breath - raising blood pressure and causing premature fatigue.'
    ],
    cues: [
      'Squeeze your glutes and pull your ribs to your pelvis.',
      'Push your elbows down to lift your chest.',
      'Pull your elbows toward your toes to engage deeper.',
      'Keep a straight line from head to heels.'
    ],
    primaryColor: '#a855f7' // Neon Purple
  },
  {
    id: 'overhead-press',
    name: 'Overhead Shoulder Press',
    category: 'shoulders',
    difficulty: 'intermediate',
    targetMuscles: ['Deltoids (Shoulders)', 'Triceps', 'Upper Chest', 'Core', 'Trapezius'],
    instructions: [
      'Set the bar at chest height. Grip the bar slightly wider than shoulder-width, with your wrists stacked directly over your forearms.',
      'Unrack the bar and rest it on your front shoulders. Keep your feet shoulder-width apart, knees locked, and glutes squeezed.',
      'Take a deep breath, brace your core, and tilt your head back slightly to clear a path for the bar.',
      'Press the bar straight up in a vertical path. Drive through your heels.',
      'Once the bar clears your forehead, push your head forward to its normal position ("pushing through the window").',
      'Fully extend your arms and lock your elbows at the top, shrugging your shoulders slightly toward the ceiling.',
      'Lower the bar under control back to the starting rack position on your collarbones, tilting head back again.'
    ],
    commonMistakes: [
      'Arching the lower back - leaning backward too far, putting heavy stress on the lumbar spine.',
      'Bending the knees (turning it into a push-press) - using leg momentum instead of shoulder strength.',
      'Bar path curving outward - pressing the bar forward in a C-shape rather than straight up.',
      'Elbows flaring too far outward during the setup - stresses the shoulder joints.'
    ],
    cues: [
      'Squeeze your glutes and quad muscles.',
      'Punch the bar straight up.',
      'Push your head through the window at lockout.',
      'Keep your forearms vertical.'
    ],
    primaryColor: '#ec4899' // Hot Pink
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'arms',
    difficulty: 'beginner',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Brachioradialis (Forearm)'],
    instructions: [
      'Stand upright holding a dumbbell in each hand, arms hanging at your sides, with palms facing forward.',
      'Position your feet hip-width apart and maintain a slight bend in your knees.',
      'Keep your elbows tucked closely to your torso. Your upper arms should remain stationary.',
      'Exhale and curl the weights upward by contracting your biceps. Continue until the dumbbells reach shoulder level.',
      'Squeeze your biceps hard at the peak of the movement for a brief second.',
      'Inhale and slowly lower the dumbbells back down to the starting position under control, fully extending your arms.'
    ],
    commonMistakes: [
      'Swinging the hips/body - using torso momentum to swing the weights up rather than muscle contraction.',
      'Elbows drifting forward - moving elbows away from the body engages the anterior deltoids and takes tension off the biceps.',
      'Incomplete range of motion - not letting the arms fully extend at the bottom, or stopping short of the top.',
      'Dropping the weight quickly - neglecting the eccentric (lowering) phase, which is highly effective for growth.'
    ],
    cues: [
      'Pin your elbows to your sides.',
      'No swinging, control the weight.',
      'Slow and controlled on the way down.',
      'Squeeze at the top.'
    ],
    primaryColor: '#3b82f6' // Royal Blue
  }
];

export const getExercisesByCategory = (category: string): Exercise[] => {
  if (category.toLowerCase() === 'all') return EXERCISES;
  return EXERCISES.filter(ex => ex.category.toLowerCase() === category.toLowerCase());
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISES.find(ex => ex.id === id);
};
