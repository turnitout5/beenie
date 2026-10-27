import React from 'react';

interface ProtagonistProps {
  pose?: 'idle' | 'holdingLantern' | 'celebrating' | 'reading';
}

export const ProtagonistBeenish: React.FC<ProtagonistProps> = ({
  pose = 'idle',
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <svg
        width="48"
        height="56"
        viewBox="0 0 24 28"
        shapeRendering="crispEdges"
        className="pixel-art animate-float"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))',
        }}
      >
        {/* Beenish's Hair - Voluminous, beautiful dark hair with soft dusty lavender highlights */}
        <rect x="6" y="2" width="12" height="4" fill="#101329" />
        <rect x="5" y="3" width="14" height="6" fill="#1B2042" />
        <rect x="4" y="5" width="4" height="8" fill="#1B2042" />
        <rect x="16" y="5" width="4" height="8" fill="#1B2042" />
        {/* Soft highlight clusters */}
        <rect x="7" y="3" width="3" height="1" fill="#9588BD" />
        <rect x="14" y="3" width="3" height="1" fill="#9588BD" />
        <rect x="4" y="8" width="1" height="4" fill="#9588BD" />
        <rect x="19" y="8" width="1" height="4" fill="#9588BD" />

        {/* Face - Warm Peach */}
        <rect x="7" y="7" width="10" height="7" fill="#F3B79C" />

        {/* Expressive Eyes */}
        <rect x="8" y="9" width="2" height="2" fill="#101329" />
        <rect x="14" y="9" width="2" height="2" fill="#101329" />
        {/* Star Sparkle in eyes */}
        <rect x="8" y="9" width="1" height="1" fill="#F6D78B" />
        <rect x="14" y="9" width="1" height="1" fill="#F6D78B" />

        {/* Cute Rose Glow Cheeks */}
        <rect x="7" y="11" width="2" height="1" fill="#E98FAF" />
        <rect x="15" y="11" width="2" height="1" fill="#E98FAF" />

        {/* Smile */}
        <rect x="11" y="12" width="2" height="1" fill="#E98FAF" />

        {/* Scarf / Collar - Moon Cream */}
        <rect x="7" y="14" width="10" height="2" fill="#F4EBDD" />
        <rect x="13" y="15" width="2" height="3" fill="#F4EBDD" />

        {/* Cozy Explorer Jacket - Dusty Lavender & Warm Peach Belt */}
        <rect x="6" y="16" width="12" height="6" fill="#9588BD" />
        <rect x="8" y="16" width="8" height="6" fill="#C3A9E8" />
        <rect x="6" y="21" width="12" height="1" fill="#F3B79C" />

        {/* Hands / Arms */}
        <rect x="4" y="16" width="2" height="5" fill="#9588BD" />
        <rect x="4" y="21" width="2" height="2" fill="#F3B79C" />
        <rect x="18" y="16" width="2" height="5" fill="#9588BD" />
        <rect x="18" y="21" width="2" height="2" fill="#F3B79C" />

        {/* Optional Lantern in hand */}
        {pose === 'holdingLantern' && (
          <>
            <rect x="19" y="18" width="1" height="2" fill="#F6D78B" />
            <rect x="18" y="20" width="3" height="4" fill="#F6D78B" />
            <rect x="19" y="21" width="1" height="2" fill="#F4EBDD" />
          </>
        )}

        {/* Skirt / Pants - Midnight Indigo */}
        <rect x="7" y="22" width="10" height="3" fill="#1B2042" />

        {/* Boots - Twilight Blue with Cream laces */}
        <rect x="7" y="25" width="4" height="3" fill="#30385F" />
        <rect x="13" y="25" width="4" height="3" fill="#30385F" />
        <rect x="7" y="27" width="4" height="1" fill="#101329" />
        <rect x="13" y="27" width="4" height="1" fill="#101329" />
      </svg>
    </div>
  );
};
