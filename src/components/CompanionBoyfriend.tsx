import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine';

interface CompanionProps {
  pose?: 'idle' | 'wave' | 'thumbsup' | 'blush' | 'reading';
  initialQuote?: string;
  locationContext?: string;
  size?: 'small' | 'medium' | 'large';
  speechPosition?: 'top' | 'bottom';
}

export const CompanionBoyfriend: React.FC<CompanionProps> = ({
  pose = 'idle',
  initialQuote = "ufff kitu sundar hain meri Paaaari... Happy birthday, meri Beghum G!",
  size = 'medium',
  speechPosition = 'top',
}) => {
  const spriteWidth = size === 'large' ? 84 : size === 'small' ? 36 : 48;
  const spriteHeight = size === 'large' ? 98 : size === 'small' ? 42 : 56;
  const [currentQuote, setCurrentQuote] = useState(initialQuote);
  const [showSpeech, setShowSpeech] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  const quotes = [
    "Bas meri Paaaari hain. Samajh nai aata, bas hain.",
    "ufff kitu sundar hain meri Beghum G...",
    "yummm yumm kha jaun ga apko!",
    "CASE FILE #001: Pagluu ka dil officially Paaaari ke paas confiscated hai.",
    "aryyyy.....sunyen tooo! Kahan bhagi ja rahi hain?",
    "Did you know every single star in this sky was placed here just for my Paaaari?",
    "11/10 baddie energy, Pagluu is permanently incapacitated.",
  ];

  const handleClick = () => {
    soundEngine.playClick();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    setCurrentQuote(quotes[nextCount % quotes.length]);
    setShowSpeech(true);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={handleClick}
      title="Click Pagluu for commentary"
    >
      {/* Pixel Speech Bubble */}
      {showSpeech && (
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            ...(speechPosition === 'bottom'
              ? { top: '100%', marginTop: '12px' }
              : { bottom: '100%', marginBottom: '12px' }),
            backgroundColor: 'var(--color-midnight-indigo)',
            color: 'var(--color-moon-cream)',
            padding: '8px 12px',
            boxShadow: 'var(--pixel-border-peach)',
            fontSize: '0.8rem',
            lineHeight: '1.4',
            maxWidth: '220px',
            textAlign: 'center',
            zIndex: 10,
            animation: 'fadeIn 200ms ease',
          }}
        >
          {currentQuote}
          {/* Stepped Pixel Pointer */}
          <div
            style={{
              position: 'absolute',
              ...(speechPosition === 'bottom'
                ? {
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '6px solid var(--color-warm-peach)',
                  }
                : {
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid var(--color-warm-peach)',
                  }),
            }}
          />
        </div>
      )}

      {/* Handcrafted Pixel Sprite (Boyfriend) */}
      <svg
        width={spriteWidth}
        height={spriteHeight}
        viewBox="0 0 24 28"
        shapeRendering="crispEdges"
        className="pixel-art"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))',
          transform: pose === 'thumbsup' ? 'scale(1.05)' : 'none',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Hair - Dark indigo / navy clusters */}
        <rect x="7" y="2" width="10" height="3" fill="#101329" />
        <rect x="6" y="3" width="12" height="4" fill="#1B2042" />
        <rect x="5" y="4" width="3" height="4" fill="#1B2042" />
        <rect x="16" y="4" width="3" height="4" fill="#1B2042" />
        {/* Hair highlights */}
        <rect x="8" y="3" width="4" height="1" fill="#30385F" />

        {/* Face - Warm Peach */}
        <rect x="7" y="7" width="10" height="7" fill="#F3B79C" />
        {/* Eyes */}
        <rect x="9" y="9" width="2" height="2" fill="#101329" />
        <rect x="13" y="9" width="2" height="2" fill="#101329" />
        {/* Eye twinkles */}
        <rect x="9" y="9" width="1" height="1" fill="#F4EBDD" />
        <rect x="13" y="9" width="1" height="1" fill="#F4EBDD" />
        {/* Cheeks / Blush */}
        <rect x="7" y="11" width="2" height="1" fill="#E98FAF" />
        <rect x="15" y="11" width="2" height="1" fill="#E98FAF" />
        {/* Smile */}
        <rect x="10" y="12" width="4" height="1" fill="#9588BD" />

        {/* Neck */}
        <rect x="10" y="14" width="4" height="1" fill="#F3B79C" />

        {/* Hoodie / Jacket - Twilight Blue & Dream Lilac accents */}
        <rect x="6" y="15" width="12" height="7" fill="#30385F" />
        <rect x="9" y="15" width="6" height="7" fill="#666FA0" />
        {/* Collar / Strings */}
        <rect x="10" y="16" width="1" height="3" fill="#F4EBDD" />
        <rect x="13" y="16" width="1" height="3" fill="#F4EBDD" />

        {/* Arms / Hands */}
        {pose === 'thumbsup' ? (
          <>
            <rect x="4" y="16" width="2" height="5" fill="#30385F" />
            <rect x="4" y="21" width="2" height="2" fill="#F3B79C" />
            {/* Raised thumb */}
            <rect x="18" y="14" width="3" height="3" fill="#F3B79C" />
            <rect x="19" y="13" width="1" height="2" fill="#F3B79C" />
            <rect x="17" y="17" width="3" height="4" fill="#30385F" />
          </>
        ) : (
          <>
            <rect x="4" y="16" width="2" height="5" fill="#30385F" />
            <rect x="4" y="21" width="2" height="2" fill="#F3B79C" />
            <rect x="18" y="16" width="2" height="5" fill="#30385F" />
            <rect x="18" y="21" width="2" height="2" fill="#F3B79C" />
          </>
        )}

        {/* Pants - Dark Void Navy */}
        <rect x="7" y="22" width="10" height="4" fill="#101329" />
        <rect x="7" y="23" width="4" height="3" fill="#101329" />
        <rect x="13" y="23" width="4" height="3" fill="#101329" />

        {/* Shoes - Moon Cream & Lavender */}
        <rect x="6" y="26" width="5" height="2" fill="#F4EBDD" />
        <rect x="13" y="26" width="5" height="2" fill="#F4EBDD" />
      </svg>
    </div>
  );
};
