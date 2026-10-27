import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { JournalModal } from './JournalModal';

export const HeaderNav: React.FC = () => {
  const { state, navigateTo, toggleMute } = useExpedition();
  const { currentLocation, starsRecovered, isMuted } = state;
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  if (currentLocation === 'boot') {
    return null;
  }

  const getLocationLabel = () => {
    switch (currentLocation) {
      case 'hub': return 'Valley of the Stars';
      case 'bureau': return 'Bureau of Unreasonable Boyfriends';
      case 'museum': return 'Museum of Beenish';
      case 'court': return 'Court of Absolutely No Flaws';
      case 'archive': return 'Archive of Things That Happened';
      case 'observatory': return 'Observatory of Future Stars';
      case 'garden': return 'The Secret Hidden Garden';
      default: return 'The Valley';
    }
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 500,
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
          borderBottom: '3px solid var(--color-twilight-blue)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(16, 19, 41, 0.8)',
        }}
      >
        {/* Brand / Expedition Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigateTo('hub')}
            className="pixel-btn pixel-btn-ghost font-display"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              color: 'var(--color-lantern-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Return to Central Expedition Hub"
          >
            <span>✦</span>
            <span>BEENIE EXPEDITION</span>
          </button>

          {/* Current Location Badge */}
          <div className="pixel-badge pixel-badge-peach">
            <span>LOC:</span>
            <span style={{ fontWeight: 600 }}>{getLocationLabel()}</span>
          </div>
        </div>

        {/* Status Indicators & Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Recovered Stars Badge */}
          <div
            className="pixel-badge pixel-badge-gold font-mono"
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              boxShadow: 'var(--pixel-border-gold)',
            }}
            onClick={() => setIsJournalOpen(true)}
            title="Click to view Expedition Journal"
          >
            <span style={{ animation: 'starTwinkle 2s infinite' }}>⭐</span>
            <span>STARS: {starsRecovered} / 7</span>
          </div>

          {/* Expedition Journal Button */}
          <button
            onClick={() => setIsJournalOpen(true)}
            className="pixel-btn pixel-btn-primary font-display"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            title="Open Expedition Journal"
          >
            <span>📖</span>
            <span style={{ display: 'inline' }}>JOURNAL</span>
          </button>

          {/* Return to Valley button if inside a room */}
          {currentLocation !== 'hub' && (
            <button
              onClick={() => navigateTo('hub')}
              className="pixel-btn font-display"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              title="Return to Valley of the Stars"
            >
              <span>🧭</span>
              <span>VALLEY</span>
            </button>
          )}

          {/* Audio Mute/Unmute Toggle */}
          <button
            onClick={toggleMute}
            className="pixel-btn pixel-btn-ghost"
            style={{
              padding: '6px 10px',
              fontSize: '0.85rem',
              minWidth: '40px',
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* Slide-out / Modal Journal */}
      {isJournalOpen && <JournalModal onClose={() => setIsJournalOpen(false)} />}
    </>
  );
};
