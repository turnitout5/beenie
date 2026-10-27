import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { MUSEUM_EXHIBITS } from '../data/personalization';
import { MuseumExhibit } from '../types/expedition';
import { soundEngine } from '../audio/soundEngine';

export const MuseumScene: React.FC = () => {
  const { state, examineExhibit, recoverStar } = useExpedition();
  const { examinedExhibits, recoveredStarIds, inventory } = state;

  const [activeExhibit, setActiveExhibit] = useState<MuseumExhibit | null>(null);
  const [hasFoundKey, setHasFoundKey] = useState(inventory.includes('brass_key'));

  const isStarRecovered = recoveredStarIds.includes(2);

  const handleExamine = (exhibit: MuseumExhibit) => {
    soundEngine.playClick();
    setActiveExhibit(exhibit);
    examineExhibit(exhibit.id);

    // If all 4 exhibits examined, award Star #2
    if (!isStarRecovered && examinedExhibits.length >= 3) {
      recoverStar(2, 'museum_complete');
    }
  };

  const handleCollectKey = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasFoundKey) return;
    soundEngine.playStarChime();
    setHasFoundKey(true);
    state.inventory.push('brass_key');
    recoverStar(2, 'museum_complete');
  };

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '24px 20px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Museum Grand Entrance Header */}
      <div
        className="pixel-panel pixel-panel-lilac"
        style={{
          marginBottom: '32px',
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
          textAlign: 'center',
        }}
      >
        <div className="font-mono" style={{ color: 'var(--color-dream-lilac)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
          NATIONAL ARCHIVE OF EXCELLENCE // EXHIBITION COMPLEX
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: 'var(--color-dream-lilac)',
            margin: '8px 0',
          }}
        >
          THE MUSEUM OF BEENISH TASAFFAR
        </h1>
        <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)' }}>
          "One Subject. An Unreasonable Number of Dedicated Exhibits."
        </p>

        {/* Status Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          <span className="pixel-badge pixel-badge-gold">
            {isStarRecovered ? '★ STAR #02 RESTORED' : '☆ RESTORATION PENDING'}
          </span>
          <span className="pixel-badge font-mono" style={{ color: 'var(--color-moon-cream)' }}>
            EXHIBITS INSPECTED: {examinedExhibits.length} / {MUSEUM_EXHIBITS.length}
          </span>
        </div>
      </div>

      {/* Museum Wings Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        {MUSEUM_EXHIBITS.map((exhibit) => {
          const isExamined = examinedExhibits.includes(exhibit.id);
          return (
            <div
              key={exhibit.id}
              className={`pixel-panel ${exhibit.id === 'exhibit_phenomenon' ? 'pixel-panel-gold' : 'pixel-panel-lilac'}`}
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--anim-quick)',
              }}
              onClick={() => handleExamine(exhibit)}
            >
              <div>
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '0.7rem' }}>
                    {exhibit.badge}
                  </span>
                  {isExamined && (
                    <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem' }}>
                      [INSPECTED ✓]
                    </span>
                  )}
                </div>

                {/* Exhibit Title */}
                <h3
                  className="font-display"
                  style={{
                    fontSize: '1rem',
                    color: exhibit.id === 'exhibit_phenomenon' ? 'var(--color-lantern-gold)' : 'var(--color-moon-cream)',
                    marginBottom: '6px',
                  }}
                >
                  {exhibit.title}
                </h3>

                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-dusty-lavender)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {exhibit.subtitle}
                </div>

                {/* Exhibit Display Pedestal Art */}
                <div
                  style={{
                    backgroundColor: 'var(--color-void-navy)',
                    border: '2px solid var(--color-twilight-blue)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Spotlight Cone Effect */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(246, 215, 139, 0.15) 0%, rgba(246, 215, 139, 0) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Icon or Emblem */}
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                    {exhibit.id === 'exhibit_portraits' && '🖼️'}
                    {exhibit.id === 'exhibit_notices' && '🔍'}
                    {exhibit.id === 'exhibit_achievements' && '🏆'}
                    {exhibit.id === 'exhibit_phenomenon' && '✨'}
                  </div>

                  <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-moon-cream)' }}>
                    [CLICK TO READ CURATOR’S PLAQUE]
                  </p>
                </div>

                {/* Plaque Teaser */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-moon-cream)',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                  }}
                >
                  {exhibit.plaque.slice(0, 110)}...
                </p>
              </div>

              <button
                className="pixel-btn font-display"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExamine(exhibit);
                }}
              >
                VIEW EXHIBIT PLAQUE →
              </button>
            </div>
          );
        })}
      </div>

      {/* Secret Museum Easter Egg: The Velvet Rope & Brass Key */}
      <div
        className="pixel-panel"
        style={{
          backgroundColor: 'var(--color-void-navy)',
          border: '2px dashed var(--color-lantern-gold)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🗝️</span>
          <div>
            <div className="font-display" style={{ fontSize: '0.85rem', color: 'var(--color-lantern-gold)' }}>
              VIP CURATOR’S DISPLAY CASE
            </div>
            <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-moon-cream)' }}>
              {hasFoundKey
                ? 'You have recovered the Antique Brass Key! (Points toward the Secret Garden)'
                : 'A gleaming antique key is resting discreetly behind the museum velvet rope...'}
            </p>
          </div>
        </div>

        {!hasFoundKey && (
          <button
            onClick={handleCollectKey}
            className="pixel-btn pixel-btn-primary font-display"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            <span>TAKE BRASS KEY 🗝️</span>
          </button>
        )}
      </div>

      {/* Exhibit Details Modal */}
      {activeExhibit && (
        <div className="pixel-modal-backdrop" onClick={() => setActiveExhibit(null)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-gold"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', backgroundColor: 'var(--color-void-navy)' }}
          >
            <div className="pixel-panel-header">
              <div>
                <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                  {activeExhibit.badge} // MUSEUM ARTIFACT DOSSIER
                </span>
                <h3 className="font-display" style={{ color: 'var(--color-dream-lilac)', fontSize: '1.1rem', marginTop: '4px' }}>
                  {activeExhibit.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveExhibit(null)}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
              >
                [X]
              </button>
            </div>

            {/* Official Plaque Text */}
            <div
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                border: '2px solid var(--color-twilight-blue)',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-lantern-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}
              >
                CURATOR’S INSCRIPTION:
              </div>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-moon-cream)',
                  lineHeight: '1.8',
                  marginBottom: '16px',
                }}
              >
                {activeExhibit.plaque}
              </p>

              {/* Special Personal Quote */}
              {activeExhibit.quote && (
                <div
                  style={{
                    borderLeft: '3px solid var(--color-lantern-gold)',
                    paddingLeft: '14px',
                    marginTop: '12px',
                  }}
                >
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--color-warm-peach)',
                      fontStyle: 'italic',
                      fontWeight: 600,
                    }}
                  >
                    "{activeExhibit.quote}"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveExhibit(null)}
              className="pixel-btn pixel-btn-primary font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              RETURN TO GALLERY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
