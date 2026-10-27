import React from 'react';
import { ExpeditionProvider, useExpedition } from './state/ExpeditionContext';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { HeaderNav } from './components/HeaderNav';
import { BootScene } from './scenes/BootScene';
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

  const renderActiveScene = () => {
    switch (currentLocation) {
      case 'boot':
        return <BootScene />;
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
    <div className="scanlines" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dynamic Starfield & Fireflies Canvas */}
      <StarfieldCanvas />

      {/* Persistent Navigation & Status Bar */}
      <HeaderNav />

      {/* Main Scene Body */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {renderActiveScene()}
      </main>

      {/* Subtle Footer (hidden on boot) */}
      {currentLocation !== 'boot' && (
        <footer
          style={{
            textAlign: 'center',
            padding: '24px 16px',
            backgroundColor: 'rgba(16, 19, 41, 0.9)',
            borderTop: '2px solid var(--color-twilight-blue)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-dusty-lavender)' }}>
            THE BEENISH EXPEDITION ✦ CREATED SPECIFICALLY FOR BEENISH TASAFFAR’S BIRTHDAY
          </p>
        </footer>
      )}
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
