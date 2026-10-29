import React, { useState } from 'react';
import { ExpeditionProvider, useExpedition } from './state/ExpeditionContext';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { BootScene } from './scenes/BootScene';
import { RPGAdventureEngine } from './game/RPGAdventureEngine';
import { InteractionModals } from './game/InteractionModals';
import { InteractableObject } from './game/types';

const ExpeditionAppContent: React.FC = () => {
  const { state } = useExpedition();
  const { currentLocation } = state;
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);

  if (currentLocation === 'boot') {
    return (
      <div 
        className="scanlines" 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          overflow: 'hidden', 
          position: 'fixed', 
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StarfieldCanvas />
        <main style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
          <BootScene />
        </main>
      </div>
    );
  }

  return (
    <div 
      className="scanlines" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'var(--color-void-navy)',
      }}
    >
      {/* Cosmic Starfield & Ambient Night Canvas in Background */}
      <StarfieldCanvas />

      {/* Edge-to-Edge Full-Screen 2D RPG Adventure with Camera Glide */}
      <RPGAdventureEngine
        onTriggerInteraction={setActiveInteractable}
        isModalOpen={Boolean(activeInteractable)}
        onCloseModal={() => setActiveInteractable(null)}
      />

      {/* Diegetic In-World Modals (Files, Courtroom, Museum, Archive, Letter) */}
      <InteractionModals activeObject={activeInteractable} onClose={() => setActiveInteractable(null)} />
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
