import React, { useState, useEffect } from 'react';
import { storageService, getLocalDateString, hasCompletedSet } from '../utils/storage';
import type { WorkoutLog } from '../types';
import { EXERCISES } from '../data/exercises';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, Clock, Clipboard, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface HistoryViewProps {
  refreshTrigger: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ refreshTrigger }) => {
  const [logs, setLogs] = useState<Record<string, WorkoutLog>>({});
  const [selectedDateStr, setSelectedDateStr] = useState(getLocalDateString());
  const [currentDate, setCurrentDate] = useState(new Date()); // For calendar navigation
  
  // Progression tracking state
  const [progressionExId, setProgressionExId] = useState(EXERCISES[0].id);
  const [progressionData, setProgressionData] = useState<{ date: string; maxVal: number }[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      const allLogs = await storageService.getWorkoutLogs();
      setLogs(allLogs);
    };
    loadLogs();
  }, [refreshTrigger]);

  // Compute progression chart data when selected exercise or logs change
  useEffect(() => {
    const dataPoints: { date: string; maxVal: number }[] = [];
    const isDuration = progressionExId === 'plank';

    // Sort logs chronologically
    const sortedDates = Object.keys(logs).sort();

    sortedDates.forEach((dateStr) => {
      const log = logs[dateStr];
      const exLog = log.exercises.find((e) => e.exerciseId === progressionExId);
      
      if (exLog) {
        const completedSets = exLog.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          if (isDuration) {
            const maxDuration = Math.max(...completedSets.map((s) => s.duration || 0));
            dataPoints.push({ date: dateStr.substring(5), maxVal: maxDuration });
          } else {
            const maxWeight = Math.max(...completedSets.map((s) => s.weight || 0));
            dataPoints.push({ date: dateStr.substring(5), maxVal: maxWeight });
          }
        }
      }
    });

    setProgressionData(dataPoints);
  }, [logs, progressionExId]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectDay = (dayNum: number) => {
    const dayStr = dayNum.toString().padStart(2, '0');
    const monthStr = (month + 1).toString().padStart(2, '0');
    setSelectedDateStr(`${year}-${monthStr}-${dayStr}`);
  };

  const selectedLog = logs[selectedDateStr];

  // Helper to render calendar cells
  const renderCalendarDays = () => {
    const cells = [];
    
    // Empty cells for alignment before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell-empty" style={{ aspectRatio: '1', width: '100%' }} />);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      
      const hasWorkout = logs[dateStr] && hasCompletedSet(logs[dateStr]);
      const isSelected = dateStr === selectedDateStr;
      const isToday = dateStr === getLocalDateString();

      cells.push(
        <button
          key={day}
          onClick={() => selectDay(day)}
          style={{
            aspectRatio: '1',
            width: '100%',
            background: isSelected 
              ? 'var(--color-accent)' 
              : hasWorkout 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(255, 255, 255, 0.02)',
            border: isToday 
              ? '1.5px solid var(--color-purple)' 
              : hasWorkout 
                ? '1px solid rgba(16, 185, 129, 0.3)' 
                : '1px solid var(--border-glass)',
            color: isSelected 
              ? '#000000' 
              : hasWorkout 
                ? 'var(--color-emerald)' 
                : '#ffffff',
            fontWeight: isSelected || isToday ? 'bold' : 'normal',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontSize: '0.9rem',
            transition: 'all 0.15s ease'
          }}
        >
          {day}
          {/* Dot marker for workouts */}
          {hasWorkout && !isSelected && (
            <span style={{ 
              position: 'absolute', 
              bottom: '4px', 
              width: '4px', 
              height: '4px', 
              borderRadius: '50%', 
              background: 'var(--color-emerald)' 
            }} />
          )}
        </button>
      );
    }

    return cells;
  };

  const getExerciseName = (id: string): string => {
    return EXERCISES.find(e => e.id === id)?.name || id;
  };

  return (
    <div className="history-view animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Left Column: Calendar & Selected Date logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Calendar Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Month Navigator Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
              {monthNames[month]} {year}
            </h3>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button className="button-secondary" onClick={prevMonth} style={{ padding: '0.4rem' }}>
                <ChevronLeft size={16} />
              </button>
              <button className="button-secondary" onClick={nextMonth} style={{ padding: '0.4rem' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, paddingBottom: '0.25rem' }}>
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {renderCalendarDays()}
          </div>
        </div>

        {/* Selected Date Session Details */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Session Detail
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Selected date: {selectedDateStr}
            </span>
          </div>

          {selectedLog && selectedLog.exercises.some(e => e.sets.some(s => s.completed)) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedLog.exercises
                .filter(ex => ex.sets.some(s => s.completed))
                .map((exLog, idx) => (
                  <div key={idx} style={{ borderBottom: idx < selectedLog.exercises.length - 1 ? '1px solid var(--border-glass)' : 'none', paddingBottom: '1rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
                      <Dumbbell size={16} />
                      {getExerciseName(exLog.exerciseId)}
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                      {exLog.sets.filter(s => s.completed).map((set, sIdx) => (
                        <div 
                          key={sIdx} 
                          style={{ 
                            padding: '0.5rem', 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid var(--border-glass)', 
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontSize: '0.8rem'
                          }}
                        >
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.65rem' }}>Set {sIdx + 1}</span>
                          <span style={{ fontWeight: 600 }}>
                            {exLog.exerciseId === 'plank' 
                              ? `${set.duration}s`
                              : `${set.weight}kg × ${set.reps}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              
              {selectedLog.notes && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Clipboard size={16} style={{ color: 'var(--color-purple)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>NOTES</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{selectedLog.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--text-muted)', 
              padding: '2rem 1rem', 
              fontSize: '0.85rem', 
              border: '1px dashed var(--border-glass)', 
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Clock size={24} />
              No completed exercises logged on this day.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Progression Charts */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '380px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-purple)' }} />
              Progression Chart
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track strength development over time</p>
          </div>
          
          <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.45rem 1.5rem 0.45rem 0.75rem', fontSize: '0.85rem' }}
            value={progressionExId}
            onChange={(e) => setProgressionExId(e.target.value)}
          >
            {EXERCISES.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flexGrow: 1, width: '100%', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {progressionData.length > 1 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={10} 
                  tickLine={false} 
                  label={{ 
                    value: progressionExId === 'plank' ? 'Seconds' : 'Weight (kg)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fill: 'var(--text-secondary)', fontSize: 10 } 
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(13, 19, 38, 0.95)', 
                    border: '1px solid var(--border-glass)', 
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif'
                  }} 
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="maxVal" 
                  stroke="var(--color-purple)" 
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--color-purple)', stroke: 'var(--bg-primary)', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: 'var(--color-accent)' }}
                  name={progressionExId === 'plank' ? 'Max Duration' : 'Max Weight'}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--text-secondary)', 
              padding: '3rem', 
              fontSize: '0.85rem', 
              border: '1px dashed var(--border-glass)', 
              borderRadius: '8px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={32} style={{ color: 'var(--text-muted)' }} />
              <p>Not enough history logged for this exercise.</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Need at least 2 distinct workout days logged to plot progression curves.
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
