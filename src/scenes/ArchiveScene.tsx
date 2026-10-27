import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { ARCHIVE_MEMORIES } from '../data/personalization';
import { ArchiveMemory } from '../types/expedition';
import { soundEngine } from '../audio/soundEngine';

export const ArchiveScene: React.FC = () => {
  const { state, readMemory, recoverStar } = useExpedition();
  const { readMemories, recoveredStarIds } = state;

  const [activeMemory, setActiveMemory] = useState<ArchiveMemory | null>(null);
  const isStarRecovered = recoveredStarIds.includes(4);

  const handleOpenMemory = (memory: ArchiveMemory) => {
    soundEngine.playPaperRustle();
    setActiveMemory(memory);
    readMemory(memory.id);

    // If all memories read, award Star #4
    if (!isStarRecovered && readMemories.length >= 2) {
      recoverStar(4, 'archive_complete');
    }
  };

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px 20px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Archive Header */}
      <div
        className="pixel-panel pixel-panel-lilac"
        style={{
          marginBottom: '32px',
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
          textAlign: 'center',
        }}
      >
        <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
          SACRED MEMORY VAULT // TIME INSCRIBED
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
            color: 'var(--color-dream-lilac)',
            margin: '6px 0',
          }}
        >
          THE ARCHIVE OF THINGS THAT HAPPENED
        </h1>
        <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)' }}>
          "Every moment kept because it was you."
        </p>

        <div style={{ marginTop: '12px' }}>
          <span className="pixel-badge pixel-badge-gold">
            {isStarRecovered ? '★ STAR #04 RECOVERED' : '☆ RECONSTRUCTION PENDING'}
          </span>
        </div>
      </div>

      {/* Floating Memory Orbs Grid */}
      <h2
        className="font-display"
        style={{
          fontSize: '0.95rem',
          color: 'var(--color-warm-peach)',
          marginBottom: '16px',
        }}
      >
        FLOATING MEMORY ARTIFACTS:
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        {ARCHIVE_MEMORIES.map((memory) => {
          const isRead = readMemories.includes(memory.id);
          return (
            <div
              key={memory.id}
              className={`pixel-panel ${memory.isClassified ? 'pixel-panel-gold' : 'pixel-panel-lilac'}`}
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--anim-quick)',
              }}
              onClick={() => handleOpenMemory(memory)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`pixel-badge ${memory.isClassified ? 'pixel-badge-gold' : 'pixel-badge-peach'}`} style={{ fontSize: '0.7rem' }}>
                    {memory.isClassified ? 'CLASSIFIED ARTIFACT' : 'MEMORY CRYSTAL'}
                  </span>
                  {isRead && (
                    <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                      [RESTORED ✓]
                    </span>
                  )}
                </div>

                {/* Floating Crystal Icon */}
                <div
                  style={{
                    backgroundColor: 'var(--color-void-navy)',
                    border: '1px solid var(--color-twilight-blue)',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    fontSize: '2.5rem',
                  }}
                >
                  <span className="animate-float" style={{ display: 'inline-block' }}>
                    {memory.isClassified ? '🔒' : '💎'}
                  </span>
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: '0.95rem',
                    color: memory.isClassified ? 'var(--color-lantern-gold)' : 'var(--color-moon-cream)',
                    marginBottom: '6px',
                  }}
                >
                  {memory.title}
                </h3>

                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)', marginBottom: '10px' }}>
                  MOMENT: {memory.dateOrMoment}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                  {memory.preview}
                </p>
              </div>

              <button
                className={`pixel-btn ${memory.isClassified ? 'pixel-btn-primary' : 'pixel-btn-peach'} font-display`}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  marginTop: '16px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMemory(memory);
                }}
              >
                {memory.isClassified ? 'DECRYPT MEMORY 🔑' : 'RECONSTRUCT MEMORY 📖'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Memory Details Modal */}
      {activeMemory && (
        <div className="pixel-modal-backdrop" onClick={() => setActiveMemory(null)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-gold"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}
          >
            <div className="pixel-panel-header">
              <div>
                <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                  ARCHIVE FILE // {activeMemory.dateOrMoment}
                </span>
                <h3 className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '1.05rem', marginTop: '4px' }}>
                  {activeMemory.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveMemory(null)}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
              >
                [X]
              </button>
            </div>

            {/* Note Content */}
            <div
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                border: '2px solid var(--color-twilight-blue)',
                padding: '24px',
                marginBottom: '20px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  color: 'var(--color-moon-cream)',
                  fontStyle: 'italic',
                }}
              >
                "{activeMemory.fullNote}"
              </p>
            </div>

            <button
              onClick={() => setActiveMemory(null)}
              className="pixel-btn pixel-btn-primary font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              PRESERVE IN HEART ♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
