import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocationId, ExpeditionState } from '../types/expedition';
import { INITIAL_JOURNAL } from '../data/personalization';
import { soundEngine } from '../audio/soundEngine';

interface ExpeditionContextType {
  state: ExpeditionState;
  navigateTo: (location: LocationId) => void;
  recoverStar: (starId: number, journalId?: string) => void;
  markReportRead: (reportId: string) => void;
  examineExhibit: (exhibitId: string) => void;
  readMemory: (memoryId: string) => void;
  viewVignette: (vignetteId: string) => void;
  setConstellationName: (name: string) => void;
  reachVerdict: () => void;
  stampBureau: () => void;
  unlockGarden: () => void;
  setPuzzleState: (updates: Partial<ExpeditionState>) => void;
  toggleMute: () => void;
  resetExpedition: () => void;
}

const STORAGE_KEY = 'beenish_expedition_save_v1';

const defaultState: ExpeditionState = {
  currentLocation: 'boot',
  starsRecovered: 0,
  unlockedLocations: [
    'boot', 
    'hub', 
    'dream_estates', 
    'castle_realm', 
    'mafia_realm', 
    'islamabad_realm', 
    'bakery_realm', 
    'haveli_realm'
  ],
  visitedLocations: ['boot'],
  recoveredStarIds: [],
  inventory: [],
  readReports: [],
  examinedExhibits: [],
  readMemories: [],
  viewedVignettes: [],
  namedConstellation: null,
  secretGardenUnlocked: false,
  courtVerdictReached: false,
  bureauStamped: false,
  bureauChargesSolved: false,
  museumJetCodeSolved: false,
  drawer07Unlocked: false,
  courtScalesBalanced: false,
  archiveChronologySolved: false,
  observatoryConstellationConnected: false,
  gardenLanternsLit: 0,
  journal: INITIAL_JOURNAL,
  isMuted: soundEngine.getMuted(),
};

const ExpeditionContext = createContext<ExpeditionContextType | undefined>(undefined);

export const ExpeditionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExpeditionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          // Ensure journal structure retains any newly added journal tasks
          journal: defaultState.journal.map(j => {
            const savedJ = parsed.journal?.find((sj: { id: string }) => sj.id === j.id);
            return savedJ ? { ...j, completed: savedJ.completed } : j;
          }),
        };
      }
    } catch {
      console.warn('Could not read saved expedition progress.');
    }
    return defaultState;
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save expedition progress', e);
    }
  }, [state]);

  const navigateTo = (location: LocationId) => {
    soundEngine.playClick();
    setState(prev => {
      const newUnlocked = prev.unlockedLocations.includes(location)
        ? prev.unlockedLocations
        : [...prev.unlockedLocations, location];
      const newVisited = prev.visitedLocations.includes(location)
        ? prev.visitedLocations
        : [...prev.visitedLocations, location];

      return {
        ...prev,
        currentLocation: location,
        unlockedLocations: newUnlocked,
        visitedLocations: newVisited,
      };
    });
  };

  const recoverStar = (starId: number, journalId?: string) => {
    setState(prev => {
      if (prev.recoveredStarIds.includes(starId)) {
        return prev;
      }
      soundEngine.playStarChime();
      const updatedRecovered = [...prev.recoveredStarIds, starId];
      const updatedJournal = prev.journal.map(j => 
        j.id === journalId || j.rewardStar === starId ? { ...j, completed: true } : j
      );

      // Check if garden unlocks (all 5 core world stars collected, or Star 6 triggered)
      const shouldUnlockGarden = updatedRecovered.length >= 5 || prev.secretGardenUnlocked;

      return {
        ...prev,
        recoveredStarIds: updatedRecovered,
        starsRecovered: updatedRecovered.length,
        journal: updatedJournal,
        secretGardenUnlocked: shouldUnlockGarden,
        unlockedLocations: shouldUnlockGarden && !prev.unlockedLocations.includes('garden')
          ? [...prev.unlockedLocations, 'garden']
          : prev.unlockedLocations,
      };
    });
  };

  const markReportRead = (reportId: string) => {
    setState(prev => {
      if (prev.readReports.includes(reportId)) return prev;
      const updated = [...prev.readReports, reportId];
      return { ...prev, readReports: updated };
    });
  };

  const examineExhibit = (exhibitId: string) => {
    setState(prev => {
      if (prev.examinedExhibits.includes(exhibitId)) return prev;
      const updated = [...prev.examinedExhibits, exhibitId];
      return { ...prev, examinedExhibits: updated };
    });
  };

  const readMemory = (memoryId: string) => {
    setState(prev => {
      if (prev.readMemories.includes(memoryId)) return prev;
      const updated = [...prev.readMemories, memoryId];
      return { ...prev, readMemories: updated };
    });
  };

  const viewVignette = (vignetteId: string) => {
    setState(prev => {
      if (prev.viewedVignettes.includes(vignetteId)) return prev;
      const updated = [...prev.viewedVignettes, vignetteId];
      return { ...prev, viewedVignettes: updated };
    });
  };

  const setConstellationName = (name: string) => {
    soundEngine.playStarChime();
    setState(prev => ({
      ...prev,
      namedConstellation: name.trim() || 'Constellation Beenish',
    }));
    recoverStar(5, 'observatory_complete');
  };

  const reachVerdict = () => {
    soundEngine.playGavel();
    setState(prev => ({
      ...prev,
      courtVerdictReached: true,
    }));
    recoverStar(3, 'court_complete');
  };

  const stampBureau = () => {
    soundEngine.playStamp();
    setState(prev => ({
      ...prev,
      bureauStamped: true,
    }));
    recoverStar(1, 'bureau_complete');
  };

  const unlockGarden = () => {
    setState(prev => ({
      ...prev,
      secretGardenUnlocked: true,
      unlockedLocations: prev.unlockedLocations.includes('garden') 
        ? prev.unlockedLocations 
        : [...prev.unlockedLocations, 'garden'],
    }));
  };

  const setPuzzleState = (updates: Partial<ExpeditionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleMute = () => {
    const isMuted = soundEngine.toggleMute();
    setState(prev => ({ ...prev, isMuted }));
  };

  const resetExpedition = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({ ...defaultState, isMuted: soundEngine.getMuted() });
  };

  return (
    <ExpeditionContext.Provider
      value={{
        state,
        navigateTo,
        recoverStar,
        markReportRead,
        examineExhibit,
        readMemory,
        viewVignette,
        setConstellationName,
        reachVerdict,
        stampBureau,
        unlockGarden,
        setPuzzleState,
        toggleMute,
        resetExpedition,
      }}
    >
      {children}
    </ExpeditionContext.Provider>
  );
};

export const useExpedition = () => {
  const context = useContext(ExpeditionContext);
  if (!context) {
    throw new Error('useExpedition must be used within an ExpeditionProvider');
  }
  return context;
};
