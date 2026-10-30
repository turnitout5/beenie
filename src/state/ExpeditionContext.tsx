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

const DREAM_ESTATE_REALMS: LocationId[] = [
  'castle_realm',
  'mafia_realm',
  'islamabad_realm',
  'bakery_realm',
  'haveli_realm',
];

const defaultState: ExpeditionState = {
  currentLocation: 'boot',
  starsRecovered: 0,
  unlockedLocations: [
    'boot',
    'hub',
    'bureau',
    'museum',
    'court',
    'archive',
    'observatory',
    'dream_estates',
    'castle_realm',
    'mafia_realm',
    'islamabad_realm',
    'bakery_realm',
    'haveli_realm',
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
  dreamEstatesUnlocked: false,
  courtVerdictReached: false,
  bureauStamped: false,
  bureauChargesSolved: false,
  museumJetCodeSolved: false,
  drawer07Unlocked: false,
  courtScalesBalanced: false,
  archiveChronologySolved: false,
  observatoryConstellationConnected: false,
  gardenLanternsLit: 0,
  candlesBlown: false,
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
        const now = new Date();
        const oct31Midnight = new Date(now.getFullYear(), 9, 31, 0, 0, 0, 0).getTime();
        const isBeforeOct31 = now.getTime() < oct31Midnight;
        return {
          ...defaultState,
          ...parsed,
          currentLocation: isBeforeOct31 ? 'boot' : (parsed.currentLocation || 'boot'),
          unlockedLocations: Array.from(
            new Set([...defaultState.unlockedLocations, ...(parsed.unlockedLocations || [])])
          ) as LocationId[],
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

      // Auto-complete the 5 Dream Estates milestone when all 5 realms or dream_estates have been toured
      const visitedRealmsCount = DREAM_ESTATE_REALMS.filter(r => newVisited.includes(r)).length;
      const estatesCompleted = visitedRealmsCount >= 5 || newVisited.includes('dream_estates');
      const updatedJournal = estatesCompleted
        ? prev.journal.map(j => (j.id === 'estates_complete' ? { ...j, completed: true } : j))
        : prev.journal;

      return {
        ...prev,
        currentLocation: location,
        unlockedLocations: newUnlocked,
        visitedLocations: newVisited,
        journal: updatedJournal,
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
      const shouldUnlockEstates = updatedRecovered.length >= 6 || updatedRecovered.includes(6) || Boolean(prev.candlesBlown) || Boolean(prev.dreamEstatesUnlocked);

      return {
        ...prev,
        recoveredStarIds: updatedRecovered,
        starsRecovered: updatedRecovered.length,
        journal: updatedJournal,
        secretGardenUnlocked: shouldUnlockGarden,
        dreamEstatesUnlocked: shouldUnlockEstates,
        unlockedLocations:
          shouldUnlockGarden && !prev.unlockedLocations.includes('garden')
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
      const all5Viewed = updated.length >= 5;
      return {
        ...prev,
        viewedVignettes: updated,
        journal: all5Viewed
          ? prev.journal.map(j => (j.id === 'estates_complete' ? { ...j, completed: true } : j))
          : prev.journal,
      };
    });
  };

  const setConstellationName = (name: string) => {
    soundEngine.playStarChime();
    setState(prev => ({
      ...prev,
      namedConstellation: name.trim() || "Paaaari's Starlight",
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
    setState(prev => {
      const merged = { ...prev, ...updates };
      if (merged.candlesBlown || (merged.recoveredStarIds && merged.recoveredStarIds.includes(6)) || (merged.recoveredStarIds && merged.recoveredStarIds.length >= 6)) {
        merged.dreamEstatesUnlocked = true;
      }
      return merged;
    });
  };

  const toggleMute = () => {
    const isMuted = soundEngine.toggleMute();
    setState(prev => ({ ...prev, isMuted }));
  };

  const resetExpedition = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useExpedition = () => {
  const context = useContext(ExpeditionContext);
  if (!context) {
    throw new Error('useExpedition must be used within an ExpeditionProvider');
  }
  return context;
};
