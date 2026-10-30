import React from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { LocationId } from '../types/expedition';
import { CompanionBoyfriend } from '../components/CompanionBoyfriend';
import { ProtagonistBeenish } from '../components/ProtagonistBeenish';

export const HubScene: React.FC = () => {
  const { state, navigateTo } = useExpedition();
  const { starsRecovered, secretGardenUnlocked, recoveredStarIds } = state;

  interface HubPortal {
    id: LocationId;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    starId: number;
    description: string;
  }

  const portals: HubPortal[] = [
    {
      id: 'bureau',
      title: 'The Bureau of Unreasonable Paglu',
      subtitle: 'Official Allegation Files',
      icon: '[FILE 01]',
      color: 'var(--color-warm-peach)',
      starId: 1,
      description: 'A completely serious office investigating why meri Paaaari is unreasonably adorable.',
    },
    {
      id: 'museum',
      title: 'The Museum of Beenish',
      subtitle: 'The Master Collection',
      icon: '[GALLERY 02]',
      color: 'var(--color-dream-lilac)',
      starId: 2,
      description: 'One subject. An unreasonable number of exhibits, spotlit traits, and the Position Holder Artifact.',
    },
    {
      id: 'court',
      title: 'The Court of Absolutely No Flaws',
      subtitle: 'The Grand Flaw Inquiry',
      icon: '[COURT 03]',
      color: 'var(--color-lantern-gold)',
      starId: 3,
      description: 'A dramatic courtroom where the prosecution attempts to find a single flaw in Beenish.',
    },
    {
      id: 'archive',
      title: 'The Archive of Things That Happened',
      subtitle: 'Keepsake Memory Vault',
      icon: '[ARCHIVE 04]',
      color: 'var(--color-dusty-lavender)',
      starId: 4,
      description: 'Floating memory artifacts, real moments, and a top-secret classified conversation.',
    },
    {
      id: 'observatory',
      title: 'The Observatory of Things We Haven’t Done Yet',
      subtitle: 'Celestial Horizons',
      icon: '[OBSERVATORY 05]',
      color: 'var(--color-dream-lilac)',
      starId: 5,
      description: 'Photoshoots, nighttime walks, couple reels, and an unnamed constellation for Beenish to name.',
    },
  ];

  return (
    <div
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '32px 20px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* World Status Banner */}
      <div
        className="pixel-panel pixel-panel-gold"
        style={{
          marginBottom: '32px',
          backgroundColor: 'rgba(27, 32, 66, 0.95)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="font-display" style={{ fontSize: '1.2rem', color: 'var(--color-lantern-gold)', marginBottom: '4px' }}>
              ✦ CENTRAL EXPEDITION HUB ✦
            </div>
            <p className="font-mono" style={{ color: 'var(--color-moon-cream)', fontSize: '0.85rem' }}>
              The universe is awakening. Recover all 7 missing stars to open the pathway to the Secret Garden.
            </p>
          </div>

          {/* World Vitality Meter */}
          <div
            className="font-mono"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-void-navy)',
              padding: '8px 16px',
              border: '2px solid var(--color-twilight-blue)',
            }}
          >
            <span style={{ color: 'var(--color-dusty-lavender)' }}>VITALITY:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < starsRecovered ? 'var(--color-lantern-gold)' : 'var(--color-midnight-indigo)',
                    fontSize: '1.1rem',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ color: 'var(--color-lantern-gold)', fontWeight: 600 }}>
              {starsRecovered} / 7
            </span>
          </div>
        </div>

        {/* Dynamic Blooming Flora & Environment Feedback */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '2px dashed var(--color-twilight-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)' }}>
              {starsRecovered >= 5
                ? 'The garden gate is humming softly in the twilight mist...'
                : starsRecovered >= 3
                ? 'Warm lanterns and lavender wildflowers have sprouted across the path.'
                : 'Faint starlight flickers. The world awaits your exploration.'}
            </span>
          </div>

          {/* Quick Secret Garden Shortcut if unlocked */}
          {secretGardenUnlocked && (
            <button
              onClick={() => navigateTo('garden')}
              className="pixel-btn pixel-btn-peach font-display"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <span>VISIT THE SECRET GARDEN →</span>
            </button>
          )}
        </div>
      </div>

      {/* Characters Interacting in the Hub */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px',
          marginBottom: '40px',
        }}
      >
        <ProtagonistBeenish pose={starsRecovered >= 5 ? 'holdingLantern' : 'idle'} />
        <CompanionBoyfriend
          pose="thumbsup"
          initialQuote={
            starsRecovered >= 5
              ? "The whole sky is glowing now, meri Paaaari! The secret garden is waiting for you."
              : "Pick any location to explore, meri Beghum G! Pagluu personally recommends checking the Bureau of Unreasonable Paglu first."
          }
        />
      </div>

      <h2
        className="font-display"
        style={{
          fontSize: '1rem',
          color: 'var(--color-dream-lilac)',
          marginBottom: '16px',
        }}
      >
        <span>EXPLORATION DESTINATIONS</span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {portals.map((portal) => {
          const isStarRecovered = recoveredStarIds.includes(portal.starId);
          return (
            <div
              key={portal.id}
              className="pixel-panel"
              style={{
                backgroundColor: 'var(--color-midnight-indigo)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--anim-quick), box-shadow var(--anim-quick)',
                cursor: 'pointer',
              }}
              onClick={() => navigateTo(portal.id)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{portal.icon}</span>
                  {isStarRecovered ? (
                    <span className="pixel-badge pixel-badge-gold">
                      ★ RESTORED
                    </span>
                  ) : (
                    <span className="pixel-badge font-mono" style={{ color: 'var(--color-dusty-lavender)' }}>
                      ☆ UNEXPLORED
                    </span>
                  )}
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: '0.95rem',
                    color: portal.color,
                    marginBottom: '4px',
                  }}
                >
                  {portal.title}
                </h3>

                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-dusty-lavender)',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {portal.subtitle}
                </div>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-moon-cream)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}
                >
                  {portal.description}
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
                  navigateTo(portal.id);
                }}
              >
                ENTER LOCATION →
              </button>
            </div>
          );
        })}

        {/* The Secret Garden Special Portal */}
        <div
          className="pixel-panel"
          style={{
            backgroundColor: secretGardenUnlocked ? 'rgba(53, 78, 80, 0.4)' : 'rgba(27, 32, 66, 0.5)',
            boxShadow: secretGardenUnlocked ? 'var(--pixel-border-peach)' : 'var(--pixel-border-base)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: secretGardenUnlocked ? 1 : 0.7,
            cursor: secretGardenUnlocked ? 'pointer' : 'not-allowed',
          }}
          onClick={() => {
            if (secretGardenUnlocked) navigateTo('garden');
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-warm-peach)' }}>[SANCTUARY]</span>
              {secretGardenUnlocked ? (
                <span className="pixel-badge pixel-badge-peach">
                  UNLOCKED
                </span>
              ) : (
                <span className="pixel-badge" style={{ color: 'var(--color-muted-periwinkle)' }}>
                  LOCKED
                </span>
              )}
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-warm-peach)',
                marginBottom: '4px',
              }}
            >
              The Secret Hidden Garden
            </h3>

            <div
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-dusty-lavender)',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              The Destination of The Heart
            </div>

            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-moon-cream)',
                lineHeight: '1.6',
                marginBottom: '16px',
              }}
            >
              {secretGardenUnlocked
                ? 'The secret pathway has opened. A quiet bench under the stars holds your personal birthday letter.'
                : 'A peaceful sanctuary hidden behind the world. Explore the locations to find the path.'}
            </p>
          </div>

          <button
            disabled={!secretGardenUnlocked}
            className={`pixel-btn ${secretGardenUnlocked ? 'pixel-btn-peach' : 'pixel-btn-ghost'} font-display`}
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '0.8rem',
            }}
          >
            {secretGardenUnlocked ? 'ENTER SECRET GARDEN →' : 'LOCKED (EXPLORE TO UNLOCK)'}
          </button>
        </div>
      </div>
    </div>
  );
};
