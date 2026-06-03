import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { ExerciseDirectory } from './components/ExerciseDirectory';
import { ExerciseGuide } from './components/ExerciseGuide';
import { WorkoutLogger } from './components/WorkoutLogger';
import { HistoryView } from './components/HistoryView';
import { storageService } from './utils/storage';
import type { UserStreak } from './types';
import { LayoutDashboard, Dumbbell, Calendar, PlusSquare, Flame, Activity, LogOut, User } from 'lucide-react';

// ── Inner app (rendered only when authenticated) ─────────────────────────────
function AppShell() {
  const { user, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [loggerPrefillId, setLoggerPrefillId] = useState<string | undefined>(undefined);
  const [streak, setStreak] = useState<UserStreak>({ currentStreak: 0, bestStreak: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const fetchStreak = async () => {
    try {
      const userStreak = await storageService.getUserStreak();
      setStreak(userStreak);
    } catch (e) {
      // user might not have data yet
    }
  };

  useEffect(() => {
    fetchStreak();
  }, [refreshTrigger]);

  useEffect(() => {
    if (user) {
      setShowAuthModal(false);
    }
  }, [user]);

  const handleNavigate = (tab: string) => {
    if (!user && (tab === 'log' || tab === 'history')) {
      setShowAuthModal(true);
      return;
    }
    setCurrentTab(tab);
    setSelectedExerciseId(null);
    setLoggerPrefillId(undefined);
  };

  const handleSelectExercise = (id: string) => {
    setSelectedExerciseId(id);
  };

  const handleLogExercisePrefill = (id: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setLoggerPrefillId(id);
    setSelectedExerciseId(null);
    setCurrentTab('log');
  };

  const handleSaveSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setCurrentTab('dashboard');
  };

  const renderContent = () => {
    if (selectedExerciseId) {
      return (
        <ExerciseGuide
          exerciseId={selectedExerciseId}
          onBack={() => setSelectedExerciseId(null)}
          onLogExercise={handleLogExercisePrefill}
        />
      );
    }
    switch (currentTab) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} refreshTrigger={refreshTrigger} />;
      case 'exercises': return <ExerciseDirectory onSelectExercise={handleSelectExercise} />;
      case 'log': return <WorkoutLogger preselectedExerciseId={loggerPrefillId} onSaveSuccess={handleSaveSuccess} />;
      case 'history': return <HistoryView refreshTrigger={refreshTrigger} />;
      default: return <Dashboard onNavigate={handleNavigate} refreshTrigger={refreshTrigger} />;
    }
  };

  // User display name or email initials for avatar
  const displayName = user?.displayName || user?.email || 'Guest Athlete';
  const initials = user ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <div className="app-container">

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div>
          {/* Brand */}
          <div className="brand-section">
            <div className="brand-logo">
              <Activity size={20} color="#ffffff" />
            </div>
            <span className="brand-name">PulseFit</span>
          </div>

          {/* Nav Links */}
          <nav>
            <ul className="nav-links">
              <li className="nav-item">
                <button onClick={() => handleNavigate('dashboard')} className={`nav-link ${currentTab === 'dashboard' && !selectedExerciseId ? 'active' : ''}`}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => handleNavigate('exercises')} className={`nav-link ${currentTab === 'exercises' || selectedExerciseId ? 'active' : ''}`}>
                  <Dumbbell size={18} />
                  Exercises
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => handleNavigate('log')} className={`nav-link ${currentTab === 'log' ? 'active' : ''}`}>
                  <PlusSquare size={18} />
                  Log Workout
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => handleNavigate('history')} className={`nav-link ${currentTab === 'history' ? 'active' : ''}`}>
                  <Calendar size={18} />
                  History & Progress
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom section: streak + user profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Streak widget (only if logged in) */}
          {user && (
            <div className="streak-counter-widget">
              <Flame className="streak-icon" size={20} />
              <div className="streak-text">
                <h4>{streak.currentStreak} Day Streak</h4>
                <p>Keep the fire burning!</p>
              </div>
            </div>
          )}

          {/* User + logout / Login Button */}
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px'
            }}>
              {/* Avatar */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0
                }}>
                  {initials || <User size={14} />}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || 'Athlete'}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
              <button
                id="sidebar-logout-btn"
                onClick={logout}
                title="Sign out"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = '#f87171')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              id="sidebar-login-btn"
              onClick={() => setShowAuthModal(true)}
              className="button-primary animate-pulse-glow"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <User size={16} />
              Sign In / Join
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        <button onClick={() => handleNavigate('dashboard')} className={`mobile-nav-item ${currentTab === 'dashboard' && !selectedExerciseId ? 'active' : ''}`}>
          <LayoutDashboard /><span>Dash</span>
        </button>
        <button onClick={() => handleNavigate('exercises')} className={`mobile-nav-item ${currentTab === 'exercises' || selectedExerciseId ? 'active' : ''}`}>
          <Dumbbell /><span>Guides</span>
        </button>
        <button onClick={() => handleNavigate('log')} className={`mobile-nav-item ${currentTab === 'log' ? 'active' : ''}`}>
          <PlusSquare /><span>Log</span>
        </button>
        <button onClick={() => handleNavigate('history')} className={`mobile-nav-item ${currentTab === 'history' ? 'active' : ''}`}>
          <Calendar /><span>History</span>
        </button>
        {!user ? (
          <button onClick={() => setShowAuthModal(true)} className="mobile-nav-item" style={{ color: 'var(--color-accent)' }}>
            <User /><span>Sign In</span>
          </button>
        ) : (
          <button onClick={logout} className="mobile-nav-item">
            <LogOut /><span>Logout</span>
          </button>
        )}
      </nav>

      {/* Main content */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Auth Modal Popup Overlay */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 8, 22, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
          animation: 'fade-in 0.25s ease-out'
        }}>
          <AuthPage onClose={() => setShowAuthModal(false)} />
        </div>
      )}
    </div>
  );
}

// ── Root (renders shells directly, authentication is lazy/optional) ───────────
function AuthGate() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem'
      }}>
        {/* Spinner */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid var(--border-glass)',
          borderTopColor: 'var(--color-accent)',
          animation: 'spin-slow 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connecting…</p>
      </div>
    );
  }

  return <AppShell />;
}

// ── App root with AuthProvider wrapper ────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
