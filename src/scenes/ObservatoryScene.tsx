import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { FUTURE_VIGNETTES } from '../data/personalization';
import { FutureVignette } from '../types/expedition';
import { soundEngine } from '../audio/soundEngine';

export const ObservatoryScene: React.FC = () => {
  const { state, setConstellationName, viewVignette } = useExpedition();
  const { viewedVignettes, namedConstellation, recoveredStarIds } = state;

  const [activeVignette, setActiveVignette] = useState<FutureVignette | null>(null);
  const [inputName, setInputName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStarRecovered = recoveredStarIds.includes(5);

  const handleOpenVignette = (vignette: FutureVignette) => {
    soundEngine.playClick();
    setActiveVignette(vignette);
    viewVignette(vignette.id);
  };

  const handleSubmitConstellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setIsSubmitting(true);
    setConstellationName(inputName.trim());
    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
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
      {/* Observatory Header */}
      <div
        className="pixel-panel pixel-panel-gold"
        style={{
          marginBottom: '32px',
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
          textAlign: 'center',
        }}
      >
        <div className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
          CELESTIAL OBSERVATION DECK // HORIZONS
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
            color: 'var(--color-lantern-gold)',
            margin: '6px 0',
          }}
        >
          THE OBSERVATORY OF THINGS WE HAVEN’T DONE YET
        </h1>
        <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)' }}>
          "These stars represent possibilities, not obligations. A future we shape together."
        </p>

        <div style={{ marginTop: '12px' }}>
          <span className="pixel-badge pixel-badge-gold">
            {isStarRecovered ? '★ CONSTELLATION INSCRIBED' : '☆ UNNAMED CONSTELLATION AWAITING BEENISH'}
          </span>
        </div>
      </div>

      {/* The Unnamed Constellation Interactive Feature */}
      <div
        className="pixel-panel pixel-panel-gold"
        style={{
          backgroundColor: 'var(--color-void-navy)',
          padding: '28px 20px',
          marginBottom: '36px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)', textTransform: 'uppercase' }}>
          CENTRAL CELESTIAL PHENOMENON
        </div>
        <h2 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-lantern-gold)', margin: '8px 0 16px' }}>
          A FUTURE WE HAVEN’T FIGURED OUT YET
        </h2>

        {/* Animated Constellation Canvas Illustration */}
        <div
          style={{
            height: '160px',
            backgroundColor: 'var(--color-midnight-indigo)',
            border: '2px solid var(--color-twilight-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            position: 'relative',
          }}
        >
          {/* Starlit Constellation Lines */}
          <svg width="240" height="120" viewBox="0 0 240 120" style={{ filter: 'drop-shadow(0 0 8px rgba(246, 215, 139, 0.6))' }}>
            <line x1="30" y1="90" x2="80" y2="30" stroke="#F6D78B" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="80" y1="30" x2="160" y2="40" stroke="#F6D78B" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="160" y1="40" x2="210" y2="85" stroke="#F6D78B" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="80" y1="30" x2="120" y2="80" stroke="#F6D78B" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="120" y1="80" x2="210" y2="85" stroke="#F6D78B" strokeWidth="2" strokeDasharray="3 3" />

            <circle cx="30" cy="90" r="4" fill="#F4EBDD" />
            <circle cx="80" cy="30" r="5" fill="#F6D78B" />
            <circle cx="160" cy="40" r="5" fill="#F6D78B" />
            <circle cx="210" cy="85" r="4" fill="#F4EBDD" />
            <circle cx="120" cy="80" r="6" fill="#F4EBDD" />
          </svg>

          {namedConstellation && (
            <div
              className="font-display"
              style={{
                position: 'absolute',
                bottom: '12px',
                color: 'var(--color-lantern-gold)',
                fontSize: '0.9rem',
                letterSpacing: '0.08em',
              }}
            >
              ✦ CONSTELLATION {namedConstellation.toUpperCase()} ✦
            </div>
          )}
        </div>

        {/* Naming Input Form */}
        {namedConstellation ? (
          <div style={{ animation: 'scaleUp 300ms ease' }}>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Inscribed into the night sky as: <strong style={{ color: 'var(--color-lantern-gold)' }}>"{namedConstellation}"</strong>
            </p>
            <span className="pixel-badge pixel-badge-gold">
              ★ STAR #05 RECOVERED AND CONNECTED TO THE UNIVERSE
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmitConstellation} style={{ maxWidth: '480px', margin: '0 auto' }}>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem', marginBottom: '14px' }}>
              Give this constellation your own name. What should our future be called?
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Name this constellation..."
                className="font-mono"
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-midnight-indigo)',
                  border: '2px solid var(--color-twilight-blue)',
                  color: 'var(--color-moon-cream)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!inputName.trim() || isSubmitting}
                className="pixel-btn pixel-btn-primary font-display"
                style={{ padding: '12px 20px', fontSize: '0.85rem' }}
              >
                <span>INSCRIBE IN SKY ✦</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4 Future Vignettes */}
      <h2
        className="font-display"
        style={{
          fontSize: '0.95rem',
          color: 'var(--color-dream-lilac)',
          marginBottom: '16px',
        }}
      >
        UNWRITTEN CHAPTERS TO DISCOVER:
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {FUTURE_VIGNETTES.map((vignette) => {
          const isViewed = viewedVignettes.includes(vignette.id);
          return (
            <div
              key={vignette.id}
              className="pixel-panel pixel-panel-lilac"
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onClick={() => handleOpenVignette(vignette)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="pixel-badge pixel-badge-peach" style={{ fontSize: '0.7rem' }}>
                    {vignette.category}
                  </span>
                  {isViewed && (
                    <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                      [VIEWED]
                    </span>
                  )}
                </div>

                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-lantern-gold)', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {vignette.sceneVisual === 'family_house' && '[ ISLAMABAD 5-MARLA ]'}
                  {vignette.sceneVisual === 'mafia_base' && '[ SECRET MAFIA BASE ]'}
                  {vignette.sceneVisual === 'bakery' && '[ ARTISAN BAKERY ]'}
                  {vignette.sceneVisual === 'mountain_castle' && '[ MERI QUEEN REALM ]'}
                  {vignette.sceneVisual === 'gaon_haveli' && '[ 12-MARLA HAVELI ]'}
                </div>

                <h3 className="font-display" style={{ fontSize: '0.95rem', color: 'var(--color-moon-cream)', marginBottom: '8px' }}>
                  {vignette.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                  {vignette.description}
                </p>
              </div>

              <button
                className="pixel-btn pixel-btn-peach font-display"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', marginTop: '16px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenVignette(vignette);
                }}
              >
                OPEN BLUEPRINT →
              </button>
            </div>
          );
        })}
      </div>

      {/* Vignette Modal */}
      {activeVignette && (
        <div className="pixel-modal-backdrop" onClick={() => setActiveVignette(null)}>
          <div
            className="pixel-modal-content pixel-panel pixel-panel-gold"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', backgroundColor: 'var(--color-void-navy)' }}
          >
            <div className="pixel-panel-header">
              <div>
                <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.75rem' }}>
                  DREAM HOUSE // {activeVignette.category.toUpperCase()}
                </span>
                <h3 className="font-display" style={{ color: 'var(--color-moon-cream)', fontSize: '1rem', marginTop: '4px' }}>
                  {activeVignette.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVignette(null)}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 8px', minWidth: '32px', minHeight: '32px' }}
              >
                [X]
              </button>
            </div>

            {/* Visual Mini-Scene Illustration */}
            <div
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                border: '2px solid var(--color-twilight-blue)',
                padding: '20px 16px',
                textAlign: 'center',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {activeVignette.sceneVisual === 'family_house' && (
                <div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-lantern-gold)', marginBottom: '6px' }}>
                    [ Islamabad Hills &bull; 5 Marla Humara Pyaara Ghar ]
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                    Samurai Jack blue bedroom, purple/pink room with bara sa teddy bear, living room may extra-wide comfy sofa meri choti si Beenie k liye, aur gaming room!
                  </div>
                </div>
              )}

              {activeVignette.sceneVisual === 'mafia_base' && (
                <div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-warm-peach)', marginBottom: '6px' }}>
                    [ Secret Mafia Mansion &bull; Batman Basement ]
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                    Tumbler parking bay, underground sniper range, concealed makeup weapons, glowing forge jahan swords banenge, aur command room!
                  </div>
                </div>
              )}

              {activeVignette.sceneVisual === 'bakery' && (
                <div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-lantern-gold)', marginBottom: '6px' }}>
                    [ Sweet Timber Bakery &bull; Meetha Heaven ]
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                    Garam garam crispy croissants, lunch may steaming white pasta, aur charon taraf Nutella aur chocolates k dher!
                  </div>
                </div>
              )}

              {activeVignette.sceneVisual === 'mountain_castle' && (
                <div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-dream-lilac)', marginBottom: '6px' }}>
                    [ Meri Queen Ka Mountain Castle &bull; Badalon K Beech ]
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                    Bary bary crystal jhumar, glowing fanoos, red carpets, Princess Beenie ka uncha tower, delicate royal heels, aur Queen Beenie ki custom sword!
                  </div>
                </div>
              )}

              {activeVignette.sceneVisual === 'gaon_haveli' && (
                <div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--color-forest-moss)', marginBottom: '6px' }}>
                    [ 12-Marla Gaon Haveli &bull; Desi Sukoon ]
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-moon-cream)', lineHeight: '1.6' }}>
                    Matti ka ghar, green khet, tubewell ka thanda tezz paani, shaam ko wooden charpai par floral chadar aur garam garam chai!
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                border: '2px solid var(--color-twilight-blue)',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-lantern-gold)', marginBottom: '6px' }}>
                ARCHITECTURAL BLUEPRINT NOTES:
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.8',
                  color: 'var(--color-moon-cream)',
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}
              >
                {activeVignette.unlockedNote}
              </p>
            </div>

            <button
              onClick={() => setActiveVignette(null)}
              className="pixel-btn pixel-btn-primary font-display"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              LOOK FORWARD TO THIS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
