import React, { useState } from 'react';
import { ExpeditionProvider, useExpedition } from './state/ExpeditionContext';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { HeaderNav } from './components/HeaderNav';
import { BootScene } from './scenes/BootScene';
import { RPGAdventureEngine } from './game/RPGAdventureEngine';
import { InteractionModals } from './game/InteractionModals';
import { InteractableObject } from './game/types';
import { HubScene } from './scenes/HubScene';
import { BureauScene } from './scenes/BureauScene';
import { MuseumScene } from './scenes/MuseumScene';
import { CourtScene } from './scenes/CourtScene';
import { ArchiveScene } from './scenes/ArchiveScene';
import { ObservatoryScene } from './scenes/ObservatoryScene';
import { GardenScene } from './scenes/GardenScene';

const ExpeditionAppContent: React.FC = () => {
  const { state } = useExpedition();
  const { currentLocation } = state;
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);
  const [viewMode, setViewMode] = useState<'rpg' | 'codex'>('rpg');

  if (currentLocation === 'boot') {
    return (
      <div className="scanlines" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <StarfieldCanvas />
        <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <BootScene />
        </main>
      </div>
    );
  }

  const renderCodexScene = () => {
    switch (currentLocation) {
      case 'hub':
        return <HubScene />;
      case 'bureau':
        return <BureauScene />;
      case 'museum':
        return <MuseumScene />;
      case 'court':
        return <CourtScene />;
      case 'archive':
        return <ArchiveScene />;
      case 'observatory':
        return <ObservatoryScene />;
      case 'garden':
        return <GardenScene />;
      default:
        return <HubScene />;
    }
  };

  return (
    <div className="scanlines" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-void-navy)' }}>
      {/* Dynamic Starfield & Fireflies Canvas */}
      <StarfieldCanvas />

      {/* Persistent Navigation & Status Bar */}
      <HeaderNav />

      {/* View Mode Switcher Pill (RPG Adventure vs Codex Reading) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px 0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(27, 32, 66, 0.9)',
            border: '2px solid var(--color-twilight-blue)',
            padding: '3px',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(16, 19, 41, 0.6)',
          }}
        >
          <button
            onClick={() => setViewMode('rpg')}
            className={`pixel-btn ${viewMode === 'rpg' ? 'pixel-btn-primary' : 'pixel-btn-ghost'} font-display`}
            style={{ padding: '5px 14px', fontSize: '0.75rem' }}
          >
            🎮 2D RPG ADVENTURE
          </button>
          <button
            onClick={() => setViewMode('codex')}
            className={`pixel-btn ${viewMode === 'codex' ? 'pixel-btn-peach' : 'pixel-btn-ghost'} font-display`}
            style={{ padding: '5px 14px', fontSize: '0.75rem' }}
          >
            📜 CODEX / DESK VIEW
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {viewMode === 'rpg' ? (
          <>
            <RPGAdventureEngine onTriggerInteraction={setActiveInteractable} />
            <InteractionModals activeObject={activeInteractable} onClose={() => setActiveInteractable(null)} />
          </>
        ) : (
          <div style={{ width: '100%', maxWidth: '1000px' }}>
            {renderCodexScene()}
          </div>
        )}
      </main>

      {/* Subtle Retro Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '16px',
          backgroundColor: 'rgba(16, 19, 41, 0.95)',
          borderTop: '2px solid var(--color-twilight-blue)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>
          THE BEENISH EXPEDITION ✦ CREATED SPECIFICALLY FOR BEENISH TASAFFAR’S BIRTHDAY
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ExpeditionProvider>
      <ExpeditionAppContent />
    </ExpeditionProvider>
  );
};

export default App;
