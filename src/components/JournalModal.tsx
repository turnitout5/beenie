import React from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { LocationId } from '../types/expedition';

interface JournalModalProps {
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ onClose }) => {
  const { state, navigateTo } = useExpedition();
  const { journal, starsRecovered, unlockedLocations } = state;

  const handleQuickTravel = (loc: LocationId) => {
    navigateTo(loc);
    onClose();
  };

  return (
    <div className="pixel-modal-backdrop" onClick={onClose}>
      <div
        className="pixel-modal-content pixel-panel pixel-panel-gold"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Terminal Header */}
        <div className="pixel-panel-header">
          <h2 className="font-display" style={{ fontSize: '1rem', color: 'var(--color-lantern-gold)' }}>
            BEENISH'S EXPEDITION JOURNAL
          </h2>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
          >
            [X]
          </button>
        </div>

        {/* Diagnostic Metadata */}
        <div
          className="font-mono"
          style={{
            backgroundColor: 'var(--color-void-navy)',
            padding: '12px 16px',
            marginBottom: '20px',
            border: '2px solid var(--color-twilight-blue)',
            fontSize: '0.85rem',
            lineHeight: '1.8',
          }}
        >
          <div><span style={{ color: 'var(--color-dusty-lavender)' }}>EXPLORER:</span> <strong style={{ color: 'var(--color-warm-peach)' }}>Beenish Tasaffar</strong></div>
          <div><span style={{ color: 'var(--color-dusty-lavender)' }}>EXPEDITION OBJECTIVE:</span> <span style={{ color: 'var(--color-moon-cream)' }}>Restore the Vanished Stars</span></div>
          <div><span style={{ color: 'var(--color-dusty-lavender)' }}>RECOVERED STARS:</span> <strong style={{ color: 'var(--color-lantern-gold)' }}>0{starsRecovered} / 07</strong> ({Math.round((starsRecovered / 7) * 100)}% Restored)</div>
          <div><span style={{ color: 'var(--color-dusty-lavender)' }}>WORLD INTEGRITY:</span> <span style={{ color: starsRecovered >= 6 ? 'var(--color-warm-peach)' : 'var(--color-dream-lilac)' }}>{starsRecovered >= 6 ? 'Harmonious & Radiant' : 'Gradually Awakening'}</span></div>
        </div>

        {/* Milestone Checklist */}
        <h3 className="font-display" style={{ fontSize: '0.85rem', color: 'var(--color-dream-lilac)', marginBottom: '12px' }}>
          EXPEDITION MILESTONES:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {journal.map((entry) => {
            const isUnlocked = unlockedLocations.includes(entry.location);
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: entry.completed ? 'rgba(246, 215, 139, 0.08)' : 'rgba(48, 56, 95, 0.3)',
                  border: `2px solid ${entry.completed ? 'var(--color-lantern-gold)' : 'var(--color-twilight-blue)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '1.1rem',
                      color: entry.completed ? 'var(--color-lantern-gold)' : 'var(--color-muted-periwinkle)',
                      fontWeight: 700,
                    }}
                  >
                    {entry.completed ? '[✓]' : '[ ]'}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        color: entry.completed ? 'var(--color-moon-cream)' : 'var(--color-muted-periwinkle)',
                        textDecoration: entry.completed ? 'line-through' : 'none',
                      }}
                    >
                      {entry.title}
                    </div>
                  </div>
                </div>

                {/* Quick Travel Button */}
                {isUnlocked && (
                  <button
                    onClick={() => handleQuickTravel(entry.location)}
                    className="pixel-btn pixel-btn-ghost font-mono"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '32px' }}
                  >
                    VISIT →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-primary font-display"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            RESUME EXPEDITION
          </button>
        </div>
      </div>
    </div>
  );
};
