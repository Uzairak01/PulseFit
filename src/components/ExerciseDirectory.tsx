import React, { useState } from 'react';
import { EXERCISES } from '../data/exercises';
import { Search, Award, Dumbbell } from 'lucide-react';

interface ExerciseDirectoryProps {
  onSelectExercise: (id: string) => void;
}

export const ExerciseDirectory: React.FC<ExerciseDirectoryProps> = ({ onSelectExercise }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Chest', value: 'chest' },
    { label: 'Back', value: 'back' },
    { label: 'Legs', value: 'legs' },
    { label: 'Shoulders', value: 'shoulders' },
    { label: 'Arms', value: 'arms' },
    { label: 'Core', value: 'core' }
  ];

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="directory-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header and Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Exercise Form Guides</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Master your technique, prevent injuries, and lift effectively.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '260px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-secondary)' 
              }} 
            />
            <input 
              type="text" 
              placeholder="Search exercise or target muscle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          
          {/* Categories Tab selectors */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  background: selectedCategory === cat.value ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedCategory === cat.value ? '1px solid var(--color-accent)' : '1px solid var(--border-glass)',
                  color: selectedCategory === cat.value ? '#ffffff' : 'var(--text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredExercises.map((ex) => (
            <div 
              key={ex.id} 
              className="glass-panel glass-panel-interactive"
              onClick={() => onSelectExercise(ex.id)}
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Highlight card border accent */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '4px', 
                  height: '100%', 
                  background: ex.primaryColor 
                }} 
              />
              
              {/* Card Title & Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className={`category-pill ${ex.category}`}>
                    <Dumbbell size={12} />
                    {ex.category}
                  </span>
                  
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '0.75rem', 
                    color: ex.difficulty === 'beginner' ? 'var(--color-emerald)' : 'var(--color-amber)', 
                    fontWeight: 600,
                    textTransform: 'capitalize' 
                  }}>
                    <Award size={12} />
                    {ex.difficulty}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.25rem' }}>{ex.name}</h3>
              </div>
              
              {/* Target Muscles */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                {ex.targetMuscles.map((muscle) => (
                  <span key={muscle} className="muscle-pill">{muscle}</span>
                ))}
              </div>
              
              {/* Quick Cues preview */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{ex.cues[0]}"
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          borderStyle: 'dashed'
        }}>
          <p style={{ fontSize: '1.1rem' }}>No exercises found matching your filters.</p>
          <button 
            className="button-secondary"
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            style={{ fontSize: '0.9rem' }}
          >
            Clear Filters
          </button>
        </div>
      )}
      
    </div>
  );
};
