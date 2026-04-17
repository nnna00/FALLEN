
export interface Character {
  id: string;
  name: string;
  title: string; // e.g., "黑翼教团大祭司"
  description: string;
  imageSeed: number; // For placeholder image generation
  isLeader?: boolean;
  
  // New Fields for "Complete" Profile
  stats: {
    might: number;   // 0-100
    scheme: number;  // 0-100
    sanity: number;  // 0-100
  };
  tags: string[]; // e.g. ["Divine Blood", "Heretic"]
  relics: string[]; // e.g. ["Shard of Nul", "Black Key"]
  secret: string; // Hidden lore
  customImage?: string; // User uploaded base64
}

export interface Faction {
  id: string;
  name: string;
  englishName: string;
  description: string;
  shortDesc: string;
  philosophy: string;
  color: string;
  characters: Character[];
  coordinates: { x: number; y: number; z: number }; // For 3D map placement
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'CITY' | 'RUIN' | 'MOUNTAIN' | 'FOREST' | 'WATER' | 'DESERT' | 'TOWN';
  x: number;
  y: number;
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    factionPoints: Record<string, number>;
  }[];
}

export type ViewState = 'INTRO' | 'MAP' | 'FACTION_DETAIL' | 'ORACLE';

export interface AppState {
  view: ViewState;
  userFaction: string | null; // ID of the faction the user was sorted into
  selectedFactionId: string | null;
  hasSeenIntro: boolean;
}
