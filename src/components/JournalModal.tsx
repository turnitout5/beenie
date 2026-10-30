import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { LocationId } from '../types/expedition';
import { soundEngine } from '../audio/soundEngine';
import { PixelEnvelopeIcon } from './PixelIcons';

interface JournalModalProps {
  onClose: () => void;
  onOpenMap?: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ onClose, onOpenMap }) => {
  const { state, navigateTo, resetExpedition } = useExpedition();
  const { journal, starsRecovered, unlockedLocations, inventory, drawer07Unlocked, namedConstellation } = state;
  const [confirmReset, setConfirmReset] = useState(false);

  const handleQuickTravel = (loc: LocationId) => {
    navigateTo(loc);
    onClose();
  };

  const handleReset = () => {
    soundEngine.playClick();
    resetExpedition();
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
            MERI PYARI PAAARI KA BIRTHDAY JOURNAL ♥
          </h2>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
          >
            [X]
          </button>
        </div>

        {/* Birthday Mission Overview */}
        <div
          className="font-mono"
          style={{
            backgroundColor: 'var(--color-void-navy)',
            padding: '12px 16px',
            marginBottom: '18px',
            border: '2px solid var(--color-twilight-blue)',
            fontSize: '0.84rem',
            lineHeight: '1.8',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-dusty-lavender)' }}>For:</span>{' '}
            <strong style={{ color: 'var(--color-warm-peach)' }}>Beenish Tasaffar (Paaaari / Beghum G)</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-dusty-lavender)' }}>Surprise:</span>{' '}
            <span style={{ color: 'var(--color-moon-cream)' }}>Pagluu Ke 7 Birthday Stars Dhoondein</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-dusty-lavender)' }}>Stars Found:</span>{' '}
            <strong style={{ color: 'var(--color-lantern-gold)' }}>0{starsRecovered} / 07</strong> ({Math.round((starsRecovered / 7) * 100)}% Restored)
          </div>
          <div>
            <span style={{ color: 'var(--color-dusty-lavender)' }}>Valley Atmosphere:</span>{' '}
            <span style={{ color: starsRecovered >= 6 ? 'var(--color-warm-peach)' : 'var(--color-dream-lilac)' }}>
              {starsRecovered >= 6 ? 'Full of Stars & Love ♥' : 'Shining for Paaaari ✨'}
            </span>
          </div>
          {namedConstellation && (
            <div>
              <span style={{ color: 'var(--color-dusty-lavender)' }}>NAMED CONSTELLATION:</span>{' '}
              <strong style={{ color: 'var(--color-lantern-gold)' }}>"{namedConstellation}"</strong>
            </div>
          )}
          {(inventory.includes('brass_key') || drawer07Unlocked) && (
            <div>
              <span style={{ color: 'var(--color-dusty-lavender)' }}>KEY ITEMS:</span>{' '}
              <span style={{ color: 'var(--color-warm-peach)' }}>
                {inventory.includes('brass_key') ? 'Antique Brass Key #07' : ''}
                {inventory.includes('brass_key') && drawer07Unlocked ? ' • ' : ''}
                {drawer07Unlocked ? 'Overgrown Botanical Map & Emergency Chocolates' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Places to Visit */}
        <h3 className="font-display" style={{ fontSize: '0.85rem', color: 'var(--color-dream-lilac)', marginBottom: '12px' }}>
          PLACES TO VISIT &amp; EXPLORE:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
                  gap: '10px',
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
                        fontSize: '0.88rem',
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
                    style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '32px', whiteSpace: 'nowrap' }}
                  >
                    VISIT →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions: Resume, View Opening Hug & Kiss Card, & Replay/Reset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {onOpenMap && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
                onOpenMap();
              }}
              className="pixel-btn pixel-btn-peach font-display"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>🗺️ VIEW EXPEDITION WORLD MAP &amp; GUIDE</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-primary font-display"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            RESUME EXPEDITION
          </button>

          <button
            onClick={() => handleQuickTravel('boot')}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              fontSize: '0.75rem',
              padding: '7px',
              minHeight: '34px',
              borderColor: 'var(--color-rose-glow)',
              color: 'var(--color-rose-glow)',
            }}
          >
            <PixelEnvelopeIcon size={14} color="var(--color-rose-glow)" />
            <span>[ VIEW MIDNIGHT HUG &amp; KISS CARD ]</span>
          </button>

          {!confirmReset ? (
            <button
              onClick={() => {
                soundEngine.playClick();
                setConfirmReset(true);
              }}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem', padding: '6px', minHeight: '32px' }}
            >
              [ REPLAY EXPEDITION FROM START ]
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleReset}
                className="pixel-btn pixel-btn-peach font-mono"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px', minHeight: '36px' }}
              >
                CONFIRM RESET TO BOOT SCREEN
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px', minHeight: '36px' }}
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
