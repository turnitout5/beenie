import React, { useState, useMemo } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { RoomId } from '../game/types';
import { soundEngine } from '../audio/soundEngine';

import { MapLandmark, MAP_LANDMARKS, getActiveObjective } from "../data/landmarksData";


interface ExpeditionMapModalProps {
  onClose: () => void;
  playerPos: { x: number; y: number };
  currentRoomId: RoomId;
  onFastTravel: (roomId: RoomId, targetPos?: { x: number; y: number }) => void;
  onSetWaypoint?: (pos: { x: number; y: number }, label: string) => void;
}

export const ExpeditionMapModal: React.FC<ExpeditionMapModalProps> = ({
  onClose,
  playerPos,
  currentRoomId,
  onFastTravel,
  onSetWaypoint,
}) => {
  const { state } = useExpedition();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'chapter' | 'estates' | 'nature'>('all');
  const [activeLandmark, setActiveLandmark] = useState<MapLandmark | null>(null);

  const activeObjective = useMemo(() => getActiveObjective(state), [state]);

  const targetLandmark = useMemo(
    () => MAP_LANDMARKS.find(l => l.id === activeObjective.targetLandmarkId) || MAP_LANDMARKS[0],
    [activeObjective]
  );

  const filteredLandmarks = useMemo(() => {
    if (selectedFilter === 'all') return MAP_LANDMARKS;
    if (selectedFilter === 'chapter') return MAP_LANDMARKS.filter(l => l.category === 'chapter');
    if (selectedFilter === 'estates') return MAP_LANDMARKS.filter(l => l.category === 'estates');
    if (selectedFilter === 'nature') return MAP_LANDMARKS.filter(l => l.category === 'nature' || l.category === 'plaza');
    return MAP_LANDMARKS;
  }, [selectedFilter]);

  // Map coordinate conversion (1600x1200 world to 800x600 SVG viewBox)
  const toSvgX = (wx: number) => (wx / 1600) * 800;
  const toSvgY = (wy: number) => (wy / 1200) * 600;

  const playerSvgX = currentRoomId === 'overworld' ? toSvgX(playerPos.x) : toSvgX(targetLandmark.x);
  const playerSvgY = currentRoomId === 'overworld' ? toSvgY(playerPos.y) : toSvgY(targetLandmark.y);

  const handleLandmarkClick = (landmark: MapLandmark) => {
    soundEngine.playClick();
    setActiveLandmark(landmark);
  };

  const handleTravelClick = (landmark: MapLandmark) => {
    soundEngine.playDoorOpen();
    if (landmark.targetRoom) {
      onFastTravel(landmark.targetRoom, landmark.targetPos);
    } else {
      // Overworld landmark
      onFastTravel('overworld', landmark.targetPos || { x: landmark.x, y: landmark.y + 25 });
    }
    onClose();
  };

  const handleWaypointClick = (landmark: MapLandmark) => {
    soundEngine.playClick();
    if (onSetWaypoint) {
      onSetWaypoint({ x: landmark.x, y: landmark.y }, landmark.name);
    }
    onClose();
  };

  return (
    <div 
      className="pixel-modal-backdrop" 
      onClick={onClose}
      style={{
        zIndex: 1000,
        backgroundColor: 'rgba(5, 8, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="pixel-modal-content pixel-panel"
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(96vw, 980px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0A0E1A',
          border: '2px solid #F59E0B',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.4), 0 20px 40px rgba(0, 0, 0, 0.9)',
          borderRadius: '8px',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* HEADER BAR */}
        <div 
          style={{
            backgroundColor: '#0F172A',
            borderBottom: '2px solid #1E293B',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🗺️</span>
            <div>
              <h2 className="font-display" style={{ margin: 0, fontSize: '0.95rem', color: '#F59E0B', letterSpacing: '0.04em' }}>
                EXPEDITION WORLD MAP &amp; GUIDE
              </h2>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                The Valley of the Stars &amp; The 5 Dream Realms
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              className="font-mono"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #F59E0B',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: '#FEF08A',
                fontWeight: 'bold',
              }}
            >
              ✦ Stars Restored: 0{state.starsRecovered} / 07
            </div>

            <button
              onClick={onClose}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ padding: '4px 10px', minWidth: '32px', minHeight: '32px', fontSize: '0.8rem' }}
              title="Close Map (ESC / M)"
            >
              [X]
            </button>
          </div>
        </div>

        {/* ACTIVE OBJECTIVE BANNER (AHMAD'S REAL VOICE) */}
        <div
          style={{
            backgroundColor: '#1E1B4B',
            borderBottom: '2px solid #312E81',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#312E81',
              border: '2px solid #F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0,
            }}
          >
            {activeObjective.icon}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span 
                style={{
                  backgroundColor: '#F59E0B',
                  color: '#0F172A',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                NEXT DESTINATION: {activeObjective.chapter.toUpperCase()}
              </span>
              <strong style={{ color: '#FFFFFF', fontSize: '0.85rem' }}>
                {activeObjective.title}
              </strong>
              <span style={{ color: '#A5B4FC', fontSize: '0.74rem' }}>
                ({activeObjective.direction})
              </span>
            </div>

            <p className="font-mono" style={{ margin: 0, fontSize: '0.82rem', color: '#FEF08A', lineHeight: '1.4' }}>
              &ldquo;{activeObjective.ahmadGuide}&rdquo;
            </p>
          </div>

          <button
            onClick={() => handleTravelClick(targetLandmark)}
            className="pixel-btn font-display"
            style={{
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              border: 'none',
              padding: '8px 14px',
              fontSize: '0.78rem',
              fontWeight: 900,
              whiteSpace: 'nowrap',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ⚡ FAST TRAVEL TO GOAL
          </button>
        </div>

        {/* MAP FILTER TABS */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#0F172A',
            borderBottom: '1px solid #1E293B',
            padding: '8px 18px',
            gap: '8px',
          }}
        >
          {[
            { id: 'all', label: '⭐ All Landmarks' },
            { id: 'chapter', label: '🏛️ Main Chapters (Stars 1-5)' },
            { id: 'estates', label: '🏰 The 5 Dream Estates' },
            { id: 'nature', label: '🌸 Nature & Celebrations' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedFilter(tab.id as 'all' | 'chapter' | 'estates' | 'nature');
              }}
              className="font-mono"
              style={{
                padding: '4px 12px',
                fontSize: '0.74rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedFilter === tab.id ? '#F59E0B' : '#1E293B',
                color: selectedFilter === tab.id ? '#0F172A' : '#94A3B8',
                fontWeight: selectedFilter === tab.id ? 800 : 500,
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN VISUAL MAP CONTAINER */}
        <div style={{ position: 'relative', flex: 1, backgroundColor: '#090D1A', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 800 600"
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '56vh' }}
          >
            {/* Background Map Gradient */}
            <defs>
              <radialGradient id="valleyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E234A" />
                <stop offset="60%" stopColor="#111633" />
                <stop offset="100%" stopColor="#080B18" />
              </radialGradient>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect width="800" height="600" fill="url(#valleyGlow)" />

            {/* Faint Starlight Grid */}
            <g stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3,3">
              {[100, 200, 300, 400, 500, 600, 700].map(x => (
                <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="600" />
              ))}
              {[100, 200, 300, 400, 500].map(y => (
                <line key={`gy-${y}`} x1="0" y1={y} x2="800" y2={y} />
              ))}
            </g>

            {/* Cobblestone Roads */}
            {/* Main Central Crossroads */}
            <path
              d="M 400 20 L 400 580 M 50 340 L 750 340 M 400 340 L 135 232 M 400 340 L 650 232 M 400 340 L 650 417 M 400 340 L 260 510"
              stroke="#2C3760"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 400 20 L 400 580 M 50 340 L 750 340 M 400 340 L 135 232 M 400 340 L 650 232 M 400 340 L 650 417 M 400 340 L 260 510"
              stroke="#404E85"
              strokeWidth="4"
              strokeDasharray="6,6"
              fill="none"
            />

            {/* South-West Pond */}
            <ellipse cx="155" cy="420" rx="60" ry="34" fill="#182747" stroke="#38BDF8" strokeWidth="2" />
            <ellipse cx="155" cy="420" rx="48" ry="24" fill="#0C4A6E" />
            <text x="155" y="424" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="monospace">
              Reflecting Pond 🌊
            </text>

            {/* Central Celebration Plaza Ring */}
            <circle cx="400" cy="340" r="38" fill="#1E234A" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,4" />

            {/* Dotted Path from Player to Active Target */}
            <line
              x1={playerSvgX}
              y1={playerSvgY}
              x2={toSvgX(targetLandmark.x)}
              y2={toSvgY(targetLandmark.y)}
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="5,5"
              strokeLinecap="round"
              filter="url(#goldGlow)"
            />

            {/* MAP LANDMARK PINS */}
            {filteredLandmarks.map(landmark => {
              const lx = toSvgX(landmark.x);
              const ly = toSvgY(landmark.y);
              const isTarget = landmark.id === targetLandmark.id;
              const isSelected = activeLandmark?.id === landmark.id;

              return (
                <g
                  key={landmark.id}
                  onClick={() => handleLandmarkClick(landmark)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glowing Target Beacon Ring */}
                  {isTarget && (
                    <circle
                      cx={lx}
                      cy={ly}
                      r="22"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      className="animate-spin"
                    />
                  )}

                  {/* Pin Background Capsule */}
                  <rect
                    x={lx - 16}
                    y={ly - 16}
                    width="32"
                    height="32"
                    rx="6"
                    fill={isSelected ? '#F59E0B' : isTarget ? '#78350F' : '#0F172A'}
                    stroke={isTarget ? '#F59E0B' : isSelected ? '#FFFFFF' : '#334155'}
                    strokeWidth={isTarget || isSelected ? 2 : 1}
                  />

                  {/* Icon */}
                  <text
                    x={lx}
                    y={ly + 5}
                    textAnchor="middle"
                    fontSize="16"
                    style={{ userSelect: 'none' }}
                  >
                    {landmark.icon}
                  </text>

                  {/* Label under icon */}
                  <text
                    x={lx}
                    y={ly + 26}
                    textAnchor="middle"
                    fill={isTarget ? '#FEF08A' : isSelected ? '#FFFFFF' : '#CBD5E1'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isTarget || isSelected ? 'bold' : 'normal'}
                    style={{ textShadow: '0 2px 4px #000000', userSelect: 'none' }}
                  >
                    {landmark.name.length > 22 ? landmark.name.slice(0, 20) + '...' : landmark.name}
                  </text>
                </g>
              );
            })}

            {/* LIVE PLAYER LOCATION PIN ("YOU ARE HERE") */}
            <g transform={`translate(${playerSvgX}, ${playerSvgY})`}>
              <circle r="14" fill="rgba(236, 72, 153, 0.25)" className="animate-ping" />
              <circle r="10" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="bold">
                ★
              </text>
              <rect x="-24" y="-28" width="48" height="15" rx="3" fill="#EC4899" />
              <text x="0" y="-18" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="monospace">
                YOU
              </text>
            </g>
          </svg>
        </div>

        {/* BOTTOM INSPECTION / FAST TRAVEL DRAWER */}
        <div
          style={{
            backgroundColor: '#0F172A',
            borderTop: '2px solid #1E293B',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {activeLandmark ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '1.8rem' }}>{activeLandmark.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: '#F59E0B', fontSize: '0.9rem' }}>{activeLandmark.name}</strong>
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>• {activeLandmark.subtitle}</span>
                </div>
                <p className="font-mono" style={{ margin: '2px 0 0 0', color: '#FEF08A', fontSize: '0.8rem' }}>
                  &ldquo;{activeLandmark.ahmadNote}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <span className="font-mono" style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                💡 Click any landmark on the map to view Ahmad&apos;s personal note, set a guidance waypoint, or fast travel instantly!
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            {activeLandmark && (
              <>
                <button
                  onClick={() => handleWaypointClick(activeLandmark)}
                  className="pixel-btn pixel-btn-ghost font-mono"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  title="Point on-screen compass arrow to this location"
                >
                  📍 SET WAYPOINT
                </button>
                <button
                  onClick={() => handleTravelClick(activeLandmark)}
                  className="pixel-btn pixel-btn-peach font-display"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 'bold' }}
                  title="Instantly travel to this location"
                >
                  ⚡ FAST TRAVEL
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              RESUME GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
