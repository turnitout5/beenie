import React, { useState } from 'react';
import { useExpedition } from '../state/ExpeditionContext';
import { soundEngine } from '../audio/soundEngine';

interface ExpeditionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVirtualDpadVisible: boolean;
  onToggleVirtualDpad: () => void;
  userZoom: number;
  onSetUserZoom: (zoom: number) => void;
}

export const ExpeditionSettingsModal: React.FC<ExpeditionSettingsModalProps> = ({
  isOpen,
  onClose,
  isVirtualDpadVisible,
  onToggleVirtualDpad,
  userZoom,
  onSetUserZoom,
}) => {
  const { state, toggleMute, resetExpedition } = useExpedition();
  const { isMuted, starsRecovered, lastRoomId, playerCoordinates } = state;

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [masterVolume, setMasterVolume] = useState<number>(() => soundEngine.getMasterVolume());
  const [currentSongMode, setCurrentSongMode] = useState<'bol' | 'mohabat' | 'synth'>(() => {
    const song = soundEngine.getCurrentSong();
    if (song === 'bol_na_halke_halke') return 'bol';
    if (song === 'mohabat') return 'mohabat';
    return 'synth';
  });

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
    soundEngine.setMasterVolume(val);
  };

  const handleSelectSong = (mode: 'bol' | 'mohabat' | 'synth') => {
    soundEngine.playClick();
    setCurrentSongMode(mode);
    if (mode === 'bol') {
      soundEngine.playSong('bol_na_halke_halke');
    } else if (mode === 'mohabat') {
      soundEngine.playSong('mohabat');
    } else {
      soundEngine.pauseSong();
      soundEngine.startBolNaHalkeHalkeTuneLoop();
    }
  };

  const handleToggleFullscreen = () => {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleExecuteReset = () => {
    soundEngine.playClick();
    resetExpedition();
    setConfirmResetOpen(false);
    onClose();
    if (typeof window !== 'undefined') {
      window.location.href = window.location.pathname;
    }
  };

  return (
    <div className="pixel-modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="pixel-modal-content pixel-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          backgroundColor: '#0B0F19',
          border: '2px solid #334155',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* HEADER BAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #1E293B',
            paddingBottom: '12px',
            marginBottom: '18px',
          }}
        >
          <div>
            <div className="font-mono" style={{ color: '#94A3B8', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              EXPEDITION SYSTEM CONTROL
            </div>
            <h2 className="font-display" style={{ color: '#F59E0B', fontSize: '1.25rem', margin: '2px 0 0 0' }}>
              SETTINGS &amp; PREFERENCES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-ghost font-mono"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            title="Close Settings (ESC)"
          >
            [X]
          </button>
        </div>

        {/* SECTION 1: AUDIO & SOUND */}
        <div style={{ marginBottom: '18px', backgroundColor: '#131B2E', padding: '14px', borderRadius: '4px', border: '1px solid #1E293B' }}>
          <div className="font-mono" style={{ color: '#38BDF8', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '10px' }}>
            AUDIO &amp; SOUND
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="font-mono" style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>Sound Master:</span>
            <button
              onClick={() => {
                toggleMute();
              }}
              className={`pixel-btn ${isMuted ? 'pixel-btn-ghost' : 'pixel-btn-primary'} font-mono`}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
            </button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Master Volume:</span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#FEF08A' }}>{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={handleVolumeChange}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#F59E0B' }}
            />
          </div>

          <div>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Music Soundtrack:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleSelectSong('bol')}
                className={`pixel-btn ${currentSongMode === 'bol' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                style={{ flex: 1, padding: '6px', fontSize: '0.72rem', justifyContent: 'center' }}
              >
                Track 1 (Bol Na Halke)
              </button>
              <button
                onClick={() => handleSelectSong('mohabat')}
                className={`pixel-btn ${currentSongMode === 'mohabat' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                style={{ flex: 1, padding: '6px', fontSize: '0.72rem', justifyContent: 'center' }}
              >
                Track 2 (Mohabat Jisko)
              </button>
              <button
                onClick={() => handleSelectSong('synth')}
                className={`pixel-btn ${currentSongMode === 'synth' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
                style={{ flex: 1, padding: '6px', fontSize: '0.72rem', justifyContent: 'center' }}
              >
                Retro Synths
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: DISPLAY & CONTROLS */}
        <div style={{ marginBottom: '18px', backgroundColor: '#131B2E', padding: '14px', borderRadius: '4px', border: '1px solid #1E293B' }}>
          <div className="font-mono" style={{ color: '#38BDF8', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '10px' }}>
            DISPLAY &amp; CAMERA
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>Camera Zoom:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSetUserZoom(Math.max(0.85, Math.round((userZoom - 0.15) * 100) / 100));
                }}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                title="Zoom Out"
              >
                -
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSetUserZoom(1.0);
                }}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                title="Reset to Default Zoom"
              >
                {Math.round(userZoom * 100)}%
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSetUserZoom(Math.min(1.75, Math.round((userZoom + 0.15) * 100) / 100));
                }}
                className="pixel-btn pixel-btn-ghost font-mono"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>Screen Mode:</span>
            <button
              onClick={handleToggleFullscreen}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              FULLSCREEN (F11)
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>Virtual D-Pad (Touch):</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleVirtualDpad();
              }}
              className={`pixel-btn ${isVirtualDpadVisible ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-mono`}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              {isVirtualDpadVisible ? 'SHOWN' : 'HIDDEN'}
            </button>
          </div>
        </div>

        {/* SECTION 3: KEYBOARD CONTROLS GUIDE */}
        <div style={{ marginBottom: '18px', backgroundColor: '#131B2E', padding: '14px', borderRadius: '4px', border: '1px solid #1E293B' }}>
          <div className="font-mono" style={{ color: '#38BDF8', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '8px' }}>
            KEYBOARD SHORTCUTS
          </div>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>WASD / Arrows: Walk</div>
            <div>Shift: Sprint / Run</div>
            <div>Enter / Space / E: Interact</div>
            <div>M: World Map &amp; Fast Travel</div>
            <div>J: Expedition Journal</div>
            <div>ESC: Close Modals</div>
          </div>
        </div>

        {/* SECTION 4: AUTO-SAVE STATUS & RESET DANGER ZONE */}
        <div style={{ backgroundColor: '#131B2E', padding: '14px', borderRadius: '4px', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: '#4ADE80' }}>
              Status: Auto-saved in browser
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Stars: {starsRecovered} / 07 | Pos: ({Math.round(playerCoordinates?.x || 0)}, {Math.round(playerCoordinates?.y || 0)}) | Room: {lastRoomId || 'overworld'}
            </span>
          </div>

          {!confirmResetOpen ? (
            <button
              onClick={() => {
                soundEngine.playClick();
                setConfirmResetOpen(true);
              }}
              className="pixel-btn pixel-btn-ghost font-mono"
              style={{ width: '100%', justifyContent: 'center', color: '#F87171', border: '1px solid #7F1D1D', padding: '8px', fontSize: '0.78rem' }}
            >
              RESTART EXPEDITION
            </button>
          ) : (
            <div style={{ backgroundColor: '#450A0A', border: '1px solid #EF4444', padding: '12px', borderRadius: '4px' }}>
              <p className="font-mono" style={{ color: '#FCA5A5', fontSize: '0.8rem', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                Meri Paaaari, kya aap sach may sab kuch shuru se restart karna chahti hain? Saari memories, candles aur stars reset ho jayenge.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setConfirmResetOpen(false);
                  }}
                  className="pixel-btn pixel-btn-ghost font-mono"
                  style={{ flex: 1, justifyContent: 'center', padding: '6px', fontSize: '0.75rem' }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleExecuteReset}
                  className="pixel-btn pixel-btn-primary font-mono"
                  style={{ flex: 1, justifyContent: 'center', padding: '6px', fontSize: '0.75rem', backgroundColor: '#DC2626', borderColor: '#EF4444' }}
                >
                  YES, RESTART
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
