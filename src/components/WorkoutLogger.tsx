import React, { useState, useEffect, useRef } from 'react';
import { EXERCISES } from '../data/exercises';
import { storageService, getLocalDateString } from '../utils/storage';
import type { ExerciseLog, WorkoutSet } from '../types';
import { Plus, Trash2, Check, Play, Pause, RotateCcw, Calendar, Save } from 'lucide-react';

interface WorkoutLoggerProps {
  preselectedExerciseId?: string;
  onSaveSuccess: () => void;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ preselectedExerciseId, onSaveSuccess }) => {
  const [logDate, setLogDate] = useState(getLocalDateString());
  const [selectedExId, setSelectedExId] = useState(preselectedExerciseId || EXERCISES[0].id);
  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: '1', reps: 10, weight: 0, completed: false }
  ]);
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  const isDurationBased = selectedExId === 'plank';

  // React to preselected exercise changes
  useEffect(() => {
    if (preselectedExerciseId) {
      setSelectedExId(preselectedExerciseId);
    }
  }, [preselectedExerciseId]);

  // Adjust inputs if exercise type changes
  useEffect(() => {
    // Re-initialize default set based on exercise type
    if (isDurationBased) {
      setSets([{ id: '1', duration: 60, completed: false }]);
    } else {
      setSets([{ id: '1', reps: 10, weight: 0, completed: false }]);
    }
  }, [selectedExId]);

  // Load existing log if the user changes the date or selected exercise
  useEffect(() => {
    const loadExistingLog = async () => {
      const existingLog = await storageService.getWorkoutLogByDate(logDate);
      if (existingLog) {
        const exLog = existingLog.exercises.find(ex => ex.exerciseId === selectedExId);
        if (exLog && exLog.sets.length > 0) {
          setSets(exLog.sets);
        } else {
          // Initialize fresh if not logged yet for this exercise
          setSets(isDurationBased ? [{ id: '1', duration: 60, completed: false }] : [{ id: '1', reps: 10, weight: 0, completed: false }]);
        }
        if (existingLog.notes) {
          setNotes(existingLog.notes);
        }
      } else {
        // Fresh date
        setSets(isDurationBased ? [{ id: '1', duration: 60, completed: false }] : [{ id: '1', reps: 10, weight: 0, completed: false }]);
        setNotes('');
      }
    };
    loadExistingLog();
  }, [logDate, selectedExId]);

  // Timer Countdown Logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playTimerCompleteSound();
            return totalTimerSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, totalTimerSeconds]);

  // Gentle audio chime when rest completes
  const playTimerCompleteSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Chime Beep 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(660, audioCtx.currentTime); // E5 Note
      gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.12);

      // Chime Beep 2
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 Note
        gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.25);
      }, 120);
    } catch (e) {
      console.warn('Audio Context not supported or blocked by user gesture:', e);
    }
  };

  // Add a new empty set
  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      completed: false,
      ...(isDurationBased 
        ? { duration: lastSet?.duration || 60 } 
        : { reps: lastSet?.reps || 10, weight: lastSet?.weight || 0 }
      )
    };
    setSets([...sets, newSet]);
  };

  // Remove a set
  const removeSet = (id: string) => {
    if (sets.length === 1) return; // Keep at least one set
    setSets(sets.filter(set => set.id !== id));
  };

  // Update set values
  const updateSetField = (id: string, field: keyof WorkoutSet, value: any) => {
    setSets(
      sets.map((set) => {
        if (set.id === id) {
          return { ...set, [field]: value };
        }
        return set;
      })
    );
  };

  // Handle Save
  const handleSaveWorkout = async () => {
    setSaveStatus('saving');
    
    // Find or create daily log
    const existingLogs = await storageService.getWorkoutLogs();
    const existingLog = existingLogs[logDate] || {
      id: logDate,
      date: logDate,
      exercises: []
    };

    // Filter out inactive sets or keep sets as is
    const activeSets = sets.map(s => ({
      ...s,
      weight: s.weight === undefined ? 0 : Number(s.weight),
      reps: s.reps === undefined ? 0 : Number(s.reps),
      duration: s.duration === undefined ? 0 : Number(s.duration)
    }));

    // Update the exercise in the log
    const exLogIndex = existingLog.exercises.findIndex(e => e.exerciseId === selectedExId);
    const newExLog: ExerciseLog = {
      exerciseId: selectedExId,
      sets: activeSets
    };

    if (exLogIndex > -1) {
      existingLog.exercises[exLogIndex] = newExLog;
    } else {
      existingLog.exercises.push(newExLog);
    }

    if (notes) {
      existingLog.notes = notes;
    }

    await storageService.saveWorkoutLog(existingLog);
    
    setSaveStatus('success');
    setTimeout(() => {
      setSaveStatus('idle');
      onSaveSuccess();
    }, 1200);
  };

  // Format MM:SS for countdown timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Rest Timer Progress Ring Percentage Calculation
  const progressPercent = (timerSeconds / totalTimerSeconds) * 100;
  const strokeDashoffset = 282.7 - (282.7 * progressPercent) / 100;

  const quickPresets = [30, 45, 60, 90, 120, 180];

  return (
    <div className="logger-view animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Left Column - Log sets form */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Date and Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Workout Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="date" 
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Select Exercise</label>
            <select
              value={selectedExId}
              onChange={(e) => setSelectedExId(e.target.value)}
              className="input-field"
            >
              {EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Set Logger Inputs */}
        <div style={{ marginTop: '0.5rem' }}>
          
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.5px' }}>
            <div>SET</div>
            {isDurationBased ? (
              <div style={{ gridColumn: 'span 2' }}>DURATION (SEC)</div>
            ) : (
              <>
                <div>WEIGHT (KG)</div>
                <div>REPS</div>
              </>
            )}
            <div>DONE</div>
            <div>DEL</div>
          </div>

          {/* Dynamic Set List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sets.map((set, index) => (
              <div 
                key={set.id} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', 
                  gap: '1rem', 
                  alignItems: 'center',
                  background: set.completed ? 'rgba(16, 185, 129, 0.03)' : 'transparent',
                  padding: '0.25rem 0',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {/* Set number */}
                <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.95rem', color: set.completed ? 'var(--color-emerald)' : '#ffffff' }}>
                  {index + 1}
                </div>

                {isDurationBased ? (
                  /* Duration fields */
                  <div style={{ gridColumn: 'span 2' }}>
                    <input 
                      type="number"
                      min="0"
                      value={set.duration || ''}
                      placeholder="60"
                      onChange={(e) => updateSetField(set.id, 'duration', e.target.value ? Number(e.target.value) : '')}
                      className="input-field"
                      style={{ textAlign: 'center' }}
                      disabled={set.completed}
                    />
                  </div>
                ) : (
                  /* Weight and Reps fields */
                  <>
                    <div>
                      <input 
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        value={set.weight === 0 && set.completed === false ? '' : set.weight}
                        onChange={(e) => updateSetField(set.id, 'weight', e.target.value ? Number(e.target.value) : 0)}
                        className="input-field"
                        style={{ textAlign: 'center' }}
                        disabled={set.completed}
                      />
                    </div>
                    
                    <div>
                      <input 
                        type="number"
                        min="0"
                        placeholder="10"
                        value={set.reps || ''}
                        onChange={(e) => updateSetField(set.id, 'reps', e.target.value ? Number(e.target.value) : '')}
                        className="input-field"
                        style={{ textAlign: 'center' }}
                        disabled={set.completed}
                      />
                    </div>
                  </>
                )}

                {/* Checked completion box */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => updateSetField(set.id, 'completed', !set.completed)}
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '8px', 
                      background: set.completed ? 'var(--color-emerald)' : 'rgba(255,255,255,0.03)',
                      border: set.completed ? '1px solid var(--color-emerald)' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {set.completed && <Check size={16} strokeWidth={3} />}
                  </button>
                </div>

                {/* Remove button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => removeSet(set.id)}
                    className="button-danger"
                    style={{ padding: '0.4rem', borderRadius: '8px' }}
                    disabled={sets.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Set Button */}
          <button 
            className="button-secondary"
            onClick={addSet}
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.6rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem' }}
          >
            <Plus size={16} />
            Add New Set
          </button>
        </div>

        {/* Workout Session Notes */}
        <div style={{ marginTop: '0.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Session Notes (Optional)</label>
          <textarea
            rows={2}
            placeholder="How did the session feel? E.g., Felt strong on squats today, rest periods were 90s."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field"
            style={{ resize: 'none' }}
          />
        </div>

        {/* Save log action */}
        <button 
          className="button-primary"
          onClick={handleSaveWorkout}
          disabled={saveStatus !== 'idle'}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          <Save size={18} />
          {saveStatus === 'idle' && 'Save Workout Log'}
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'success' && 'Logged Successfully!'}
        </button>

      </div>

      {/* Right Column - Rest Timer Widget */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', width: '100%', paddingBottom: '0.75rem', textAlign: 'center' }}>
          Rest Timer
        </h3>

        {/* Timer countdown circle representation */}
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '150px', height: '150px' }}>
            {/* Background ring */}
            <circle 
              cx="75" 
              cy="75" 
              r="45" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="6" 
              fill="transparent" 
            />
            {/* Active countdown border track */}
            <circle 
              cx="75" 
              cy="75" 
              r="45" 
              stroke="var(--color-accent)" 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray="282.7"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
              {formatTime(timerSeconds)}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '-2px' }}>
              rest
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
          <button 
            className="button-secondary"
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(totalTimerSeconds);
            }}
            style={{ padding: '0.6rem 1rem' }}
          >
            <RotateCcw size={16} />
          </button>
          
          <button 
            className="button-primary"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            style={{ 
              padding: '0.6rem 2rem', 
              background: isTimerRunning ? 'rgba(239, 68, 68, 0.12)' : 'linear-gradient(135deg, var(--color-accent), var(--color-blue))',
              border: isTimerRunning ? '1px solid rgba(239, 68, 68, 0.2)' : 'none',
              color: isTimerRunning ? '#f87171' : '#ffffff',
              boxShadow: isTimerRunning ? 'none' : '0 4px 15px rgba(6, 182, 212, 0.25)'
            }}
          >
            {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            <span style={{ marginLeft: '4px' }}>{isTimerRunning ? 'Pause' : 'Start'}</span>
          </button>
        </div>

        {/* Quick Presets Grid */}
        <div style={{ width: '100%', marginTop: '0.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 500 }}>
            Quick Duration Select (Seconds)
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {quickPresets.map((secs) => (
              <button
                key={secs}
                onClick={() => {
                  setIsTimerRunning(false);
                  setTotalTimerSeconds(secs);
                  setTimerSeconds(secs);
                }}
                style={{
                  background: totalTimerSeconds === secs ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: totalTimerSeconds === secs ? '1px solid var(--color-accent)' : '1px solid var(--border-glass)',
                  color: totalTimerSeconds === secs ? '#ffffff' : 'var(--text-secondary)',
                  padding: '0.45rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  transition: 'all 0.15s ease'
                }}
              >
                {secs}s
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
