export type LocationId = 
  | 'boot'
  | 'hub' 
  | 'bureau' 
  | 'museum' 
  | 'court' 
  | 'archive' 
  | 'observatory' 
  | 'garden';

export interface JournalEntry {
  id: string;
  title: string;
  location: LocationId;
  completed: boolean;
  rewardStar?: number;
  timestamp?: string;
}

export interface BureauReport {
  id: string;
  code: string;
  title: string;
  subject: string;
  investigator: string;
  objectivity: string;
  finding: string;
  caption: string;
  image?: string;
  soundType?: 'stamp' | 'rustle' | 'chime';
}

export interface MuseumExhibit {
  id: string;
  wing: 'portrait' | 'notices' | 'achievements' | 'phenomenon';
  title: string;
  subtitle?: string;
  badge: string;
  plaque: string;
  quote?: string;
  image?: string;
  revealed?: boolean;
}

export interface ArchiveMemory {
  id: string;
  title: string;
  dateOrMoment: string;
  preview: string;
  fullNote: string;
  isClassified: boolean;
  image?: string;
}

export interface FutureVignette {
  id: string;
  title: string;
  category: string;
  description: string;
  sceneVisual: 
    | 'family_house' 
    | 'mafia_base' 
    | 'bakery' 
    | 'mountain_castle' 
    | 'gaon_haveli' 
    | 'photoshoot' 
    | 'walk' 
    | 'reels' 
    | 'date';
  unlockedNote: string;
}

export interface ExpeditionState {
  currentLocation: LocationId;
  starsRecovered: number; // 0 to 7
  unlockedLocations: LocationId[];
  visitedLocations: LocationId[];
  recoveredStarIds: number[];
  inventory: string[];
  readReports: string[];
  examinedExhibits: string[];
  readMemories: string[];
  viewedVignettes: string[];
  namedConstellation: string | null;
  secretGardenUnlocked: boolean;
  courtVerdictReached: boolean;
  bureauStamped: boolean;
  journal: JournalEntry[];
  isMuted: boolean;
}
