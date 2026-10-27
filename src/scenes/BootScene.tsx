import React, { useState, useEffect, useRef } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { soundEngine } from '../audio/soundEngine';
import { ProtagonistBeenish } from '../components/ProtagonistBeenish';
import { CompanionBoyfriend } from '../components/CompanionBoyfriend';

export const BootScene: React.FC = () => {
  const { navigateTo } = useExpedition();
  const [bootStep, setBootStep] = useState(0);
  const [evadeOffset, setEvadeOffset] = useState({ x: 0, y: 0 });
  const [evadeMessage, setEvadeMessage] = useState('Go back to sleep');
  const [evadeCount, setEvadeCount] = useState(0);
  const runawayBtnRef = useRef<HTMLButtonElement | null>(null);

  const evadeQuips = [
    "Nice try, Paaaari.",
    "Not happening today.",
    "Pagluu says you have to see this.",
    "Too slow.",
    "You're not sleeping through your birthday.",
    "Come on, Pagluu spent weeks on this.",
  ];

  // Authentic human birthday note lines
  const noteLines = [
    "To Meri Paaaari (Beghum G),",
    "I wanted to give you something that couldn't be bought in any store.",
    "So I built you a world of your own: The Valley of the Stars.",
    "Seven places are scattered across the valley—holding your photos, our memories, and all the quiet things I love about you.",
    "Start by walking west along the stone path to the Bureau of Unreasonable Paglu.",
    "Happy Birthday, meri Paaaari.",
  ];

  useEffect(() => {
    soundEngine.startNightAmbience();
    if (bootStep < noteLines.length) {
      const timer = setTimeout(() => {
        soundEngine.playClick();
        setBootStep(prev => prev + 1);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [bootStep, noteLines.length]);

  const handleEvade = () => {
    soundEngine.playClick();
    const nextCount = evadeCount + 1;
    setEvadeCount(nextCount);
    setEvadeMessage(evadeQuips[nextCount % evadeQuips.length]);

    const randX = (Math.random() - 0.5) * 260;
    const randY = (Math.random() - 0.5) * 160;
    setEvadeOffset({ x: randX, y: randY });
  };

  const handleAccept = () => {
    soundEngine.playStarChime();
    soundEngine.startBolNaHalkeHalkeTuneLoop();
    navigateTo('hub');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          className="font-mono"
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-warm-peach)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          October 31 &bull; Birthday Expedition
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: 'var(--color-lantern-gold)',
            letterSpacing: '0.06em',
            margin: 0,
            textShadow: '0 0 20px rgba(246, 215, 139, 0.35)',
          }}
        >
          THE BEENISH EXPEDITION
        </h1>
        <p
          className="font-mono"
          style={{
            color: 'var(--color-dusty-lavender)',
            fontSize: '0.9rem',
            marginTop: '6px',
          }}
        >
          A world built for Paaaari (Beenish) by her Pagluu (Ahmad).
        </p>
      </div>

      {/* Handcrafted Note Panel */}
      <div
        className="pixel-panel pixel-panel-gold"
        onClick={() => {
          if (bootStep < noteLines.length) {
            soundEngine.playClick();
            setBootStep(noteLines.length);
          }
        }}
        style={{
          maxWidth: '640px',
          width: '100%',
          backgroundColor: 'rgba(27, 32, 66, 0.94)',
          backdropFilter: 'blur(10px)',
          padding: '28px 26px',
          marginBottom: '28px',
          boxShadow: 'var(--pixel-border-gold), 0 8px 30px rgba(16, 19, 41, 0.75)',
          cursor: bootStep < noteLines.length ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-twilight-blue)',
            paddingBottom: '12px',
            marginBottom: '20px',
          }}
        >
          <span
            className="font-mono"
            style={{
              color: 'var(--color-warm-peach)',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Dispatch &bull; From Pagluu (Ahmad)
          </span>
          <span
            className="font-mono"
            style={{
              color: 'var(--color-lantern-gold)',
              fontSize: '0.75rem',
            }}
          >
            For Paaaari
          </span>
        </div>

        {/* Written Lines */}
        <div
          className="font-mono"
          style={{
            minHeight: '170px',
            fontSize: '0.95rem',
            lineHeight: '1.9',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {noteLines.slice(0, bootStep).map((line, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', animation: 'fadeIn 250ms ease' }}>
              <span style={{ color: 'var(--color-dusty-lavender)' }}>&gt;</span>
              <span
                style={{
                  color:
                    idx === 0
                      ? 'var(--color-lantern-gold)'
                      : idx === noteLines.length - 1
                      ? 'var(--color-rose-glow)'
                      : idx === 4
                      ? 'var(--color-warm-peach)'
                      : 'var(--color-moon-cream)',
                  fontWeight: idx === 0 || idx === noteLines.length - 1 ? 600 : 400,
                }}
              >
                {line}
              </span>
            </div>
          ))}

          {bootStep < noteLines.length && (
            <div style={{ color: 'var(--color-lantern-gold)', animation: 'starTwinkle 0.8s infinite' }}>
              &gt; _ <span style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>[click to read all]</span>
            </div>
          )}
        </div>
      </div>

      {/* Characters Vignette */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '32px',
        }}
      >
        <ProtagonistBeenish pose="holdingLantern" />
        <CompanionBoyfriend pose="wave" initialQuote="Happy birthday, meri Paaaari! Come take a look." />
      </div>

      {/* Action Buttons */}
      {bootStep >= noteLines.length && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          <button
            onClick={handleAccept}
            className="pixel-btn pixel-btn-primary font-display"
            style={{
              padding: '14px 30px',
              fontSize: '0.95rem',
              animation: 'scaleUp 300ms ease',
            }}
          >
            <span>Step Into The Valley</span>
          </button>

          <button
            ref={runawayBtnRef}
            onMouseEnter={handleEvade}
            onTouchStart={handleEvade}
            onClick={handleEvade}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{
              padding: '14px 22px',
              fontSize: '0.85rem',
              transform: `translate(${evadeOffset.x}px, ${evadeOffset.y}px)`,
              transition: 'transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1)',
              borderColor: 'var(--color-dusty-lavender)',
              cursor: 'pointer',
            }}
          >
            <span>{evadeMessage}</span>
          </button>
        </div>
      )}
    </div>
  );
};
