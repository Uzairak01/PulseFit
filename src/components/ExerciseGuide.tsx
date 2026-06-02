import React from 'react';
import { getExerciseById } from '../data/exercises';
import { ChevronLeft, AlertTriangle, HelpCircle, Dumbbell } from 'lucide-react';

interface ExerciseGuideProps {
  exerciseId: string;
  onBack: () => void;
  onLogExercise: (id: string) => void;
}

export const ExerciseGuide: React.FC<ExerciseGuideProps> = ({ exerciseId, onBack, onLogExercise }) => {
  const ex = getExerciseById(exerciseId);

  if (!ex) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Exercise not found.</p>
        <button className="button-secondary" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  // Generate the custom interactive form guide SVG based on exercise ID
  const renderInteractiveDiagram = () => {
    switch (ex.id) {
      case 'squat':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '220px', display: 'block', margin: '0 auto' }}>
            <style>{`
              .joint { fill: #10b981; filter: drop-shadow(0 0 4px #10b981); }
              .link { stroke: rgba(255,255,255,0.4); stroke-width: 3; stroke-linecap: round; }
              .ground { stroke: rgba(255,255,255,0.1); stroke-width: 4; }
              .force-line { stroke: #06b6d4; stroke-width: 2; stroke-dasharray: 4 4; }
              .angle-cue { fill: none; stroke: #f59e0b; stroke-width: 2; }
            `}</style>
            {/* Ground */}
            <line x1="20" y1="180" x2="180" y2="180" className="ground" />
            {/* Force Line (Heels) */}
            <line x1="85" y1="180" x2="85" y2="80" className="force-line" />
            <path d="M 85,120 A 25,25 0 0,1 115,145" className="angle-cue" />
            {/* Back (should be flat) */}
            <line x1="120" y1="70" x2="85" y2="115" className="link" style={{ stroke: '#10b981', strokeWidth: 4 }} />
            {/* Thigh (parallel) */}
            <line x1="85" y1="115" x2="130" y2="115" className="link" style={{ stroke: '#10b981', strokeWidth: 4 }} />
            {/* Shin (knees behind/over toes) */}
            <line x1="130" y1="115" x2="120" y2="180" className="link" />
            {/* Torso/Head */}
            <circle cx="125" cy="55" r="10" fill="#ffffff" />
            {/* Arms (reaching forward for balance) */}
            <line x1="120" y1="75" x2="160" y2="75" className="link" />
            {/* Key Joints markers */}
            <circle cx="85" cy="115" r="5" className="joint" /> {/* Hip */}
            <circle cx="130" cy="115" r="5" className="joint" /> {/* Knee */}
            <circle cx="120" cy="180" r="5" className="joint" /> {/* Ankle */}
            {/* Guide markers */}
            <text x="145" y="110" fill="#10b981" fontSize="9" fontWeight="bold">Parallel</text>
            <text x="50" y="65" fill="#f59e0b" fontSize="9" fontWeight="bold">Chest Up</text>
            <text x="50" y="160" fill="#06b6d4" fontSize="9" fontWeight="bold">Drive Heels</text>
          </svg>
        );
      case 'pushup':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '220px', display: 'block', margin: '0 auto' }}>
            <style>{`
              .joint { fill: #06b6d4; filter: drop-shadow(0 0 4px #06b6d4); }
              .link { stroke: rgba(255,255,255,0.4); stroke-width: 3; stroke-linecap: round; }
              .body-line { stroke: #10b981; stroke-width: 4; stroke-linecap: round; filter: drop-shadow(0 0 3px rgba(16,185,129,0.3)); }
              .ground { stroke: rgba(255,255,255,0.1); stroke-width: 4; }
            `}</style>
            {/* Ground */}
            <line x1="20" y1="160" x2="180" y2="160" className="ground" />
            {/* Feet contact */}
            <line x1="30" y1="150" x2="175" y2="90" className="body-line" />
            {/* Arms support (Lowered position) */}
            <line x1="140" y1="160" x2="150" y2="120" className="link" />
            <line x1="150" y1="120" x2="158" y2="105" className="link" />
            {/* Head */}
            <circle cx="185" cy="85" r="10" fill="#ffffff" />
            {/* Joint Markers */}
            <circle cx="30" cy="150" r="5" className="joint" /> {/* Ankle */}
            <circle cx="102" cy="120" r="5" className="joint" /> {/* Hip */}
            <circle cx="158" cy="100" r="5" className="joint" /> {/* Shoulder */}
            <circle cx="150" cy="120" r="5" className="joint" style={{ fill: '#ec4899' }} /> {/* Elbow angle */}
            {/* Labels */}
            <text x="70" y="80" fill="#10b981" fontSize="9" fontWeight="bold">Straight Spine</text>
            <text x="145" y="140" fill="#ec4899" fontSize="9" fontWeight="bold">Elbows 45°</text>
          </svg>
        );
      case 'deadlift':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '220px', display: 'block', margin: '0 auto' }}>
            <style>{`
              .joint { fill: #f59e0b; filter: drop-shadow(0 0 4px #f59e0b); }
              .link { stroke: rgba(255,255,255,0.4); stroke-width: 3; stroke-linecap: round; }
              .barbell { stroke: #06b6d4; stroke-width: 5; }
              .plates { fill: #06b6d4; opacity: 0.8; }
              .flat-back { stroke: #10b981; stroke-width: 4; stroke-linecap: round; }
              .ground { stroke: rgba(255,255,255,0.1); stroke-width: 4; }
            `}</style>
            {/* Ground */}
            <line x1="20" y1="180" x2="180" y2="180" className="ground" />
            {/* Barbell weights */}
            <rect x="135" y="120" width="8" height="50" rx="3" className="plates" />
            <line x1="120" y1="145" x2="155" y2="145" className="barbell" />
            {/* Leg (Shin vertical) */}
            <line x1="120" y1="180" x2="122" y2="140" className="link" />
            {/* Thigh (Hinge) */}
            <line x1="122" y1="140" x2="80" y2="120" className="link" />
            {/* Back (Perfect Flat) */}
            <line x1="80" y1="120" x2="120" y2="80" className="flat-back" />
            {/* Arm (Straight down to bar) */}
            <line x1="120" y1="80" x2="120" y2="145" className="link" />
            {/* Head */}
            <circle cx="130" cy="70" r="10" fill="#ffffff" />
            {/* Joint Markers */}
            <circle cx="120" cy="180" r="5" className="joint" /> {/* Ankle */}
            <circle cx="122" cy="140" r="5" className="joint" /> {/* Knee */}
            <circle cx="80" cy="120" r="5" className="joint" /> {/* Hip */}
            <circle cx="120" cy="80" r="5" className="joint" /> {/* Shoulder */}
            {/* Text labels */}
            <text x="45" y="95" fill="#10b981" fontSize="9" fontWeight="bold">Flat Spine</text>
            <text x="140" y="110" fill="#06b6d4" fontSize="9" fontWeight="bold">Bar close</text>
          </svg>
        );
      case 'plank':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '220px', display: 'block', margin: '0 auto' }}>
            <style>{`
              .joint { fill: #a855f7; filter: drop-shadow(0 0 4px #a855f7); }
              .body-line { stroke: #10b981; stroke-width: 4; stroke-linecap: round; }
              .arm { stroke: rgba(255,255,255,0.5); stroke-width: 3; stroke-linecap: round; }
              .ground { stroke: rgba(255,255,255,0.1); stroke-width: 4; }
            `}</style>
            {/* Ground */}
            <line x1="20" y1="160" x2="180" y2="160" className="ground" />
            {/* Arm (Forearm support) */}
            <line x1="140" y1="160" x2="140" y2="120" className="arm" /> {/* Upper arm */}
            <line x1="140" y1="160" x2="165" y2="160" className="arm" /> {/* Forearm */}
            {/* Straight Body Line */}
            <line x1="30" y1="135" x2="140" y2="120" className="body-line" />
            {/* Head */}
            <circle cx="155" cy="112" r="10" fill="#ffffff" />
            {/* Joint Markers */}
            <circle cx="30" cy="135" r="5" className="joint" /> {/* Toes/Ankle */}
            <circle cx="85" cy="127" r="5" className="joint" /> {/* Hip */}
            <circle cx="140" cy="120" r="5" className="joint" /> {/* Shoulder */}
            {/* Text Cues */}
            <text x="65" y="100" fill="#10b981" fontSize="9" fontWeight="bold">Squeeze Glutes & Abs</text>
            <text x="110" y="145" fill="#a855f7" fontSize="9" fontWeight="bold">Elbows under Shoulder</text>
          </svg>
        );
      case 'overhead-press':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '220px', display: 'block', margin: '0 auto' }}>
            <style>{`
              .joint { fill: #ec4899; filter: drop-shadow(0 0 4px #ec4899); }
              .link { stroke: rgba(255,255,255,0.4); stroke-width: 3; stroke-linecap: round; }
              .barbell { stroke: #ec4899; stroke-width: 4; }
              .plates { fill: #ec4899; opacity: 0.8; }
              .ground { stroke: rgba(255,255,255,0.1); stroke-width: 4; }
              .arrow { stroke: #06b6d4; stroke-width: 2; fill: none; stroke-dasharray: 2 2; }
            `}</style>
            {/* Ground */}
            <line x1="20" y1="180" x2="180" y2="180" className="ground" />
            {/* Skeleton (Straight lockout at the top) */}
            {/* Legs */}
            <line x1="100" y1="180" x2="100" y2="115" className="link" style={{ stroke: '#10b981' }} />
            {/* Spine */}
            <line x1="100" y1="115" x2="100" y2="70" className="link" style={{ stroke: '#10b981' }} />
            {/* Arms overhead */}
            <line x1="100" y1="70" x2="85" y2="40" className="link" />
            <line x1="85" y1="40" x2="85" y2="22" className="link" />
            <line x1="100" y1="70" x2="115" y2="40" className="link" />
            <line x1="115" y1="40" x2="115" y2="22" className="link" />
            {/* Head pushed through */}
            <circle cx="100" cy="52" r="10" fill="#ffffff" />
            {/* Barbell overhead */}
            <line x1="70" y1="20" x2="130" y2="20" className="barbell" style={{ strokeWidth: 4 }} />
            <rect x="63" y="10" width="7" height="20" rx="2" className="plates" />
            <rect x="130" y="10" width="7" height="20" rx="2" className="plates" />
            {/* Joint Markers */}
            <circle cx="100" cy="115" r="5" className="joint" /> {/* Hips locked */}
            <circle cx="100" cy="70" r="5" className="joint" /> {/* Shoulders */}
            {/* Push Arrow */}
            <path d="M 125,70 L 125,30 M 125,30 L 121,35 M 125,30 L 129,35" className="arrow" style={{ strokeWidth: 2, strokeDasharray: 'none' }} />
            {/* Labels */}
            <text x="110" y="145" fill="#10b981" fontSize="9" fontWeight="bold">Locked Knees/Glutes</text>
            <text x="132" y="45" fill="#06b6d4" fontSize="9" fontWeight="bold">Straight Path</text>
          </svg>
        );
      case 'bicep-curl':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', maxHeight: '220px', display: 'block', margin: '0 auto' }}>
            <style>{`
              .joint { fill: #3b82f6; filter: drop-shadow(0 0 4px #3b82f6); }
              .link { stroke: rgba(255,255,255,0.4); stroke-width: 3; stroke-linecap: round; }
              .dumbbell { stroke: #3b82f6; stroke-width: 4; }
              .ground { stroke: rgba(255,255,255,0.1); stroke-width: 4; }
              .arc-arrow { fill: none; stroke: #ec4899; stroke-width: 2; stroke-dasharray: 3 3; }
            `}</style>
            {/* Ground */}
            <line x1="20" y1="180" x2="180" y2="180" className="ground" />
            {/* Spine & Legs */}
            <line x1="80" y1="180" x2="80" y2="70" className="link" />
            {/* Head */}
            <circle cx="80" cy="55" r="10" fill="#ffffff" />
            {/* Upper Arm (Pinned to side) */}
            <line x1="80" y1="70" x2="80" y2="105" className="link" style={{ stroke: '#10b981', strokeWidth: 4 }} />
            {/* Forearm (Curled position) */}
            <line x1="80" y1="105" x2="110" y2="85" className="link" />
            {/* Dumbbell */}
            <line x1="105" y1="75" x2="115" y2="95" className="dumbbell" />
            <circle cx="105" cy="75" r="6" fill="#3b82f6" />
            <circle cx="115" cy="95" r="6" fill="#3b82f6" />
            {/* Path Arc */}
            <path d="M 115,125 A 30,30 0 0,0 110,85" className="arc-arrow" />
            {/* Joint Markers */}
            <circle cx="80" cy="70" r="5" className="joint" /> {/* Shoulder */}
            <circle cx="80" cy="105" r="5" className="joint" style={{ fill: '#10b981' }} /> {/* Elbow */}
            {/* Labels */}
            <text x="25" y="105" fill="#10b981" fontSize="9" fontWeight="bold">Elbow Pinned</text>
            <text x="120" y="110" fill="#ec4899" fontSize="9" fontWeight="bold">Full Squeeze</text>
          </svg>
        );
      default:
        return (
          <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-glass)', borderRadius: '12px' }}>
            <HelpCircle size={32} style={{ color: 'var(--text-muted)' }} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>No interactive diagram available</p>
          </div>
        );
    }
  };

  return (
    <div className="guide-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Back button */}
      <div>
        <button 
          className="button-secondary" 
          onClick={onBack}
          style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}
        >
          <ChevronLeft size={16} />
          Back to Directory
        </button>
      </div>

      {/* Hero section */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: ex.primaryColor }} />
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className={`category-pill ${ex.category}`}>{ex.category}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
              Difficulty: {ex.difficulty}
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{ex.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Perfect form setup and training guide.</p>
        </div>
        <button className="button-primary" onClick={() => onLogExercise(ex.id)}>
          <Dumbbell size={18} />
          Log This Exercise
        </button>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Left column: SVG Interactive Diagram & Cues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Interactive Form Simulator Box */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Form Alignment Reference</h3>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--color-emerald)', padding: '2px 8px', borderRadius: '4px', height: 'fit-content' }}>Active check</span>
            </div>
            
            <div style={{ width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.02)' }}>
              {renderInteractiveDiagram()}
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
              Move cursor over neon markers for structural angle guidance.
            </p>
          </div>

          {/* Golden Rule Cue Bubbles */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Technique Cues</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {ex.cues.map((cue, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '0.85rem', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--border-glass)', 
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ color: ex.primaryColor }}>✦</span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Form Instructions & Warnings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Detailed Instructions */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Step-by-Step Technique</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ex.instructions.map((inst, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: `${ex.primaryColor}1a`, 
                    color: ex.primaryColor,
                    border: `1px solid ${ex.primaryColor}3d`,
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>{inst}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
              <AlertTriangle size={18} />
              Common Mistakes to Avoid
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ex.commonMistakes.map((mistake, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    alignItems: 'flex-start',
                    padding: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.03)',
                    border: '1px solid rgba(239, 68, 68, 0.08)',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1, marginTop: '2px' }}>✕</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{mistake}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
