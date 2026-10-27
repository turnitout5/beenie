import React, { useState, useEffect, useRef } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { soundEngine } from '../audio/soundEngine';
import { ProtagonistBeenish } from '../components/ProtagonistBeenish';
import { CompanionBoyfriend } from '../components/CompanionBoyfriend';

export const BootScene: React.FC = () => {
  const { navigateTo } = useExpedition();
  const [bootStep, setBootStep] = useState(0);
  const [evadeOffset, setEvadeOffset] = useState({ x: 0, y: 0 });
  const [evadeMessage, setEvadeMessage] = useState('GO BACK TO SLEEP');
  const [evadeCount, setEvadeCount] = useState(0);
  const runawayBtnRef = useRef<HTMLButtonElement | null>(null);

  const evadeQuips = [
    "Nice try, Beenie!",
    "Error 404: Sleep Not Found",
    "Nope, someone loves you too much!",
    "Too fast for you ♡",
    "No sleeping on your birthday!",
    "Mission is mandatory!",
  ];

  // Sequence of boot lines
  const bootLogs = [
    "INITIALIZING EXPEDITION OS v2.0...",
    "SCANNING SECTOR FOR LOST STARS...",
    "CRITICAL ALERT: STORAGE OVERFLOW DETECTED.",
    "REASON: The list of wonderful things about Beenish exceeded universal limits.",
    "EXPLORER DETECTED: BEENISH TASAFFAR.",
    "STATUS: Apparently, someone loves you an unreasonable amount.",
    "WOULD YOU LIKE TO INVESTIGATE?",
  ];

  useEffect(() => {
    soundEngine.startNightAmbience();
    if (bootStep < bootLogs.length) {
      const timer = setTimeout(() => {
        soundEngine.playClick();
        setBootStep(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [bootStep, bootLogs.length]);

  const handleEvade = () => {
    soundEngine.playClick();
    const nextCount = evadeCount + 1;
    setEvadeCount(nextCount);
    setEvadeMessage(evadeQuips[nextCount % evadeQuips.length]);

    // Random offset within reasonable bounds
    const randX = (Math.random() - 0.5) * 260;
    const randY = (Math.random() - 0.5) * 160;
    setEvadeOffset({ x: randX, y: randY });
  };

  const handleAccept = () => {
    soundEngine.playStarChime();
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
        padding: '24px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Title & Atmosphere */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          className="font-display"
          style={{
            fontSize: 'clamp(1.2rem, 3.5vw, 2.2rem)',
            color: 'var(--color-lantern-gold)',
            textShadow: '0 0 16px rgba(246, 215, 139, 0.4)',
            letterSpacing: '0.08em',
            marginBottom: '8px',
          }}
        >
          ✦ THE BEENISH EXPEDITION ✦
        </div>
        <p
          className="font-mono"
          style={{
            color: 'var(--color-dusty-lavender)',
            fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
          }}
        >
          A world that shouldn't exist, dedicated to a girl who absolutely does.
        </p>
      </div>

      {/* Terminal Screen Panel */}
      <div
        className="pixel-panel pixel-panel-lilac"
        onClick={() => {
          if (bootStep < bootLogs.length) {
            soundEngine.playClick();
            setBootStep(bootLogs.length);
          }
        }}
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: 'var(--color-void-navy)',
          padding: '28px 24px',
          marginBottom: '32px',
          cursor: bootStep < bootLogs.length ? 'pointer' : 'default',
        }}
        title={bootStep < bootLogs.length ? 'Click to skip typing' : ''}
      >
        <div className="pixel-panel-header" style={{ marginBottom: '20px' }}>
          <span className="font-mono" style={{ color: 'var(--color-dream-lilac)', fontSize: '0.8rem' }}>
            TERMINAL // BOOT_SEQUENCE.LOG {bootStep < bootLogs.length && <span style={{ color: 'var(--color-dusty-lavender)', fontSize: '0.7rem' }}>[CLICK TO SKIP]</span>}
          </span>
          <span className="pixel-badge pixel-badge-gold">ONLINE</span>
        </div>

        {/* Typed Lines */}
        <div
          className="font-mono"
          style={{
            minHeight: '160px',
            fontSize: '0.9rem',
            lineHeight: '1.9',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {bootLogs.slice(0, bootStep).map((log, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', animation: 'fadeIn 250ms ease' }}>
              <span style={{ color: 'var(--color-muted-periwinkle)' }}>&gt;</span>
              <span
                style={{
                  color:
                    idx === 2
                      ? 'var(--color-rose-glow)'
                      : idx === 3
                      ? 'var(--color-warm-peach)'
                      : idx === 4
                      ? 'var(--color-lantern-gold)'
                      : 'var(--color-moon-cream)',
                  fontWeight: idx >= 4 ? 600 : 400,
                }}
              >
                {log}
              </span>
            </div>
          ))}

          {bootStep < bootLogs.length && (
            <div style={{ color: 'var(--color-lantern-gold)', animation: 'starTwinkle 0.8s infinite' }}>
              &gt; ▋
            </div>
          )}
        </div>
      </div>

      {/* Sprites Vignette */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '36px',
        }}
      >
        <ProtagonistBeenish pose="holdingLantern" />
        <CompanionBoyfriend pose="wave" initialQuote="Hey Beenie! Ready for your birthday mission? ♡" />
      </div>

      {/* Interactive Choice Buttons */}
      {bootStep >= bootLogs.length && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {/* Primary Acceptance Button */}
          <button
            onClick={handleAccept}
            className="pixel-btn pixel-btn-primary font-display"
            style={{
              padding: '16px 28px',
              fontSize: '1rem',
              animation: 'scaleUp 300ms ease',
            }}
          >
            <span>ACCEPT MISSION ♡</span>
          </button>

          {/* The Runaway "Go Back To Sleep" Button */}
          <button
            ref={runawayBtnRef}
            onMouseEnter={handleEvade}
            onTouchStart={handleEvade}
            onClick={handleEvade}
            className="pixel-btn pixel-btn-ghost font-display"
            style={{
              padding: '16px 24px',
              fontSize: '0.85rem',
              transform: `translate(${evadeOffset.x}px, ${evadeOffset.y}px)`,
              transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
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
