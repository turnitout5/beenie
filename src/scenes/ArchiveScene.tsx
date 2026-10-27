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
                  <span className="font-mono" style={{ fontSize: '0.85rem', color: memory.isClassified ? 'var(--color-lantern-gold)' : 'var(--color-dream-lilac)', letterSpacing: '0.08em' }}>
                    {memory.isClassified ? '[CLASSIFIED]' : '[MEMORY]'}
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
                {memory.isClassified ? 'DECRYPT MEMORY' : 'RECONSTRUCT MEMORY'}
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

            {/* Interactive Memory Artifacts */}
            {activeMemory.id === 'mem_songs' && (
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', marginBottom: '10px', textTransform: 'uppercase' }}>
                  OUR THREE SACRED ANTHEMS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-void-navy)', borderLeft: '3px solid var(--color-lantern-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--color-lantern-gold)' }}>1. Bol Na Halke Halke</strong>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-dusty-lavender)' }}>For the quiet, tender evenings where no words are needed.</span>
                    </div>
                    <button 
                      onClick={() => soundEngine.playBolNaHalkeHalke()}
                      className="pixel-btn pixel-btn-ghost font-mono"
                      style={{ fontSize: '0.7rem', padding: '4px 8px', whiteSpace: 'nowrap' }}
                    >
                      PLAY MELODY
                    </button>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-void-navy)', borderLeft: '3px solid var(--color-rose-glow)' }}>
                    <strong style={{ color: 'var(--color-rose-glow)' }}>2. Mohabbat Jisko Bakhsh De Zindagi</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-dusty-lavender)' }}>For the kind of love that doesn’t bend and never ends.</span>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-void-navy)', borderLeft: '3px solid var(--color-warm-peach)' }}>
                    <strong style={{ color: 'var(--color-warm-peach)' }}>3. Lo Maan Liya Humne Hai Nahi Tumko</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-dusty-lavender)' }}>For the sweet ache of missing each other when miles feel too long.</span>
                  </div>
                </div>
              </div>
            )}

            {activeMemory.id === 'mem_white_pasta' && (
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '1px solid var(--color-twilight-blue)', padding: '16px', marginBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-warm-peach)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  THE 2 AM FEAST MENU
                </div>
                <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.7' }}>
                  Steaming hot white pasta cooked just how you like it, mounds of Kinder Joys cracked open, jars of Nutella, and big midnight bowls of Koko Krunch. Eating good food with you and listening to you talk beats any five-star restaurant in the world.
                </p>
              </div>
            )}

            {activeMemory.id === 'mem_email_origin' && (
              <div style={{ backgroundColor: 'var(--color-midnight-indigo)', border: '2px solid var(--color-lantern-gold)', padding: '14px', marginBottom: '16px', textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '0.88rem', color: 'var(--color-lantern-gold)', marginBottom: '4px' }}>
                  ★ ORIGIN RECORD // binishieeees@gmail.com ★
                </div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--color-warm-peach)' }}>
                  Where our magic first sparked. I would choose you every single time.
                </div>
              </div>
            )}

            {/* Note Content */}
            <div
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                border: '2px solid var(--color-twilight-blue)',
                padding: '24px',
                marginBottom: '20px',
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                WHY THIS MOMENT MATTERS TO ME:
              </div>
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
              PRESERVE IN HEART
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
