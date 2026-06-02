import React, { useState, useEffect } from 'react';
import { storageService, getLocalDateString } from '../utils/storage';
import type { UserStreak } from '../types';
import { Flame, Activity, Trophy, Calendar, PlusCircle, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  refreshTrigger: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, refreshTrigger }) => {
  const [streak, setStreak] = useState<UserStreak>({ currentStreak: 0, bestStreak: 0 });
  const [todaySets, setTodaySets] = useState(0);
  const [weeklySetCount, setWeeklySetCount] = useState(0);
  const [muscleData, setMuscleData] = useState<{ name: string; value: number }[]>([]);
  const [chartData, setChartData] = useState<{ day: string; sets: number }[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const activeStreak = await storageService.getUserStreak();
      const allLogs = await storageService.getWorkoutLogs();
      setStreak(activeStreak);

      // Calculate sets completed today
      const todayStr = getLocalDateString();
      const todayLog = allLogs[todayStr];
      let todayTotal = 0;
      if (todayLog) {
        todayLog.exercises.forEach((ex) => {
          todayTotal += ex.sets.filter((s) => s.completed).length;
        });
      }
      setTodaySets(todayTotal);

      // Process 7-day chart data
      const chartArr = [];
      const musclesMap: Record<string, number> = {};
      let totalWeeklySets = 0;
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = getLocalDateString(d);
        const dayName = dayNames[d.getDay()];
        
        const log = allLogs[dateStr];
        let setsCount = 0;
        
        if (log) {
          log.exercises.forEach((ex) => {
            const completedSets = ex.sets.filter((s) => s.completed);
            setsCount += completedSets.length;
            
            // Map muscle group sets
            // Let's grab some built-in muscles associated (we'll look them up)
            // For simplicity, we assign based on exercise names in data if available
            // Let's compute based on exercise category:
            const category = getMuscleCategory(ex.exerciseId);
            if (completedSets.length > 0) {
              musclesMap[category] = (musclesMap[category] || 0) + completedSets.length;
            }
          });
        }
        
        totalWeeklySets += setsCount;
        chartArr.push({
          day: dayName,
          sets: setsCount,
        });
      }
      
      setWeeklySetCount(totalWeeklySets);
      setChartData(chartArr);

      // Format Muscle Data for progress bars
      const sortedMuscles = Object.entries(musclesMap)
        .map(([name, val]) => ({ name, value: val }))
        .sort((a, b) => b.value - a.value);
      
      setMuscleData(sortedMuscles.slice(0, 5));
    };

    loadDashboardData();
  }, [refreshTrigger]);

  const getMuscleCategory = (exId: string): string => {
    if (exId === 'squat') return 'Legs (Quads/Glutes)';
    if (exId === 'pushup') return 'Chest (Pectorals)';
    if (exId === 'deadlift') return 'Posterior Chain';
    if (exId === 'plank') return 'Core (Abs)';
    if (exId === 'overhead-press') return 'Shoulders (Delts)';
    if (exId === 'bicep-curl') return 'Arms (Biceps)';
    return 'Other';
  };

  const getActiveDaysCount = () => {
    return chartData.filter((d) => d.sets > 0).length;
  };

  return (
    <div className="dashboard-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #ffffff, var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome Back, Athlete
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track your progress, correct your posture, and hit your fitness goals today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="button-primary" onClick={() => onNavigate('log')}>
            <PlusCircle size={18} />
            Log a Workout
          </button>
          <button className="button-secondary" onClick={() => onNavigate('exercises')}>
            Form Guides
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        
        {/* Streak Card */}
        <div className="glass-panel pulse-glow-accent" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderColor: streak.currentStreak > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-glass)' }}>
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid rgba(245, 158, 11, 0.2)', 
            width: '56px', 
            height: '56px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame className="streak-icon" size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Streak</span>
            <h2 style={{ fontSize: '1.8rem', margin: '0.1rem 0' }}>{streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trophy size={12} style={{ color: 'var(--color-amber)' }} />
              Personal Best: {streak.bestStreak} days
            </p>
          </div>
        </div>

        {/* Volume Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            background: 'rgba(6, 182, 212, 0.1)', 
            border: '1px solid rgba(6, 182, 212, 0.2)', 
            width: '56px', 
            height: '56px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity style={{ color: 'var(--color-accent)' }} size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Sets</span>
            <h2 style={{ fontSize: '1.8rem', margin: '0.1rem 0' }}>{todaySets}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {todaySets > 0 ? (
                <>
                  <CheckCircle2 size={12} style={{ color: 'var(--color-emerald)' }} />
                  Active today! Keep going.
                </>
              ) : (
                'No sets completed today yet.'
              )}
            </p>
          </div>
        </div>

        {/* Active Days Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ 
            background: 'rgba(168, 85, 247, 0.1)', 
            border: '1px solid rgba(168, 85, 247, 0.2)', 
            width: '56px', 
            height: '56px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar style={{ color: 'var(--color-purple)' }} size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Active Days</span>
            <h2 style={{ fontSize: '1.8rem', margin: '0.1rem 0' }}>{getActiveDaysCount()} / 7</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Total sets: {weeklySetCount} sets
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Graph & Muscle Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Weekly Progress Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '320px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Weekly Workload</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sets completed over the past 7 days</p>
          </div>
          <div style={{ flexGrow: 1, width: '100%', minHeight: '220px' }}>
            {weeklySetCount > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(13, 19, 38, 0.95)', 
                      border: '1px solid var(--border-glass)', 
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontFamily: 'Inter, sans-serif'
                    }} 
                  />
                  <Area type="monotone" dataKey="sets" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorSets)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                gap: '0.75rem',
                border: '1px dashed var(--border-glass)',
                borderRadius: '12px'
              }}>
                <Award size={32} style={{ color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '0.9rem' }}>No activity data found yet.</p>
                <button 
                  onClick={() => onNavigate('log')} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--color-accent)', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Log your first set to start tracking!
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Muscle Targets */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Muscles Targeted</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on sets completed</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
            {muscleData.length > 0 ? (
              muscleData.map((m, index) => {
                const maxVal = Math.max(...muscleData.map((md) => md.value));
                const percentage = maxVal > 0 ? (m.value / maxVal) * 100 : 0;
                
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 500 }}>{m.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{m.value} {m.value === 1 ? 'set' : 'sets'}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: `linear-gradient(to right, var(--color-accent), var(--color-purple))`, 
                          borderRadius: '10px',
                          transition: 'width 0.5s ease-out'
                        }} 
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                border: '1px dashed var(--border-glass)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                Targeted muscle groups will be listed here after logging workouts.
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};
