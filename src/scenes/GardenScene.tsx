import React, { useState, useEffect } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { BIRTHDAY_LETTER } from '../data/personalization';
import { soundEngine } from '../audio/soundEngine';

export const GardenScene: React.FC = () => {
  const { recoverStar } = useExpedition();
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  useEffect(() => {
    soundEngine.startGardenMelody();
    return () => {
      soundEngine.stopGardenMelody();
    };
  }, []);

  const handleOpenLetter = () => {
    soundEngine.playStarChime();
    setIsLetterOpen(true);
    recoverStar(6, 'garden_complete');
    recoverStar(7); // Final Star 7: The Heart Restored
  };

  return (
    <div
      style={{
        maxWidth: '920px',
        margin: '0 auto',
        padding: '32px 20px 100px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Peaceful Garden Atmosphere Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '36px',
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-warm-peach)',
            letterSpacing: '0.15em',
            marginBottom: '8px',
          }}
        >
          ✦ SANCTUARY OF THE HEART // RESTORATION COMPLETE ✦
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.2rem, 3.2vw, 2rem)',
            color: 'var(--color-lantern-gold)',
            marginBottom: '10px',
            textShadow: '0 0 16px rgba(246, 215, 139, 0.4)',
          }}
        >
          THE SECRET HIDDEN GARDEN
        </h1>
        <p
          className="font-body"
          style={{
            fontSize: '1rem',
            color: 'var(--color-moon-cream)',
            maxWidth: '540px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontStyle: 'italic',
          }}
        >
          "The world has finally stopped rushing. You have explored, laughed, and discovered. Now you can simply sit here."
        </p>
      </div>

      {/* Handcrafted Pixel Garden Diorama */}
      <div
        className="pixel-panel pixel-panel-gold"
        style={{
          backgroundColor: 'rgba(27, 32, 66, 0.85)',
          padding: '40px 24px',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(16, 19, 41, 0.9), var(--pixel-border-gold)',
        }}
      >
        {/* Soft Moonlight Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(246, 215, 139, 0.12) 0%, rgba(16, 19, 41, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* The Bench with Both Characters Sitting Together */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            marginBottom: '32px',
          }}
        >
          {/* Constellation above them */}
          <div style={{ fontSize: '1.4rem', color: 'var(--color-lantern-gold)', marginBottom: '16px', animation: 'pulseGlow 3s infinite' }}>
            ✦ ✦ ✦
          </div>

          {/* Both Characters Hand-in-Hand on the Bench */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', position: 'relative' }}>
            {/* Beenish sitting */}
            <svg width="44" height="48" viewBox="0 0 22 24" shapeRendering="crispEdges" className="pixel-art">
              {/* Hair */}
              <rect x="5" y="1" width="12" height="6" fill="#101329" />
              <rect x="4" y="3" width="14" height="8" fill="#1B2042" />
              {/* Face */}
              <rect x="6" y="6" width="10" height="6" fill="#F3B79C" />
              <rect x="8" y="8" width="2" height="2" fill="#101329" />
              <rect x="12" y="8" width="2" height="2" fill="#101329" />
              <rect x="6" y="10" width="2" height="1" fill="#E98FAF" />
              <rect x="14" y="10" width="2" height="1" fill="#E98FAF" />
              {/* Cozy Jacket */}
              <rect x="6" y="12" width="10" height="7" fill="#9588BD" />
              <rect x="8" y="12" width="6" height="7" fill="#C3A9E8" />
              {/* Legs sitting */}
              <rect x="6" y="19" width="10" height="4" fill="#1B2042" />
            </svg>

            {/* Boyfriend sitting */}
            <svg width="44" height="48" viewBox="0 0 22 24" shapeRendering="crispEdges" className="pixel-art">
              {/* Hair */}
              <rect x="6" y="1" width="10" height="4" fill="#101329" />
              <rect x="5" y="2" width="12" height="5" fill="#1B2042" />
              {/* Face */}
              <rect x="6" y="6" width="10" height="6" fill="#F3B79C" />
              <rect x="8" y="8" width="2" height="2" fill="#101329" />
              <rect x="12" y="8" width="2" height="2" fill="#101329" />
              <rect x="6" y="10" width="2" height="1" fill="#E98FAF" />
              <rect x="14" y="10" width="2" height="1" fill="#E98FAF" />
              {/* Jacket */}
              <rect x="5" y="12" width="12" height="7" fill="#30385F" />
              <rect x="8" y="12" width="6" height="7" fill="#666FA0" />
              {/* Legs sitting */}
              <rect x="6" y="19" width="10" height="4" fill="#101329" />
            </svg>

            {/* Wooden Garden Bench */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '-16px',
                right: '-16px',
                height: '8px',
                backgroundColor: 'var(--color-twilight-blue)',
                boxShadow: '0 -2px 0 var(--color-warm-peach)',
              }}
            />
          </div>

          {/* Clean footer line */}
          <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)', marginTop: '14px', letterSpacing: '0.1em' }}>
            [ THE WILLOW TREE BENCH ]
          </div>
        </div>

        {/* The Keepsake Envelope on the Garden Table */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleOpenLetter}
            className="pixel-btn pixel-btn-primary font-display animate-glow"
            style={{
              padding: '16px 32px',
              fontSize: '1rem',
              boxShadow: 'var(--pixel-border-gold)',
            }}
          >
            <span>OPEN YOUR BIRTHDAY LETTER</span>
          </button>
        </div>
      </div>

      {/* The Birthday Love Letter Modal */}
      {isLetterOpen && (
        <div className="pixel-modal-backdrop" onClick={() => setIsLetterOpen(false)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-gold"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              backgroundColor: 'var(--color-void-navy)',
              padding: '36px 28px',
              border: '2px solid var(--color-lantern-gold)',
            }}
          >
            {/* Letter Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px', borderBottom: '1px dashed var(--color-twilight-blue)', paddingBottom: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                October 31 &bull; For Paaaari (Beenish)
              </div>
              <div className="font-display" style={{ color: 'var(--color-lantern-gold)', fontSize: '1.2rem', marginBottom: '4px' }}>
                {BIRTHDAY_LETTER.title}
              </div>
              <div className="font-mono" style={{ color: 'var(--color-warm-peach)', fontSize: '0.85rem' }}>
                {BIRTHDAY_LETTER.salutation}
              </div>
            </div>

            {/* Letter Body Paragraphs */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                lineHeight: '1.9',
                color: 'var(--color-moon-cream)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                marginBottom: '32px',
              }}
            >
              {BIRTHDAY_LETTER.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Letter Signoff */}
            <div
              style={{
                borderTop: '2px dashed var(--color-twilight-blue)',
                paddingTop: '20px',
                textAlign: 'right',
                marginBottom: '24px',
              }}
            >
              <div className="font-mono" style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.9rem', marginBottom: '6px' }}>
                {BIRTHDAY_LETTER.signoff}
              </div>
              <div
                className="font-display"
                style={{
                  color: 'var(--color-lantern-gold)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.05em',
                }}
              >
                Forever aapka Pagluu, Ahmad
              </div>
              <div
                className="font-mono"
                style={{
                  color: 'var(--color-rose-glow)',
                  fontSize: '0.95rem',
                  marginTop: '12px',
                  fontStyle: 'italic',
                }}
              >
                "{BIRTHDAY_LETTER.postscript}"
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsLetterOpen(false)}
              className="pixel-btn pixel-btn-peach font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              KEEP THIS LETTER FOREVER ♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
