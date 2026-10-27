import React from 'react';
import { LocationId } from '../types/expedition';
import { soundEngine } from '../audio/soundEngine';

interface WorldMapDioramaProps {
  starsRecovered: number;
  recoveredStarIds: number[];
  secretGardenUnlocked: boolean;
  onNavigate: (location: LocationId) => void;
}

export const WorldMapDiorama: React.FC<WorldMapDioramaProps> = ({
  starsRecovered,
  recoveredStarIds,
  secretGardenUnlocked,
  onNavigate,
}) => {
  const isBureauLit = recoveredStarIds.includes(1);
  const isMuseumLit = recoveredStarIds.includes(2);
  const isCourtLit = recoveredStarIds.includes(3);
  const isArchiveLit = recoveredStarIds.includes(4);
  const isObservatoryLit = recoveredStarIds.includes(5);

  const handleSelect = (loc: LocationId) => {
    soundEngine.playClick();
    onNavigate(loc);
  };

  return (
    <div
      className="pixel-panel pixel-panel-lilac"
      style={{
        backgroundColor: 'var(--color-void-navy)',
        padding: '20px',
        marginBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="pixel-panel-header" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ color: 'var(--color-lantern-gold)', fontSize: '0.8rem' }}>[MAP]</span>
          <span className="font-display" style={{ fontSize: '0.85rem', color: 'var(--color-dream-lilac)' }}>
            INTERACTIVE EXPEDITION MAP
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>
          [CLICK ANY BUILDING TO TRAVEL]
        </span>
      </div>

      {/* Handcrafted Stepped Pixel Landscape Diorama */}
      <svg
        viewBox="0 0 800 240"
        width="100%"
        height="auto"
        shapeRendering="crispEdges"
        className="pixel-art"
        style={{
          backgroundColor: '#101329',
          border: '2px solid var(--color-twilight-blue)',
          maxHeight: '300px',
        }}
      >
        {/* Background Night Sky Gradient & Stars */}
        <rect width="800" height="240" fill="#101329" />

        {/* Distant Stepped Mountain Silhouettes */}
        <polygon points="0,170 120,90 200,170" fill="#1B2042" />
        <polygon points="160,170 280,70 380,170" fill="#1B2042" />
        <polygon points="340,170 480,85 580,170" fill="#1B2042" />
        <polygon points="540,170 660,60 800,170" fill="#1B2042" />

        {/* Midground Hills */}
        <rect x="0" y="160" width="800" height="80" fill="#1B2042" />
        <polygon points="0,160 140,130 300,160" fill="#30385F" />
        <polygon points="260,160 440,120 600,160" fill="#30385F" />
        <polygon points="560,160 700,110 800,160" fill="#30385F" />

        {/* Foreground Path & Grass */}
        <rect x="0" y="180" width="800" height="60" fill="#30385F" />
        <rect x="0" y="200" width="800" height="40" fill="#354E50" />
        <rect x="120" y="210" width="560" height="15" fill="#718C83" />

        {/* LOCATION 1: BUREAU OF UNREASONABLE PAGLU (Left) */}
        <g
          onClick={() => handleSelect('bureau')}
          style={{ cursor: 'pointer' }}
          className="map-building"
        >
          {/* Building block */}
          <rect x="60" y="140" width="90" height="50" fill="#1B2042" stroke="#30385F" strokeWidth="2" />
          <polygon points="55,140 105,115 155,140" fill="#30385F" />
          {/* Signboard */}
          <rect x="75" y="130" width="60" height="8" fill="#F3B79C" opacity="0.8" />
          {/* Window - glows warm peach if star 1 recovered */}
          <rect
            x="75"
            y="155"
            width="20"
            height="18"
            fill={isBureauLit ? '#F3B79C' : '#30385F'}
            filter={isBureauLit ? 'drop-shadow(0 0 6px #F3B79C)' : 'none'}
          />
          <rect
            x="115"
            y="155"
            width="20"
            height="18"
            fill={isBureauLit ? '#F3B79C' : '#30385F'}
            filter={isBureauLit ? 'drop-shadow(0 0 6px #F3B79C)' : 'none'}
          />
          {/* Door */}
          <rect x="95" y="165" width="16" height="25" fill="#101329" />
          {/* Label Pin */}
          <rect x="65" y="195" width="80" height="14" fill="#101329" stroke="#F3B79C" strokeWidth="1" />
          <text x="105" y="205" fill="#F3B79C" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            01. BUREAU
          </text>
        </g>

        {/* LOCATION 2: THE MUSEUM OF BEENISH (Mid-Left) */}
        <g
          onClick={() => handleSelect('museum')}
          style={{ cursor: 'pointer' }}
          className="map-building"
        >
          {/* Stepped Grand Facade */}
          <rect x="190" y="130" width="110" height="60" fill="#1B2042" stroke="#666FA0" strokeWidth="2" />
          <polygon points="180,130 245,100 310,130" fill="#30385F" />
          {/* Columns */}
          <rect x="205" y="140" width="8" height="40" fill="#666FA0" />
          <rect x="235" y="140" width="8" height="40" fill="#666FA0" />
          <rect x="255" y="140" width="8" height="40" fill="#666FA0" />
          <rect x="275" y="140" width="8" height="40" fill="#666FA0" />
          {/* Windows - glows lavender if star 2 recovered */}
          <rect
            x="218"
            y="145"
            width="12"
            height="22"
            fill={isMuseumLit ? '#C3A9E8' : '#30385F'}
            filter={isMuseumLit ? 'drop-shadow(0 0 6px #C3A9E8)' : 'none'}
          />
          {/* Label Pin */}
          <rect x="205" y="195" width="80" height="14" fill="#101329" stroke="#C3A9E8" strokeWidth="1" />
          <text x="245" y="205" fill="#C3A9E8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            02. MUSEUM
          </text>
        </g>

        {/* LOCATION 3: COURT OF ABSOLUTELY NO FLAWS (Center) */}
        <g
          onClick={() => handleSelect('court')}
          style={{ cursor: 'pointer' }}
          className="map-building"
        >
          <rect x="340" y="135" width="100" height="55" fill="#1B2042" stroke="#F6D78B" strokeWidth="2" />
          <polygon points="330,135 390,110 450,135" fill="#30385F" />
          {/* Scale emblem */}
          <rect x="385" y="120" width="10" height="8" fill="#F6D78B" />
          {/* Judicial Windows */}
          <rect
            x="355"
            y="150"
            width="16"
            height="20"
            fill={isCourtLit ? '#F6D78B' : '#30385F'}
            filter={isCourtLit ? 'drop-shadow(0 0 6px #F6D78B)' : 'none'}
          />
          <rect
            x="410"
            y="150"
            width="16"
            height="20"
            fill={isCourtLit ? '#F6D78B' : '#30385F'}
            filter={isCourtLit ? 'drop-shadow(0 0 6px #F6D78B)' : 'none'}
          />
          {/* Label Pin */}
          <rect x="350" y="195" width="80" height="14" fill="#101329" stroke="#F6D78B" strokeWidth="1" />
          <text x="390" y="205" fill="#F6D78B" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            03. COURT
          </text>
        </g>

        {/* LOCATION 4: THE ARCHIVE OF MEMORIES (Mid-Right) */}
        <g
          onClick={() => handleSelect('archive')}
          style={{ cursor: 'pointer' }}
          className="map-building"
        >
          {/* Archive Library built into hill */}
          <rect x="480" y="140" width="90" height="50" fill="#1B2042" stroke="#9588BD" strokeWidth="2" />
          <polygon points="475,140 525,120 575,140" fill="#30385F" />
          {/* Stacks window */}
          <rect
            x="495"
            y="150"
            width="25"
            height="22"
            fill={isArchiveLit ? '#9588BD' : '#30385F'}
            filter={isArchiveLit ? 'drop-shadow(0 0 6px #9588BD)' : 'none'}
          />
          <rect
            x="535"
            y="150"
            width="22"
            height="22"
            fill={isArchiveLit ? '#F4EBDD' : '#30385F'}
            filter={isArchiveLit ? 'drop-shadow(0 0 6px #F4EBDD)' : 'none'}
          />
          {/* Label Pin */}
          <rect x="485" y="195" width="80" height="14" fill="#101329" stroke="#9588BD" strokeWidth="1" />
          <text x="525" y="205" fill="#9588BD" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            04. ARCHIVE
          </text>
        </g>

        {/* LOCATION 5: OBSERVATORY (Right Hilltop) */}
        <g
          onClick={() => handleSelect('observatory')}
          style={{ cursor: 'pointer' }}
          className="map-building"
        >
          {/* Observatory Dome */}
          <circle cx="650" cy="120" r="28" fill="#1B2042" stroke="#C3A9E8" strokeWidth="2" />
          {/* Telescope slit / barrel */}
          <rect x="655" y="95" width="18" height="6" fill="#F6D78B" transform="rotate(-30 655 95)" />
          {/* Observatory Base */}
          <rect x="620" y="135" width="60" height="55" fill="#30385F" />
          {/* Dome glow */}
          <circle
            cx="650"
            cy="120"
            r="12"
            fill={isObservatoryLit ? '#C3A9E8' : '#101329'}
            filter={isObservatoryLit ? 'drop-shadow(0 0 8px #C3A9E8)' : 'none'}
          />
          {/* Label Pin */}
          <rect x="615" y="195" width="80" height="14" fill="#101329" stroke="#C3A9E8" strokeWidth="1" />
          <text x="655" y="205" fill="#C3A9E8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            05. OBSERVATORY
          </text>
        </g>

        {/* LOCATION 6: SECRET HIDDEN GARDEN (Far Right Pathway Gate) */}
        <g
          onClick={() => {
            if (secretGardenUnlocked) handleSelect('garden');
          }}
          style={{ cursor: secretGardenUnlocked ? 'pointer' : 'not-allowed' }}
        >
          {/* Garden Gate archway */}
          <rect x="725" y="150" width="45" height="40" fill={secretGardenUnlocked ? '#354E50' : '#101329'} stroke={secretGardenUnlocked ? '#F3B79C' : '#30385F'} strokeWidth="2" />
          <circle cx="747" cy="150" r="14" fill={secretGardenUnlocked ? '#E98FAF' : '#1B2042'} opacity={secretGardenUnlocked ? 0.6 : 0.2} />
          {/* Bench inside gate */}
          <rect x="735" y="175" width="25" height="6" fill={secretGardenUnlocked ? '#F6D78B' : '#30385F'} />

          {/* Label Pin */}
          <rect x="715" y="195" width="70" height="14" fill="#101329" stroke={secretGardenUnlocked ? '#E98FAF' : '#30385F'} strokeWidth="1" />
          <text x="750" y="205" fill={secretGardenUnlocked ? '#E98FAF' : '#666FA0'} fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            {secretGardenUnlocked ? '★ GARDEN' : '[LOCKED]'}
          </text>
        </g>

        {/* Dynamic Blooming Wildflowers across foreground (scales with stars) */}
        {starsRecovered >= 2 && (
          <>
            <circle cx="140" cy="215" r="3" fill="#E98FAF" />
            <circle cx="148" cy="218" r="2" fill="#F4EBDD" />
          </>
        )}
        {starsRecovered >= 4 && (
          <>
            <circle cx="310" cy="216" r="3" fill="#C3A9E8" />
            <circle cx="460" cy="214" r="3" fill="#F3B79C" />
            <circle cx="468" cy="218" r="2" fill="#F6D78B" />
          </>
        )}
        {starsRecovered >= 6 && (
          <>
            <circle cx="600" cy="215" r="3" fill="#F6D78B" />
            <circle cx="700" cy="216" r="4" fill="#E98FAF" />
            <circle cx="710" cy="213" r="3" fill="#C3A9E8" />
          </>
        )}
      </svg>
    </div>
  );
};
